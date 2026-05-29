import { getSprintNumber } from "../data/mockData";
import type { CoachingMetric, CritiqueResult, TranscriptionResult } from "../types/production";
import { getSessionBucket } from "./sessionBucket";
import { supabase } from "./supabase";

type CreateAttemptInput = {
  userId: string;
  sessionId: number;
  challengeType?: string;
  recordingPath?: string | null;
  durationMs?: number;
};

export async function createSessionAttempt(input: CreateAttemptInput) {
  if (!supabase) {
    return { attemptId: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("session_attempts")
    .insert({
      user_id: input.userId,
      session_id: input.sessionId,
      sprint_id: getSprintNumber(input.sessionId),
      bucket: getSessionBucket(input.challengeType),
      recording_path: input.recordingPath ?? null,
      duration_ms: input.durationMs ?? null,
      status: "recorded",
    })
    .select("id")
    .single();

  return { attemptId: data?.id ?? null, error: error?.message ?? null };
}

export async function updateSessionAttempt(
  attemptId: string,
  patch: {
    status?: "recorded" | "transcribed" | "analysed" | "failed";
    recordingPath?: string;
    durationMs?: number;
    completedAt?: string;
  },
) {
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("session_attempts")
    .update({
      status: patch.status,
      recording_path: patch.recordingPath,
      duration_ms: patch.durationMs,
      completed_at: patch.completedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", attemptId);

  return { error: error?.message ?? null };
}

export async function saveCommitment(input: {
  userId: string;
  sessionId: number;
  recordingPath?: string | null;
  transcript?: string | null;
}) {
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.from("commitments").upsert(
    {
      user_id: input.userId,
      session_id: input.sessionId,
      recording_path: input.recordingPath ?? null,
      transcript: input.transcript ?? null,
    },
    { onConflict: "user_id,session_id" },
  );

  return { error: error?.message ?? null };
}

export async function fetchLatestAttempt(userId: string, sessionId: number) {
  if (!supabase) {
    return { attempt: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("session_attempts")
    .select("id, status, recording_path, duration_ms, completed_at, created_at")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { attempt: data, error: error?.message ?? null };
}

export type SessionAnalysisSnapshot = {
  attemptId?: string | null;
  transcript: string;
  transcription: TranscriptionResult;
  metrics: CoachingMetric[];
  critique: CritiqueResult | null;
  selectedMetricLabel?: string | null;
  recordingPath?: string | null;
  recordingUri?: string | null;
  durationMs: number;
};
