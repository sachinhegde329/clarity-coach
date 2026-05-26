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

  return jsonResponse({
    narration: "This week, pace stabilised first. The next useful target is cleaner endings under pressure.",
    highlights: ["Pace variance narrowed.", "Filler density improved.", "Review one rising ending before the next session."],
  });
});
