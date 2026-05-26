import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "../../../design-system/icons";
import { LogoGlyph, MonoText } from "../../../design-system/primitives";
import { InteractivePressable } from "../../../design-system/motion";
import { palette, spacing, type } from "../../../design-system/theme";
import { formatTime } from "../formatTime";

export function SessionBrandHeader({
  stepIndex,
  onExit,
  timerSeconds,
}: {
  stepIndex: number;
  onExit: () => void;
  timerSeconds?: number;
}) {
  const stepLabel = String(stepIndex + 1).padStart(2, "0");

  return (
    <View style={styles.shell}>
      <View style={styles.row}>
        <View style={styles.brandRow}>
          <LogoGlyph barHeights={[10, 16, 22, 16, 10]} barWidth={3} radius={2} />
          <Text style={styles.brandTitle}>CLARITY{"\n"}COACH</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.stepBlock}>
            <MonoText style={styles.stepKicker}>STEP</MonoText>
            <MonoText style={styles.stepValue}>{stepLabel}/05</MonoText>
          </View>
          {typeof timerSeconds === "number" ? (
            <View style={styles.stepBlock}>
              <MonoText style={styles.stepKicker}>TIMER</MonoText>
              <MonoText style={styles.timerValue}>{formatTime(timerSeconds)}</MonoText>
            </View>
          ) : null}
          <InteractivePressable onPress={onExit} style={styles.exitPressable}>
            <Icon name="profile" size={22} color={palette.line} />
          </InteractivePressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderBottomWidth: 2,
    borderColor: palette.line,
    backgroundColor: palette.paper,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    minHeight: 48,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  brandTitle: {
    fontFamily: type.display,
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: -0.4,
    fontWeight: "800",
    textTransform: "uppercase",
    color: palette.line,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  stepBlock: {
    alignItems: "flex-end",
    gap: 2,
  },
  stepKicker: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: palette.inkMuted,
  },
  stepValue: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.line,
  },
  timerValue: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.line,
    fontVariant: ["tabular-nums"],
  },
  exitPressable: {
    padding: 4,
  },
});
