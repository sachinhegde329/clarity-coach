import React, { ReactNode } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import type { SessionDefinition, SessionStage } from "../../../data/mockData";
import { palette } from "../../../design-system/theme";
import { FloatingOrb, Reveal } from "../../../design-system/motion";
import { styles } from "../sessionFlowStyles";
import { SessionUnifiedHeader } from "./SessionUnifiedHeader";
import { SessionStageTitle } from "./SessionStageTitle";
import { SESSION_STEP_COUNT, UNLOCK_ALL_FOR_TESTING } from "../constants";
import { stageBackground } from "../unified/sessionScreenConfig";
import { usesUnifiedShell } from "../flow/sessionStageRouter";

type SessionFlowShellProps = {
  sessionNumber: number;
  session: SessionDefinition;
  stage: SessionStage;
  stepIndex: number;
  onJumpToStep: (stepIndex: number) => void;
  breathElapsed?: number;
  isBreathRunning?: boolean;
  onBack: () => void;
  onExit: () => void;
  children: ReactNode;
  variant?: "default" | "breathe";
  hideHeader?: boolean;
  hideStageDetails?: boolean;
  scrollContentStyle?: StyleProp<ViewStyle>;
};

export function SessionFlowShell({
  sessionNumber,
  session,
  stage,
  stepIndex,
  onJumpToStep,
  onBack,
  onExit,
  children,
  variant = "default",
  hideHeader = false,
  hideStageDetails = false,
  scrollContentStyle,
}: SessionFlowShellProps) {
  const isBreathe = variant === "breathe";
  const activeStepIndex = isBreathe ? 0 : stepIndex;
  const stageKey = `${sessionNumber}-${stage}`;
  const usesUnifiedDesign = usesUnifiedShell(sessionNumber);
  const screenBackground = usesUnifiedDesign ? stageBackground(sessionNumber, stage) : palette.paper;

  return (
    <View style={[styles.screen, isBreathe && styles.breatheScreen, usesUnifiedDesign && { backgroundColor: screenBackground }]}>
      {!hideHeader && !usesUnifiedDesign ? (
        <>
          <FloatingOrb
            size={isBreathe ? 220 : 180}
            top={isBreathe ? 72 : 96}
            right={-30}
            color={isBreathe ? "#F3E2D3" : palette.blush}
            opacity={isBreathe ? 0.65 : 0.5}
          />
          {!isBreathe ? (
            <FloatingOrb size={100} top={200} left={-24} color={palette.blush} opacity={0.35} duration={6400} amplitude={14} />
          ) : null}
        </>
      ) : null}

      {!hideHeader ? (
        <SessionUnifiedHeader
          activeIndex={activeStepIndex}
          maxUnlockedIndex={UNLOCK_ALL_FOR_TESTING ? SESSION_STEP_COUNT - 1 : Math.max(0, activeStepIndex)}
          onSelectStep={(targetIndex) => {
            if (targetIndex < 0 || targetIndex >= SESSION_STEP_COUNT) return;
            if (!UNLOCK_ALL_FOR_TESTING && targetIndex > activeStepIndex) return;
            onJumpToStep(targetIndex);
          }}
          onBack={onBack}
          onExit={onExit}
        />
      ) : null}

      {hideHeader ? (
        <View key={stageKey} style={[{ flex: 1 }, scrollContentStyle]}>
          <Reveal key={`reveal-${stageKey}`} delay={40}>
            {children}
          </Reveal>
        </View>
      ) : (
        <ScrollView
          key={stageKey}
          style={isBreathe ? styles.breatheScroll : undefined}
          contentContainerStyle={[
            usesUnifiedDesign ? styles.unifiedScrollContent : isBreathe ? styles.breatheCanvas : styles.scrollContent,
            scrollContentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          bounces={!isBreathe}
        >
          <Reveal key={`reveal-${stageKey}`} delay={40}>
            {usesUnifiedDesign && !hideStageDetails && sessionNumber > 5 ? (
              <View style={styles.unifiedStageTitleWrap}>
                <SessionStageTitle sessionNumber={sessionNumber} stepIndex={activeStepIndex} stage={stage} />
              </View>
            ) : null}
            {children}
          </Reveal>
        </ScrollView>
      )}
    </View>
  );
}
