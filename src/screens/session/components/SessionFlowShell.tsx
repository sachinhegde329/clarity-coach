import React, { ReactNode } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import type { SessionDefinition, SessionStage } from "../../../data/mockData";
import { styles } from "../sessionFlowStyles";
import { SessionUnifiedHeader } from "./SessionUnifiedHeader";
import { SessionStageTitle } from "./SessionStageTitle";
import { SESSION_STEP_COUNT } from "../constants";
import { usesUnifiedShell } from "../flow/sessionStageRouter";

type SessionFlowShellProps = {
  sessionNumber: number;
  session: SessionDefinition;
  stage: SessionStage;
  stepIndex: number;
  children: ReactNode;
  variant?: "default" | "breathe";
  hideHeader?: boolean;
  hideStageDetails?: boolean;
  scrollContentStyle?: StyleProp<ViewStyle>;
  breathElapsed?: number;
  isBreathRunning?: boolean;
  onBack: () => void;
  onExit: () => void;
  onJumpToStep: (stepIndex: number) => void;
};

export function SessionFlowShell({
  sessionNumber,
  session,
  stage,
  stepIndex,
  children,
  variant = "default",
  hideHeader = false,
  hideStageDetails = false,
  scrollContentStyle,
  onBack,
  onExit,
  onJumpToStep,
}: SessionFlowShellProps) {
  const isBreathe = variant === "breathe";
  const activeStepIndex = isBreathe ? 0 : stepIndex;
  const stageKey = `${sessionNumber}-${stage}`;
  const usesUnifiedDesign = usesUnifiedShell(sessionNumber);

  return (
    <View style={[styles.screen, isBreathe && styles.breatheScreen]}>
      {!hideHeader ? (
        <SessionUnifiedHeader
          activeIndex={activeStepIndex}
          maxUnlockedIndex={SESSION_STEP_COUNT - 1}
          onSelectStep={onJumpToStep}
          onBack={onBack}
          onExit={onExit}
        />
      ) : null}

      {hideHeader ? (
          <View key={stageKey} style={[{ flex: 1 }, scrollContentStyle]}>
            {children}
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
            {usesUnifiedDesign && !hideStageDetails ? (
              <View style={styles.unifiedStageTitleWrap}>
                <SessionStageTitle sessionNumber={sessionNumber} stepIndex={activeStepIndex} stage={stage} />
              </View>
            ) : null}
            {children}
          </ScrollView>
        )}
    </View>
  );
}
