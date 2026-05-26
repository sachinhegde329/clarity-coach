export type Plan = "free" | "premium";

export type CoachingMetric = {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  delta?: string;
};

export type TranscriptSegment = {
  text: string;
  startMs?: number;
  endMs?: number;
  confidence?: number;
};

export type TranscriptionResult = {
  provider: "on-device" | "groq" | "openai" | "typed-fallback";
  language: string;
  text: string;
  segments: TranscriptSegment[];
};

export type CritiqueRequest = {
  userId?: string;
  sessionId: number;
  sprintId: number;
  plan: Plan;
  transcript: string;
  metrics: CoachingMetric[];
  profile?: Record<string, unknown>;
  attemptId?: string;
};

export type CritiqueResult = {
  critique: string;
  recommendation: string;
  suggestedCommitment?: string;
  annotations?: Array<{
    timestampMs?: number;
    label: string;
    detail: string;
  }>;
};

export type EntitlementState = {
  plan: Plan;
  isPremium: boolean;
  source: "local" | "revenuecat" | "supabase";
  activeProductId?: string;
  expiresAt?: string;
};
