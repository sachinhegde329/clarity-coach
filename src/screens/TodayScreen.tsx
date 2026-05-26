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
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { BodyText, MonoText, Panel, PrimaryButton, TabHeader } from "../design-system/primitives";
import { Icon } from "../design-system/icons";
import { InteractivePressable, Reveal } from "../design-system/motion";
import { spacing } from "../design-system/theme";
import { SESSIONS_PER_SPRINT, sessionDefinitions, sessionProtocol, type AppTab } from "../data/mockData";

const todayColors = {
  parchment: "#FDF6E3",
  sienna: "#8B4513",
  primary: "#6C2F00",
  inkFocus: "#2E2E2E",
  sageSuccess: "#7A8C70",
  surfaceContainer: "#FBECE3",
  surfaceContainerLow: "#FFF1EB",
  outline: "#877369",
  outlineVariant: "#DAC2B6",
  onSurfaceVariant: "#54433A",
  onPrimaryContainer: "#FFC29F",
  background: "#FFF8F5",
};

const todayFonts = {
  headline: "SpaceMono_400Regular",
  label: "SpaceMono_400Regular",
  labelBold: "SpaceMono_400Regular",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodyBold: "Inter_700Bold",
};

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
        { fontFamily: todayFonts.label, transform: [{ translateY: shift }], opacity },
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

