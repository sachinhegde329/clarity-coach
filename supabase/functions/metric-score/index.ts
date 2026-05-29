import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getUserIdFromRequest } from "../_shared/auth.ts";

type CoachingMetric = {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  delta?: string;
};

type RequestBody = {
  sessionId: number;
  sprintId: number;
  transcript: string;
  durationMs: number;
  baseMetrics: CoachingMetric[];
  requestedLabels: string[];
};

function normalizeKey(label: string) {
  return label
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function scoreWithGroq(input: RequestBody) {
  const apiKey = Deno.env.get("GROQ_API_KEY");
  if (!apiKey) {
    return { metrics: [], provider: null, model: null, error: "AI metric scoring not configured." } as const;
  }

  const model = Deno.env.get("GROQ_CHAT_MODEL") ?? "llama-3.1-8b-instant";
  const provider = "groq";

  const requested = input.requestedLabels.map((label) => label.trim()).filter(Boolean);
  if (!requested.length) {
    return { metrics: [], provider, model, error: null } as const;
  }

  // Keep this intentionally simple and safe: numeric 0–100 scores for subjective labels.
  const system = [
    "You are scoring communication coaching metrics for a voice coaching app.",
    "Return STRICT JSON only, no prose. The response must match the schema exactly.",
    "Score each requested metric as a number 0-100 (integer).",
    "If you cannot infer a metric, return null for its value.",
  ].join("\n");

  const user = JSON.stringify(
    {
      sessionId: input.sessionId,
      sprintId: input.sprintId,
      requestedLabels: requested,
      transcript: input.transcript,
      durationMs: input.durationMs,
      baseMetrics: input.baseMetrics,
      outputSchema: {
        metrics: [{ label: "STRING", value: "NUMBER_OR_NULL", unit: "STRING_OR_NULL" }],
      },
    },
    null,
    2,
  );

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    return { metrics: [], provider, model, error: message || "Metric scoring failed." } as const;
  }

  const payload = (await response.json()) as any;
  const content = payload?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    return { metrics: [], provider, model, error: "Metric scoring returned no content." } as const;
  }

  let parsed: any = null;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { metrics: [], provider, model, error: "Metric scoring returned invalid JSON." } as const;
  }

  const metrics: CoachingMetric[] = Array.isArray(parsed?.metrics)
    ? parsed.metrics
        .map((m: any) => {
          const label = typeof m?.label === "string" ? m.label : null;
          const value = typeof m?.value === "number" ? Math.round(m.value) : null;
          if (!label) return null;
          if (value === null) return { key: normalizeKey(label), label: label.toUpperCase(), value: "—" };
          return { key: normalizeKey(label), label: label.toUpperCase(), value, unit: m?.unit ?? undefined };
        })
        .filter(Boolean)
    : [];

  return { metrics, provider, model, error: null } as const;
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

  const body = (await request.json()) as RequestBody;
  const result = await scoreWithGroq(body);

  return jsonResponse({
    provider: result.provider ?? "typed-fallback",
    model: result.model ?? null,
    metrics: result.metrics,
    error: result.error ?? null,
  });
});

