type RuntimeEnv = {
  appEnv: "development" | "staging" | "production";
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  revenueCatIosApiKey?: string;
  revenueCatAndroidApiKey?: string;
  revenueCatEntitlementId: string;
  posthogApiKey?: string;
  posthogHost?: string;
  sentryDsn?: string;
};

function readPublicEnv(key: string) {
  return process.env[key]?.trim() || undefined;
}

function readAppEnv(): RuntimeEnv["appEnv"] {
  const value = readPublicEnv("EXPO_PUBLIC_APP_ENV");
  if (value === "production" || value === "staging" || value === "development") {
    return value;
  }
  return "development";
}

export const env: RuntimeEnv = {
  appEnv: readAppEnv(),
  supabaseUrl: readPublicEnv("EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: readPublicEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
  revenueCatIosApiKey: readPublicEnv("EXPO_PUBLIC_REVENUECAT_IOS_API_KEY"),
  revenueCatAndroidApiKey: readPublicEnv("EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY"),
  revenueCatEntitlementId: readPublicEnv("EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID") ?? "premium",
  posthogApiKey: readPublicEnv("EXPO_PUBLIC_POSTHOG_API_KEY"),
  posthogHost: readPublicEnv("EXPO_PUBLIC_POSTHOG_HOST"),
  sentryDsn: readPublicEnv("EXPO_PUBLIC_SENTRY_DSN"),
};

export function hasSupabaseConfig() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function hasRevenueCatConfig() {
  return Boolean(env.revenueCatIosApiKey || env.revenueCatAndroidApiKey);
}

export function hasPostHogConfig() {
  return Boolean(env.posthogApiKey);
}

export function hasSentryConfig() {
  return Boolean(env.sentryDsn);
}
