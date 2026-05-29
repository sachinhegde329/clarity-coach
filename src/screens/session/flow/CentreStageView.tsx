import React from "react";
import { View } from "react-native";
import { BodyText, DisplayText } from "../../../design-system/primitives";
import { palette, spacing } from "../../../design-system/theme";
import { SessionButton } from "../components/SessionButton";
import { BreatheStageBody } from "../breathe/BreatheStage";
import { CentreStep } from "../steps/CentreStep";
import { getCentreRendererId } from "./sessionStageRouter";
import type { CentreStageRenderProps } from "./types";
import { getCentreConfigForSession } from "./getCentreConfig";

/**
 * Single entry for Centre (step 1) across all 36 sessions.
 * Routing table: flow/sessionStageRouter.ts
 */
export function CentreStageView({
  session,
  sessionNumber,
  breathElapsed,
  isBreathRunning,
  setIsBreathRunning,
  onNext,
}: CentreStageRenderProps) {
  if (session.skipCentre) {
    return (
      <View style={{ gap: spacing.lg, paddingVertical: spacing.xl, alignItems: "center" }}>
        <DisplayText style={{ fontSize: 32, lineHeight: 36, textAlign: "center" }}>Today you perform.</DisplayText>
        <BodyText style={{ textAlign: "center", color: palette.inkMuted, maxWidth: 320 }}>
          {session.stages.breathe.quote ?? "No Centre today. You have done all the centring."}
        </BodyText>
        <SessionButton label="BEGIN SESSION" onPress={onNext} />
      </View>
    );
  }

  if (getCentreRendererId(sessionNumber) === "breatheToolkit") {
    return (
      <BreatheStageBody
        sessionNumber={sessionNumber}
        sessionContent={session}
        breathElapsed={breathElapsed}
        isBreathRunning={isBreathRunning}
        onNext={onNext}
        setIsBreathRunning={setIsBreathRunning}
      />
    );
  }

  const centreConfig = getCentreConfigForSession(sessionNumber, session.stages.breathe);
  return (
    <CentreStep
      config={centreConfig}
      sessionNumber={sessionNumber}
      onSkip={onNext}
      onContinue={onNext}
    />
  );
}
