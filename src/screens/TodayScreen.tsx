import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BodyText, MonoText, Panel, PrimaryButton, ProfileIcon, TabHeader } from "../design-system/primitives";
import { Icon } from "../design-system/icons";
import { FloatingOrb, InteractivePressable, Reveal } from "../design-system/motion";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { palette, spacing, type } from "../design-system/theme";
import {
  SESSIONS_PER_SPRINT,
  sessionDefinitions,
  sessionProtocol,
  type AppTab,
} from "../data/mockData";

const stageIcons = ["centre", "listen", "do", "see", "commit"] as const;

const quickDrills = {
  storytelling: ["The Hook", "Analogy Engine", "Hero's Journey", "Emotional Arc", "First Principles Argument"],
  conflict: ["Mirroring", "Radical Candor", "Silent Objection", "De-escalation Loop", "Strategic Empathy"],
  presence: ["Power Pose", "Voice Projection", "Eye Contact Matrix", "Active Listening", "The Weighted Pause"],
  executive: ["BLUF Master", "Quick Pivot", "Decision Framework", "Stakeholder Alignment", "Executive Summary"],
};

type QuickDrillCategory = keyof typeof quickDrills | "all";

const categoryOptions: { key: QuickDrillCategory; label: string }[] = [
  { key: "all", label: "All (Random)" },
  { key: "storytelling", label: "Storytelling" },
  { key: "conflict", label: "Conflict" },
  { key: "presence", label: "Presence" },
  { key: "executive", label: "Executive Presence" },
];

function getSprintProgress(sessionNumber: number, completedProtocolSteps: number) {
  const positionInSprint = ((sessionNumber - 1) % SESSIONS_PER_SPRINT) + 1;
  const sessionsBeforeCurrent = positionInSprint - 1;
  const filledCount = Math.min(sessionsBeforeCurrent + completedProtocolSteps, SESSIONS_PER_SPRINT);
  const checkeredIndex = filledCount < SESSIONS_PER_SPRINT ? filledCount + 1 : null;

  return {
    label: `${filledCount}/${SESSIONS_PER_SPRINT}`,
    filledCount,
    checkeredIndex,
  };
}

function CheckeredFill() {
  const cells = Array.from({ length: 24 });
  return (
    <View style={styles.checkeredWrap} pointerEvents="none">
      {cells.map((_, index) => {
        const row = Math.floor(index / 12);
        const col = index % 12;
        const filled = (row + col) % 2 === 0;
        return (
          <View
            key={index}
            style={[styles.checkeredCell, filled ? styles.checkeredCellFilled : styles.checkeredCellEmpty]}
          />
        );
      })}
    </View>
  );
}

function SprintProgressBar({
  filledCount,
  checkeredIndex,
}: {
  filledCount: number;
  checkeredIndex: number | null;
}) {
  const segmentAnims = useRef(Array.from({ length: SESSIONS_PER_SPRINT }, () => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = segmentAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        delay: index * 28,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    );
    Animated.stagger(28, animations).start();
  }, [filledCount, checkeredIndex, segmentAnims]);

  return (
    <View style={styles.sprintStrip} accessibilityLabel="Sprint progress">
      {Array.from({ length: SESSIONS_PER_SPRINT }).map((_, index) => {
        const segmentIndex = index + 1;
        const filled = segmentIndex <= filledCount;
        const checkered = segmentIndex === checkeredIndex;
        const empty = !filled && !checkered;

        return (
          <Animated.View
            key={segmentIndex}
            style={[
              styles.sprintSegment,
              filled && styles.sprintSegmentFilled,
              checkered && styles.sprintSegmentCheckered,
              empty && styles.sprintSegmentEmpty,
              {
                opacity: segmentAnims[index],
              },
            ]}
          >
            {checkered ? <CheckeredFill /> : null}
          </Animated.View>
        );
      })}
    </View>
  );
}

