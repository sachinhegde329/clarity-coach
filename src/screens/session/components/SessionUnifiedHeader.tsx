import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Icon } from "../../../design-system/icons";
import { LogoGlyph, MonoText } from "../../../design-system/primitives";
import { InteractivePressable } from "../../../design-system/motion";
import { palette, spacing, type } from "../../../design-system/theme";

const STAGE_TABS: { key: "centre" | "listen" | "do" | "see" | "commit"; label: string }[] = [
  { key: "centre", label: "Reset" },
  { key: "listen", label: "Listen" },
  { key: "do", label: "Do" },
  { key: "see", label: "See" },
  { key: "commit", label: "Commit" },
];

export function SessionUnifiedHeader({
  activeIndex,
  maxUnlockedIndex,
  onSelectStep,
  onBack,
  onExit,
}: {
  activeIndex: number;
  maxUnlockedIndex: number;
  onSelectStep: (index: number) => void;
  onBack: () => void;
  onExit: () => void;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 420;
  const iconSize = compact ? 16 : 20;

  return (
    <View style={styles.shell}>
      <View style={styles.topRow}>
        <InteractivePressable onPress={onBack} style={styles.sidePressable}>
          <View style={[styles.iconButton, compact && styles.iconButtonCompact]}>
            <Icon name="back" size={compact ? 16 : 18} color={palette.line} />
          </View>
        </InteractivePressable>

        <View style={styles.brandColumn}>
          <View style={styles.wordmarkRow}>
            <LogoGlyph color={palette.line} barHeights={[10, 16, 22, 16, 10]} barWidth={3} gap={3} />
            <MonoText style={[styles.wordmark, compact && styles.wordmarkCompact]}>CLARITY COACH</MonoText>
          </View>
          <View style={styles.stepCounterPill}>
            <MonoText style={styles.stepCounter}>{String(activeIndex + 1).padStart(2, "0")} / 05</MonoText>
          </View>
        </View>

        <InteractivePressable onPress={onExit} style={styles.sidePressable}>
          <View style={[styles.iconButton, compact && styles.iconButtonCompact]}>
            <Icon name="close" size={compact ? 14 : 16} color={palette.line} />
          </View>
        </InteractivePressable>
      </View>

      <View style={styles.tabRow} accessibilityLabel="Session progress">
        {STAGE_TABS.map((step, index) => {
          const isActive = index === activeIndex;
          const isUnlocked = index <= maxUnlockedIndex;
          const fg = isActive ? palette.paper : isUnlocked ? palette.inkMuted : palette.lineSoft;

          return (
            <InteractivePressable
              key={step.key}
              disabled={!isUnlocked}
              onPress={() => onSelectStep(index)}
              style={styles.tabPressable}
            >
              <View style={[styles.tabItem, isActive && styles.tabItemActive, compact && styles.tabItemCompact]}>
                <Icon name={step.key} size={iconSize} color={fg} />
                <MonoText
                  style={[
                    styles.tabLabel,
                    compact && styles.tabLabelCompact,
                    { color: fg },
                    isActive && styles.tabLabelActive,
                  ]}
                >
                  {step.label}
                </MonoText>
              </View>
            </InteractivePressable>
          );
        })}
      </View>
    </View>
  );
}

const SIDE_WIDTH = 44;

const styles = StyleSheet.create({
  shell: {
    borderBottomWidth: 1,
    borderColor: "rgba(139, 69, 19, 0.2)",
    backgroundColor: palette.paper,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  sidePressable: {
    width: SIDE_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.paper,
  },
  iconButtonCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  brandColumn: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  wordmark: {
    fontFamily: type.mono,
    fontSize: 14,
    letterSpacing: 3.2,
    color: palette.line,
  },
  wordmarkCompact: {
    fontSize: 11,
    letterSpacing: 2,
  },
  stepCounterPill: {
    backgroundColor: palette.panelSoft,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
  },
  stepCounter: {
    fontSize: 10,
    letterSpacing: 1,
    color: palette.inkMuted,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 4,
  },
  tabPressable: {
    flex: 1,
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    minWidth: 0,
  },
  tabItemCompact: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    gap: 2,
  },
  tabItemActive: {
    backgroundColor: palette.line,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
    textAlign: "center",
    textTransform: "uppercase",
  },
  tabLabelCompact: {
    fontSize: 8,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontFamily: type.mono,
  },
});
