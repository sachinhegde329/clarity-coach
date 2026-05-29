import React, { useCallback, useEffect, useRef } from "react";
import { sessionDefinitions, type SessionStage } from "../../data/mockData";
import { useSessionProgressStore } from "../../stores/sessionProgressStore";
import { RECORD_DURATION } from "./constants";
import { useSessionPipeline } from "./hooks/useSessionPipeline";
import { useSessionRecording } from "./hooks/useSessionRecording";
import { useSessionTimers } from "./hooks/useSessionTimers";
import { SessionStageView } from "./flow/SessionStageView";

function buildGuidedHandlers(
  timers: ReturnType<typeof useSessionTimers>,
  recording: ReturnType<typeof useSessionRecording>,
  onNext: () => void,
  recordLimit: number,
) {
  const {
    setListenPlaying,
    setRecording,
    setRecordElapsed,
    setOverlayOn,
    setReflectRecording,
    setReflectElapsed,
    setReflectionDone,
    reflectionDone,
    recording: timerRecording,
  } = timers;

  return {
    onTogglePlay: () => setListenPlaying((current) => !current),
    onToggleRecording: async () => {
      if (timerRecording) {
        await recording.stop();
        setRecording(false);
        return;
      }

      if (timers.recordElapsed >= recordLimit) {
        setRecordElapsed(0);
        await recording.reset();
      }

      const started = await recording.start();
      if (started) {
        setRecording(true);
      }
    },
    onReplay: () => setOverlayOn((current) => !current),
    onToggleReflection: async () => {
      if (reflectionDone) {
        setReflectElapsed(0);
        setReflectionDone(false);
        await recording.reset();
      }

      if (timers.reflectRecording) {
        await recording.stop();
        setReflectRecording(false);
        setReflectionDone(true);
        return;
      }

      const started = await recording.start();
      if (started) {
        setReflectRecording(true);
      }
    },
    onRetakeReflection: async () => {
      await recording.reset();
      setReflectRecording(false);
      setReflectElapsed(0);
      setReflectionDone(false);
    },
    onNext,
  };
}

export function SessionFlowScreen({
  sessionNumber,
  stage,
  stepIndex,
  onJumpToStep,
  onBack,
  onNext,
  onExit,
}: {
  sessionNumber: number;
  stage: SessionStage;
  stepIndex: number;
  onJumpToStep: (stepIndex: number) => void;
  onBack: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  const sessionContent = sessionDefinitions.find((session) => session.sessionNumber === sessionNumber) ?? sessionDefinitions[0]!;
  const recordLimit = sessionContent.stages.feedback.timeLimit ?? RECORD_DURATION;
  const userId = useSessionProgressStore((state) => state.userId);
  const saveStepProgress = useSessionProgressStore((state) => state.saveStepProgress);

  const timers = useSessionTimers(stage, { recordSeconds: recordLimit });
  const recording = useSessionRecording();
  const pipeline = useSessionPipeline(userId);
  const doRecordingRef = useRef<{ uri: string; durationMs: number } | null>(null);
  const commitRecordingRef = useRef<{ uri: string; durationMs: number } | null>(null);
  const processingRef = useRef(false);

  const {
    sessionElapsed,
    listenProgress,
    listenPlaying,
    recording: timerRecording,
    recordElapsed,
    recordLimit: activeRecordLimit,
    overlayOn,
    reflectRecording,
    reflectElapsed,
    reflectionDone,
    breathElapsed,
    isBreathRunning,
    setIsBreathRunning,
    setRecordElapsed,
    setReflectElapsed,
  } = timers;

  useEffect(() => {
    pipeline.resetForSession(sessionNumber);
    doRecordingRef.current = null;
    commitRecordingRef.current = null;
    processingRef.current = false;
  }, [sessionNumber]);

  useEffect(() => {
    saveStepProgress(sessionNumber, stepIndex);
  }, [saveStepProgress, sessionNumber, stepIndex]);

  useEffect(() => {
    if (stage !== "feedback" || !timerRecording) return;
    setRecordElapsed(recording.durationSeconds);
    if (recording.durationSeconds >= recordLimit) {
      void (async () => {
        const result = await recording.stop();
        timers.setRecording(false);
        if (result?.uri) {
          doRecordingRef.current = { uri: result.uri, durationMs: result.durationMs };
        }
      })();
    }
  }, [recording.durationSeconds, recordLimit, recording, stage, setRecordElapsed, timerRecording, timers]);

  useEffect(() => {
    if (stage !== "reflect" || !reflectRecording) return;
    setReflectElapsed(recording.durationSeconds);
  }, [recording.durationSeconds, reflectRecording, setReflectElapsed, stage]);

  const handleNext = useCallback(async () => {
    if (stage === "feedback") {
      if (timerRecording) {
        const result = await recording.stop();
        timers.setRecording(false);
        if (result?.uri) {
          doRecordingRef.current = { uri: result.uri, durationMs: result.durationMs };
        }
      }

      const capture = doRecordingRef.current ?? recording.lastResult;
      if (capture?.uri) {
        doRecordingRef.current = { uri: capture.uri, durationMs: capture.durationMs };
      }
    }

    if (stage === "feedback" && doRecordingRef.current && !processingRef.current) {
      processingRef.current = true;
      void pipeline.processDoRecording({
        localUri: doRecordingRef.current.uri,
        durationMs: doRecordingRef.current.durationMs,
        sessionNumber,
        challengeType: sessionContent.stages.feedback.challengeType,
      });
    }

    if (stage === "reflect" && reflectionDone) {
      const capture = commitRecordingRef.current ?? recording.lastResult;
      if (capture?.uri) {
        void pipeline.processCommitRecording({
          localUri: capture.uri,
          durationMs: capture.durationMs,
          sessionNumber,
          transcript: pipeline.transcript,
        });
      }
    }

    onNext();
  }, [
    onNext,
    pipeline,
    recording,
    reflectionDone,
    sessionContent.stages.feedback.challengeType,
    sessionNumber,
    stage,
    timerRecording,
    timers,
  ]);

  const guidedHandlers = buildGuidedHandlers(timers, recording, handleNext, recordLimit);

  useEffect(() => {
    if (stage !== "reflect" || !reflectionDone) return;
    const capture = recording.lastResult;
    if (capture?.uri) {
      commitRecordingRef.current = { uri: capture.uri, durationMs: capture.durationMs };
    }
  }, [recording.lastResult, reflectionDone, stage]);

  return (
    <SessionStageView
      sessionNumber={sessionNumber}
      stage={stage}
      stepIndex={stepIndex}
      sessionElapsed={sessionElapsed}
      onJumpToStep={onJumpToStep}
      onBack={onBack}
      onExit={onExit}
      centre={{
        session: sessionContent,
        sessionNumber,
        breathElapsed,
        isBreathRunning,
        setIsBreathRunning,
        onNext: handleNext,
      }}
      guided={{
        session: sessionContent,
        sessionNumber,
        stage,
        recordLimit: activeRecordLimit,
        listenPlaying,
        listenProgress,
        recording: timerRecording,
        recordElapsed,
        overlayOn,
        reflectRecording,
        reflectElapsed,
        reflectionDone,
        analysis: {
          status: pipeline.status,
          metrics: pipeline.metrics,
          transcript: pipeline.transcript,
          commentaryLines: pipeline.commentaryLines,
          critique: pipeline.critique,
          recordingUri: pipeline.recordingUri,
          error: pipeline.error,
        },
        ...guidedHandlers,
      }}
    />
  );
}
