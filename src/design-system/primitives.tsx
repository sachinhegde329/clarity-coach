import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "./icons";
import { InteractivePressable } from "./motion";
import { palette, radii, shadow, spacing, type } from "./theme";
import type { AppTab } from "../data/mockData";

export function LogoGlyph({
  color = palette.line,
  barHeights = [12, 20, 28, 20, 12],
  barWidth = 4,
  gap = 4,
  radius = 3,
}: {
  color?: string;
  barHeights?: number[];
  barWidth?: number;
  gap?: number;
  radius?: number;
}) {
  return (
    <View style={[styles.logoGlyph, { gap }]}>
      {barHeights.map((height, index) => (
        <View
          key={index}
          style={[
            styles.logoBar,
            {
              height,
              width: barWidth,
              borderRadius: radius,
              backgroundColor: color,
            },
          ]}
        />
      ))}
    </View>
  );
}

export function Wordmark() {
  return (
    <View style={styles.wordmarkRow}>
      <LogoGlyph />
      <Text style={styles.wordmark}>CLARITY COACH</Text>
    </View>
  );
}

export function MonoText({ children, style }: { children: ReactNode; style?: object }) {
  return <Text style={[styles.mono, style]}>{children}</Text>;
}

export function BodyText({ children, style }: { children: ReactNode; style?: object }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function DisplayText({ children, style }: { children: ReactNode; style?: object }) {
  return <Text style={[styles.display, style]}>{children}</Text>;
}

export function Panel({
  children,
  tone = "paper",
  padded = true,
  style,
}: {
  children: ReactNode;
  tone?: "paper" | "soft" | "ink";
  padded?: boolean;
  style?: object;
}) {
  const backgroundColor = tone === "ink" ? palette.ink : tone === "soft" ? palette.panelSoft : palette.paper;
  const borderColor = tone === "ink" ? palette.ink : palette.line;
  return <View style={[styles.panel, { backgroundColor, borderColor }, padded && styles.panelPadded, style]}>{children}</View>;
}

export function PrimaryButton({
  label,
  onPress,
  inverted,
  icon,
  disabled,
}: {
  label: string;
  onPress: () => void;
  inverted?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  const disabledOpacity = disabled ? 0.45 : 1;
  const background = inverted ? palette.paper : palette.line;
  const border = inverted ? palette.line : palette.line;
  const textColor = inverted ? palette.ink : palette.paper;
  const iconColor = inverted ? palette.ink : palette.paper;

  return (
    <InteractivePressable onPress={onPress} disabled={disabled}>
      <View
        style={[
          styles.button,
          inverted ? styles.buttonInverted : styles.buttonFilled,
          { opacity: disabledOpacity, backgroundColor: background, borderColor: border },
        ]}
      >
        <MonoText style={[styles.buttonLabel, { color: textColor }]}>{label}</MonoText>
        {icon ?? <Icon name="arrow" size={26} color={iconColor} />}
      </View>
    </InteractivePressable>
  );
}

export function SectionLabel({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <MonoText style={styles.sectionLabel}>{label}</MonoText>
      {value ? <MonoText style={styles.sectionValue}>{value}</MonoText> : null}
    </View>
  );
}

export function ProgressPills({ total, active }: { total: number; active: number }) {
  return (
    <View style={styles.progressRow}>
      {Array.from({ length: total }).map((_, index) => {
        const isComplete = index < active;
        const isCurrent = index === active;
        return (
          <View
            key={index}
            style={[
              styles.progressPill,
              isComplete && styles.progressPillActive,
              isCurrent && styles.progressPillCurrent,
            ]}
          />
        );
      })}
    </View>
  );
}

export function AppHeader({
  left,
  right,
  divider = true,
}: {
  left?: ReactNode;
  right?: ReactNode;
  divider?: boolean;
}) {
  return (
    <View style={[styles.header, divider && styles.headerDivider]}>
      <View>{left ?? <Wordmark />}</View>
      <View>{right}</View>
    </View>
  );
}

export function TabHeader({
  title,
  kicker,
  onPressLogo,
  right,
  divider = true,
}: {
  title: string;
  kicker?: string;
  onPressLogo?: () => void;
  right?: ReactNode;
  divider?: boolean;
}) {
  const brand = (
    <View style={styles.tabHeaderLeft}>
      <LogoGlyph />
      <View style={styles.tabHeaderTitleWrap}>
        <MonoText style={styles.tabHeaderAppName}>Clarity Coach</MonoText>
        <DisplayText style={styles.tabHeaderTitle}>{title}</DisplayText>
        {kicker ? <BodyText style={styles.tabHeaderSubtitle}>{kicker}</BodyText> : null}
      </View>
    </View>
  );

  return (
    <AppHeader
      divider={divider}
      left={onPressLogo ? <InteractivePressable onPress={onPressLogo}>{brand}</InteractivePressable> : brand}
      right={right}
    />
  );
}

export function BottomBar({ activeTab, onTab }: { activeTab: AppTab; onTab: (tab: AppTab) => void }) {
  const items: { key: AppTab; label: string; icon: Parameters<typeof Icon>[0]["name"] }[] = [
    { key: "today", label: "TODAY", icon: "today" },
    { key: "journey", label: "JOURNEY", icon: "journey" },
    { key: "library", label: "LIBRARY", icon: "library" },
    { key: "stats", label: "STATS", icon: "stats" },
  ];

  return (
    <View style={styles.bottomBar}>
      {items.map((item) => {
        const active = item.key === activeTab;
        return (
          <InteractivePressable key={item.key} onPress={() => onTab(item.key)} style={styles.bottomItemWrap}>
            <View style={[styles.bottomItem, active && styles.bottomItemActive]}>
              <Icon name={item.icon} size={24} color={active ? palette.paper : palette.ink} />
              <MonoText style={[styles.bottomLabel, active && { color: palette.paper }]}>{item.label}</MonoText>
              {active ? <View style={styles.bottomIndicator} /> : null}
            </View>
          </InteractivePressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerDivider: {
    borderBottomWidth: 2,
    borderColor: palette.line,
  },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  logoGlyph: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoBar: {
    backgroundColor: palette.line,
  },
  wordmark: {
    fontFamily: type.display,
    color: palette.ink,
    fontSize: 20,
    letterSpacing: -0.8,
  },
  tabHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tabHeaderTitleWrap: {
    gap: 2,
  },
  tabHeaderAppName: {
    fontSize: 11,
    color: palette.inkMuted,
    letterSpacing: 0.8,
  },
  tabHeaderTitle: {
    fontSize: 22,
    lineHeight: 26,
  },
  tabHeaderSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.inkMuted,
  },
  mono: {
    fontFamily: type.mono,
    color: palette.ink,
    letterSpacing: 1,
  },
  body: {
    fontFamily: type.body,
    color: palette.inkMuted,
    fontSize: 16,
    lineHeight: 26,
  },
  display: {
    fontFamily: type.display,
    color: palette.ink,
    fontSize: 46,
    lineHeight: 50,
    letterSpacing: -2,
  },
  panel: {
    borderWidth: 2,
    borderRadius: radii.lg,
    ...shadow,
  },
  panelPadded: {
    padding: 20,
  },
  button: {
    minHeight: 62,
    paddingHorizontal: 26,
    borderWidth: 2,
    borderRadius: radii.full,
    borderColor: palette.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    ...shadow,
  },
  buttonFilled: {
    backgroundColor: palette.line,
  },
  buttonInverted: {
    backgroundColor: palette.paper,
  },
  buttonLabel: {
    color: palette.paper,
    fontSize: 16,
  },
  sectionLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    color: palette.ink,
    opacity: 0.9,
    fontSize: 14,
  },
  sectionValue: {
    color: palette.ink,
    fontSize: 14,
  },
  progressRow: {
    flexDirection: "row",
    gap: 8,
  },
  progressPill: {
    flex: 1,
    height: 16,
    borderWidth: 2,
    borderRadius: radii.full,
    borderColor: palette.line,
    backgroundColor: "transparent",
  },
  progressPillActive: {
    backgroundColor: palette.line,
  },
  progressPillCurrent: {
    backgroundColor: palette.panelSoft,
  },
  bottomBar: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderColor: palette.line,
    backgroundColor: palette.canvas,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  bottomItemWrap: {
    flex: 1,
  },
  bottomItem: {
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: 1.5,
    borderRadius: radii.full,
    borderColor: palette.lineSoft,
    position: "relative",
  },
  bottomItemActive: {
    backgroundColor: palette.line,
    borderColor: palette.line,
  },
  bottomLabel: {
    fontSize: 10,
  },
  bottomIndicator: {
    position: "absolute",
    top: 8,
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: palette.paper,
  },
});
