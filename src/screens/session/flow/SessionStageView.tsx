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
  onBack: () => void;
  onExit: () => void;
  onJumpToStep: (stepIndex: number) => void;
  centre: CentreStageRenderProps;
  guided: SessionStageRenderProps;
  transitionDirection: "forward" | "backward" | "none";
};

export function SessionStageView({
  sessionNumber,
  stage,
  stepIndex,
  sessionElapsed,
  onBack,
  onExit,
  onJumpToStep,
  centre,
  guided,
  transitionDirection,
}: SessionStageViewProps) {
  const shellProps = {
    sessionNumber,
    session: centre.session,
    stage,
    stepIndex,
    sessionElapsed,
    onBack,
    onExit,
    onJumpToStep,
    variant: stage === "breathe" && isCentreToolkitSession(sessionNumber) ? ("breathe" as const) : ("default" as const),
    scrollContentStyle:
      stage === "breathe" && sessionNumber >= 6 && sessionNumber <= 11 ? styles.stepBody : undefined,
    transitionDirection,
  };

  return (
    <SessionFlowShell {...shellProps}>
      {stage === "breathe" ? <CentreStageView {...centre} /> : <GuidedStageView {...guided} sessionElapsed={sessionElapsed} />}
    </SessionFlowShell>
  );
}
