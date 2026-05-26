import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getUserIdFromRequest, serviceRoleClient } from "../_shared/auth.ts";

type CritiqueRequest = {
  sessionId: number;
  sprintId: number;
  plan: "free" | "premium";
  transcript: string;
  metrics: Array<{ key?: string; label: string; value: string | number; delta?: string }>;
  profile?: Record<string, unknown>;
  attemptId?: string;
};

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

  const body = (await request.json()) as CritiqueRequest;
  const model = Deno.env.get("AI_MODEL") ?? "llama-3.1-8b-instant";
  const provider = Deno.env.get("AI_PROVIDER") ?? "groq";
  const strongestMetric = body.metrics[0]?.label ?? "clarity";
  const paceMetric = body.metrics.find((metric) => /pace|wpm/i.test(metric.label));
  const fillerMetric = body.metrics.find((metric) => /filler/i.test(metric.label));

  const critique = paceMetric
    ? `Your pace landed around ${paceMetric.value}${paceMetric.unit ? ` ${paceMetric.unit}` : ""}. Lead with the decision in sentence one, then let the supporting detail follow.`
    : `Your answer has a clear ${strongestMetric} signal. Tighten the next pass by making the first sentence carry the decision.`;

  const recommendation =
    body.plan === "premium"
      ? "Replay the exact moment where your structure drifted, then answer once more with one fewer supporting detail."
      : fillerMetric && Number(fillerMetric.value) > 2
        ? "Pause for one beat before your next clause instead of filling the gap."
        : "Use one deliberate pause before the final sentence.";

  const suggestedCommitment = "Tomorrow I will make the first sentence do more work.";
  const result = {
    provider,
    model,
    critique,
    recommendation,
    suggestedCommitment,
    annotations: [] as Array<{ label: string; detail: string; timestampMs?: number }>,
  };

  const supabase = serviceRoleClient();
  await supabase.from("ai_critiques").insert({
    attempt_id: body.attemptId ?? null,
    user_id: userId,
    session_id: body.sessionId,
    provider,
    model,
    critique: result.critique,
    recommendation: result.recommendation,
    suggested_commitment: result.suggestedCommitment,
    annotations: result.annotations,
  });

  if (body.attemptId) {
    await supabase
      .from("session_attempts")
      .update({ status: "analysed", updated_at: new Date().toISOString() })
      .eq("id", body.attemptId);
  }

  return jsonResponse(result);
});
