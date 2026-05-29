import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from "react-native";
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
  stepName,
  transitionDirection,
}: {
  activeIndex: number;
  maxUnlockedIndex: number;
  onSelectStep: (index: number) => void;
  onBack: () => void;
  onExit: () => void;
  stepName?: string;
  transitionDirection?: "forward" | "backward" | "none";
}) {
  const { width } = useWindowDimensions();
  const compact = width < 420;
  const iconSize = compact ? 22 : 28;
  const sideSize = compact ? 44 : 52;

  const stepLabelAnim = useRef(new Animated.Value(0)).current;
  const prevStepName = useRef(stepName);

  useEffect(() => {
    if (prevStepName.current === stepName) return;
    prevStepName.current = stepName;
    stepLabelAnim.setValue(0);
    Animated.timing(stepLabelAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [stepName, stepLabelAnim]);

  const stepLabelOpacity = stepLabelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const stepLabelSlide = stepLabelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: transitionDirection === "forward" ? [8, 0] : transitionDirection === "backward" ? [-8, 0] : [0, 0],
  });

  return (
    <View style={styles.shell}>
      <View style={styles.topRow}>
        <InteractivePressable onPress={onBack}>
          <View style={[styles.iconButton, { width: sideSize, height: sideSize, borderRadius: sideSize / 2 }]}>
            <Icon name="back" size={compact ? 20 : 24} color={palette.siennaAccent} />
          </View>
        </InteractivePressable>

        <View style={styles.brandColumn}>
          <View style={styles.wordmarkRow}>
            <LogoGlyph color={palette.siennaAccent} barHeights={[10, 16, 22, 16, 10]} barWidth={3} gap={3} />
            <MonoText style={[styles.wordmark, compact && styles.wordmarkCompact]}>CLARITY COACH</MonoText>
          </View>
          {stepName ? (
            <Animated.Text
              style={[
                styles.stepNameLabel,
                { opacity: stepLabelOpacity, transform: [{ translateY: stepLabelSlide }] },
              ]}
            >
              {stepName}
            </Animated.Text>
          ) : null}
          <View style={styles.stepCounterPill}>
            <MonoText style={styles.stepCounter}>
              {String(activeIndex + 1).padStart(2, "0")} / 05
            </MonoText>
          </View>
        </View>

        <InteractivePressable onPress={onExit}>
          <View style={[styles.iconButton, { width: sideSize, height: sideSize, borderRadius: sideSize / 2 }]}>
            <Icon name="close" size={compact ? 20 : 24} color={palette.siennaAccent} />
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
              <TabContent
                step={step}
                isActive={isActive}
                isUnlocked={isUnlocked}
                fg={fg}
                compact={compact}
                iconSize={iconSize}
              />
            </InteractivePressable>
          );
        })}
      </View>
    </View>
  );
}

function TabContent({
  step,
  isActive,
  isUnlocked,
  fg,
  compact,
  iconSize,
}: {
  step: { key: "centre" | "listen" | "do" | "see" | "commit"; label: string };
  isActive: boolean;
  isUnlocked: boolean;
  fg: string;
  compact: boolean;
  iconSize: number;
}) {
  const pulse = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(pulse, {
      toValue: isActive ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isActive, pulse]);

  const iconScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  return (
    <Animated.View
      style={[
        styles.tabItem,
        isActive && styles.tabItemActive,
        compact && styles.tabItemCompact,
        isActive && { transform: [{ scale: iconScale }] },
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
    </Animated.View>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.parchmentSurface,
    shadowColor: palette.siennaAccent,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
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
  stepNameLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: palette.onSurfaceVariant,
    marginTop: -4,
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
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    minWidth: 0,
  },
  tabItemCompact: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: palette.siennaAccent,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 14,
  },
  tabLabel: {
    fontSize: 13,
    letterSpacing: 0.8,
    textAlign: "center",
    textTransform: "uppercase",
  },
  tabLabelCompact: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontFamily: type.mono,
  },
});
