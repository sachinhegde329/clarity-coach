import type { SessionStage } from "../../../data/mockData";

export type SessionScreenCta = {
  primary: string;
  secondary?: string;
  primaryInverted?: boolean;
};

type StageBg = "parchment" | "surface";

export type SessionScreenLayout = {
  background: StageBg;
  /** Per-step screen tint from Stitch HTML (falls back to `background`). */
  stageBackgrounds?: Partial<Record<SessionStage, StageBg>>;
  listenNext: string;
  doRecordStyle: "circle" | "circle-large" | "square";
  see: SessionScreenCta;
  commit: SessionScreenCta;
  centreBegin: string;
  /** Do-step footer CTA (defaults to CONTINUE TO SEE / OPEN SEE). */
  doNext?: string;
  doRecordHint?: string;
  commitRecordHint?: string;
};

const DEFAULT: SessionScreenLayout = {
  background: "parchment",
  listenNext: "NEXT: RECORD",
  doRecordStyle: "circle",
  see: { primary: "SAVE INSIGHT", secondary: "REPLAY WITH OVERLAY" },
  commit: { primary: "SAVE COMMITMENT", secondary: "RETAKE" },
  centreBegin: "START SESSION",
};

/** Labels and layout hints aligned to the 25 Stitch HTML screens (sessions 1–5). */
export const SESSION_SCREEN_CONFIG: Record<number, SessionScreenLayout> = {
  1: {
    background: "parchment",
    listenNext: "LISTEN TO CONTINUE",
    doRecordStyle: "circle-large",
    see: { primary: "COMMIT TO JOURNEY" },
    commit: { primary: "COMMIT REFLECTION", secondary: "RETAKE AUDIO" },
    centreBegin: "START SESSION",
  },
  2: {
    background: "parchment",
    listenNext: "NEXT: RECORD",
    doRecordStyle: "circle-large",
    see: { primary: "SAVE INSIGHT" },
    commit: { primary: "SAVE COMMITMENT" },
    centreBegin: "START SESSION",
  },
  3: {
    background: "parchment",
    listenNext: "NEXT: RECORD",
    doRecordStyle: "square",
    see: { primary: "SAVE INSIGHT" },
    commit: { primary: "SAVE COMMITMENT" },
    centreBegin: "START SESSION",
  },
  4: {
    background: "parchment",
    listenNext: "NEXT: RECORD",
    doRecordStyle: "circle",
    see: { primary: "SAVE INSIGHT" },
    commit: { primary: "SAVE COMMITMENT" },
    centreBegin: "START SESSION",
  },
  5: {
    background: "parchment",
    listenNext: "NEXT: RECORD",
    doRecordStyle: "circle",
    see: { primary: "PROCEED TO CALIBRATION", secondary: "RE-LISTEN TO CLIP" },
    commit: { primary: "SAVE COMMITMENT" },
    centreBegin: "BEGIN",
  },
  6: {
    background: "parchment",
    listenNext: "PROCEED TO PLAYBACK",
    doRecordStyle: "circle-large",
    see: { primary: "FINISH SPRINT 1" },
    commit: { primary: "COMPLETE SPRINT 1" },
    centreBegin: "BEGIN REVIEW",
  },
  7: {
    background: "parchment",
    listenNext: "MARK STEP COMPLETE",
    doRecordStyle: "circle",
    see: { primary: "BEGIN NEXT SESSION" },
    commit: { primary: "COMPLETE SESSION" },
    centreBegin: "BEGIN",
  },
  8: {
    background: "parchment",
    listenNext: "CONTINUE TO STEP 03: RECORD",
    doRecordStyle: "circle-large",
    see: { primary: "PROCEED TO STEP 05", secondary: "RE-LISTEN TO CLIP" },
    commit: { primary: "COMPLETE SESSION" },
    centreBegin: "BEGIN",
  },
  9: {
    background: "parchment",
    listenNext: "CONTINUE TO STEP 03: RECORD",
    doRecordStyle: "circle-large",
    see: { primary: "PROCEED TO STEP 05" },
    commit: { primary: "COMPLETE SESSION" },
    centreBegin: "BEGIN",
  },
  10: {
    background: "parchment",
    listenNext: "CONTINUE TO STEP 03: RECORD",
    doRecordStyle: "circle",
    see: { primary: "PROCEED TO STEP 05" },
    commit: { primary: "COMPLETE SESSION" },
    centreBegin: "BEGIN",
  },
  25: {
    background: "surface",
    stageBackgrounds: { breathe: "surface", lesson: "surface", feedback: "surface", record: "surface", reflect: "parchment" },
    listenNext: "CONTINUE TO STEP 3",
    doRecordStyle: "circle",
    doNext: "PROCEED TO REVIEW",
    see: { primary: "PROCEED TO EVALUATION" },
    commit: { primary: "COMPLETE SESSION" },
    commitRecordHint: "RECORD",
    centreBegin: "BEGIN CENTRING",
  },
  26: {
    background: "surface",
    stageBackgrounds: { breathe: "surface", lesson: "surface", feedback: "parchment", record: "parchment", reflect: "parchment" },
    listenNext: "CONTINUE",
    doRecordStyle: "circle",
    doNext: "FINISH",
    see: { primary: "PROCEED TO SYNTHESIS" },
    commit: { primary: "RECORD" },
    commitRecordHint: "RECORD",
    centreBegin: "BEGIN RECORDING",
  },
  27: {
    background: "surface",
    stageBackgrounds: { breathe: "surface", lesson: "surface", feedback: "surface", record: "parchment", reflect: "parchment" },
    listenNext: "CONTINUE",
    doRecordStyle: "circle-large",
    doNext: "BEGIN RECORDING",
    doRecordHint: "BEGIN RECORDING",
    see: { primary: "CONTINUE TO COMMIT", secondary: "PLAY RECORDING" },
    commit: { primary: "RECORD" },
    commitRecordHint: "RECORD",
    centreBegin: "START RECORDING",
  },
  28: {
    background: "parchment",
    stageBackgrounds: { breathe: "parchment", lesson: "surface", feedback: "parchment", record: "parchment", reflect: "parchment" },
    listenNext: "CONTINUE",
    doRecordStyle: "circle",
    doNext: "END RECORDING",
    doRecordHint: "END RECORDING",
    see: { primary: "PROCEED TO DELIVER" },
    commit: { primary: "RECORD" },
    commitRecordHint: "RECORD",
    centreBegin: "BEGIN RECORDING",
  },
  29: {
    background: "surface",
    stageBackgrounds: { breathe: "surface", lesson: "surface", feedback: "surface", record: "parchment", reflect: "parchment" },
    listenNext: "CONTINUE",
    doRecordStyle: "circle",
    doNext: "FINISH RECORDING",
    doRecordHint: "FINISH RECORDING (SPACEBAR)",
    see: { primary: "PROCEED TO FINAL STEP" },
    commit: { primary: "HOLD TO COMMIT" },
    centreBegin: "BEGIN RECORDING",
  },
  30: {
    background: "surface",
    stageBackgrounds: { breathe: "surface", lesson: "surface", feedback: "surface", record: "surface", reflect: "parchment" },
    listenNext: "CONTINUE",
    doRecordStyle: "circle",
    doNext: "END SESSION",
    doRecordHint: "BEGIN",
    see: { primary: "PROCEED TO 05 INTEGRATE" },
    commit: { primary: "RECORD" },
    commitRecordHint: "RECORD",
    centreBegin: "CONFIRM LENS",
  },
  31: {
    background: "surface",
    stageBackgrounds: { breathe: "surface", lesson: "surface", feedback: "parchment", record: "surface", reflect: "surface" },
    listenNext: "CONTINUE",
    doRecordStyle: "circle",
    doNext: "CONTINUE TO SEE",
    see: { primary: "CONTINUE TO COMMIT" },
    commit: { primary: "RECORD" },
    commitRecordHint: "RECORD",
    centreBegin: "BEGIN",
  },
  32: {
    background: "surface",
    stageBackgrounds: { breathe: "surface", lesson: "surface", feedback: "surface", record: "surface", reflect: "parchment" },
    listenNext: "CONTINUE",
    doRecordStyle: "circle",
    doNext: "END RECORDING",
    doRecordHint: "END RECORDING",
    see: { primary: "CONTINUE TO REFLECT" },
    commit: { primary: "RECORD" },
    commitRecordHint: "RECORD",
    centreBegin: "BEGIN RECORDING",
  },
  33: {
    background: "surface",
    stageBackgrounds: { breathe: "surface", lesson: "surface", feedback: "surface", record: "surface", reflect: "parchment" },
    listenNext: "CONTINUE →",
    doRecordStyle: "circle",
    doNext: "END RECORDING",
    doRecordHint: "END RECORDING",
    see: { primary: "ADVANCE TO 05" },
    commit: { primary: "HOLD TO COMMIT" },
    centreBegin: "BEGIN RECORD",
  },
  34: {
    background: "surface",
    stageBackgrounds: { breathe: "surface", lesson: "surface", feedback: "surface", record: "surface", reflect: "parchment" },
    listenNext: "CONTINUE",
    doRecordStyle: "circle",
    doNext: "FINISH",
    see: { primary: "PROCEED TO 05: ACTION" },
    commit: { primary: "COMMIT TO MEMORY" },
    centreBegin: "BEGIN",
  },
  35: {
    background: "parchment",
    stageBackgrounds: { breathe: "parchment", lesson: "surface", feedback: "surface", record: "surface", reflect: "parchment" },
    listenNext: "CONTINUE",
    doRecordStyle: "circle-large",
    doNext: "END & ANALYZE",
    see: { primary: "NEXT STEP" },
    commit: { primary: "RECORD" },
    commitRecordHint: "RECORD",
    centreBegin: "BEGIN RECORDING",
  },
  36: {
    background: "surface",
    stageBackgrounds: { breathe: "surface", lesson: "surface", feedback: "surface", record: "surface", reflect: "parchment" },
    listenNext: "CONTINUE",
    doRecordStyle: "circle-large",
    doNext: "CONTINUE TO SEE",
    doRecordHint: "TAP TO BEGIN",
    see: { primary: "CONTINUE TO COMMIT" },
    commit: { primary: "COMPLETE PROGRAM" },
    commitRecordHint: "RECORD",
    centreBegin: "BEGIN PERFORMANCE",
  },
};

