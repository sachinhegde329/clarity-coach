import type { CritiqueRequest, CritiqueResult } from "../types/production";
import { invokeEdgeFunction } from "./supabase";

export async function requestSessionCritique(input: CritiqueRequest) {
  return invokeEdgeFunction<CritiqueRequest, CritiqueResult>("ai-critique", input);
}

export async function requestHotSeatTurn(input: CritiqueRequest & { turnIndex: number; persona?: string }) {
  return invokeEdgeFunction<typeof input, { followUp: string; coachingNote: string }>("hot-seat-turn", input);
}

export async function requestWeeklyForensic(input: { userId: string; weekStart: string }) {
  return invokeEdgeFunction<typeof input, { narration: string; highlights: string[] }>("weekly-forensic", input);
}
