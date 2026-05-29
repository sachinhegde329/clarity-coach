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
  const sideSize = compact ? 36 : 40;

  return (
    <View style={styles.shell}>
      <View style={styles.topRow}>
        <InteractivePressable onPress={onBack}>
          <View style={[styles.iconButton, { width: sideSize, height: sideSize, borderRadius: sideSize / 2 }]}>
            <Icon name="back" size={compact ? 16 : 18} color={palette.siennaAccent} />
          </View>
        </InteractivePressable>

        <View style={styles.brandColumn}>
          <View style={styles.wordmarkRow}>
            <LogoGlyph color={palette.siennaAccent} barHeights={[10, 16, 22, 16, 10]} barWidth={3} gap={3} />
            <MonoText style={[styles.wordmark, compact && styles.wordmarkCompact]}>CLARITY COACH</MonoText>
          </View>
          <View style={styles.stepCounterPill}>
            <MonoText style={styles.stepCounter}>
              {String(activeIndex + 1).padStart(2, "0")} / 05
            </MonoText>
          </View>
        </View>

        <InteractivePressable onPress={onExit}>
          <View style={[styles.iconButton, { width: sideSize, height: sideSize, borderRadius: sideSize / 2 }]}>
            <Icon name="close" size={compact ? 14 : 16} color={palette.siennaAccent} />
          </View>
        </InteractivePressable>
      </View>

      <View style={styles.tabRow} accessibilityLabel="Session progress">
        {STAGE_TABS.map((step, index) => {
          const isActive = index === activeIndex;
          const isUnlocked = index <= maxUnlockedIndex;
          const fg = isActive
            ? palette.onPrimary
            : isUnlocked
              ? palette.onSurfaceVariant
              : palette.outlineVariant;

          return (
            <InteractivePressable
              key={step.key}
              disabled={!isUnlocked}
              onPress={() => onSelectStep(index)}
              style={styles.tabPressable}
            >
              <View
                style={[
                  styles.tabItem,
                  isActive && styles.tabItemActive,
                  compact && styles.tabItemCompact,
                ]}
              >
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

const styles = StyleSheet.create({
  shell: {
    borderBottomWidth: 1,
    borderColor: "#8B451333",
    backgroundColor: palette.parchmentSurface,
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
  iconButton: {
    borderWidth: 2,
    borderColor: palette.siennaAccent,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.parchmentSurface,
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
    color: palette.siennaAccent,
  },
  wordmarkCompact: {
    fontSize: 11,
    letterSpacing: 2,
  },
  stepCounterPill: {
    backgroundColor: palette.surfaceContainer,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
  },
  stepCounter: {
    fontSize: 10,
    letterSpacing: 1,
    color: palette.onSurfaceVariant,
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
    backgroundColor: palette.siennaAccent,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,
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