export function getSessionScreenConfig(sessionNumber: number): SessionScreenLayout {
  return SESSION_SCREEN_CONFIG[sessionNumber] ?? DEFAULT;
}

export function stageBackground(sessionNumber: number, stage?: SessionStage): string {
  const cfg = getSessionScreenConfig(sessionNumber);
  const tone = (stage && cfg.stageBackgrounds?.[stage]) ?? cfg.background;
  return tone === "parchment" ? "#FDF6E3" : "#fff8f5";
}

export function listenCtaLabel(sessionNumber: number, listenComplete: boolean): string {
  const cfg = getSessionScreenConfig(sessionNumber);
  if (listenComplete) {
    if (sessionNumber >= 1 && sessionNumber <= 10) return cfg.listenNext;
    if (sessionNumber >= 25 && sessionNumber <= 36) return cfg.listenNext;
    return "CONTINUE TO DO";
  }
  return cfg.listenNext;
}

export function doCtaLabel(sessionNumber: number, recordElapsed: number, recordLimit: number): string {
  const cfg = getSessionScreenConfig(sessionNumber);
  if (cfg.doNext) return cfg.doNext;
  return recordElapsed >= recordLimit ? "OPEN SEE" : "CONTINUE TO SEE";
}

export function doRecordHintLabel(sessionNumber: number, recording: boolean, recordElapsed: number): string {
  const cfg = getSessionScreenConfig(sessionNumber);
  if (cfg.doRecordHint) {
    if (recording) return "RECORDING IN PROGRESS";
    if (recordElapsed > 0) return "CAPTURE PAUSED";
    return cfg.doRecordHint;
  }
  if (recording) return "RECORDING IN PROGRESS";
  if (recordElapsed > 0) return "CAPTURE PAUSED";
  return "TAP TO RECORD";
}

