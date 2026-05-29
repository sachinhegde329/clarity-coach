import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { BodyText, PrimaryButton } from "../../../design-system/primitives";
import { palette, spacing, type } from "../../../design-system/theme";
import { InteractivePressable } from "../../../design-system/motion";
import type { CentreData } from "../../../data/mockData";

const INHALE_MS = 4000;
const EXHALE_MS = 6000;
const TOTAL_MS = 30000;
const ORB_SIZE = 256;

type BreathPhase = "inhale" | "exhale";

const RADIUS_REST = {
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0,
};

const RADIUS_PEAK = {
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0,
};

export function SessionTwoCentreStep({
  content,
  onSkip,
  onContinue,
}: {
  content?: CentreData;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [continueReady, setContinueReady] = useState(false);
  const [skipHinted, setSkipHinted] = useState(false);

  const breath = useRef(new Animated.Value(0)).current;
  const innerPulse = useRef(new Animated.Value(0.35)).current;
  const sessionProgress = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(true);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animatePhase = (nextPhase: BreathPhase) => {
    setPhase(nextPhase);
    Animated.timing(breath, {
      toValue: nextPhase === "inhale" ? 1 : 0,
      duration: nextPhase === "inhale" ? INHALE_MS : EXHALE_MS,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
      isInteraction: false,
    }).start();

    phaseTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      animatePhase(nextPhase === "inhale" ? "exhale" : "inhale");
    }, nextPhase === "inhale" ? INHALE_MS : EXHALE_MS);
  };

  useEffect(() => {
    mountedRef.current = true;
    breath.setValue(0);
    animatePhase("inhale");

    Animated.loop(
      Animated.sequence([
        Animated.timing(innerPulse, { toValue: 0.65, duration: 1800, useNativeDriver: true }),
        Animated.timing(innerPulse, { toValue: 0.35, duration: 1800, useNativeDriver: true }),
      ]),
    ).start();

    Animated.timing(sessionProgress, {
      toValue: 1,
      duration: TOTAL_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    totalTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setContinueReady(true);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    }, TOTAL_MS);

    hintTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setSkipHinted(true);
    }, 12000);

    return () => {
      mountedRef.current = false;
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (totalTimerRef.current) clearTimeout(totalTimerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      breath.stopAnimation();
      innerPulse.stopAnimation();
      sessionProgress.stopAnimation();
    };
  }, [breath, innerPulse, sessionProgress]);

  const orbStyle = {
    width: ORB_SIZE,
    height: ORB_SIZE,
    transform: [
      {
        scale: breath.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1.1],
        }),
      },
    ],
    borderTopLeftRadius: breath.interpolate({
      inputRange: [0, 1],
      outputRange: [RADIUS_REST.borderTopLeftRadius, RADIUS_PEAK.borderTopLeftRadius],
    }),
    borderTopRightRadius: breath.interpolate({
      inputRange: [0, 1],
      outputRange: [RADIUS_REST.borderTopRightRadius, RADIUS_PEAK.borderTopRightRadius],
    }),
    borderBottomRightRadius: breath.interpolate({
      inputRange: [0, 1],
      outputRange: [RADIUS_REST.borderBottomRightRadius, RADIUS_PEAK.borderBottomRightRadius],
    }),
    borderBottomLeftRadius: breath.interpolate({
      inputRange: [0, 1],
      outputRange: [RADIUS_REST.borderBottomLeftRadius, RADIUS_PEAK.borderBottomLeftRadius],
    }),
    shadowOpacity: breath.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 0.38],
    }),
    shadowRadius: breath.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 28],
    }),
  };

  const progressWidth = sessionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const activeLabel = phase === "inhale" ? "Breathe in..." : "Breathe out...";

  return (
    <View style={styles.screen}>
      <View style={styles.heroCopy}>
        <Text style={styles.title}>{content?.title ?? "Inhale four. Exhale six."}</Text>
        <BodyText style={styles.body}>{content?.onScreenLines?.[0] ?? content?.quote ?? "Feel the difference between rushed and measured."}</BodyText>
      </View>

      <View style={styles.canvas}>
        <View style={styles.ghostFrame} />
        <Animated.View style={[styles.orb, orbStyle]}>
          <View style={styles.orbGradientHighlight} />
          <View style={styles.orbGradientBase} />
          <Animated.View style={[styles.orbInnerRing, { opacity: innerPulse }]} />
        </Animated.View>

        <View pointerEvents="none" style={styles.instructionOverlay}>
          <View style={styles.labelPill}>
            <Text style={styles.labelText}>{activeLabel}</Text>
          </View>
          <View style={styles.timerRow}>
            <View style={[styles.timerPill, phase === "inhale" ? styles.timerPillActive : styles.timerPillIdle]}>
              <Text style={[styles.timerText, phase === "inhale" ? styles.timerTextActive : styles.timerTextIdle]}>4s In</Text>
            </View>
            <View style={[styles.timerPill, phase === "exhale" ? styles.timerPillActive : styles.timerPillIdle]}>
              <Text style={[styles.timerText, phase === "exhale" ? styles.timerTextActive : styles.timerTextIdle]}>6s Out</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <View style={styles.actionRow}>
        <PrimaryButton
          label={continueReady ? "CONTINUE" : "SETTLE IN"}
          onPress={continueReady ? onContinue : () => undefined}
          inverted={!continueReady}
        />
      </View>

      <InteractivePressable onPress={onSkip} style={[styles.skip, skipHinted && styles.skipVisible]}>
        <Text style={styles.skipText}>Skip</Text>
      </InteractivePressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    minHeight: 560,
    alignItems: "center",
    gap: spacing.md,
  },
  heroCopy: {
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  title: {
    fontFamily: type.display,
    fontSize: 32,
    lineHeight: 38,
    color: palette.line,
    textAlign: "center",
    letterSpacing: -0.6,
    fontWeight: "700",
  },
  body: {
    maxWidth: 340,
    textAlign: "center",
    color: palette.inkMuted,
    fontSize: 18,
    lineHeight: 28,
  },
  canvas: {
    width: "100%",
    maxWidth: 360,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostFrame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderRadius: 0,
    borderColor: palette.line,
    opacity: 0.1,
  },
  orb: {
    backgroundColor: "#7C2D12",
    shadowColor: "#7C2D12",
    shadowOffset: { width: 0, height: 8 },
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  orbGradientHighlight: {
    position: "absolute",
    width: ORB_SIZE * 0.55,
    height: ORB_SIZE * 0.55,
    borderRadius: 0,
    backgroundColor: "#ff9b7b",
    top: ORB_SIZE * 0.08,
    left: ORB_SIZE * 0.12,
    opacity: 0.85,
  },
  orbGradientBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(94, 23, 0, 0.35)",
  },
  orbInnerRing: {
    position: "absolute",
    top: 16,
    right: 16,
    bottom: 16,
    left: 16,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "rgba(253, 249, 245, 0.35)",
  },
  instructionOverlay: {
    position: "absolute",
    alignItems: "center",
    gap: spacing.md,
  },
  labelPill: {
    backgroundColor: "rgba(253, 249, 245, 0.92)",
    borderWidth: 2,
    borderColor: palette.line,
    borderRadius: 0,
    paddingHorizontal: 24,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  labelText: {
    fontFamily: type.display,
    fontSize: 24,
    lineHeight: 28,
    color: palette.line,
    fontWeight: "600",
  },
  timerRow: {
    flexDirection: "row",
    gap: 8,
  },
  timerPill: {
    borderWidth: 2,
    borderColor: palette.line,
    borderRadius: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timerPillActive: {
    backgroundColor: palette.line,
  },
  timerPillIdle: {
    backgroundColor: "transparent",
  },
  timerText: {
    fontFamily: type.mono,
    fontSize: 14,
  },
  timerTextActive: {
    color: palette.paper,
  },
  timerTextIdle: {
    color: palette.line,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: palette.panelSoft,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: palette.line,
  },
  actionRow: {
    width: "100%",
    paddingTop: spacing.sm,
  },
  skip: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    opacity: 0.16,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  skipVisible: {
    opacity: 0.28,
  },
  skipText: {
    fontFamily: type.body,
    fontSize: 14,
    color: palette.inkMuted,
  },
});
