import React from "react";
import type { SessionStageRenderProps } from "../types";
import { CommitStep } from "../../steps/CommitStep";
import { DoStep } from "../../steps/DoStep";
import { ListenStep } from "../../steps/ListenStep";
import { SeeStep } from "../../steps/SeeStep";

/** Sessions 11–16: original sprint step components. */
export function ClassicGuidedStage(props: SessionStageRenderProps & { sessionElapsed?: number }) {
  const {
    session,
    sessionNumber,
    stage,
    recordLimit,
    listenPlaying,
    listenProgress,
    recording,
    recordElapsed,
    overlayOn,
    reflectRecording,
    reflectElapsed,
    reflectionDone,
    onTogglePlay,
    onToggleRecording,
    onReplay,
    onToggleReflection,
    onRetakeReflection,
    onNext,
    analysis,
    sessionElapsed = 0,
  } = props;

  switch (stage) {
    case "lesson":
      return (
        <ListenStep
          sessionNumber={sessionNumber}
          content={session.stages.lesson}
          listenPlaying={listenPlaying}
          listenProgress={listenProgress}
          onTogglePlay={onTogglePlay}
          onNext={onNext}
        />
      );
    case "feedback":
      return (
        <DoStep
          sessionNumber={sessionNumber}
          content={session.stages.feedback}
          recordElapsed={recordElapsed}
          recordLimit={recordLimit}
          recording={recording}
          onToggleRecording={onToggleRecording}
          onNext={onNext}
        />
      );
    case "record":
      return (
        <SeeStep
          sessionNumber={sessionNumber}
          content={session.stages.record}
          overlayOn={overlayOn}
          onReplay={onReplay}
          onNext={onNext}
          sessionElapsed={sessionElapsed}
          analysis={analysis}
        />
      );
    case "reflect":
      return (
        <CommitStep
          sessionNumber={sessionNumber}
          content={session.stages.reflect}
          reflectElapsed={reflectElapsed}
          reflectRecording={reflectRecording}
          reflectionDone={reflectionDone}
          onToggleRecording={onToggleReflection}
          onRetake={onRetakeReflection}
          onNext={onNext}
        />
      );
    default:
      return null;
  }
}
