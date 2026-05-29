import { supabase } from "./supabase";

export type UserProfileDB = {
  industry: string;
  role: string;
  training_goal: string;
  horizons: string[];
  frictions: string[];
  duration: string;
  practice_time: string;
};

export type UserProfileRow = UserProfileDB & {
  user_id: string;
  created_at: string;
  updated_at: string;
};

export async function upsertProfile(
  userId: string,
  profile: UserProfileDB,
): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.from("user_profiles").upsert(
    {
      user_id: userId,
      industry: profile.industry,
      role: profile.role,
      training_goal: profile.training_goal,
      horizons: profile.horizons,
      frictions: profile.frictions,
      duration: profile.duration,
      practice_time: profile.practice_time,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  return { error: error?.message ?? null };
}

export async function fetchProfile(
  userId: string,
): Promise<{ profile: UserProfileRow | null; error: string | null }> {
  if (!supabase) {
    return { profile: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return { profile: data as UserProfileRow | null, error: error?.message ?? null };
}
