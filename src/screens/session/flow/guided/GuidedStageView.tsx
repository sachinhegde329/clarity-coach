import React from "react";
import type { SessionStageRenderProps } from "../types";
import { getGuidedRendererId } from "../sessionStageRouter";
import { UnifiedSessionStage } from "../../unified/UnifiedSessionStage";
import { ClassicGuidedStage } from "./classicStages";
import {
  trySprintCommit,
  trySprintDo,
  trySprintListen,
  trySprintSee,
} from "./sprintStages";
import {
  StitchUnifiedCommit,
  StitchUnifiedDo,
  StitchUnifiedListen,
  StitchUnifiedSee,
} from "./stitchStages";

type GuidedStageViewProps = SessionStageRenderProps & {
  sessionElapsed?: number;
};

function SprintGuidedStage(props: GuidedStageViewProps) {
  const { session, sessionNumber, stage } = props;
  const listenProps = {
    session,
    sessionNumber,
    content: session.stages.lesson,
    listenPlaying: props.listenPlaying,
    listenProgress: props.listenProgress,
    onTogglePlay: props.onTogglePlay,
    onNext: props.onNext,
  };
  const doProps = {
    sessionNumber,
    content: session.stages.feedback,
    recordElapsed: props.recordElapsed,
    recordLimit: props.recordLimit,
    recording: props.recording,
    onToggleRecording: props.onToggleRecording,
    onNext: props.onNext,
  };
  const seeProps = {
    sessionNumber,
    session,
    content: session.stages.record,
    analysis: props.analysis,
    onNext: props.onNext,
  };
  const commitProps = {
    sessionNumber,
    session,
    content: session.stages.reflect,
    reflectRecording: props.reflectRecording,
    reflectionDone: props.reflectionDone,
    onToggleReflection: props.onToggleReflection,
    onNext: props.onNext,
  };

  switch (stage) {
    case "lesson": {
      const node = trySprintListen(listenProps);
      return node ?? <ClassicGuidedStage {...props} />;
    }
    case "feedback": {
      const node = trySprintDo(doProps);
      return node ?? <ClassicGuidedStage {...props} />;
    }
    case "record": {
      const node = trySprintSee(seeProps);
      return node ?? <ClassicGuidedStage {...props} />;
    }
    case "reflect": {
      const node = trySprintCommit(commitProps);
      return node ?? <ClassicGuidedStage {...props} />;
    }
    default:
      return null;
  }
}

function StitchGuidedStage(props: GuidedStageViewProps) {
  const stitchProps = {
    session: props.session,
    sessionNumber: props.sessionNumber,
    recordLimit: props.recordLimit,
    listenPlaying: props.listenPlaying,
    listenProgress: props.listenProgress,
    recording: props.recording,
    recordElapsed: props.recordElapsed,
    overlayOn: props.overlayOn,
    reflectRecording: props.reflectRecording,
    reflectElapsed: props.reflectElapsed,
    reflectionDone: props.reflectionDone,
    analysis: props.analysis,
    onTogglePlay: props.onTogglePlay,
    onToggleRecording: props.onToggleRecording,
    onReplay: props.onReplay,
    onToggleReflection: props.onToggleReflection,
    onRetakeReflection: props.onRetakeReflection,
    onNext: props.onNext,
  };

  switch (props.stage) {
    case "lesson":
      return <StitchUnifiedListen {...stitchProps} />;
    case "feedback":
      return <StitchUnifiedDo {...stitchProps} />;
    case "record":
      return <StitchUnifiedSee {...stitchProps} />;
    case "reflect":
      return <StitchUnifiedCommit {...stitchProps} />;
    default:
      return null;
  }
}

/**
 * Single entry for Listen → Commit across all 36 sessions.
 * Routing table: flow/sessionStageRouter.ts
 */
export function GuidedStageView(props: GuidedStageViewProps) {
  const renderer = getGuidedRendererId(props.sessionNumber);

  switch (renderer) {
    case "foundation":
      return <UnifiedSessionStage {...props} />;
    case "classic":
      return <ClassicGuidedStage {...props} />;
    case "sprint":
      return <SprintGuidedStage {...props} />;
    case "stitch":
      return <StitchGuidedStage {...props} />;
    default:
      return <UnifiedSessionStage {...props} />;
  }
}
