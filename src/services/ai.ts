import type { CritiqueRequest, CritiqueResult } from "../types/production";
import { invokeEdgeFunction } from "./supabase";

export async function requestSessionCritique(input: CritiqueRequest, signal?: AbortSignal) {
  return invokeEdgeFunction<CritiqueRequest, CritiqueResult>("ai-critique", input, { signal });
}

export async function requestMetricScores(
  input: {
    sessionId: number;
    sprintId: number;
    transcript: string;
    durationMs: number;
    baseMetrics: import("../types/production").CoachingMetric[];
    requestedLabels: string[];
  },
  signal?: AbortSignal,
) {
  return invokeEdgeFunction<
    typeof input,
    { metrics: import("../types/production").CoachingMetric[]; provider: string; model: string | null; error: string | null }
  >("metric-score", input, { signal });
}

export async function requestHotSeatTurn(input: CritiqueRequest & { turnIndex: number; persona?: string }) {
  return invokeEdgeFunction<typeof input, { followUp: string; coachingNote: string }>("hot-seat-turn", input);
}

export async function requestWeeklyForensic(input: { userId: string; weekStart: string }) {
  return invokeEdgeFunction<typeof input, { narration: string; highlights: string[] }>("weekly-forensic", input);
}
