import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { hasSupabaseConfig, env } from "../config/env";

export const supabase = hasSupabaseConfig()
  ? createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export async function getOrCreateAnonymousUser() {
  if (!supabase) {
    return { userId: null, error: "Supabase is not configured." };
  }

  const existing = await supabase.auth.getUser();
  if (existing.data.user) {
    return { userId: existing.data.user.id, error: null };
  }

  const created = await supabase.auth.signInAnonymously();
  return { userId: created.data.user?.id ?? null, error: created.error?.message ?? null };
}

export async function invokeEdgeFunction<TInput extends object, TOutput>(
  name: string,
  body: TInput,
  options?: { signal?: AbortSignal },
): Promise<{ data: TOutput | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase.functions.invoke<TOutput>(name, {
    body,
    signal: options?.signal,
  });
  return { data: data ?? null, error: error?.message ?? null };
}
