import { sessionDefinitions } from "../../../data/mockData";
import type { CentreConfig } from "../steps/CentreStep";

function clampToThreeLines(value: string, maxChars: number, suffix: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) return suffix;
  if (clean.length <= maxChars) return clean;
  const clipped = clean.slice(0, Math.max(0, maxChars - 1)).trimEnd();
  return `${clipped}… ${suffix}`;
}

type BreatheStage = (typeof sessionDefinitions)[number]["stages"]["breathe"];

export function getCentreConfigForSession(sessionNumber: number, breathe: BreatheStage): CentreConfig {
  const commonTiming = { totalMs: 30_000, settleMs: 5_000, phaseMs: 4_000, haptics: false };
  const framingFromCopy = [breathe.title, ...(breathe.onScreenLines ?? []), breathe.underOrbMeta ?? breathe.quote]
    .filter(Boolean)
    .join("\n");

  if (sessionNumber === 1) {
    return {
      type: "breathing",
      framingText: framingFromCopy || breathe.prompt,
      patternSeconds: [4, 6],
      phaseLabels: ["Breathe in…", "Breathe out…"],
      organicOrb: true,
      timingConfig: { totalMs: 40_000, settleMs: 3_000, microPauseMs: 0 },
    };
  }

  if (sessionNumber === 2) {
    return {
      type: "breathing",
      framingText: framingFromCopy || breathe.prompt,
      patternSeconds: [4, 6],
      phaseLabels: ["Breathe in…", "Breathe out…"],
      organicOrb: true,
      organicOrbVariant: "session2",
      timingConfig: { ...commonTiming, settleMs: 3_000, microPauseMs: 0 },
    };
  }

  if (sessionNumber === 5) {
    return {
      type: "pause",
      framingText: framingFromCopy,
      textSequence: breathe.onScreenLines?.length ? breathe.onScreenLines : ["Something small is fine."],
      timingConfig: commonTiming,
    };
  }

  if (sessionNumber === 6) {
    return {
      type: "pause",
      framingText: framingFromCopy,
      textSequence: breathe.onScreenLines ?? ["Today, no recording. Just listening."],
      timingConfig: commonTiming,
    };
  }

  if (sessionNumber === 7) {
    return {
      type: "affirmation",
      framingText: framingFromCopy,
      textSequence: breathe.onScreenLines ?? [
        "You are about to try something hard.",
        "The next sixty seconds will feel unnatural. That is the point.",
      ],
      timingConfig: commonTiming,
    };
  }

  if (sessionNumber === 8) {
    return {
      type: "vocal",
      framingText: framingFromCopy,
      timingConfig: commonTiming,
    };
  }

  if (sessionNumber === 9) {
    return {
      type: "affirmation",
      framingText: framingFromCopy,
      textSequence: breathe.onScreenLines ?? [breathe.quote],
      timingConfig: commonTiming,
    };
  }

  if (sessionNumber === 10) {
    return {
      type: "breathing",
      framingText: framingFromCopy,
      patternSeconds: [4, 4, 6, 4],
      phaseLabels: ["Breathe in…", "Hold…", "Release…", "Pause…"],
      timingConfig: commonTiming,
    };
  }

  if (sessionNumber === 11) {
    return {
      type: "affirmation",
      framingText: framingFromCopy,
      textSequence: breathe.onScreenLines ?? [breathe.quote],
      timingConfig: commonTiming,
    };
  }

  if (sessionNumber >= 25 && sessionNumber <= 35) {
    return {
      type: "affirmation",
      framingText: framingFromCopy,
      textSequence: breathe.onScreenLines?.length ? breathe.onScreenLines : [breathe.quote],
      timingConfig: { ...commonTiming, settleMs: 3_000 },
    };
  }

  if (sessionNumber === 36) {
    return {
      type: "pause",
      framingText: framingFromCopy,
      textSequence: breathe.onScreenLines?.length ? breathe.onScreenLines : [breathe.quote],
      timingConfig: commonTiming,
    };
  }

  return {
    type: "breathing",
    framingText: clampToThreeLines(framingFromCopy || breathe.prompt, 220, "Clarity begins here."),
    patternSeconds: breathe.breathPattern
      ? [breathe.breathPattern.inhale, breathe.breathPattern.hold, breathe.breathPattern.exhale].filter(
          (value): value is number => Boolean(value),
        )
      : [4, 4, 4, 4],
    phaseLabels: breathe.breathPattern?.hold
      ? ["Breathe in…", "Hold…", "Breathe out…"]
      : ["Breathe in…", "Hold…", "Breathe out…", "Hold…"],
    timingConfig: commonTiming,
  };
}
