import React from "react";
import { SessionFlowShell } from "../components/SessionFlowShell";
import { CentreStageView } from "./CentreStageView";
import { GuidedStageView } from "./guided/GuidedStageView";
import { styles } from "../sessionFlowStyles";
import { isCentreToolkitSession } from "./sessionStageRouter";
import type { CentreStageRenderProps, SessionStageRenderProps } from "./types";
import type { SessionStage } from "../../../data/mockData";

export type SessionStageViewProps = {
  sessionNumber: number;
  stage: SessionStage;
  stepIndex: number;
  sessionElapsed: number;
  onJumpToStep?: (stepIndex: number) => void;
  onBack: () => void;
  onExit: () => void;
  centre: CentreStageRenderProps;
  guided: SessionStageRenderProps;
};

/**
 * Renders the active session stage inside SessionFlowShell.
 * This is the only stage content entry point from SessionFlowScreen.
 */
export function SessionStageView({
  sessionNumber,
  stage,
  stepIndex,
  sessionElapsed,
  onJumpToStep,
  onBack,
  onExit,
  centre,
  guided,
}: SessionStageViewProps) {
  const shellProps = {
    sessionNumber,
    session: centre.session,
    stage,
    stepIndex,
    sessionElapsed,
    onJumpToStep: (targetIndex: number) => (onJumpToStep ? onJumpToStep(targetIndex) : undefined),
    onBack,
    onExit,
    hideStageDetails: sessionNumber >= 6,
    variant: stage === "breathe" && isCentreToolkitSession(sessionNumber) ? ("breathe" as const) : ("default" as const),
    scrollContentStyle:
      stage === "breathe" && sessionNumber >= 6 && sessionNumber <= 11 ? styles.stepBody : undefined,
  };

  return (
    <SessionFlowShell {...shellProps}>
      {stage === "breathe" ? <CentreStageView {...centre} /> : <GuidedStageView {...guided} sessionElapsed={sessionElapsed} />}
    </SessionFlowShell>
  );
}