export function commitRecordHintLabel(sessionNumber: number, reflectRecording: boolean, reflectionDone: boolean): string {
  const cfg = getSessionScreenConfig(sessionNumber);
  const hint = cfg.commitRecordHint ?? "TAP TO RECORD";
  if (reflectRecording) return "RECORDING";
  if (reflectionDone) return "SAVED";
  if (sessionNumber === 25) return "TAP TO RECORD";
  return hint;
}

export function commitActionLabel(
  sessionNumber: number,
  reflectionDone: boolean,
  totalSessions: number,
): string {
  const cta = commitCtaLabels(sessionNumber);
  const cfg = getSessionScreenConfig(sessionNumber);
  if (reflectionDone) {
    if (sessionNumber >= totalSessions) return "COMPLETE PROGRAM";
    return "COMPLETE SESSION";
  }
  if (/HOLD TO COMMIT/i.test(cta.primary)) return cta.primary;
  if (/COMMIT TO MEMORY/i.test(cta.primary)) return cta.primary;
  if (/COMPLETE/i.test(cta.primary)) {
    return cfg.commitRecordHint ?? "RECORD";
  }
  return cfg.commitRecordHint ?? cta.primary;
}

export function seeCtaLabels(sessionNumber: number): SessionScreenCta {
  return getSessionScreenConfig(sessionNumber).see;
}

export function commitCtaLabels(sessionNumber: number): SessionScreenCta {
  return getSessionScreenConfig(sessionNumber).commit;
}

export function centreBeginLabel(sessionNumber: number, ready: boolean): string {
  const cfg = getSessionScreenConfig(sessionNumber);
  return ready ? cfg.centreBegin : "SETTLE IN";
}

export function doRecordStyle(sessionNumber: number): SessionScreenLayout["doRecordStyle"] {
  return getSessionScreenConfig(sessionNumber).doRecordStyle;
}

/** All sessions use unified shell chrome (backgrounds, scroll layout). See flow/sessionStageRouter.ts for stage bodies. */
export function usesUnifiedShell(sessionNumber?: number): boolean {
  return sessionNumber !== undefined && sessionNumber >= 1 && sessionNumber <= 36;
}

/** @deprecated Use usesUnifiedShell — name reflected an old 1–10 / 25–36 split. */
export function isUnifiedSession(sessionNumber?: number): boolean {
  return usesUnifiedShell(sessionNumber);
}

export function stageIndex(stage: SessionStage): number {
  const map: Record<SessionStage, number> = {
    breathe: 0,
    lesson: 1,
    feedback: 2,
    record: 3,
    reflect: 4,
  };
  return map[stage];
}
