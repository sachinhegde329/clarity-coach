import type { TranscriptionResult } from "../types/production";
import { invokeEdgeFunction } from "./supabase";

export async function transcribePremiumRecording(
  input: {
    recordingPath: string;
    sessionId: number;
    attemptId?: string;
    durationMs?: number;
    language?: string;
  },
  signal?: AbortSignal,
) {
  return invokeEdgeFunction<
    typeof input,
    TranscriptionResult & { metrics?: import("../types/production").CoachingMetric[] }
  >("transcribe", input, { signal });
}

export function buildTypedFallbackTranscript(text: string): TranscriptionResult {
  return {
    provider: "typed-fallback",
    language: "en",
    text,
    segments: [{ text }],
  };
}
