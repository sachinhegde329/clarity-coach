import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getUserIdFromRequest } from "../_shared/auth.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return jsonResponse({ error: "Unauthenticated." }, 401);
  }

  const body = await request.json() as { turnIndex: number; persona?: string };
  return jsonResponse({
    followUp: body.turnIndex === 0
      ? "What would make a skeptical stakeholder believe that?"
      : "What is the decision you want from the room?",
    coachingNote: "Acknowledge the pressure, answer directly, then return to your structure.",
  });
});