function BrutalistShadowButton({
  onPress,
  disabled,
  filled,
  label,
  icon,
  style,
}: {
  onPress: () => void;
  disabled?: boolean;
  filled?: boolean;
  label: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const translate = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);

  const animatePress = (toValue: number) => {
    Animated.spring(translate, {
      toValue,
      tension: 280,
      friction: 22,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        setPressed(true);
        animatePress(1);
      }}
      onPressOut={() => {
        setPressed(false);
        animatePress(0);
      }}
    >
      <Animated.View
        style={[
          filled ? styles.generateButtonFilled : styles.generateButton,
          pressed && styles.generateButtonPressed,
          disabled && styles.generateButtonDisabled,
          style,
          {
            transform: [
              {
                translateX: translate.interpolate({ inputRange: [0, 1], outputRange: [0, 2] }),
              },
              {
                translateY: translate.interpolate({ inputRange: [0, 1], outputRange: [0, 2] }),
              },
            ],
          },
        ]}
      >
        <Text style={filled ? styles.generateButtonLabelFilled : styles.generateButtonLabel}>{label}</Text>
        {icon}
      </Animated.View>
    </Pressable>
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
                    {active ? <Icon name="check" size={14} color={todayColors.sienna} /> : null}
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
  const hasRestored = useRef(false);

  const allQuickDrills = useMemo(() => Object.values(quickDrills).flat(), []);

  const [quickDrillCategory, setQuickDrillCategory] = useState<QuickDrillCategory>("all");
  const [quickDrillCyclingTitle, setQuickDrillCyclingTitle] = useState<string>("FOCUS NOT ALLOCATED");
  const [quickDrillFinal, setQuickDrillFinal] = useState<null | { category: string; title: string }>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const cycleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const continuePress = useRef(new Animated.Value(0)).current;

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

  const continueTranslate = continuePress.interpolate({ inputRange: [0, 1], outputRange: [0, 2] });

  return (
    <View style={styles.screen}>
      <TabHeader
        title="Today"
        kicker="TODAY'S PRACTICE"
        onPressLogo={() => onTab?.("today")}
        right={
          <InteractivePressable onPress={() => onTab?.("stats")}>
            <View style={styles.profileBox}>
              <Icon name="profile" size={30} color={todayColors.sienna} />
            </View>
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
              <MonoText style={{ color: todayColors.sienna }}>SESSION 1 COMPLETE</MonoText>
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
            <Icon name="bolt" size={18} color={todayColors.sienna} />
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
                        <Icon name="check" size={14} color={todayColors.sageSuccess} />
                      ) : (
                        <Icon name={stageIcon} size={16} color={todayColors.outline} />
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

            <Pressable
              onPress={onBegin}
              onPressIn={() => Animated.spring(continuePress, { toValue: 1, tension: 260, friction: 24, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(continuePress, { toValue: 0, tension: 260, friction: 24, useNativeDriver: true }).start()}
            >
              <Animated.View style={[styles.continueButton, { transform: [{ translateY: continueTranslate }] }]}>
                <Text style={styles.continueButtonLabel}>CONTINUE SESSION</Text>
                <Icon name="arrow" size={20} color={todayColors.parchment} />
              </Animated.View>
            </Pressable>
          </View>
        </Reveal>

        <Reveal delay={160}>
          <View style={styles.quickDrillHeader}>
            <Icon name="psychology" size={18} color={todayColors.onSurfaceVariant} />
            <Text style={styles.sectionTitle}>QUICK DRILL HUB</Text>
          </View>

          <View style={styles.filterBlock}>
            <Text style={styles.filterLabel}>FILTER BY CATEGORY</Text>
            <InteractivePressable onPress={() => setCategoryPickerOpen(true)}>
              <View style={styles.categorySelect}>
                <Text style={styles.categorySelectText}>{selectedCategoryLabel}</Text>
                <Icon name="chevronDown" size={20} color={todayColors.sienna} />
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
                <Icon name="casino" size={22} color={todayColors.sienna} />
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
              <BrutalistShadowButton
                filled
                label="BEGIN RECORDING"
                icon={<Icon name="videocam" size={18} color={todayColors.parchment} />}
                onPress={handleBeginRecording}
                disabled={!onStartQuickDrill}
              />
            ) : (
              <BrutalistShadowButton label="GENERATE RANDOM CHALLENGE" onPress={handleGenerateQuickDrill} disabled={isGenerating} />
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
    backgroundColor: todayColors.background,
  },
  profileBox: {
    width: 52,
    height: 52,
    borderWidth: 2,
    borderRadius: 26,
    borderColor: todayColors.outline,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: todayColors.parchment,
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
    color: todayColors.onSurfaceVariant,
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
    fontFamily: todayFonts.headline,
    fontSize: 32,
    lineHeight: 35,
    color: todayColors.inkFocus,
    textTransform: "uppercase",
  },
  progressRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  progressLabel: {
    fontFamily: todayFonts.label,
    fontSize: 12,
    color: todayColors.onSurfaceVariant,
    letterSpacing: 1.2,
  },
  progressValue: {
    fontFamily: todayFonts.labelBold,
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: 1.2,
    color: todayColors.sienna,
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
    backgroundColor: todayColors.sienna,
    borderWidth: 1,
    borderColor: todayColors.inkFocus,
  },
  sprintSegmentCheckered: {
    backgroundColor: todayColors.parchment,
    borderWidth: 1,
    borderColor: todayColors.inkFocus,
  },
  sprintSegmentEmpty: {
    borderWidth: 1,
    borderColor: todayColors.outline,
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
    backgroundColor: todayColors.sienna,
  },
  checkeredCellEmpty: {
    backgroundColor: todayColors.parchment,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: todayFonts.label,
    fontSize: 12,
    color: todayColors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  protocolShell: {
    borderWidth: 2,
    borderColor: todayColors.inkFocus,
    backgroundColor: todayColors.parchment,
    shadowColor: todayColors.sienna,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    overflow: "hidden",
  },
  protocolHeader: {
    backgroundColor: todayColors.inkFocus,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  protocolHeaderTitle: {
    flex: 1,
    fontFamily: todayFonts.headline,
    color: todayColors.parchment,
    fontSize: 24,
    lineHeight: 26,
    textTransform: "uppercase",
  },
  protocolHeaderMeta: {
    fontFamily: todayFonts.label,
    color: todayColors.parchment,
    fontSize: 12,
    opacity: 0.8,
    letterSpacing: 1.2,
  },
  protocolStep: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: todayColors.parchment,
  },
  protocolStepDivider: {
    borderBottomWidth: 1,
    borderBottomColor: todayColors.outlineVariant,
  },
  protocolStepActive: {
    backgroundColor: todayColors.primary,
  },
  protocolStepCompleted: {
    backgroundColor: todayColors.surfaceContainerLow,
  },
  protocolDot: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: todayColors.outline,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  protocolDotActive: {
    borderColor: todayColors.parchment,
  },
  protocolDotCompleted: {
    borderColor: todayColors.sageSuccess,
  },
  protocolDotPulse: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: todayColors.parchment,
  },
  protocolIndex: {
    fontFamily: todayFonts.label,
    fontSize: 10,
    color: todayColors.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  protocolIndexActive: {
    color: todayColors.onPrimaryContainer,
  },
  protocolLabel: {
    fontFamily: todayFonts.bodyBold,
    fontSize: 16,
    color: todayColors.inkFocus,
    textTransform: "uppercase",
  },
  protocolLabelActive: {
    color: todayColors.parchment,
    textTransform: "none",
  },
  protocolLabelCompleted: {
    textDecorationLine: "line-through",
    color: todayColors.onSurfaceVariant,
  },
  protocolDuration: {
    borderWidth: 1,
    borderColor: todayColors.outline,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: todayColors.background,
  },
  protocolDurationActive: {
    borderColor: todayColors.parchment,
    backgroundColor: "transparent",
  },
  protocolDurationCompleted: {
    backgroundColor: todayColors.background,
  },
  protocolDurationText: {
    fontFamily: todayFonts.label,
    fontSize: 12,
    letterSpacing: 1,
    color: todayColors.inkFocus,
  },
  protocolDurationTextActive: {
    color: todayColors.parchment,
  },
  continueButton: {
    width: "100%",
    backgroundColor: todayColors.sienna,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueButtonLabel: {
    fontFamily: todayFonts.label,
    color: todayColors.parchment,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  quickDrillHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 2,
    borderTopColor: todayColors.outlineVariant,
    paddingTop: 32,
    marginBottom: 24,
  },
  filterBlock: {
    gap: 8,
    marginBottom: 24,
  },
  filterLabel: {
    fontFamily: todayFonts.label,
    fontSize: 12,
    color: todayColors.onSurfaceVariant,
    letterSpacing: 1.2,
  },
  categorySelect: {
    borderWidth: 2,
    borderColor: todayColors.outline,
    backgroundColor: todayColors.parchment,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categorySelectText: {
    fontFamily: todayFonts.label,
    fontSize: 14,
    color: todayColors.inkFocus,
    letterSpacing: 0.5,
  },
  randomizerCard: {
    borderWidth: 2,
    borderColor: todayColors.outline,
    backgroundColor: todayColors.surfaceContainer,
    padding: 24,
    gap: 16,
  },
  randomizerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  randomizerLabel: {
    fontFamily: todayFonts.label,
    fontSize: 12,
    color: todayColors.sienna,
    letterSpacing: 1.2,
  },
  randomizerCopy: {
    fontFamily: todayFonts.body,
    color: todayColors.inkFocus,
    fontSize: 16,
    lineHeight: 24,
  },
  randomizerIconBox: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: todayColors.outline,
    backgroundColor: todayColors.parchment,
    alignItems: "center",
    justifyContent: "center",
  },
  drillDisplay: {
    height: 96,
    borderWidth: 2,
    borderColor: todayColors.outlineVariant,
    borderStyle: "dashed",
    backgroundColor: todayColors.parchment,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  drillDisplayActive: {
    borderStyle: "solid",
    borderColor: todayColors.outline,
    backgroundColor: "#FFFFFF",
  },
  drillPlaceholder: {
    fontSize: 12,
    color: todayColors.onSurfaceVariant,
    textAlign: "center",
    letterSpacing: 1,
    opacity: 0.5,
  },
  drillCycling: {
    color: todayColors.sienna,
    opacity: 1,
  },
  drillCategory: {
    fontFamily: todayFonts.label,
    fontSize: 10,
    color: todayColors.onSurfaceVariant,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  drillTitle: {
    fontFamily: todayFonts.labelBold,
    fontSize: 18,
    lineHeight: 22,
    color: todayColors.inkFocus,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  generateButton: {
    borderWidth: 2,
    borderColor: todayColors.inkFocus,
    backgroundColor: todayColors.parchment,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: todayColors.inkFocus,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  generateButtonFilled: {
    backgroundColor: todayColors.sienna,
    borderColor: todayColors.sienna,
    shadowColor: todayColors.sienna,
    shadowOffset: { width: 4, height: 4 },
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonPressed: {
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  generateButtonLabel: {
    fontFamily: todayFonts.label,
    color: todayColors.inkFocus,
    fontSize: 12,
    letterSpacing: 1,
  },
  generateButtonLabelFilled: {
    fontFamily: todayFonts.label,
    color: todayColors.parchment,
    fontSize: 12,
    letterSpacing: 1,
  },
  spacerRow: {
    paddingVertical: 48,
    alignItems: "center",
  },
  spacerLine: {
    width: 96,
    height: 1,
    backgroundColor: todayColors.outlineVariant,
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
    backgroundColor: todayColors.parchment,
    borderWidth: 2,
    borderColor: todayColors.inkFocus,
    shadowColor: todayColors.inkFocus,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    overflow: "hidden",
  },
  modalHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    backgroundColor: todayColors.outlineVariant,
    marginTop: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: todayFonts.label,
    fontSize: 11,
    color: todayColors.onSurfaceVariant,
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  modalOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: todayColors.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalOptionActive: {
    backgroundColor: todayColors.surfaceContainerLow,
  },
  modalOptionText: {
    fontFamily: todayFonts.bodyMedium,
    fontSize: 15,
    color: todayColors.inkFocus,
  },
  modalOptionTextActive: {
    fontFamily: todayFonts.bodyBold,
    color: todayColors.sienna,
  },
});
