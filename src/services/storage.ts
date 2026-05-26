import { supabase } from "./supabase";

type UploadRecordingInput = {
  userId: string;
  sessionId: number;
  localUri: string;
  contentType?: string;
};

export async function uploadRecording({ userId, sessionId, localUri, contentType = "audio/m4a" }: UploadRecordingInput) {
  if (!supabase) {
    return { path: null, error: "Supabase is not configured." };
  }

  const response = await fetch(localUri);
  const blob = await response.blob();
  const path = `${userId}/session-${String(sessionId).padStart(2, "0")}/${Date.now()}.m4a`;
  const { error } = await supabase.storage.from("recordings").upload(path, blob, {
    contentType,
    upsert: false,
  });

  return { path: error ? null : path, error: error?.message ?? null };
}

export async function createSignedRecordingUrl(path: string) {
  if (!supabase) {
    return { url: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase.storage.from("recordings").createSignedUrl(path, 60 * 15);
  return { url: data?.signedUrl ?? null, error: error?.message ?? null };
}