function ActiveStepPulse() {
  const pulse = useRef(new Animated.Value(0.4)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.14, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 0.4, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.9, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, scale]);

  return <Animated.View style={[styles.protocolDotPulse, { opacity: pulse, transform: [{ scale }] }]} />;
}

function CyclingDrillText({ text, animating }: { text: string; animating: boolean }) {
  const shift = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animating) {
      shift.setValue(0);
      opacity.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(shift, { toValue: -5, duration: 75, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5, duration: 75, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(shift, { toValue: 5, duration: 75, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5, duration: 75, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(shift, { toValue: -5, duration: 75, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5, duration: 75, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(shift, { toValue: 2, duration: 75, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.8, duration: 75, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(shift, { toValue: 0, duration: 75, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 75, useNativeDriver: true }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animating, opacity, shift]);

  return (
    <Animated.Text
      style={[
        styles.drillPlaceholder,
        animating && styles.drillCycling,
        { fontFamily: type.mono, transform: [{ translateY: shift }], opacity },
      ]}
    >
      {text}
    </Animated.Text>
  );
}

function DrillResult({ category, title }: { category: string; title: string }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 180, friction: 16, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);

  return (
    <Animated.View style={{ alignItems: "center", gap: 4, opacity, transform: [{ scale }] }}>
      <Text style={styles.drillCategory}>{category}</Text>
      <Text style={styles.drillTitle}>{title.toUpperCase()}</Text>
    </Animated.View>
  );
}



function CategoryPickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: QuickDrillCategory;
  onSelect: (key: QuickDrillCategory) => void;
  onClose: () => void;
}) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(280)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(sheetY, { toValue: 0, tension: 180, friction: 22, useNativeDriver: true }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 280, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [backdropOpacity, sheetY, visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.modalRoot} onPress={onClose}>
        <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]} />
        <Animated.View style={[styles.modalSheetWrap, { transform: [{ translateY: sheetY }] }]}>
          <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>FILTER BY CATEGORY</Text>
            {categoryOptions.map((option) => {
              const active = option.key === selected;
              return (
                <InteractivePressable key={option.key} onPress={() => onSelect(option.key)}>
                  <View style={[styles.modalOption, active && styles.modalOptionActive]}>
                    <Text style={[styles.modalOptionText, active && styles.modalOptionTextActive]}>{option.label}</Text>
                    {active ? <Icon name="check" size={14} color={palette.siennaAccent} /> : null}
                  </View>
                </InteractivePressable>
              );
            })}
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export function TodayScreen({
  sessionNumber,
  activeProtocolStepIndex = 1,
  onBegin,
  onStartQuickDrill,
  onTab,
  completionNotice,
  onClearCompletionNotice,
  scrollOffset = 0,
  onScrollOffsetChange,
}: {
  sessionNumber: number;
  activeProtocolStepIndex?: number;
  onBegin: () => void;
  onStartQuickDrill?: (drill: { category: string; title: string }) => void;
  onTab?: (tab: AppTab) => void;
  completionNotice?: null | { sessionNumber: number; message: string };
  onClearCompletionNotice?: () => void;
  scrollOffset?: number;
  onScrollOffsetChange?: (offset: number) => void;
}) {
  const session = sessionDefinitions.find((item) => item.sessionNumber === sessionNumber) ?? sessionDefinitions[0]!;
  const completedProtocolSteps = Math.max(0, Math.min(activeProtocolStepIndex, sessionProtocol.length - 1));
  const sprintProgress = useMemo(
    () => getSprintProgress(sessionNumber, completedProtocolSteps),
    [completedProtocolSteps, sessionNumber],
  );

  const scrollRef = useRef<ScrollView>(null);
  useScrollRestoration(scrollRef, scrollOffset);

  const allQuickDrills = useMemo(() => Object.values(quickDrills).flat(), []);

  const [quickDrillCategory, setQuickDrillCategory] = useState<QuickDrillCategory>("all");
  const [quickDrillCyclingTitle, setQuickDrillCyclingTitle] = useState<string>("FOCUS NOT ALLOCATED");
  const [quickDrillFinal, setQuickDrillFinal] = useState<null | { category: string; title: string }>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const cycleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
      }
      if (cycleTimeoutRef.current) {
        clearTimeout(cycleTimeoutRef.current);
      }
    };
  }, []);

  const totalMinutesLabel = useMemo(() => {
    const total = sessionProtocol.reduce((sum, item) => sum + (parseInt(item.duration, 10) || 0), 0);
    return `${total} MIN TOTAL`;
  }, []);

  const selectedCategoryLabel =
    categoryOptions.find((option) => option.key === quickDrillCategory)?.label ?? "All (Random)";

  const handleCategorySelect = (key: QuickDrillCategory) => {
    setQuickDrillCategory(key);
    setQuickDrillFinal(null);
    setQuickDrillCyclingTitle("FOCUS NOT ALLOCATED");
    setCategoryPickerOpen(false);
  };

  const handleGenerateQuickDrill = () => {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);
    setQuickDrillFinal(null);

    if (cycleIntervalRef.current) {
      clearInterval(cycleIntervalRef.current);
    }
    if (cycleTimeoutRef.current) {
      clearTimeout(cycleTimeoutRef.current);
    }

    cycleIntervalRef.current = setInterval(() => {
      setQuickDrillCyclingTitle(allQuickDrills[Math.floor(Math.random() * allQuickDrills.length)]!.toUpperCase());
    }, 80);

    cycleTimeoutRef.current = setTimeout(() => {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
      }
      const pool = quickDrillCategory === "all" ? allQuickDrills : quickDrills[quickDrillCategory];
      const finalTitle = pool[Math.floor(Math.random() * pool.length)]!;
      setQuickDrillFinal({
        category: quickDrillCategory === "all" ? "RANDOM CHALLENGE" : quickDrillCategory.toUpperCase(),
        title: finalTitle,
      });
      setIsGenerating(false);
    }, 1500);
  };

  const handleBeginRecording = () => {
    if (quickDrillFinal) {
      onStartQuickDrill?.(quickDrillFinal);
    }
  };

  return (
    <View style={styles.screen}>
      <FloatingOrb size={260} top={80} right={-40} color={palette.blush} opacity={0.45} />
      <FloatingOrb size={120} bottom={200} left={-20} color={palette.apricot} opacity={0.3} duration={5800} />
      <TabHeader
        title="Today"
        kicker="TODAY'S PRACTICE"
        onPressLogo={() => onTab?.("today")}
        right={
          <InteractivePressable onPress={() => onTab?.("stats")}>
            <ProfileIcon size={52} />
          </InteractivePressable>
        }
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="normal"
        bounces
        overScrollMode="always"
        keyboardShouldPersistTaps="handled"
        onScroll={(event) => onScrollOffsetChange?.(event.nativeEvent.contentOffset.y)}
      >
        {completionNotice?.sessionNumber === 1 ? (
          <Reveal>
            <Panel tone="soft" style={styles.completionBanner}>
              <MonoText style={{ color: palette.siennaAccent }}>SESSION 1 COMPLETE</MonoText>
              <BodyText style={styles.completionCopy}>{completionNotice.message}</BodyText>
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <PrimaryButton label="GOT IT" onPress={() => onClearCompletionNotice?.()} inverted />
              </View>
            </Panel>
          </Reveal>
        ) : null}

        <Reveal style={styles.todayHeader}>
          <View style={styles.todayHeaderTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.todayGreeting}>GOOD MORNING, SAHANA.</Text>
            </View>
            <View style={styles.progressRight}>
              <Text style={styles.progressLabel}>SPRINT PROGRESS</Text>
              <Text style={styles.progressValue}>{sprintProgress.label}</Text>
            </View>
          </View>

          <SprintProgressBar filledCount={sprintProgress.filledCount} checkeredIndex={sprintProgress.checkeredIndex} />
        </Reveal>

        <Reveal delay={80}>
          <View style={styles.sectionTitleRow}>
            <Icon name="bolt" size={18} color={palette.siennaAccent} />
            <Text style={styles.sectionTitle}>THE DAILY PROTOCOL</Text>
          </View>

          <View style={styles.protocolShell}>
            <View style={styles.protocolHeader}>
              <Text style={styles.protocolHeaderTitle}>{`SESSION ${session.sessionNumber}: ${session.practiceTitle}`}</Text>
              <Text style={styles.protocolHeaderMeta}>{totalMinutesLabel}</Text>
            </View>

            <View>
              {sessionProtocol.map((item, index) => {
                const isCompleted = index < activeProtocolStepIndex;
                const isActive = index === activeProtocolStepIndex;
                const stageIcon = stageIcons[index] ?? "centre";

                return (
                  <View
                    key={item.label}
                    style={[
                      styles.protocolStep,
                      index < sessionProtocol.length - 1 && styles.protocolStepDivider,
                      isActive && styles.protocolStepActive,
                      isCompleted && styles.protocolStepCompleted,
                    ]}
                  >
                    <View
                      style={[
                        styles.protocolDot,
                        isActive && styles.protocolDotActive,
                        isCompleted && styles.protocolDotCompleted,
                      ]}
                    >
                      {isActive ? (
                        <ActiveStepPulse />
                      ) : isCompleted ? (
                        <Icon name="check" size={14} color={palette.sageSuccess} />
                      ) : (
                        <Icon name={stageIcon} size={16} color={palette.outline} />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.protocolIndex, isActive && styles.protocolIndexActive]}>
                        {String(index + 1).padStart(2, "0")}
                      </Text>
                      <Text
                        style={[
                          styles.protocolLabel,
                          isActive && styles.protocolLabelActive,
                          isCompleted && styles.protocolLabelCompleted,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    <View style={[styles.protocolDuration, isActive && styles.protocolDurationActive, isCompleted && styles.protocolDurationCompleted]}>
                      <Text style={[styles.protocolDurationText, isActive && styles.protocolDurationTextActive]}>
                        {item.duration.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <PrimaryButton label="CONTINUE SESSION" onPress={onBegin} />
          </View>
        </Reveal>

        <Reveal delay={160}>
          <View style={styles.quickDrillHeader}>
            <Icon name="psychology" size={18} color={palette.onSurfaceVariant} />
            <Text style={styles.sectionTitle}>QUICK DRILL HUB</Text>
          </View>

          <View style={styles.filterBlock}>
            <Text style={styles.filterLabel}>FILTER BY CATEGORY</Text>
            <InteractivePressable onPress={() => setCategoryPickerOpen(true)}>
              <View style={styles.categorySelect}>
                <Text style={styles.categorySelectText}>{selectedCategoryLabel}</Text>
                <Icon name="chevronDown" size={20} color={palette.siennaAccent} />
              </View>
            </InteractivePressable>
          </View>

          <View style={styles.randomizerCard}>
            <View style={styles.randomizerTop}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.randomizerLabel}>RANDOMIZER</Text>
                <Text style={styles.randomizerCopy}>Ready for a spontaneous challenge?</Text>
              </View>
              <View style={styles.randomizerIconBox}>
                <Icon name="casino" size={22} color={palette.siennaAccent} />
              </View>
            </View>

            <View style={[styles.drillDisplay, (isGenerating || quickDrillFinal) && styles.drillDisplayActive]}>
              {quickDrillFinal ? (
                <DrillResult category={quickDrillFinal.category} title={quickDrillFinal.title} />
              ) : (
                <CyclingDrillText text={isGenerating ? quickDrillCyclingTitle : "FOCUS NOT ALLOCATED"} animating={isGenerating} />
              )}
            </View>

            {quickDrillFinal ? (
              <PrimaryButton
                label="BEGIN RECORDING"
                icon={<Icon name="videocam" size={18} />}
                onPress={handleBeginRecording}
                disabled={!onStartQuickDrill}
              />
            ) : (
              <PrimaryButton label="GENERATE RANDOM CHALLENGE" onPress={handleGenerateQuickDrill} disabled={isGenerating} inverted />
            )}
          </View>
        </Reveal>

        <View style={styles.spacerRow}>
          <View style={styles.spacerLine} />
        </View>
      </ScrollView>

      <CategoryPickerModal
        visible={categoryPickerOpen}
        selected={quickDrillCategory}
        onSelect={handleCategorySelect}
        onClose={() => setCategoryPickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 120,
    gap: 32,
  },
  completionBanner: {
    gap: spacing.sm,
    borderStyle: "dashed",
  },
  completionCopy: {
    color: palette.onSurfaceVariant,
    lineHeight: 26,
  },
  todayHeader: {
    gap: 16,
  },
  todayHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: spacing.md,
  },
  todayGreeting: {
    fontFamily: type.display,
    fontSize: 30,
    lineHeight: 33,
    color: palette.inkFocus,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  progressRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  progressLabel: {
    fontFamily: type.mono,
    fontSize: 11,
    color: palette.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  progressValue: {
    fontFamily: type.monoBold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 1,
    color: palette.siennaAccent,
  },
  sprintStrip: {
    flexDirection: "row",
    gap: 4,
    height: 12,
    width: "100%",
  },
  sprintSegment: {
    flex: 1,
    height: 12,
    overflow: "hidden",
    position: "relative",
  },
  sprintSegmentFilled: {
    backgroundColor: palette.siennaAccent,
    borderWidth: 1,
    borderColor: palette.inkFocus,
  },
  sprintSegmentCheckered: {
    backgroundColor: palette.parchmentSurface,
    borderWidth: 1,
    borderColor: palette.inkFocus,
  },
  sprintSegmentEmpty: {
    borderWidth: 1,
    borderColor: palette.outline,
    backgroundColor: "transparent",
  },
  checkeredWrap: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  checkeredCell: {
    width: "8.33%",
    height: "50%",
  },
  checkeredCellFilled: {
    backgroundColor: palette.siennaAccent,
  },
  checkeredCellEmpty: {
    backgroundColor: palette.parchmentSurface,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: type.mono,
    fontSize: 11,
    color: palette.onSurfaceVariant,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  protocolShell: {
    borderWidth: 2,
    borderColor: palette.inkFocus,
    backgroundColor: palette.parchmentSurface,
    shadowColor: palette.siennaAccent,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.95,
    shadowRadius: 0,
    overflow: "hidden",
  },
  protocolHeader: {
    backgroundColor: palette.inkFocus,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  protocolHeaderTitle: {
    flex: 1,
    fontFamily: type.display,
    color: palette.parchmentSurface,
    fontSize: 20,
    lineHeight: 22,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  protocolHeaderMeta: {
    fontFamily: type.mono,
    color: palette.parchmentSurface,
    fontSize: 11,
    opacity: 0.76,
    letterSpacing: 1.1,
  },
  protocolStep: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 62,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: palette.parchmentSurface,
  },
  protocolStepDivider: {
    borderBottomWidth: 1,
    borderBottomColor: palette.outlineVariant,
  },
  protocolStepActive: {
    backgroundColor: palette.primary,
  },
  protocolStepCompleted: {
    backgroundColor: palette.surfaceContainerLow,
  },
  protocolDot: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: palette.outline,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  protocolDotActive: {
    borderColor: palette.parchmentSurface,
  },
  protocolDotCompleted: {
    borderColor: palette.sageSuccess,
  },
  protocolDotPulse: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: palette.parchmentSurface,
  },
  protocolIndex: {
    fontFamily: type.mono,
    fontSize: 9,
    color: palette.onSurfaceVariant,
    letterSpacing: 1,
  },
  protocolIndexActive: {
    color: palette.onPrimaryContainer,
  },
  protocolLabel: {
    fontFamily: type.bodyBold,
    fontSize: 15,
    color: palette.inkFocus,
    textTransform: "uppercase",
  },
  protocolLabelActive: {
    color: palette.parchmentSurface,
    textTransform: "none",
  },
  protocolLabelCompleted: {
    textDecorationLine: "line-through",
    color: palette.onSurfaceVariant,
  },
  protocolDuration: {
    borderWidth: 1,
    borderColor: palette.outline,
    paddingHorizontal: 7,
    paddingVertical: 4,
    backgroundColor: palette.background,
  },
  protocolDurationActive: {
    borderColor: palette.parchmentSurface,
    backgroundColor: "transparent",
  },
  protocolDurationCompleted: {
    backgroundColor: palette.background,
  },
  protocolDurationText: {
    fontFamily: type.mono,
    fontSize: 11,
    letterSpacing: 0.9,
    color: palette.inkFocus,
  },
  protocolDurationTextActive: {
    color: palette.parchmentSurface,
  },

  quickDrillHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderTopWidth: 2,
    borderTopColor: palette.outlineVariant,
    paddingTop: 26,
    marginBottom: 18,
  },
  filterBlock: {
    gap: 8,
    marginBottom: 24,
  },
  filterLabel: {
    fontFamily: type.mono,
    fontSize: 11,
    color: palette.onSurfaceVariant,
    letterSpacing: 1.4,
  },
  categorySelect: {
    borderWidth: 2,
    borderColor: palette.outline,
    backgroundColor: palette.parchmentSurface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categorySelectText: {
    fontFamily: type.mono,
    fontSize: 13,
    color: palette.inkFocus,
    letterSpacing: 0.4,
  },
  randomizerCard: {
    borderWidth: 2,
    borderColor: palette.outline,
    backgroundColor: palette.surfaceContainer,
    padding: 22,
    gap: 14,
    shadowColor: palette.outlineVariant,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
  },
  randomizerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  randomizerLabel: {
    fontFamily: type.mono,
    fontSize: 11,
    color: palette.siennaAccent,
    letterSpacing: 1.4,
  },
  randomizerCopy: {
    fontFamily: type.body,
    color: palette.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 22,
  },
  randomizerIconBox: {
    width: 44,
    height: 44,
    borderWidth: 1.5,
    borderColor: palette.outline,
    backgroundColor: palette.parchmentSurface,
    alignItems: "center",
    justifyContent: "center",
  },
  drillDisplay: {
    minHeight: 96,
    borderWidth: 1.5,
    borderColor: palette.outlineVariant,
    borderStyle: "dashed",
    backgroundColor: palette.parchmentSurface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  drillDisplayActive: {
    borderStyle: "solid",
    borderColor: palette.outline,
    backgroundColor: palette.white,
  },
  drillPlaceholder: {
    fontSize: 11,
    color: palette.onSurfaceVariant,
    textAlign: "center",
    letterSpacing: 1.1,
    opacity: 0.5,
  },
  drillCycling: {
    color: palette.siennaAccent,
    opacity: 1,
  },
  drillCategory: {
    fontFamily: type.mono,
    fontSize: 9,
    color: palette.onSurfaceVariant,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  drillTitle: {
    fontFamily: type.monoBold,
    fontSize: 16,
    lineHeight: 20,
    color: palette.inkFocus,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  spacerRow: {
    paddingVertical: 48,
    alignItems: "center",
  },
  spacerLine: {
    width: 96,
    height: 1,
    backgroundColor: palette.outlineVariant,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(44, 20, 13, 0.45)",
  },
  modalSheetWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modalSheet: {
    backgroundColor: palette.parchmentSurface,
    borderWidth: 2,
    borderColor: palette.inkFocus,
    shadowColor: palette.inkFocus,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    overflow: "hidden",
  },
  modalHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    backgroundColor: palette.outlineVariant,
    marginTop: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: type.mono,
    fontSize: 11,
    color: palette.onSurfaceVariant,
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  modalOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: palette.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalOptionActive: {
    backgroundColor: palette.surfaceContainerLow,
  },
  modalOptionText: {
    fontFamily: type.bodyMedium,
    fontSize: 15,
    color: palette.inkFocus,
  },
  modalOptionTextActive: {
    fontFamily: type.bodyBold,
    color: palette.siennaAccent,
  },
});
