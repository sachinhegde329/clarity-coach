import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, StyleProp, View, ViewStyle } from "react-native";
import type { SessionDefinition, SessionStage } from "../../../data/mockData";
import { styles } from "../sessionFlowStyles";
import { SessionUnifiedHeader } from "./SessionUnifiedHeader";
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
  scrollContentStyle?: StyleProp<ViewStyle>;
  breathElapsed?: number;
  isBreathRunning?: boolean;
  onBack: () => void;
  onExit: () => void;
  onJumpToStep: (stepIndex: number) => void;
  transitionDirection: "forward" | "backward" | "none";
};

export function SessionFlowShell({
  sessionNumber,
  session,
  stage,
  stepIndex,
  children,
  variant = "default",
  hideHeader = false,
  scrollContentStyle,
  onBack,
  onExit,
  onJumpToStep,
  transitionDirection,
}: SessionFlowShellProps) {
  const isBreathe = variant === "breathe";
  const activeStepIndex = isBreathe ? 0 : stepIndex;
  const stageKey = `${sessionNumber}-${stage}`;
  const usesUnifiedDesign = usesUnifiedShell(sessionNumber);
  const stageStepName = session.stages[stage]?.stepName;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const exitFadeAnim = useRef(new Animated.Value(1)).current;
  const exitSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const isForward = transitionDirection === "forward";
    const isBackward = transitionDirection === "backward";
    const slideOffset = isForward ? 60 : isBackward ? -60 : 24;
    const exitSlideOffset = isForward ? -40 : isBackward ? 40 : 0;

    // Reset entrance values
    fadeAnim.setValue(0);
    slideAnim.setValue(slideOffset);
    scaleAnim.setValue(0.97);

    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Exit animation for previous content
    if (transitionDirection !== "none") {
      exitFadeAnim.setValue(1);
      exitSlideAnim.setValue(0);
      Animated.parallel([
        Animated.timing(exitFadeAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(exitSlideAnim, {
          toValue: exitSlideOffset,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [stageKey, fadeAnim, slideAnim, scaleAnim, exitFadeAnim, exitSlideAnim, transitionDirection]);

  const animatedChildren = (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }, { scale: scaleAnim }], flex: 1 }}>
      {children}
    </Animated.View>
  );

  return (
    <View style={[styles.screen, isBreathe && styles.breatheScreen]}>
      {!hideHeader ? (
        <SessionUnifiedHeader
          stepName={stageStepName}
          activeIndex={activeStepIndex}
          maxUnlockedIndex={SESSION_STEP_COUNT - 1}
          onSelectStep={onJumpToStep}
          onBack={onBack}
          onExit={onExit}
          transitionDirection={transitionDirection}
        />
      ) : null}

      {hideHeader ? (
          <View key={stageKey} style={[{ flex: 1 }, scrollContentStyle]}>
            {animatedChildren}
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
            {animatedChildren}
          </ScrollView>
        )}
    </View>
  );
}
