import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceRoleClient } from "../_shared/auth.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const expectedSecret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");
  const providedSecret = request.headers.get("x-revenuecat-signature");
  if (expectedSecret && providedSecret !== expectedSecret) {
    return jsonResponse({ error: "Invalid webhook signature." }, 401);
  }

  const payload = await request.json();
  const appUserId = payload?.event?.app_user_id;
  const entitlementId = payload?.event?.entitlement_id ?? "premium";
  if (!appUserId) {
    return jsonResponse({ ok: true, ignored: "Missing app_user_id." });
  }

  const supabase = serviceRoleClient();
  await supabase.from("entitlements").upsert({
    user_id: appUserId,
    entitlement_id: entitlementId,
    product_id: payload?.event?.product_id,
    is_active: !["EXPIRATION", "CANCELLATION"].includes(payload?.event?.type),
    expires_at: payload?.event?.expiration_at_ms ? new Date(payload.event.expiration_at_ms).toISOString() : null,
    raw_payload: payload,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,entitlement_id" });

  return jsonResponse({ ok: true });
});
