import { useCallback, useEffect, useRef, useState } from "react";
import { resolveSessionCommentary } from "../../../data/commentaryEngine";
import { sessionDefinitions } from "../../../data/mockData";
import { requestSessionCritique } from "../../../services/ai";
import { computeSpeechMetrics, metricsToCommentaryVars } from "../../../services/speechMetrics";
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

  const [status, setStatus] = useState<SessionPipelineStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<CoachingMetric[]>([]);
  const [transcript, setTranscript] = useState("");
  const [critique, setCritique] = useState<CritiqueResult | null>(null);
  const [commentaryLines, setCommentaryLines] = useState<string[]>([]);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const activeSessionRef = useRef<number | null>(null);

  const resetForSession = useCallback((sessionNumber: number) => {
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

      let remotePath: string | null = null;
      let currentAttemptId: string | null = null;

      if (hasSupabaseConfig() && userId) {
        const upload = await uploadRecording({
          userId,
          sessionId: sessionNumber,
          localUri,
        });

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

        if (attempt.error) {
          setStatus("error");
          setError(attempt.error);
          return null;
        }

        currentAttemptId = attempt.attemptId;
        setAttemptId(currentAttemptId);
      }

      setStatus("transcribing");
      let transcriptText = buildFallbackTranscript(durationMs);
      let transcriptionProvider = "typed-fallback";
      let serverMetrics: CoachingMetric[] = [];

      if (remotePath) {
        const transcription = await transcribePremiumRecording({
          recordingPath: remotePath,
          sessionId: sessionNumber,
          attemptId: currentAttemptId ?? undefined,
          durationMs,
        });

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

      const computedMetrics =
        serverMetrics.length > 0 ? serverMetrics : computeSpeechMetrics(transcriptText, durationMs);
      setTranscript(transcriptText);
      setMetrics(computedMetrics);

      const resolvedCommentary = resolveSessionCommentary(
        sessionNumber,
        session.stages.record,
        metricsToCommentaryVars(computedMetrics),
      );
      setCommentaryLines(resolvedCommentary.lines);

      setStatus("analysing");
      let critiqueResult: CritiqueResult | null = null;

      const critiqueResponse = await requestSessionCritique({
        userId: userId ?? undefined,
        sessionId: sessionNumber,
        sprintId: Math.ceil(sessionNumber / 6),
        plan: "free",
        transcript: transcriptText,
        metrics: computedMetrics,
        attemptId: currentAttemptId ?? undefined,
      });

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
        metrics: computedMetrics,
        critique: critiqueResult,
        recordingPath: remotePath,
        recordingUri: localUri,
        durationMs,
      };

      saveAnalysis(sessionNumber, snapshot);
      setStatus("ready");
      return snapshot;
    },
    [resetForSession, saveAnalysis, userId],
  );

  const processCommitRecording = useCallback(
    async ({ localUri, durationMs, sessionNumber, transcript: typedTranscript }: CommitRecordingInput) => {
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

  useEffect(() => {
    if (activeSessionRef.current !== null) {
      resetForSession(activeSessionRef.current);
    }
  }, [cachedAnalysis, resetForSession]);

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
  };
}
