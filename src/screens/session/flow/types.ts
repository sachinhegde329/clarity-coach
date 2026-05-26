import type { SessionDefinition, SessionStage } from "../../../data/mockData";
import type { CoachingMetric, CritiqueResult } from "../../../types/production";
import type { SessionPipelineStatus } from "../hooks/useSessionPipeline";

export type SessionAnalysisProps = {
  status: SessionPipelineStatus;
  metrics: CoachingMetric[];
  transcript: string;
  commentaryLines: string[];
  critique: CritiqueResult | null;
  recordingUri: string | null;
  error: string | null;
};

/** Shared props for every session stage renderer (sessions 1–36). */
export type SessionStageRenderProps = {
  session: SessionDefinition;
  sessionNumber: number;
  stage: SessionStage;
  recordLimit: number;
  listenPlaying: boolean;
  listenProgress: number;
  recording: boolean;
  recordElapsed: number;
  overlayOn: boolean;
  reflectRecording: boolean;
  reflectElapsed: number;
  reflectionDone: boolean;
  onTogglePlay: () => void;
  onToggleRecording: () => void;
  onReplay: () => void;
  onToggleReflection: () => void;
  onRetakeReflection: () => void;
  onNext: () => void;
  analysis?: SessionAnalysisProps;
};

export type CentreStageRenderProps = {
  session: SessionDefinition;
  sessionNumber: number;
  breathElapsed: number;
  isBreathRunning: boolean;
  setIsBreathRunning: (running: boolean) => void;
  onNext: () => void;
};
