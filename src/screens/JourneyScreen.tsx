import React, { useEffect, useMemo, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel, ProfileIcon, TabHeader } from "../design-system/primitives";
import { Icon } from "../design-system/icons";
import { FloatingOrb, InteractivePressable, Reveal } from "../design-system/motion";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { palette, spacing, type } from "../design-system/theme";
import { formatSessionMeta, getSprintGroups, sessionDefinitions, sessionProtocol, type AppTab } from "../data/mockData";
import { UNLOCK_ALL_FOR_TESTING } from "./session/constants";

const STAGE_ICONS = ["centre", "listen", "do", "see", "commit"] as const;

export function JourneyScreen({
  highestUnlockedSessionNumber,
  onOpenSession,
  onTab,
  scrollOffset = 0,
  onScrollOffsetChange,
}: {
  highestUnlockedSessionNumber: number;
  onOpenSession: (sessionNumber: number, stepIndex?: number) => void;
  onTab?: (tab: AppTab) => void;
  scrollOffset?: number;
  onScrollOffsetChange?: (offset: number) => void;
}) {
  const sprintGroups = useMemo(() => getSprintGroups(), []);
  const completedCount = Math.max(0, highestUnlockedSessionNumber - 1);
  const scrollRef = useRef<ScrollView>(null);
  useScrollRestoration(scrollRef, scrollOffset);

  return (
    <View style={styles.screen}>
      <FloatingOrb size={200} top={60} right={-50} color={palette.blush} opacity={0.5} />

      <TabHeader
        title="Journey"
        kicker="PROGRAM MAP"
        onPressLogo={() => onTab?.("today")}
        right={
          <View style={styles.headerRight}>
            <View style={styles.progressChip}>
              <MonoText style={styles.progressChipText}>
                {completedCount}/{sessionDefinitions.length}
              </MonoText>
            </View>
            <InteractivePressable onPress={() => onTab?.("stats")}>
              <ProfileIcon />
            </InteractivePressable>
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
          <BodyText style={styles.intro}>
            {UNLOCK_ALL_FOR_TESTING
              ? "Testing mode — tap any session or stage icon to jump there instantly."
              : "Six sprints, six sessions each. Work through the program in order — each sprint builds on the last."}
          </BodyText>
        </Reveal>

        {sprintGroups.map((sprint, sprintIndex) => {
          const sprintStart = (sprint.sprintNumber - 1) * 6 + 1;
          const sprintEnd = sprint.sprintNumber * 6;
          const completedInSprint = sprint.sessions.filter((s) => s.sessionNumber < highestUnlockedSessionNumber).length;
          const isCurrentSprint =
            highestUnlockedSessionNumber >= sprintStart && highestUnlockedSessionNumber <= sprintEnd;
          const sprintProgress = completedInSprint / sprint.sessions.length;

          return (
            <Reveal key={sprint.sprintNumber} delay={sprintIndex * 60} style={styles.sprintSection}>
              <View style={styles.sprintHeader}>
                <View style={styles.sprintHeaderMain}>
                  <View style={[styles.sprintBadge, isCurrentSprint && styles.sprintBadgeCurrent]}>
                    <MonoText style={[styles.sprintBadgeText, isCurrentSprint && styles.sprintBadgeTextCurrent]}>
                      SPRINT {String(sprint.sprintNumber).padStart(2, "0")}
                    </MonoText>
                  </View>
                  <DisplayText style={styles.sprintTitle}>{sprint.title}</DisplayText>
                  <MonoText style={styles.sprintTheme}>{sprint.theme.toUpperCase()}</MonoText>
                  <BodyText style={styles.sprintDescription}>{sprint.description}</BodyText>
                </View>
                <View style={styles.sprintStats}>
                  <DisplayText style={styles.sprintStatValue}>{completedInSprint}/6</DisplayText>
                  <MonoText style={styles.sprintStatLabel}>SESSIONS</MonoText>
                  <View style={styles.sprintProgressTrack}>
                    <View style={[styles.sprintProgressFill, { width: `${sprintProgress * 100}%` }]} />
                  </View>
                </View>
              </View>

              <View style={styles.sessionGrid}>
                {sprint.sessions.map((session) => {
                  const isCompleted = session.sessionNumber < highestUnlockedSessionNumber;
                  const isCurrent = session.sessionNumber === highestUnlockedSessionNumber;
                  const isLocked = !UNLOCK_ALL_FOR_TESTING && session.sessionNumber > highestUnlockedSessionNumber;
                  const completedSteps = isCompleted ? 5 : isCurrent ? 1 : 0;
                  const meta = formatSessionMeta(session.sessionNumber);
                  const stagePreview = [
                    session.stages.breathe.title,
                    session.stages.lesson.title,
                    session.stages.feedback.promptTitle,
                    session.stages.record.title.replace(/\n/g, " "),
                    session.stages.reflect.promptTitle,
                  ];

                  return (
                    <View key={session.sessionNumber} style={styles.sessionRow}>
                    <InteractivePressable
                      onPress={() => onOpenSession(session.sessionNumber, 0)}
                      disabled={isLocked}
                      style={styles.sessionCardPressable}
                    >
                      <Panel
                        tone="soft"
                        style={[
                          styles.sessionCard,
                          isCurrent && styles.sessionCardCurrent,
                          isLocked && styles.sessionCardLocked,
                        ]}
                      >
                        <View style={styles.sessionMetaRow}>
                          <MonoText style={styles.sessionMetaPrimary}>{meta.session}</MonoText>
                          <MonoText style={styles.sessionMetaSep}>·</MonoText>
                          <MonoText style={styles.sessionMetaSecondary}>{meta.sprint}</MonoText>
                          <View style={styles.sessionMetaSpacer} />
                          <MonoText style={[styles.sessionStatus, isCurrent && styles.sessionStatusCurrent]}>
                            {isCurrent ? "NOW" : isCompleted ? "DONE" : isLocked ? "LOCKED" : "OPEN"}
                          </MonoText>
                        </View>

                        <MonoText style={styles.sessionArcTitle}>{session.arcTitle.toUpperCase()}</MonoText>
                        <DisplayText style={styles.sessionPractice}>{session.practiceTitle}</DisplayText>
                        <BodyText style={styles.sessionFocusLine}>{session.focusLine}</BodyText>

                        <View style={styles.stageProgressTrack}>
                          <View
                            style={[
                              styles.stageProgressFill,
                              { width: `${((UNLOCK_ALL_FOR_TESTING ? 0 : completedSteps) / 5) * 100}%` },
                            ]}
                          />
                        </View>

                        <View style={styles.stageIconRow}>
                          {STAGE_ICONS.map((iconName, index) => {
                            const stepDone = UNLOCK_ALL_FOR_TESTING ? false : index < completedSteps;
                            const stepCurrent = !UNLOCK_ALL_FOR_TESTING && index === completedSteps && isCurrent;
                            const stepActive = UNLOCK_ALL_FOR_TESTING || stepDone || stepCurrent || !isLocked;

                            return (
                              <InteractivePressable
                                key={iconName}
                                disabled={isLocked}
                                onPress={() => onOpenSession(session.sessionNumber, index)}
                                style={[
                                  styles.stageIconButton,
                                  stepDone && styles.stageIconButtonDone,
                                  stepCurrent && styles.stageIconButtonCurrent,
                                  UNLOCK_ALL_FOR_TESTING && styles.stageIconButtonTesting,
                                ]}
                              >
                                <Icon
                                  name={iconName}
                                  size={16}
                                  color={stepCurrent ? palette.paper : stepDone ? palette.line : stepActive ? palette.ink : palette.inkMuted}
                                />
                                <MonoText
                                  style={[
                                    styles.stageIconLabel,
                                    stepCurrent && styles.stageIconLabelCurrent,
                                  ]}
                                >
                                  {sessionProtocol[index]?.label ?? ""}
                                </MonoText>
                              </InteractivePressable>
                            );
                          })}
                        </View>

                        <BodyText style={styles.stagePreview}>
                          {stagePreview[isCurrent ? completedSteps : 0]}
                        </BodyText>
                      </Panel>
                    </InteractivePressable>
                    </View>
                  );
                })}
              </View>
            </Reveal>
          );
        })}

        <Reveal delay={200}>
          <Panel style={styles.noteCard}>
            <MonoText style={styles.noteKicker}>FROM YOUR COACH</MonoText>
            <BodyText style={styles.noteBody}>
              Momentum is built in the middle miles. Finish each sprint before rushing ahead — the habits compound when you
              give them room to settle.
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

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressChip: {
    borderWidth: 2,
    borderColor: palette.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.paper,
  },
  progressChipText: {
    fontSize: 12,
  },

  content: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  intro: {
    fontSize: 17,
    lineHeight: 28,
    color: palette.inkMuted,
  },
  sprintSection: {
    gap: spacing.md,
  },
  sprintHeader: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  sprintHeaderMain: {
    flex: 1,
    gap: spacing.xs,
  },
  sprintBadge: {
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderColor: palette.line,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: palette.paper,
  },
  sprintBadgeCurrent: {
    backgroundColor: palette.line,
  },
  sprintBadgeText: {
    fontSize: 10,
    color: palette.ink,
  },
  sprintBadgeTextCurrent: {
    color: palette.paper,
  },
  sprintTitle: {
    fontSize: 26,
    lineHeight: 30,
  },
  sprintTheme: {
    fontSize: 10,
    color: palette.line,
  },
  sprintDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: palette.inkMuted,
  },
  sprintStats: {
    width: 72,
    alignItems: "flex-end",
    gap: 4,
  },
  sprintStatValue: {
    fontSize: 28,
    lineHeight: 30,
  },
  sprintStatLabel: {
    fontSize: 9,
    color: palette.inkMuted,
  },
  sprintProgressTrack: {
    width: "100%",
    height: 6,
    borderWidth: 1.5,
    borderColor: palette.line,
    marginTop: spacing.xs,
  },
  sprintProgressFill: {
    height: "100%",
    backgroundColor: palette.line,
  },
  sessionGrid: {
    flexDirection: "column",
    gap: spacing.md,
  },
  sessionRow: {
    width: "100%",
  },
  sessionCardPressable: {
    width: "100%",
  },
  sessionCard: {
    gap: spacing.sm,
    minHeight: 140,
  },
  sessionCardCurrent: {
    backgroundColor: palette.surfaceContainerHigh,
    borderWidth: 2,
    borderColor: palette.line,
  },
  sessionCardLocked: {
    opacity: 0.55,
  },
  sessionCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sessionMetaPrimary: {
    fontSize: 13,
    letterSpacing: 0.2,
    color: palette.line,
    fontFamily: type.bodyMedium,
  },
  sessionMetaSep: {
    fontSize: 12,
    color: palette.lineSoft,
  },
  sessionMetaSecondary: {
    fontSize: 11,
    letterSpacing: 0.4,
    color: palette.inkMuted,
  },
  sessionMetaSpacer: {
    flex: 1,
  },
  sessionArcTitle: {
    fontSize: 9,
    letterSpacing: 1.2,
    color: palette.line,
    opacity: 0.75,
  },
  sessionNumber: {
    fontSize: 10,
    letterSpacing: 1,
    color: palette.line,
    fontFamily: type.mono,
  },
  sessionStatus: {
    fontSize: 9,
    fontFamily: type.mono,
    color: palette.inkMuted,
  },
  sessionStatusCurrent: {
    color: palette.line,
    fontFamily: type.mono,
  },
  sessionPractice: {
    fontSize: 17,
    lineHeight: 22,
  },
  sessionFocusLine: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.inkMuted,
  },
  sessionSummary: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.inkMuted,
  },
  stageProgressTrack: {
    height: 4,
    borderWidth: 1,
    borderColor: palette.lineSoft,
    marginTop: spacing.xs,
  },
  stageProgressFill: {
    height: "100%",
    backgroundColor: palette.line,
  },
  stageIconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    marginTop: spacing.xs,
  },
  stageIconButton: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: palette.lineSoft,
    backgroundColor: palette.paper,
    borderRadius: 6,
  },
  stageIconButtonDone: {
    backgroundColor: "#EDE4D8",
    borderColor: palette.line,
  },
  stageIconButtonCurrent: {
    backgroundColor: palette.line,
    borderColor: palette.line,
  },
  stageIconButtonTesting: {
    borderColor: palette.lineSoft,
  },
  stageIconLabel: {
    fontSize: 7,
    letterSpacing: 0.2,
    color: palette.inkMuted,
    textAlign: "center",
  },
  stageIconLabelCurrent: {
    color: palette.paper,
  },
  stagePreview: {
    fontSize: 11,
    lineHeight: 14,
    color: palette.inkMuted,
    fontStyle: "italic",
    marginTop: 2,
  },
  noteCard: {
    backgroundColor: palette.blush,
    gap: spacing.sm,
  },
  noteKicker: {
    fontSize: 10,
    color: palette.line,
  },
  noteBody: {
    fontSize: 17,
    lineHeight: 28,
    fontStyle: "italic",
  },
});
