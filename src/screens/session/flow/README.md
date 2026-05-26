# Session flow architecture

All **36 sessions** share one traceable pipeline. Start here when adding or fixing a screen.

## Entry points

| File | Role |
|------|------|
| [`SessionFlowScreen.tsx`](../SessionFlowScreen.tsx) | Wires timers + handlers; delegates to `SessionStageView` |
| [`SessionStageView.tsx`](./SessionStageView.tsx) | Wraps `SessionFlowShell`; picks Centre vs Guided |
| [`sessionStageRouter.ts`](./sessionStageRouter.ts) | **Routing table** — which renderer each session uses |

## Centre (step 1)

[`CentreStageView.tsx`](./CentreStageView.tsx)

| Renderer | Sessions | Implementation |
|----------|----------|----------------|
| `centreStep` | 1–10, 25–36 | [`CentreStep`](../steps/CentreStep.tsx) + [`getCentreConfig.ts`](./getCentreConfig.ts) |
| `breatheToolkit` | 11–24 | [`BreatheStageBody`](../breathe/BreatheStage.tsx) (sprint centre tools) |

## Guided (steps 2–5: Listen → Commit)

[`guided/GuidedStageView.tsx`](./guided/GuidedStageView.tsx)

| Renderer | Sessions | Implementation |
|----------|----------|----------------|
| `foundation` | 1–10 | [`UnifiedSessionStage`](../unified/UnifiedSessionStage.tsx) |
| `classic` | 11–16 | [`classicStages.tsx`](./guided/classicStages.tsx) → Listen/Do/See/Commit steps |
| `sprint` | 17–24 | [`sprintStages.tsx`](./guided/sprintStages.tsx) |
| `stitch` | 25–36 | [`stitchStages.tsx`](./guided/stitchStages.tsx) |

## Config & chrome

| File | Role |
|------|------|
| [`unified/sessionScreenConfig.ts`](../unified/sessionScreenConfig.ts) | CTA labels, backgrounds, record button **text** (not chrome) |
| [`components/SessionFlowShell.tsx`](../components/SessionFlowShell.tsx) | Header + shell (do not fork per session) |
| [`data/sessionCopy.ts`](../../../data/sessionCopy.ts) | Copy source of truth |

## Adding a new session-specific screen

1. Open [`sessionStageRouter.ts`](./sessionStageRouter.ts) and confirm the session’s `guided` / `centre` renderer.
2. Add a `sessionNumber === N` branch in the matching module (`stitchStages`, `sprintStages`, `classicStages`, or `UnifiedSessionStage`).
3. Prefer extending shared primitives in [`sessionFlowStyles.ts`](../sessionFlowStyles.ts) over new one-off shells.

## Deprecated paths (do not extend)

- `breathe/BreatheStage.tsx` — use `CentreStageView` + `BreatheStageBody` only
- `sessionStepRegistry.ts` — empty; routing lives in `sessionStageRouter.ts`
- `legacy/`, `unified/stitchSessionStages.ts` — re-export shims only
