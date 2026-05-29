import { useCallback, useEffect, useRef, useState } from "react";
import { resolveSessionCommentary } from "../../../data/commentaryEngine";
import { sessionDefinitions } from "../../../data/mockData";
import { requestMetricScores, requestSessionCritique } from "../../../services/ai";
import {
  computeSpeechMetrics,
  deriveDeterministicSeeMetrics,
  deriveSessionSpecificMetrics,
  mergeMetricsInLabelOrder,
  metricsToCommentaryVars,
} from "../../../services/speechMetrics";
import {
  createSessionAttempt,
  saveCommitment,
  updateSessionAttempt,
  type SessionAnalysisSnapshot,
} from "../../../services/sessions";
import { uploadRecording } from "../../../services/storage";
import { transcribePremiumRecording } from "../../../services/transcription";
import { useSessionProgressStore } from "../../../stores/sessionProgressStore";
import type { CoachingMetric, CritiqueResult } from "../../../types/production";
import { hasSupabaseConfig } from "../../../config/env";

export type SessionPipelineStatus = "idle" | "uploading" | "transcribing" | "analysing" | "ready" | "error";

type ProcessRecordingInput = {
  localUri: string;
  durationMs: number;
  sessionNumber: number;
  challengeType?: string;
};

type CommitRecordingInput = {
  localUri: string;
  durationMs: number;
  sessionNumber: number;
  transcript?: string;
};

function buildFallbackTranscript(durationMs: number) {
  const seconds = Math.max(Math.round(durationMs / 1000), 1);
  return `Practice capture recorded for about ${seconds} seconds. Live transcription will appear once cloud speech-to-text is connected.`;
}

