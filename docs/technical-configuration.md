# Clarity Coach Technical Configuration

This repo now has the scaffolding for the production stack described in the PRD. The app still runs without secrets; integrations no-op until the environment variables are filled.

## Accounts To Create

1. Supabase project
   - Enable anonymous auth for v1 device-first accounts.
   - Create Storage buckets: `recordings`, `reference-audio`, `share-clips`.
   - Run `supabase/migrations/001_initial_schema.sql`.
   - Deploy Edge Functions: `ai-critique`, `transcribe`, `hot-seat-turn`, `weekly-forensic`, `revenuecat-webhook`.

2. RevenueCat
   - Entitlement: `premium`.
   - Products: monthly, annual, lifetime.
   - Trial: 7 days.
   - Prices: US `9.99/mo`, `59/year`, `149 lifetime`; India `199 INR/mo`, `1,999 INR/year`, `4,999 INR lifetime`.
   - Webhook target: Supabase `revenuecat-webhook` function.

3. AI/STT providers
   - Groq API key for Whisper and fast critique model.
   - OpenAI API key as fallback transcription provider.
   - Set rate/cost limits in Edge Functions before beta.

4. Analytics and errors
   - PostHog project for product events.
   - Sentry project for React Native crashes and Edge Function errors.

5. Mobile stores
   - Apple Developer account, App Store Connect app, in-app purchases.
   - Google Play app, subscriptions, internal testing track.
   - Apple Small Business Programme application.

## Environment Variables

Copy `.env.example` to `.env.local` for local Expo development. Public keys use `EXPO_PUBLIC_` and are safe in the app bundle.

Set server-only values with Supabase secrets:

```bash
supabase secrets set GROQ_API_KEY=...
supabase secrets set OPENAI_API_KEY=...
supabase secrets set AI_PROVIDER=groq
supabase secrets set AI_MODEL=...
supabase secrets set TRANSCRIPTION_PROVIDER=groq
supabase secrets set REVENUECAT_WEBHOOK_SECRET=...
```

## Current Repo Scaffolding

- `src/config/env.ts`: public runtime config.
- `src/services/supabase.ts`: Supabase client and Edge Function wrapper.
- `src/services/ai.ts`: critique, Hot Seat, weekly forensic client calls.
- `src/services/transcription.ts`: premium/cloud transcription client call.
- `src/services/entitlements.ts`: RevenueCat setup and entitlement checks.
- `src/services/analytics.ts`: PostHog adapter.
- `src/services/errorTracking.ts`: Sentry adapter.
- `src/services/notifications.ts`: daily reminder scheduling.
- `supabase/migrations/001_initial_schema.sql`: initial Postgres schema and RLS policies.
- `supabase/functions/*`: Edge Function shells.

## Remaining Implementation Work

- Replace Edge Function placeholder responses with live Groq/OpenAI provider calls.
- Upload recordings to Supabase Storage from the app before transcription.
- Connect deterministic metric calculation to real transcripts.
- Replace local `plan` state with RevenueCat entitlement state.
- Send analytics events for onboarding, session step drop-off, recording failure, transcription fallback, purchase start, purchase complete, and replay share.
- Add Sentry source-map upload configuration once `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` are available.
- Configure EAS build profiles for development, preview, and production.
