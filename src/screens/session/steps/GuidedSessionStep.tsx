import React from "react";
import { GuidedStageView } from "../flow/guided/GuidedStageView";
import type { SessionStageRenderProps } from "../flow/types";

/** @deprecated Prefer flow/guided/GuidedStageView via SessionStageView. */
export function GuidedSessionStep(props: SessionStageRenderProps) {
  return <GuidedStageView {...props} />;
}