export function useSessionPipeline(userId: string | null) {
  const saveAnalysis = useSessionProgressStore((state) => state.saveAnalysis);
  const cachedAnalysis = useSessionProgressStore((state) => state.analysisBySession);
  const selectedMetricBySession = useSessionProgressStore((state) => state.selectedMetricBySession);

  const [status, setStatus] = useState<SessionPipelineStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<CoachingMetric[]>([]);
  const [transcript, setTranscript] = useState("");
  const [critique, setCritique] = useState<CritiqueResult | null>(null);
  const [commentaryLines, setCommentaryLines] = useState<string[]>([]);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const activeSessionRef = useRef<number | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const lastDoInputRef = useRef<ProcessRecordingInput | null>(null);
  const lastCommitInputRef = useRef<CommitRecordingInput | null>(null);

  const resetForSession = useCallback((sessionNumber: number) => {
    abortRef.current?.abort();
    abortRef.current = null;
    activeSessionRef.current = sessionNumber;

    const cached = cachedAnalysis[sessionNumber];
    if (cached) {
      setStatus("ready");
      setError(null);
      setMetrics(cached.metrics);
      setTranscript(cached.transcript);
      setCritique(cached.critique);
      setRecordingUri(cached.recordingUri ?? null);
      setAttemptId(cached.attemptId ?? null);
      const session = sessionDefinitions.find((entry) => entry.sessionNumber === sessionNumber);
      if (session) {
        const resolved = resolveSessionCommentary(sessionNumber, session.stages.record, metricsToCommentaryVars(cached.metrics));
        setCommentaryLines(resolved.lines);
      } else {
        setCommentaryLines([]);
      }
      return;
    }

    setStatus("idle");
    setError(null);
    setMetrics([]);
    setTranscript("");
    setCritique(null);
    setCommentaryLines([]);
    setRecordingUri(null);
    setAttemptId(null);
  }, [cachedAnalysis]);

  const processDoRecording = useCallback(
    async ({ localUri, durationMs, sessionNumber, challengeType }: ProcessRecordingInput) => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;
      lastDoInputRef.current = { localUri, durationMs, sessionNumber, challengeType };
      const signal = controller.signal;

      if (activeSessionRef.current !== sessionNumber) {
        resetForSession(sessionNumber);
      }

      setStatus("uploading");
      setError(null);
      setRecordingUri(localUri);

      const session = sessionDefinitions.find((entry) => entry.sessionNumber === sessionNumber);
      if (!session) {
        setStatus("error");
        setError("Session content not found.");
        return null;
      }

      if (signal.aborted) { setStatus("idle"); return null; }

      let remotePath: string | null = null;
      let currentAttemptId: string | null = null;

      if (hasSupabaseConfig() && userId) {
        const upload = await uploadRecording(
          { userId, sessionId: sessionNumber, localUri },
          signal,
        );

        if (signal.aborted) { setStatus("idle"); return null; }

        if (upload.error) {
          setStatus("error");
          setError(upload.error);
          return null;
        }

        remotePath = upload.path;
        const attempt = await createSessionAttempt({
          userId,
          sessionId: sessionNumber,
          challengeType,
          recordingPath: remotePath,
          durationMs,
        });

        if (signal.aborted) { setStatus("idle"); return null; }

        if (attempt.error) {
          setStatus("error");
          setError(attempt.error);
          return null;
        }

        currentAttemptId = attempt.attemptId;
        setAttemptId(currentAttemptId);
      }

      if (signal.aborted) { setStatus("idle"); return null; }

      setStatus("transcribing");
      let transcriptText = buildFallbackTranscript(durationMs);
      let transcriptionProvider = "typed-fallback";
      let serverMetrics: CoachingMetric[] = [];

      if (remotePath) {
        const transcription = await transcribePremiumRecording(
          {
            recordingPath: remotePath,
            sessionId: sessionNumber,
            attemptId: currentAttemptId ?? undefined,
            durationMs,
          },
          signal,
        );

        if (signal.aborted) { setStatus("idle"); return null; }

        if (transcription.data?.text?.trim()) {
          transcriptText = transcription.data.text.trim();
          transcriptionProvider = transcription.data.provider;
        } else if (transcription.error) {
          setError(transcription.error);
        }

        if (transcription.data?.metrics?.length) {
          serverMetrics = transcription.data.metrics;
        }
      }

      if (signal.aborted) { setStatus("idle"); return null; }

      const baseMetrics =
        serverMetrics.length > 0 ? serverMetrics : computeSpeechMetrics(transcriptText, durationMs);

      const deterministic = deriveDeterministicSeeMetrics({ transcript: transcriptText, durationMs, baseMetrics });
      const selectedMetricLabel = selectedMetricBySession[sessionNumber] ?? null;

      const requestedLabels = (session.stages.record.metrics?.map((m) => m.label).filter(Boolean) ?? []).flatMap((label) =>
        label.toUpperCase().includes("SINGLE CHOSEN METRIC")
          ? [selectedMetricLabel ?? "PACE (WPM)"]
          : [label],
      );

      const sessionSpecific = deriveSessionSpecificMetrics({
        sessionNumber,
        requestedLabels,
        transcript: transcriptText,
        durationMs,
        currentMetrics: [...baseMetrics, ...deterministic],
        analysisBySession: cachedAnalysis,
        selectedMetricLabel,
      });

      if (signal.aborted) { setStatus("idle"); return null; }

      const placeholders = (requestedLabels.length ? requestedLabels : []).map((label) => ({
        key: label.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        label,
        value: "—",
      }));

      let scored: CoachingMetric[] = [];
      if (requestedLabels.length) {
        const scoreResponse = await requestMetricScores(
          {
            sessionId: sessionNumber,
            sprintId: Math.ceil(sessionNumber / 6),
            transcript: transcriptText,
            durationMs,
            baseMetrics: [...baseMetrics, ...deterministic, ...sessionSpecific],
            requestedLabels,
          },
          signal,
        );

        if (signal.aborted) { setStatus("idle"); return null; }

        if (scoreResponse.data?.metrics?.length) {
          scored = scoreResponse.data.metrics;
        }
      }

      const mergedMetrics = mergeMetricsInLabelOrder({
        requestedLabels,
        placeholders,
        baseMetrics,
        derivedMetrics: [...deterministic, ...sessionSpecific],
        scoredMetrics: scored,
      });

      setTranscript(transcriptText);
      setMetrics(mergedMetrics);

      const resolvedCommentary = resolveSessionCommentary(
        sessionNumber,
        session.stages.record,
        metricsToCommentaryVars(mergedMetrics),
      );
      setCommentaryLines(resolvedCommentary.lines);

      if (signal.aborted) { setStatus("idle"); return null; }

      setStatus("analysing");
      let critiqueResult: CritiqueResult | null = null;

      const critiqueResponse = await requestSessionCritique(
        {
          userId: userId ?? undefined,
          sessionId: sessionNumber,
          sprintId: Math.ceil(sessionNumber / 6),
          plan: "free",
          transcript: transcriptText,
          metrics: mergedMetrics,
          attemptId: currentAttemptId ?? undefined,
        },
        signal,
      );

      if (signal.aborted) { setStatus("idle"); return null; }

      if (critiqueResponse.data) {
        critiqueResult = critiqueResponse.data;
        setCritique(critiqueResult);
      } else if (critiqueResponse.error) {
        setError(critiqueResponse.error);
      }

      if (currentAttemptId) {
        await updateSessionAttempt(currentAttemptId, {
          status: "analysed",
          durationMs,
          recordingPath: remotePath ?? undefined,
        });
      }

      const snapshot: SessionAnalysisSnapshot = {
        attemptId: currentAttemptId,
        transcript: transcriptText,
        transcription: {
          provider: transcriptionProvider as SessionAnalysisSnapshot["transcription"]["provider"],
          language: "en",
          text: transcriptText,
          segments: [{ text: transcriptText }],
        },
        metrics: mergedMetrics,
        critique: critiqueResult,
        selectedMetricLabel,
        recordingPath: remotePath,
        recordingUri: localUri,
        durationMs,
      };

      saveAnalysis(sessionNumber, snapshot);
      setStatus("ready");
      abortRef.current = null;
      return snapshot;
    },
    [cachedAnalysis, resetForSession, saveAnalysis, selectedMetricBySession, userId],
  );

  const processCommitRecording = useCallback(
    async ({ localUri, durationMs, sessionNumber, transcript: typedTranscript }: CommitRecordingInput) => {
      lastCommitInputRef.current = { localUri, durationMs, sessionNumber, transcript: typedTranscript };

      if (!userId || !hasSupabaseConfig()) {
        return { error: null };
      }

      const upload = await uploadRecording({
        userId,
        sessionId: sessionNumber,
        localUri,
        contentType: "audio/m4a",
      });

      if (upload.error) {
        return { error: upload.error };
      }

      const commitmentTranscript =
        typedTranscript?.trim() ||
        buildFallbackTranscript(durationMs);

      const result = await saveCommitment({
        userId,
        sessionId: sessionNumber,
        recordingPath: upload.path,
        transcript: commitmentTranscript,
      });

      return { error: result.error };
    },
    [userId],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
    setError(null);
  }, []);

  const retry = useCallback(() => {
    const input = lastDoInputRef.current;
    if (!input) return null;
    return processDoRecording(input);
  }, [processDoRecording]);

  useEffect(() => {
    if (activeSessionRef.current !== null) {
      resetForSession(activeSessionRef.current);
    }
  }, [cachedAnalysis, resetForSession]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  return {
    status,
    error,
    metrics,
    transcript,
    critique,
    commentaryLines,
    recordingUri,
    attemptId,
    resetForSession,
    processDoRecording,
    processCommitRecording,
    cancel,
    retry,
  };
}
