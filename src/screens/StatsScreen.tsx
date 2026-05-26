import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel, TabHeader } from "../design-system/primitives";
import { Icon } from "../design-system/icons";
import { FloatingOrb, PulseDots, Reveal } from "../design-system/motion";
import { palette, spacing, type } from "../design-system/theme";
import { statsBars, type AppTab } from "../data/mockData";

function Heatmap() {
  const cells = [
    0.2, 1, 0.9, 0, 1, 0.2, 0.35,
    1, 0.95, 0.9, 0.2, 1, 0.2, 0.8,
    1, 0.2, 0.95, 0.95, 1, 0.1, 0.2,
    0.95, 1, 0.95, 0.95, 0.95, 0, 0,
  ];

  return (
    <View>
      <View style={styles.weekRow}>
        {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
          <MonoText key={day} style={styles.weekLabel}>{day}</MonoText>
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

function TrendChart() {
  const points = [38, 39, 41, 40, 43, 42, 44, 44, 43, 45, 46];
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
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) {
      return;
    }
    if (scrollOffset <= 0) {
      hasRestored.current = true;
      return;
    }
    const id = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: scrollOffset, animated: false });
      hasRestored.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, [scrollOffset]);

  return (
    <View style={styles.screen}>
      <FloatingOrb size={220} top={110} left={-50} color="#EEE1D4" />
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
          <DisplayText style={styles.title}>STATS</DisplayText>
          <BodyText style={styles.subtitle}>14 sessions — 13-session streak</BodyText>
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
          <Heatmap />
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
            <MonoText>CURRENT AVG 142</MonoText>
          </View>
          <BodyText style={styles.wpmLabel}>WPM across sessions</BodyText>
          <TrendChart />
          <MonoText style={styles.legend}>SESS 01     SESS 07     SESS 14</MonoText>
        </Panel>
        </Reveal>

        <Reveal delay={170} style={styles.progressSection}>
          <MonoText style={styles.progressTitle}>SPRINT PROGRESSION</MonoText>
          {statsBars.map((bar) => (
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
            Your pace consistently spikes during Sprint 02. Focus on diaphragmatic breathing during transitions to maintain your 142 WPM baseline.
          </BodyText>
        </Panel>
        </Reveal>
      </ScrollView>
    </View>
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
  title: {
    fontSize: 46,
    lineHeight: 48,
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
