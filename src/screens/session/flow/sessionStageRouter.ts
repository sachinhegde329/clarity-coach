import type { SessionStage } from "../../../data/mockData";

/**
 * How Centre (step 1) is rendered for a session.
 * - centreStep: shared CentreStep + getCentreConfig (sessions 1–10, 25–36)
 * - breatheToolkit: sprint toolkit layouts (sessions 11–24 centre designs)
 */
export type CentreRendererId = "centreStep" | "breatheToolkit";

/**
 * How Listen → Commit (steps 2–5) are rendered.
 * - foundation: sessions 1–10 (UnifiedSessionStage)
 * - classic: sessions 11–16 (original sprint UI components)
 * - sprint: sessions 17–24 (pressure sprint surgical layouts)
 * - stitch: sessions 25–36 (unified stitch layouts)
 */
export type GuidedRendererId = "foundation" | "classic" | "sprint" | "stitch";

export type SessionStageRoute = {
  centre: CentreRendererId;
  guided: GuidedRendererId;
};

const ROUTES: Record<number, SessionStageRoute> = {};

function register(sessionNumber: number, route: SessionStageRoute) {
  ROUTES[sessionNumber] = route;
}

for (let n = 1; n <= 10; n += 1) {
  register(n, { centre: "centreStep", guided: "foundation" });
}
for (let n = 11; n <= 16; n += 1) {
  register(n, { centre: "breatheToolkit", guided: "classic" });
}
for (let n = 17; n <= 24; n += 1) {
  register(n, { centre: "breatheToolkit", guided: "sprint" });
}
for (let n = 25; n <= 36; n += 1) {
  register(n, { centre: "centreStep", guided: "stitch" });
}

export function getSessionStageRoute(sessionNumber: number): SessionStageRoute {
  return ROUTES[sessionNumber] ?? { centre: "centreStep", guided: "foundation" };
}

export function getCentreRendererId(sessionNumber: number): CentreRendererId {
  return getSessionStageRoute(sessionNumber).centre;
}

export function getGuidedRendererId(sessionNumber: number): GuidedRendererId {
  return getSessionStageRoute(sessionNumber).guided;
}

/** @deprecated Use getGuidedRendererId(session) === "stitch" */
export function usesStitchGuidedStages(sessionNumber?: number) {
  return sessionNumber !== undefined && getGuidedRendererId(sessionNumber) === "stitch";
}

/** All 36 sessions use the unified SessionFlowShell chrome. */
export function usesUnifiedShell(sessionNumber?: number) {
  return sessionNumber !== undefined && sessionNumber >= 1 && sessionNumber <= 36;
}

export function isCentreToolkitSession(sessionNumber: number) {
  return getCentreRendererId(sessionNumber) === "breatheToolkit";
}

export function describeSessionRoute(sessionNumber: number, stage: SessionStage): string {
  const route = getSessionStageRoute(sessionNumber);
  if (stage === "breathe") return `centre:${route.centre}`;
  return `guided:${route.guided}/${stage}`;
}
