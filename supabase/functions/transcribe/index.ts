import { computeSpeechMetrics } from "../speechMetrics.ts";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getUserIdFromRequest, serviceRoleClient } from "../_shared/auth.ts";

const FILLER_PATTERN = /\b(um+|uh+|er+|ah+|like|you know|sort of|kind of|basically|actually|literally|right\?)\b/gi;

function deriveMetricsFromText(text: string, durationMs = 60000) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const durationSec = Math.max(durationMs / 1000, 1);
  const wpm = Math.round((words.length / durationSec) * 60);
  const fillers = (text.match(FILLER_PATTERN) ?? []).length;
  return { wpm, fillers, words: words.length };
}

async function fetchRecordingBlob(path: string) {
  const supabase = serviceRoleClient();
  const { data, error } = await supabase.storage.from("recordings").download(path);
  if (error || !data) {
    throw new Error(error?.message ?? "Recording not found.");
  }
  return data;
}

async function transcribeWithGroq(blob: Blob, language: string) {
  const apiKey = Deno.env.get("GROQ_API_KEY");
  if (!apiKey) {
    return null;
  }

  const form = new FormData();
  form.append("file", blob, "recording.m4a");
  form.append("model", Deno.env.get("GROQ_TRANSCRIPTION_MODEL") ?? "whisper-large-v3");
  form.append("language", language);

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Groq transcription failed.");
  }

  const payload = await response.json() as { text?: string };
  return payload.text?.trim() ?? "";
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return jsonResponse({ error: "Unauthenticated." }, 401);
  }

  const body = await request.json() as {
    recordingPath: string;
    sessionId: number;
    attemptId?: string;
    durationMs?: number;
    language?: string;
  };

  const language = body.language ?? "en";
  const provider = Deno.env.get("TRANSCRIPTION_PROVIDER") ?? "groq";
  let text = "";
  let resolvedProvider: "groq" | "typed-fallback" = "typed-fallback";

  try {
    if (body.recordingPath) {
      const blob = await fetchRecordingBlob(body.recordingPath);
      const groqText = await transcribeWithGroq(blob, language);
      if (groqText) {
        text = groqText;
        resolvedProvider = "groq";
      }
    }
  } catch (error) {
    console.error("transcribe provider error", error);
  }

  if (!text) {
    const seconds = Math.max(Math.round((body.durationMs ?? 60000) / 1000), 1);
    text = `Practice capture recorded for about ${seconds} seconds. Connect Groq Whisper to unlock full transcription.`;
  }

  const metrics = computeSpeechMetrics(text, body.durationMs ?? 60000);
  const supabase = serviceRoleClient();

  if (body.attemptId) {
    await supabase.from("transcripts").insert({
      attempt_id: body.attemptId,
      provider: resolvedProvider,
      language,
      text,
      segments: [{ text }],
    });

    await supabase.from("session_metrics").insert(
      metrics.map((metric) => ({
        attempt_id: body.attemptId,
        key: metric.key,
        label: metric.label,
        value: typeof metric.value === "number" ? metric.value : null,
        value_text: typeof metric.value === "string" ? metric.value : String(metric.value),
        unit: metric.unit ?? null,
        delta: metric.delta ?? null,
      })),
    );

    await supabase
      .from("session_attempts")
      .update({ status: "transcribed", updated_at: new Date().toISOString() })
      .eq("id", body.attemptId);
  }

  return jsonResponse({
    provider: resolvedProvider,
    language,
    text,
    segments: [{ text }],
    metrics,
  });
});
