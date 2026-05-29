import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

export function serviceRoleClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("Missing Supabase service role configuration.");
  }
  return createClient(url, key);
}

export async function getUserIdFromRequest(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return null;
  }

  const supabase = serviceRoleClient();
  const token = authHeader.replace("Bearer ", "");
  const { data } = await supabase.auth.getUser(token);
  return data.user?.id ?? null;
}
