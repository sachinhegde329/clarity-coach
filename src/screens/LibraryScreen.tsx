import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel, PrimaryButton, TabHeader } from "../design-system/primitives";
import { Icon } from "../design-system/icons";
import { FloatingOrb, InteractivePressable, Reveal } from "../design-system/motion";
import { palette, spacing, type } from "../design-system/theme";
import { drills, type AppTab } from "../data/mockData";

function DrillCard({
  tag,
  title,
  duration,
  difficulty,
  description,
  steps,
  onStart,
}: {
  tag: string;
  title: string;
  duration: string;
  difficulty: string;
  description: string;
  steps: string[];
  onStart: () => void;
}) {
  return (
    <Panel style={styles.drillCard}>
      <View style={styles.drillTopline}>
        <View style={styles.tagBadge}>
          <Icon name="wave" size={14} />
          <MonoText style={styles.tagText}>{tag}</MonoText>
        </View>
        <MonoText style={styles.metaText}>
          {duration} / {difficulty}
        </MonoText>
      </View>
      <MonoText style={styles.drillTitle}>{title}</MonoText>
      <BodyText>{description}</BodyText>
      <View style={styles.stepRow}>
        {steps.map((step, index) => (
          <View key={step} style={styles.stepChip}>
            <MonoText style={styles.stepChipText}>
              {String(index + 1).padStart(2, "0")} {step}
            </MonoText>
          </View>
        ))}
      </View>
      <PrimaryButton label="START DRILL" onPress={onStart} />
    </Panel>
  );
}

export function LibraryScreen({
  onStartDrill,
  onTab,
  scrollOffset = 0,
  onScrollOffsetChange,
}: {
  onStartDrill: () => void;
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
      <FloatingOrb size={240} top={120} right={-30} color="#F1E0D1" opacity={0.85} />
      <FloatingOrb size={100} bottom={180} left={-20} color={palette.blush} opacity={0.5} duration={5800} />
      <TabHeader
        title="Library"
        kicker="SOLO PRACTICE"
        onPressLogo={() => onTab?.("today")}
        right={
          <InteractivePressable onPress={() => onTab?.("stats")}>
            <View style={styles.profileBox}>
              <Icon name="profile" size={24} />
            </View>
          </InteractivePressable>
        }
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => onScrollOffsetChange?.(event.nativeEvent.contentOffset.y)}
      >
        <Reveal style={styles.hero}>
          <MonoText style={styles.heroKicker}>DRILLS</MonoText>
          <DisplayText style={styles.heroTitle}>Standalone reps for voice, confidence, and communication.</DisplayText>
          <BodyText style={styles.heroBody}>
            Use these between guided sessions to train one communication muscle at a time: pace, clarity, pressure handling, and vocal steadiness.
          </BodyText>
        </Reveal>

        <Reveal delay={70}>
        <Panel tone="soft" style={styles.featureStrip}>
          <View style={styles.featureMetric}>
            <Icon name="mic" size={18} />
            <MonoText style={styles.featureLabel}>FOCUS</MonoText>
            <MonoText style={styles.featureValue}>Voice training</MonoText>
          </View>
          <View style={styles.featureMetric}>
            <Icon name="spark" size={18} />
            <MonoText style={styles.featureLabel}>FORMAT</MonoText>
            <MonoText style={styles.featureValue}>Solo drills</MonoText>
          </View>
          <View style={styles.featureMetric}>
            <Icon name="clock" size={18} />
            <MonoText style={styles.featureLabel}>LENGTH</MonoText>
            <MonoText style={styles.featureValue}>1-3 min</MonoText>
          </View>
        </Panel>
        </Reveal>

        <Reveal delay={120} style={styles.filterRow}>
          {["VOICE", "COMMUNICATION", "CONFIDENCE"].map((item, index) => (
            <InteractivePressable key={item}>
              <View style={[styles.filterPill, index === 0 && styles.filterPillActive]}>
              <MonoText style={[styles.filterLabel, index === 0 && styles.filterLabelActive]}>{item}</MonoText>
              </View>
            </InteractivePressable>
          ))}
        </Reveal>

        <Reveal delay={170} style={styles.drillList}>
          {drills.map((drill) => (
            <DrillCard key={drill.id} {...drill} onStart={onStartDrill} />
          ))}
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
  profileBox: {
    width: 46,
    height: 46,
    borderWidth: 2,
    borderRadius: 23,
    borderColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.paper,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    gap: 10,
  },
  heroKicker: {
    fontSize: 12,
    color: palette.line,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    maxWidth: 330,
  },
  heroBody: {
    maxWidth: 340,
  },
  featureStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    overflow: "hidden",
  },
  featureMetric: {
    flex: 1,
    gap: 6,
  },
  featureLabel: {
    fontSize: 10,
    color: palette.inkMuted,
  },
  featureValue: {
    fontFamily: type.heading,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  filterPill: {
    borderWidth: 1.5,
    borderColor: palette.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.paper,
  },
  filterPillActive: {
    backgroundColor: palette.line,
  },
  filterLabel: {
    fontSize: 11,
  },
  filterLabelActive: {
    color: palette.paper,
  },
  drillList: {
    gap: spacing.lg,
  },
  drillCard: {
    gap: spacing.md,
    overflow: "hidden",
  },
  drillTopline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F6DED0",
    borderWidth: 1.5,
    borderColor: palette.line,
    alignSelf: "flex-start",
    borderRadius: 999,
  },
  tagText: {
    fontSize: 10,
  },
  metaText: {
    fontSize: 10,
    color: palette.inkMuted,
  },
  drillTitle: {
    fontFamily: type.display,
    fontSize: 26,
    lineHeight: 30,
  },
  stepRow: {
    gap: 8,
  },
  stepChip: {
    borderWidth: 1.5,
    borderColor: palette.lineSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFF9F4",
  },
  stepChipText: {
    fontSize: 11,
    color: palette.inkMuted,
  },
});
