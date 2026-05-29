import { supabase } from "./supabase";
import { hasSupabaseConfig } from "../config/env";

type StepProgressEntry = {
  stepIndex: number;
  updatedAt: string;
  completedAt?: string;
};

export type SyncProgressInput = {
  highestUnlockedSessionNumber: number;
  stepProgressBySession: Record<number, StepProgressEntry>;
  selectedMetricBySession: Record<number, string>;
};

export async function syncProgressToServer(userId: string, progress: SyncProgressInput) {
  if (!supabase || !hasSupabaseConfig()) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      highest_unlocked_session_number: progress.highestUnlockedSessionNumber,
      step_progress_by_session: progress.stepProgressBySession as unknown as JSON,
      selected_metric_by_session: progress.selectedMetricBySession as unknown as JSON,
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  return { error: error?.message ?? null };
}

type RawServerProgress = {
  highest_unlocked_session_number: number;
  step_progress_by_session: Record<string, unknown>;
  selected_metric_by_session: Record<string, unknown>;
};

export type FetchProgressResult = {
  highestUnlockedSessionNumber: number;
  stepProgressBySession: Record<number, StepProgressEntry>;
  selectedMetricBySession: Record<number, string>;
};

export async function fetchProgressFromServer(
  userId: string,
): Promise<{ data: FetchProgressResult | null; error: string | null }> {
  if (!supabase || !hasSupabaseConfig()) {
    return { data: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("user_progress")
    .select("highest_unlocked_session_number, step_progress_by_session, selected_metric_by_session")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: null };

  const raw = data as unknown as RawServerProgress;
  const stepProgress = normalizeRecord(raw.step_progress_by_session);
  const selectedMetric = normalizeRecord(raw.selected_metric_by_session);

  return {
    data: {
      highestUnlockedSessionNumber: raw.highest_unlocked_session_number,
      stepProgressBySession: stepProgress as unknown as Record<number, StepProgressEntry>,
      selectedMetricBySession: selectedMetric as unknown as Record<number, string>,
    },
    error: null,
  };
}

function normalizeRecord(obj: Record<string, unknown>): Record<string, unknown> {
  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    return obj;
  }
  return {};
}
