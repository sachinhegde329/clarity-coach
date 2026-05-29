import React, { useEffect, useRef, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { BodyText, MonoText, Panel, ProfileIcon, TabHeader } from "../design-system/primitives";
import { Icon } from "../design-system/icons";
import { FloatingOrb, PulseDots, Reveal } from "../design-system/motion";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { palette, spacing, type } from "../design-system/theme";
import { useThemeColors } from "../design-system/ThemeProvider";
import { useThemeStore, type ThemeMode } from "../stores/themeStore";
import { type AppTab, getSprintNumber, sessionDefinitions, sprintCards } from "../data/mockData";
import { useSessionProgressStore } from "../stores/sessionProgressStore";

function Heatmap({ cells }: { cells: number[] }) {
  return (
    <View>
      <View style={styles.weekRow}>
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <MonoText key={day + index} style={styles.weekLabel}>{day}</MonoText>
        ))}
      </View>
      <View style={styles.heatmapGrid}>
        {cells.map((value, index) => (
          <View
            key={index}
            style={[
              styles.heatCell,
              {
                backgroundColor:
                  value === 0
                    ? "transparent"
                    : value < 0.3
                      ? "#FFD5CC"
                      : value < 0.6
                        ? "#FFB2A0"
                        : value < 0.9
                          ? "#A34A21"
                          : palette.line,
                borderStyle: value === 0 ? "dashed" : "solid",
                borderColor: value === 0 ? palette.lineSoft : palette.line,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function TrendChart({ points }: { points: number[] }) {
  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartGrid}>
        {Array.from({ length: 36 }).map((_, index) => (
          <View key={index} style={styles.chartDot} />
        ))}
      </View>
      <View style={styles.chartLineRow}>
        {points.map((point, index) => (
          <View key={index} style={[styles.chartPoint, { left: `${index * 9}%`, bottom: point * 2.4 }]} />
        ))}
      </View>
    </View>
  );
}

export function StatsScreen({
  onTab,
  scrollOffset = 0,
  onScrollOffsetChange,
}: {
  onTab?: (tab: AppTab) => void;
  scrollOffset?: number;
  onScrollOffsetChange?: (offset: number) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);

  const stepProgressBySession = useSessionProgressStore((s) => s.stepProgressBySession);
  const analysisBySession = useSessionProgressStore((s) => s.analysisBySession);

  const completedSessions = useMemo(
    () => Object.values(stepProgressBySession).filter((p) => p.completedAt).length,
    [stepProgressBySession],
  );

  const streak = useMemo(() => {
    let s = 0;
    for (let i = 1; i <= 36; i++) {
      if (stepProgressBySession[i]?.completedAt) s++;
      else break;
    }
    return s;
  }, [stepProgressBySession]);

  const sortedAnalyses = useMemo(
    () =>
      Object.entries(analysisBySession)
        .map(([sn, a]) => ({ sessionNumber: Number(sn), analysis: a }))
        .sort((a, b) => a.sessionNumber - b.sessionNumber),
    [analysisBySession],
  );

  const wpmPoints = useMemo((): number[] => {
    const values = sortedAnalyses
      .map((a) => Number(a.analysis.metrics.find((m) => m.key === "wpm")?.value ?? 0))
      .filter((v) => v > 0);
    if (values.length <= 11) return values.length > 0 ? values : [38, 39, 41, 40, 43, 42, 44, 44, 43, 45, 46];
    const step = (values.length - 1) / 10;
    return Array.from({ length: 11 }, (_, i) => values[Math.round(i * step)] ?? 0);
  }, [sortedAnalyses]);

  const avgWpm = useMemo(() => {
    if (wpmPoints.length === 0) return 142;
    return Math.round(wpmPoints.reduce((a, b) => a + b, 0) / wpmPoints.length);
  }, [wpmPoints]);

  const fillerCells = useMemo((): number[] => {
    const values = sortedAnalyses
      .map((a) => Number(a.analysis.metrics.find((m) => m.key === "fillers")?.value ?? 0))
      .filter((v) => v > 0);
    return Array.from({ length: 28 }, (_, i) => {
      if (i < values.length) {
        const normalized = (values[i] ?? 0) / 10;
        return Math.min(Math.max(normalized, 0), 1);
      }
      return 0;
    });
  }, [sortedAnalyses]);

  const sprintProgress = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const sprintNum = i + 1;
      const sessionsInSprint = sessionDefinitions.filter(
        (s) => getSprintNumber(s.sessionNumber) === sprintNum,
      );
      const completedCount = sessionsInSprint.filter(
        (s) => stepProgressBySession[s.sessionNumber]?.completedAt,
      ).length;
      const total = sessionsInSprint.length;
      const value = total > 0 ? completedCount / total : 0;
      const accent = value >= 1 ? "dark" : value > 0 ? "soft" : "muted";
      const card = sprintCards[sprintNum - 1];
      return {
        label: `SPRINT ${String(sprintNum).padStart(2, "0")}: ${card?.title ?? ""}`,
        value,
        accent: accent as "dark" | "soft" | "muted",
      };
    });
  }, [stepProgressBySession]);

  const latestInsight = useMemo(() => {
    const critique = sortedAnalyses[sortedAnalyses.length - 1]?.analysis.critique;
    return critique?.recommendation ?? null;
  }, [sortedAnalyses]);

  const chartSessionLabels = useMemo(() => {
    const sn = sortedAnalyses.map((a) => a.sessionNumber);
    if (sn.length === 0) return ["SESS 01", "SESS 07", "SESS 14"];
    const first = sn[0];
    const mid = sn[Math.floor(sn.length / 2)];
    const last = sn[sn.length - 1];
    return [
      `SESS ${String(first).padStart(2, "0")}`,
      `SESS ${String(mid).padStart(2, "0")}`,
      `SESS ${String(last).padStart(2, "0")}`,
    ];
  }, [sortedAnalyses]);

  useScrollRestoration(scrollRef, scrollOffset);

  const subtitleText =
    completedSessions > 0
      ? `${completedSessions} session${completedSessions !== 1 ? "s" : ""} — ${streak}-session streak`
      : "Start your first session to see stats";

  return (
    <View style={styles.screen}>
      <FloatingOrb size={220} top={110} left={-50} color={palette.surfaceDim} />
      <FloatingOrb size={120} bottom={140} right={-10} color={palette.blush} opacity={0.55} duration={6200} />
      <TabHeader
        title="Stats"
        kicker="PROGRESS"
        onPressLogo={() => onTab?.("today")}
        right={
          <View style={styles.liveData}>
            <PulseDots />
            <MonoText style={{ color: palette.paper }}>LIVE DATA</MonoText>
          </View>
        }
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => onScrollOffsetChange?.(event.nativeEvent.contentOffset.y)}
      >
        <Reveal>
          <BodyText style={styles.subtitle}>{subtitleText}</BodyText>
        </Reveal>

        <Reveal delay={70}>
        <Panel style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="wave" size={18} />
              <MonoText style={styles.sectionTitle}>FILLER FREQUENCY</MonoText>
            </View>
            <MonoText>LAST 4 WEEKS</MonoText>
          </View>
          <Heatmap cells={fillerCells} />
          <MonoText style={styles.legend}>LESS □ □ □ MORE</MonoText>
        </Panel>
        </Reveal>

        <Reveal delay={120}>
        <Panel style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="stats" size={18} />
              <MonoText style={styles.sectionTitle}>PACE TREND</MonoText>
            </View>
            <MonoText>CURRENT AVG {avgWpm}</MonoText>
          </View>
          <BodyText style={styles.wpmLabel}>WPM across sessions</BodyText>
          <TrendChart points={wpmPoints} />
          <MonoText style={styles.legend}>{chartSessionLabels.join("     ")}</MonoText>
        </Panel>
        </Reveal>

        <Reveal delay={170} style={styles.progressSection}>
          <MonoText style={styles.progressTitle}>SPRINT PROGRESSION</MonoText>
          {sprintProgress.map((bar) => (
            <View key={bar.label} style={styles.progressRow}>
              <View style={styles.progressRowLabel}>
                <MonoText>{bar.label}</MonoText>
                <MonoText style={styles.progressPercent}>{Math.round(bar.value * 100)}%</MonoText>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${bar.value * 100}%`,
                      backgroundColor: bar.accent === "dark" ? palette.line : bar.accent === "soft" ? palette.peach : palette.lineSoft,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </Reveal>

        <Reveal delay={220}>
        <Panel tone="soft" style={styles.insightCard}>
          <MonoText style={styles.insightTitle}>Critical Insight</MonoText>
          <BodyText style={styles.insightBody}>
            {latestInsight ??
              "Your pace consistently spikes during Sprint 02. Focus on diaphragmatic breathing during transitions to maintain your 142 WPM baseline."}
          </BodyText>
        </Panel>
        </Reveal>

        <Reveal delay={270}>
        <ThemeToggle />
        </Reveal>
      </ScrollView>
    </View>
  );
}

const THEME_OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: "light", label: "LIGHT" },
  { key: "dark", label: "DARK" },
  { key: "system", label: "SYSTEM" },
];

function ThemeToggle() {
  const colors = useThemeColors();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  return (
    <Panel style={{ gap: spacing.md }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon name="globe" size={18} />
        <MonoText>APPEARANCE</MonoText>
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {THEME_OPTIONS.map((option) => {
          const active = mode === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => setMode(option.key)}
              style={{
                flex: 1,
                borderWidth: 2,
                borderColor: active ? colors.inkFocus : colors.outline,
                backgroundColor: active ? colors.inkFocus : "transparent",
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <MonoText
                style={{
                  fontSize: 11,
                  color: active ? colors.onPrimary : colors.inkFocus,
                  letterSpacing: 1.2,
                }}
              >
                {option.label}
              </MonoText>
            </Pressable>
          );
        })}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  liveData: {
    backgroundColor: palette.line,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: palette.line,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  subtitle: {
    color: palette.ink,
    borderLeftWidth: 3,
    borderColor: palette.line,
    paddingLeft: spacing.md,
  },
  sectionCard: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekLabel: {
    width: 32,
    textAlign: "center",
    color: palette.inkMuted,
  },
  heatmapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  heatCell: {
    width: 36,
    height: 30,
    borderWidth: 1.5,
  },
  legend: {
    alignSelf: "flex-end",
    color: palette.inkMuted,
  },
  wpmLabel: {
    color: palette.ink,
  },
  chartWrap: {
    height: 210,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: palette.line,
    position: "relative",
    paddingLeft: 12,
    paddingBottom: 12,
  },
  chartGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    paddingLeft: 10,
    paddingTop: 14,
  },
  chartDot: {
    width: 2,
    height: 2,
    backgroundColor: palette.lineSoft,
  },
  chartLineRow: {
    position: "absolute",
    left: 14,
    right: 0,
    bottom: 16,
    top: 0,
  },
  chartPoint: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: palette.paper,
    borderWidth: 1.5,
    borderColor: palette.line,
  },
  progressSection: {
    gap: spacing.lg,
  },
  progressTitle: {
    fontSize: 16,
  },
  progressRow: {
    gap: 8,
  },
  progressRowLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressPercent: {
    fontFamily: type.display,
  },
  progressTrack: {
    height: 24,
    borderWidth: 2,
    borderColor: palette.line,
  },
  progressFill: {
    height: "100%",
  },
  insightCard: {
    gap: spacing.sm,
  },
  insightTitle: {
    fontFamily: type.heading,
    fontSize: 28,
    letterSpacing: -1,
  },
  insightBody: {
    color: palette.ink,
  },
});
