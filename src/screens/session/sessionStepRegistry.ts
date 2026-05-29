import type { SessionStage } from "../../data/mockData";

/**
 * @deprecated Session routing is defined in `flow/sessionStageRouter.ts`.
 * Stage rendering is intentionally unified; per-session UI lives in flow/guided/* and CentreStep.
 */
const CUSTOM_LISTEN = new Set<number>();

const CUSTOM_DO = new Set<number>();

const CUSTOM_SEE = new Set<number>();

const CUSTOM_COMMIT = new Set<number>();

const CUSTOM_CENTRE = new Set<number>();

export function usesCustomCentre(sessionNumber: number) {
  return CUSTOM_CENTRE.has(sessionNumber);
}

export function usesCustomStep(sessionNumber: number, stage: SessionStage) {
  if (stage === "breathe") return usesCustomCentre(sessionNumber);
  if (stage === "lesson") return CUSTOM_LISTEN.has(sessionNumber);
  if (stage === "feedback") return CUSTOM_DO.has(sessionNumber);
  if (stage === "record") return CUSTOM_SEE.has(sessionNumber);
  if (stage === "reflect") return CUSTOM_COMMIT.has(sessionNumber);
  return false;
}

export function usesGuidedStep(sessionNumber: number, stage: SessionStage) {
  if (stage === "breathe") return false;
  return !usesCustomStep(sessionNumber, stage);
}
