import { PostHog } from "posthog-react-native";
import { env, hasPostHogConfig } from "../config/env";

let client: PostHog | null = null;

export function configureAnalytics() {
  if (!hasPostHogConfig()) {
    return null;
  }

  client = new PostHog(env.posthogApiKey!, {
    host: env.posthogHost,
  });
  return client;
}

type AnalyticsProperties = Record<string, string | number | boolean | null>;

export function identifyUser(userId: string, properties?: AnalyticsProperties) {
  client?.identify(userId, properties);
}

export function trackEvent(name: string, properties?: AnalyticsProperties) {
  client?.capture(name, properties);
}
