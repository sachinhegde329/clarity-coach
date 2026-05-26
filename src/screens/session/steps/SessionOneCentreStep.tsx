import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel, PrimaryButton } from "../../../design-system/primitives";
import { palette, spacing, type } from "../../../design-system/theme";
import type { CentreData } from "../../../data/mockData";
import { UNLOCK_ALL_FOR_TESTING } from "../constants";

const INHALE_MS = 4000;
const EXHALE_MS = 6000;
const TOTAL_MS = 30000;
const ORB_SIZE = 176;
const MIDDLE_RING = 260;
const OUTER_RING = 320;
const CORNER_RADIUS = 12;

export function SessionOneCentreStep({
  content,
  summary,
  onContinue,
}: {
  content: CentreData;
  summary?: string;
  onSkip?: () => void;
  onContinue: () => void;
}) {
  const [breathCycle, setBreathCycle] = useState(0);
  const [insightVisible, setInsightVisible] = useState(false);
  const [breathComplete, setBreathComplete] = useState(false);

  const breath = useRef(new Animated.Value(0)).current;
  const insightOpacity = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(true);
  const elapsedSecondsRef = useRef(0);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const secondTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animatePhase = (phase: "inhale" | "exhale") => {
    Animated.timing(breath, {
      toValue: phase === "inhale" ? 1 : 0,
      duration: phase === "inhale" ? INHALE_MS : EXHALE_MS,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
      isInteraction: false,
    }).start();

    phaseTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      animatePhase(phase === "inhale" ? "exhale" : "inhale");
    }, phase === "inhale" ? INHALE_MS : EXHALE_MS);
  };

  useEffect(() => {
    mountedRef.current = true;
    elapsedSecondsRef.current = 0;
    setBreathComplete(false);
    setInsightVisible(false);
    insightOpacity.setValue(0);
    breath.setValue(0);
    animatePhase("inhale");

    secondTimerRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      elapsedSecondsRef.current += 1;
      setBreathCycle((current) => (current + 1) % 10);

      if (elapsedSecondsRef.current === 4) {
        setInsightVisible(true);
        Animated.timing(insightOpacity, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
      }
    }, 1000);

    totalTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setBreathComplete(true);
    }, TOTAL_MS);

    return () => {
      mountedRef.current = false;
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (secondTimerRef.current) clearInterval(secondTimerRef.current);
      if (totalTimerRef.current) clearTimeout(totalTimerRef.current);
      breath.stopAnimation();
    };
  }, [breath, insightOpacity]);

  const isInhale = breathCycle < 4;
  const breathPrompt = isInhale ? "Breathe in..." : "Breathe out...";

  const orbStyle = {
    transform: [
      {
        scale: breath.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.1],
        }),
      },
    ],
    shadowOpacity: breath.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 0.2],
    }),
    shadowRadius: breath.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 40],
    }),
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerZone}>
        <DisplayText style={styles.title}>Centre</DisplayText>
        <BodyText style={styles.subtitle}>{content.title}</BodyText>
      </View>

      <View style={styles.breathZone}>
        <View style={styles.ringField}>
          <View style={styles.outerRing} />
          <View style={styles.middleRing} />
          <Animated.View style={[styles.orb, orbStyle]}>
            <View style={styles.orbCore} />
          </Animated.View>
        </View>

        {content.underOrbMeta ? (
          <MonoText style={styles.underOrbMeta}>{content.underOrbMeta}</MonoText>
        ) : null}

        <View style={styles.promptBlock}>
          <BodyText style={[styles.breathPrompt, { opacity: isInhale ? 1 : 0.7 }]}>{breathPrompt}</BodyText>
          {insightVisible ? (
            <Animated.Text style={[styles.insightText, { opacity: insightOpacity }]}>
              {content.onScreenLines?.[1] ?? content.onScreenLines?.[0] ?? "There is no wrong answer here."}
            </Animated.Text>
          ) : (
            <View style={styles.insightPlaceholder} />
          )}
        </View>
      </View>

      <Panel tone="soft" style={styles.framingPanel}>
        {summary ? <BodyText style={styles.framingLead}>{summary}</BodyText> : null}
        {(content.onScreenLines ?? []).map((line) => (
          <BodyText key={line} style={styles.framingBody}>{line}</BodyText>
        ))}
        <BodyText style={styles.framingQuote}>{content.underOrbMeta ?? content.quote}</BodyText>
      </Panel>

      <PrimaryButton
        label={breathComplete || UNLOCK_ALL_FOR_TESTING ? "NEXT" : "SETTLE IN"}
        onPress={onContinue}
        disabled={!breathComplete && !UNLOCK_ALL_FOR_TESTING}
        inverted={!breathComplete && !UNLOCK_ALL_FOR_TESTING}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    alignItems: "stretch",
    gap: spacing.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  headerZone: {
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1.2,
    textTransform: "uppercase",
    textAlign: "center",
    color: palette.line,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    color: palette.inkMuted,
    maxWidth: 340,
  },
  breathZone: {
    alignItems: "center",
    gap: 96,
    paddingVertical: spacing.md,
  },
  ringField: {
    width: OUTER_RING,
    height: OUTER_RING,
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    position: "absolute",
    width: OUTER_RING,
    height: OUTER_RING,
    borderRadius: CORNER_RADIUS,
    borderWidth: 1,
    borderColor: palette.line,
    opacity: 0.1,
  },
  middleRing: {
    position: "absolute",
    width: MIDDLE_RING,
    height: MIDDLE_RING,
    borderRadius: CORNER_RADIUS,
    borderWidth: 1,
    borderColor: palette.line,
    opacity: 0.05,
  },
  orb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: CORNER_RADIUS,
    backgroundColor: palette.line,
    borderWidth: 2,
    borderColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.line,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  orbCore: {
    width: 12,
    height: 12,
    borderRadius: 0,
    backgroundColor: palette.paper,
    opacity: 0.35,
  },
  promptBlock: {
    alignItems: "center",
    minHeight: 88,
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  underOrbMeta: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: palette.lineSoft,
    textAlign: "center",
    textTransform: "uppercase",
  },
  breathPrompt: {
    fontFamily: type.bodyMedium,
    fontSize: 24,
    lineHeight: 32,
    color: palette.ink,
    textAlign: "center",
  },
  insightText: {
    fontFamily: type.body,
    fontSize: 18,
    lineHeight: 28,
    color: palette.inkMuted,
    fontStyle: "italic",
    textAlign: "center",
    maxWidth: 280,
  },
  insightPlaceholder: {
    height: 28,
  },
  framingPanel: {
    gap: spacing.sm,
  },
  framingLead: {
    fontFamily: type.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
    color: palette.ink,
    textAlign: "center",
  },
  framingBody: {
    fontSize: 15,
    lineHeight: 24,
    color: palette.inkMuted,
    textAlign: "center",
  },
  framingQuote: {
    fontSize: 14,
    lineHeight: 22,
    color: palette.inkMuted,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
