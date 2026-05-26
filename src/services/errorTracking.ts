import * as Sentry from "@sentry/react-native";
import { env, hasSentryConfig } from "../config/env";

export function configureErrorTracking() {
  if (!hasSentryConfig()) {
    return false;
  }

  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.appEnv,
    tracesSampleRate: env.appEnv === "production" ? 0.1 : 1,
  });
  return true;
}

export function reportError(error: unknown, context?: Record<string, unknown>) {
  Sentry.captureException(error, { extra: context });
}
