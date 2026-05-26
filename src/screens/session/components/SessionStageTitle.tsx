import React from "react";
import { StyleSheet, View } from "react-native";
import { DisplayText, MonoText } from "../../../design-system/primitives";
import { palette, spacing, type } from "../../../design-system/theme";
import type { SessionStage } from "../../../data/mockData";

const STAGE_LABELS: Record<SessionStage, string> = {
  breathe: "CENTRE",
  lesson: "LISTEN",
  feedback: "DO",
  record: "SEE",
  reflect: "COMMIT",
};

export function SessionStageTitle({
  sessionNumber,
  stepIndex,
  stage,
}: {
  sessionNumber: number;
  stepIndex: number;
  stage: SessionStage;
}) {
  const stageLabel = STAGE_LABELS[stage];

  return (
    <View style={styles.wrap}>
      <MonoText style={styles.kicker}>SESSION {String(sessionNumber).padStart(2, "0")}</MonoText>
      <DisplayText style={styles.title}>
        {String(stepIndex + 1).padStart(2, "0")}/05 - {stageLabel}
      </DisplayText>
      <View style={styles.accentBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: palette.line,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: type.display,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: palette.line,
    textTransform: "uppercase",
    textAlign: "center",
  },
  accentBar: {
    marginTop: 4,
    width: 96,
    height: 4,
    backgroundColor: palette.line,
  },
});
