import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, AppState, Easing, StyleSheet, Text, Vibration, View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel, PrimaryButton } from "../../../design-system/primitives";
import { Icon } from "../../../design-system/icons";
import { palette, spacing, type } from "../../../design-system/theme";
import { InteractivePressable } from "../../../design-system/motion";
import { styles as flowStyles } from "../sessionFlowStyles";
import { SessionButton } from "../components/SessionButton";
import { centreBeginLabel } from "../unified/sessionScreenConfig";
import { usesUnifiedShell } from "../flow/sessionStageRouter";
import { DottedStageBackground } from "../components/DottedStageBackground";

type CentreType = "breathing" | "affirmation" | "vocal" | "pause";

type CentreTimingConfig = {
  totalMs?: number;
  settleMs?: number;
  phaseMs?: number;
  microPauseMs?: number;
  haptics?: boolean;
};

export type CentreConfig = {
  type: CentreType;
  patternSeconds?: number[];
  phaseLabels?: string[];
  exhaleDrift?: boolean;
  organicOrb?: boolean;
  organicOrbVariant?: "session1" | "session2";
  framingText: string;
  textSequence?: string[];
  timingConfig?: CentreTimingConfig;
};

type CentreState = "INITIAL_RENDER" | "SETTLING" | "GUIDED_ACTIVITY" | "COMPLETION" | "AUTO_ADVANCE";

const DEFAULT_TIMING: Required<CentreTimingConfig> = {
  totalMs: 30_000,
  settleMs: 5_000,
  phaseMs: 4_000,
  microPauseMs: 300,
  haptics: false,
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * clamp01(t)) - 1) / 2;
}

export function CentreStep({
  config,
  sessionNumber,
  onSkip,
  onContinue,
}: {
  config: CentreConfig;
  sessionNumber?: number;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const unifiedDesign = usesUnifiedShell(sessionNumber);
  const timing = { ...DEFAULT_TIMING, ...(config.timingConfig ?? {}) };
  const [centreState, setCentreState] = useState<CentreState>("INITIAL_RENDER");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [skipHinted, setSkipHinted] = useState(false);
  const [continueReady, setContinueReady] = useState(false);
  const [session2Phase, setSession2Phase] = useState<"inhale" | "exhale">("inhale");

  const startedAtMs = useRef<number | null>(null);
  const accumulatedPausedMs = useRef(0);
  const pausedAtMs = useRef<number | null>(null);
  const lastPhaseIndex = useRef<number | null>(null);
  const guidedStartElapsedMs = useRef<number | null>(null);

  const organicProgress = useRef(new Animated.Value(0)).current;
  const organicArrive = useRef(new Animated.Value(0)).current;
  const organicInstructionOpacity = useRef(new Animated.Value(0)).current;
  const organicLoop = useRef<Animated.CompositeAnimation | null>(null);
  const session2PhaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    startedAtMs.current = Date.now();
    setCentreState("SETTLING");

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "background" || state === "inactive") {
        pausedAtMs.current = Date.now();
      } else if (state === "active") {
        if (pausedAtMs.current !== null) {
          accumulatedPausedMs.current += Date.now() - pausedAtMs.current;
          pausedAtMs.current = null;
        }
      }
    });

    const tick = setInterval(() => setNowMs(Date.now()), 50);
    const hint = setTimeout(() => setSkipHinted(true), 12_000);

    return () => {
      sub.remove();
      clearInterval(tick);
      clearTimeout(hint);
      organicLoop.current?.stop();
      if (session2PhaseTimer.current) {
        clearTimeout(session2PhaseTimer.current);
      }
    };
  }, []);

  const elapsedMs = useMemo(() => {
    if (startedAtMs.current === null) return 0;
    const pauseDelta = pausedAtMs.current ? Date.now() - pausedAtMs.current : 0;
    return Math.max(0, nowMs - startedAtMs.current - accumulatedPausedMs.current - pauseDelta);
  }, [nowMs]);

  useEffect(() => {
    if (centreState === "SETTLING" && elapsedMs >= timing.settleMs) {
      if (guidedStartElapsedMs.current === null) {
        guidedStartElapsedMs.current = elapsedMs;
      }
      setCentreState("GUIDED_ACTIVITY");
    }
    if (centreState === "GUIDED_ACTIVITY" && elapsedMs >= timing.totalMs) {
      setCentreState("COMPLETION");
    }
    if (centreState === "COMPLETION") {
      setContinueReady(true);
      setCentreState("AUTO_ADVANCE");
    }
  }, [centreState, elapsedMs, timing.settleMs, timing.totalMs]);

  useEffect(() => {
    if (!config.organicOrb) return;
    if (centreState !== "SETTLING") return;

    Animated.timing(organicArrive, {
      toValue: 1,
      duration: timing.settleMs,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [centreState, config.organicOrb, organicArrive, timing.settleMs]);

  useEffect(() => {
    if (!config.organicOrb) return;
    if (centreState !== "GUIDED_ACTIVITY") return;

    const inhaleMs = (config.patternSeconds?.[0] ?? 4) * 1000;
    const exhaleMs = (config.patternSeconds?.[1] ?? 6) * 1000;
    const isSession2 = config.organicOrbVariant === "session2";
    const microPause = isSession2 ? 0 : timing.microPauseMs;

    // Always start from "exhale/base" so the first animation is a clean inhale.
    organicProgress.stopAnimation();
    organicProgress.setValue(0);

    if (isSession2) {
      setSession2Phase("inhale");

      const runSession2Loop = (phase: "inhale" | "exhale") => {
        setSession2Phase(phase);
        Animated.timing(organicProgress, {
          toValue: phase === "inhale" ? 1 : 0,
          duration: phase === "inhale" ? inhaleMs : exhaleMs,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
          isInteraction: false,
        }).start();

        session2PhaseTimer.current = setTimeout(() => {
          runSession2Loop(phase === "inhale" ? "exhale" : "inhale");
        }, phase === "inhale" ? inhaleMs : exhaleMs);
      };

      runSession2Loop("inhale");

      return () => {
        if (session2PhaseTimer.current) {
          clearTimeout(session2PhaseTimer.current);
        }
      };
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(organicProgress, {
          toValue: 1,
          duration: inhaleMs,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
          isInteraction: false,
        }),
        Animated.timing(organicProgress, {
          toValue: 0,
          duration: exhaleMs,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
          isInteraction: false,
        }),
        microPause ? Animated.delay(microPause) : Animated.delay(0),
      ]),
    );

    organicLoop.current = loop;
    loop.start();

    return () => loop.stop();
  }, [centreState, config.organicOrb, config.patternSeconds, organicProgress, timing.microPauseMs]);

  const opacity = useMemo(() => {
    if (centreState === "INITIAL_RENDER") return 0;
    if (centreState === "SETTLING") return easeInOutSine(elapsedMs / timing.settleMs);
    return 1;
  }, [centreState, elapsedMs, timing.settleMs]);

  const breathing = config.type === "breathing";
  const guidedElapsedMs = useMemo(() => {
    if (guidedStartElapsedMs.current === null) return 0;
    return Math.max(0, elapsedMs - guidedStartElapsedMs.current);
  }, [elapsedMs]);
  const patternSeconds = breathing
    ? config.patternSeconds?.length
      ? config.patternSeconds
      : [4, 4, 4, 4]
    : [];
  const patternMs = patternSeconds.map((value) => Math.max(1, value) * 1000);
  const cycleMs = patternMs.reduce((sum, value) => sum + value, 0) || timing.phaseMs * 4;
  const inCycleMs = breathing ? (guidedElapsedMs + cycleMs) % cycleMs : 0;
  const phaseIndex = breathing ? getPhaseIndex({ inCycleMs, patternMs }) : 0;

  useEffect(() => {
    if (!breathing || centreState !== "GUIDED_ACTIVITY") return;
    if (lastPhaseIndex.current === null) {
      lastPhaseIndex.current = phaseIndex;
      return;
    }
    if (lastPhaseIndex.current !== phaseIndex) {
      lastPhaseIndex.current = phaseIndex;
      if (timing.haptics) {
        Vibration.vibrate(8);
      }
    }
  }, [breathing, centreState, phaseIndex, timing.haptics]);

  const instruction = useMemo(() => {
    if (centreState === "SETTLING") return "Let your breath slow down.";
    if (config.type === "pause") return "Hold. This silence is not empty.";
    if (config.type === "affirmation") {
      const seq = config.textSequence?.length ? config.textSequence : ["There is no wrong answer here.", "You are not performing.", "You are observing."];
      const index = Math.floor(guidedElapsedMs / 5_000) % seq.length;
      return seq[index]!;
    }
    if (config.type === "vocal") return "Say your name softly. Then at your normal voice.";

    if (breathing) {
      if (config.organicOrbVariant === "session2") {
        return session2Phase === "inhale" ? "Breathe in..." : "Breathe out...";
      }
      const labels = config.phaseLabels?.length ? config.phaseLabels : defaultLabelsForPattern(patternSeconds.length);
      return labels[Math.min(labels.length - 1, phaseIndex)] ?? "Breathe…";
    }
    return "Breathe…";
  }, [centreState, config.type, config.textSequence, config.organicOrbVariant, guidedElapsedMs, phaseIndex, patternSeconds.length, session2Phase]);

  useEffect(() => {
    if (!config.organicOrb) return;
    if (centreState !== "GUIDED_ACTIVITY") return;

    organicInstructionOpacity.stopAnimation();
    organicInstructionOpacity.setValue(0);
    Animated.timing(organicInstructionOpacity, {
      toValue: 0.6,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [centreState, config.organicOrb, instruction, organicInstructionOpacity]);

  const orbScale = useMemo(() => {
    if (!breathing) return 1;
    const phaseMs = patternMs[phaseIndex] ?? timing.phaseMs;
    const phaseProgress = getPhaseProgress({ inCycleMs, patternMs, phaseIndex }) / phaseMs;
    const eased = easeInOutSine(phaseProgress);
    const inhaleIndex = 0;
    const exhaleIndex = patternSeconds.length === 2 ? 1 : 2;

    if (phaseIndex === inhaleIndex) return 1.0 + eased * 0.4;
    if (phaseIndex === exhaleIndex) return 1.4 - eased * 0.4;
    return 1.4;
  }, [breathing, inCycleMs, patternMs, patternSeconds.length, phaseIndex, timing.phaseMs]);

  const orbOpacity = useMemo(() => {
    if (!breathing) return 1;
    const phaseMs = patternMs[phaseIndex] ?? timing.phaseMs;
    const phaseProgress = getPhaseProgress({ inCycleMs, patternMs, phaseIndex }) / phaseMs;
    const eased = easeInOutSine(phaseProgress);
    const inhaleIndex = 0;
    const exhaleIndex = patternSeconds.length === 2 ? 1 : 2;

    if (phaseIndex === inhaleIndex) return 0.3 + eased * 0.3;
    if (phaseIndex === exhaleIndex) return 0.6 - eased * 0.3;
    return 0.6;
  }, [breathing, inCycleMs, patternMs, patternSeconds.length, phaseIndex, timing.phaseMs]);

  const exhaleDrift = useMemo(() => {
    if (!breathing || !config.exhaleDrift) return 0;
    const exhaleIndex = patternSeconds.length === 2 ? 1 : 2;
    if (phaseIndex !== exhaleIndex) return 0;
    const phaseMs = patternMs[phaseIndex] ?? timing.phaseMs;
    const phaseProgress = getPhaseProgress({ inCycleMs, patternMs, phaseIndex }) / phaseMs;
    return Math.round(easeInOutSine(phaseProgress) * 10);
  }, [breathing, config.exhaleDrift, inCycleMs, patternMs, patternSeconds.length, phaseIndex, timing.phaseMs]);

  const quietPulse = useMemo(() => {
    const t = guidedElapsedMs;
    const period = 4000;
    const phase = (t % period) / period;
    return 0.92 + easeInOutSine(phase) * 0.1;
  }, [guidedElapsedMs]);

  const instructionLines = useMemo(() => {
    const lines = config.framingText.split("\n").map((line) => line.trim()).filter(Boolean);
    return lines.length ? lines : [config.framingText];
  }, [config.framingText]);

  if (unifiedDesign) {
    const primaryLine = instructionLines[0] ?? config.framingText;
    const secondaryLines = instructionLines.slice(1).join(" ");
    const sn = sessionNumber ?? 1;

    if (sn === 6) {
      const centreCopy = config.framingText.split("\n").map((l) => l.trim()).filter(Boolean);
      const stepLabel = centreCopy[0] ?? "Today, you are the audience.";
      const lineA = centreCopy[1] ?? "Today, no recording. Just listening.";
      const lineB = centreCopy[2] ?? "Hear the baseline and Session 5 with the attention you would give a colleague.";
      const protocol = centreCopy[3] ?? "No speaking from you in this Centre. Sustained attention to one's own voice is the skill being trained.";
      return (
        <View style={[styles.wrap, styles.unifiedWrap]}>
          <View style={{ width: "100%", gap: spacing.lg }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Icon name="back" size={18} color={palette.line} />
              <MonoText style={{ color: palette.line, letterSpacing: 1 }}>01 / 05 · CENTRE</MonoText>
              <View style={{ width: 18, height: 18 }} />
            </View>

            <View style={[flowStyles.brutalistPanel, flowStyles.brutalistShadowInk, { paddingVertical: spacing.md }]}>
              <MonoText style={{ color: palette.line, letterSpacing: 2, textAlign: "center" }}>
                SPRINT 01 NOTICE - SITTING WITH EVIDENCE
              </MonoText>
            </View>

            <View style={{ alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.sm }}>
              <DisplayText style={{ fontSize: 46, lineHeight: 50, textAlign: "center" }}>{stepLabel}</DisplayText>
              <BodyText style={{ textAlign: "center", color: palette.inkMuted, fontSize: 18, lineHeight: 28 }}>
                {lineA}
              </BodyText>
              <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 26 }}>
                {lineB}
              </BodyText>
            </View>

            <View style={[flowStyles.brutalistPanel, flowStyles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.45)" }]}>
              <View style={{ position: "absolute", top: -10, left: spacing.md, paddingHorizontal: spacing.sm, backgroundColor: "#FDF6E3" }}>
                <MonoText style={{ color: palette.line, letterSpacing: 2 }}>PROTOCOL NOTE</MonoText>
              </View>
              <BodyText style={{ color: palette.inkMuted, fontFamily: type.mono, lineHeight: 24 }}>
                {protocol}
              </BodyText>
            </View>
          </View>

          <SessionButton
            label={centreBeginLabel(sn, continueReady)}
            onPress={continueReady ? onContinue : () => undefined}
            disabled={!continueReady}
          />
        </View>
      );
    }

    if (sn === 7) {
      return (
        <View style={[styles.wrap, styles.unifiedWrap]}>
          <View style={{ width: "100%", gap: spacing.lg }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <MonoText style={{ color: palette.line, letterSpacing: 2, fontSize: 10 }}>CLARITY COACH</MonoText>
              <View style={[flowStyles.outlineBadge, { borderColor: palette.lineSoft }]}>
                <MonoText style={[flowStyles.outlineBadgeText, { color: palette.inkMuted }]}>STEP 01/05</MonoText>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 6 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 8,
                    borderWidth: 1,
                    borderColor: palette.lineSoft,
                    backgroundColor: i === 0 ? palette.line : "transparent",
                  }}
                />
              ))}
            </View>

            <View style={{ alignItems: "center", gap: spacing.md }}>
              <View style={[flowStyles.doConstraintBadge, { backgroundColor: palette.black }]}>
                <MonoText style={flowStyles.doConstraintBadgeText}>PHASE 01: CENTRE</MonoText>
              </View>
              <DisplayText style={{ fontSize: 44, lineHeight: 48, textAlign: "center" }}>
                YOU ARE ABOUT TO{"\n"}TRY SOMETHING{"\n"}HARD. SETTLE IN.
              </DisplayText>
            </View>

            <View style={[flowStyles.brutalistPanelInk, flowStyles.brutalistShadowInk, { paddingVertical: spacing.xl }]}>
              <BodyText style={{ textAlign: "center", color: palette.inkMuted, fontStyle: "italic", lineHeight: 28 }}>
                “The next sixty seconds will feel unnatural. That is the point.”
              </BodyText>
              <View style={{ height: 1, backgroundColor: palette.lineSoft, marginVertical: spacing.md }} />
              <MonoText style={{ textAlign: "center", color: palette.inkMuted, letterSpacing: 2 }}>
                CONSTRAINTS FEEL LIKE RESTRAINT.{"\n"}THEY ARE TRAINING.
              </MonoText>
            </View>

            <SessionButton
              label={centreBeginLabel(sn, continueReady)}
              onPress={continueReady ? onContinue : () => undefined}
              disabled={!continueReady}
              style={{ alignSelf: "center", maxWidth: 260 }}
            />

            <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.xl, paddingTop: spacing.lg }}>
              {["BREATH IN", "HOLD", "BREATH OUT"].map((label) => (
                <View key={label} style={{ alignItems: "center", gap: 8 }}>
                  <View style={{ width: 3, height: 34, backgroundColor: label === "HOLD" ? palette.line : palette.lineSoft }} />
                  <MonoText style={{ color: label === "HOLD" ? palette.line : palette.inkMuted, fontSize: 10, letterSpacing: 1 }}>
                    {label}
                  </MonoText>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    }

    if (sn === 8) {
      return (
        <View style={[styles.wrap, styles.unifiedWrap]}>
          <View style={{ width: "100%", gap: spacing.lg }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={[flowStyles.outlineBadge, { borderColor: palette.lineSoft }]}>
                <Icon name="back" size={16} color={palette.line} />
              </View>
              <MonoText style={{ color: palette.line, letterSpacing: 1 }}>01 / 05</MonoText>
              <MonoText style={{ color: palette.line, letterSpacing: 1 }}>CENTRE</MonoText>
            </View>

            <View style={{ gap: spacing.md }}>
              <View style={{ width: 84, height: 10, backgroundColor: palette.line, alignSelf: "flex-start" }} />
              <MonoText style={{ color: palette.line, letterSpacing: 1 }}>PACE SETS THE CADENCE</MonoText>
              <View style={{ borderLeftWidth: 4, borderLeftColor: palette.black, paddingLeft: spacing.md, gap: spacing.md }}>
                <BodyText style={{ fontSize: 22, lineHeight: 34 }}>
                  Three breaths at the tempo you want to speak.
                </BodyText>
                <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>
                  Breath cadence sets speech cadence. Slow the first; the second follows.
                </BodyText>
              </View>
            </View>

            <View style={[flowStyles.brutalistPanelInk, flowStyles.brutalistShadowInk, { padding: spacing.lg }]}>
              <BodyText style={{ fontSize: 20, lineHeight: 30 }}>
                Three slow cycles before the recording. The diaphragmatic pattern carries into the first thirty seconds of speech.
              </BodyText>
            </View>
          </View>

          <SessionButton
            label={centreBeginLabel(sn, continueReady)}
            onPress={continueReady ? onContinue : () => undefined}
            disabled={!continueReady}
          />
        </View>
      );
    }

    if (sn === 9) {
      return (
        <View style={[styles.wrap, styles.unifiedWrap]}>
          <View style={{ width: "100%", gap: spacing.lg, alignItems: "center" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <Icon name="back" size={18} color={palette.line} />
              <MonoText style={{ color: palette.line, letterSpacing: 1 }}>01 / 05</MonoText>
              <Icon name="close" size={18} color={palette.line} />
            </View>

            <View style={[flowStyles.outlineBadge, { borderColor: palette.lineSoft }]}>
              <MonoText style={[flowStyles.outlineBadgeText, { color: palette.line }]}>CENTRE</MonoText>
            </View>
            <DisplayText style={{ fontSize: 46, lineHeight: 50, textAlign: "center" }}>BOX BREATHING.</DisplayText>

            <View style={{ width: 280, height: 280, alignItems: "center", justifyContent: "center" }}>
              <View style={{ position: "absolute", width: 280, height: 280, borderRadius: 0, borderWidth: 6, borderColor: palette.line }} />
              <View style={[flowStyles.brutalistPanelInk, { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 0 }]}>
                <MonoText style={{ color: palette.line, fontSize: 18, letterSpacing: 3 }}>INHALE</MonoText>
              </View>
            </View>

            <BodyText style={{ textAlign: "center", color: palette.inkMuted, fontStyle: "italic", lineHeight: 28 }}>
              “The hold trains tolerance for silence — the same physiology as a mid-sentence pause.”
            </BodyText>

            <View style={[flowStyles.brutalistPanel, flowStyles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.45)", borderLeftWidth: 4, borderLeftColor: palette.line }]}>
              <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>
                <BodyText style={{ fontFamily: type.bodyMedium, color: palette.inkMuted }}>Two cycles.</BodyText> The held breath produces the same nervous-system state as a deliberate pause.
              </BodyText>
            </View>

            <SessionButton
              label={centreBeginLabel(sn, continueReady)}
              onPress={continueReady ? onContinue : () => undefined}
              disabled={!continueReady}
              variant="secondary"
            />
          </View>
        </View>
      );
    }

    if (sn === 10) {
      return (
        <View style={[styles.wrap, styles.unifiedWrap]}>
          <View style={{ width: "100%", gap: spacing.lg }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Icon name="back" size={18} color={palette.line} />
              <MonoText style={{ color: palette.line, letterSpacing: 2 }}>SESSION 10</MonoText>
              <View style={[flowStyles.outlineBadge, { borderColor: palette.lineSoft }]}>
                <Icon name="profile" size={16} color={palette.line} />
              </View>
            </View>

            <View style={[flowStyles.outlineBadge, { borderColor: palette.lineSoft, alignSelf: "center" }]}>
              <MonoText style={[flowStyles.outlineBadgeText, { color: palette.line }]}>00 VOCAL DESCENT</MonoText>
            </View>

            <View style={[flowStyles.brutalistPanel, flowStyles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
              <View style={{ height: 360, backgroundColor: "#FCF8F4" }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <View key={`v-${i}`} style={{ position: "absolute", left: `${(i + 1) * 10}%`, top: 0, bottom: 0, width: 1, backgroundColor: "#EFE2D8" }} />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <View key={`h-${i}`} style={{ position: "absolute", top: `${(i + 1) * 9}%`, left: 0, right: 0, height: 1, backgroundColor: "#EFE2D8" }} />
                ))}

                <View style={{ position: "absolute", left: 22, top: 110, gap: 6 }}>
                  <MonoText style={{ color: palette.line, letterSpacing: 1 }}>UPPER</MonoText>
                  <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>REGISTER</MonoText>
                </View>
                <View style={{ position: "absolute", left: 22, top: 240, gap: 6 }}>
                  <MonoText style={{ color: palette.line, letterSpacing: 1 }}>LOWER</MonoText>
                  <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>REGISTER</MonoText>
                </View>

                <View style={{ position: "absolute", left: "58%", top: 70, width: 4, height: 230, backgroundColor: palette.lineSoft, opacity: 0.4 }} />

                <View style={{ position: "absolute", left: "62%", top: 82 }}>
                  <View style={{ width: 56, height: 56, borderRadius: 0, borderWidth: 2, borderColor: palette.line, alignItems: "center", justifyContent: "center", backgroundColor: palette.paper }}>
                    <View style={{ width: 14, height: 14, borderRadius: 0, backgroundColor: palette.line }} />
                  </View>
                </View>
                <View style={{ position: "absolute", left: "60%", top: 120, width: 100, height: 180, borderLeftWidth: 6, borderLeftColor: palette.line, borderBottomLeftRadius: 0, transform: [{ rotate: "6deg" }] }} />
                <View style={{ position: "absolute", left: "50%", top: 110 }}>
                  <View style={[flowStyles.brutalistPanelInk, { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 0 }]}>
                    <MonoText style={{ color: palette.line, fontSize: 18, letterSpacing: 3 }}>INHALE</MonoText>
                  </View>
                </View>
              </View>
            </View>

            <View style={[flowStyles.brutalistPanelInk, flowStyles.brutalistShadowInk]}>
              <BodyText style={{ fontSize: 20, lineHeight: 30 }}>
                Hum down through two octaves. The lower register is where today's sentences will end.
              </BodyText>
            </View>
            <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24, textAlign: "center" }}>
              Descending hums prime the laryngeal muscles for the same trajectory the sentences require.
            </BodyText>
          </View>

          <SessionButton
            label={centreBeginLabel(sn, continueReady)}
            onPress={continueReady ? onContinue : () => undefined}
            disabled={!continueReady}
            variant="secondary"
          />
        </View>
      );
    }

    if (sn === 2) {
      return (
        <View style={[styles.wrap, styles.unifiedWrap]}>
          <DottedStageBackground>
            <View style={{ width: "100%", gap: spacing.md }}>
              <View style={[flowStyles.brutalistPanel, flowStyles.brutalistShadowInk, { gap: spacing.sm, padding: spacing.lg }]}>
                <DisplayText style={{ fontSize: 40, lineHeight: 44, textAlign: "center" }}>
                  INHALE FOUR.{"\n"}EXHALE SIX.
                </DisplayText>
                <BodyText style={{ textAlign: "center", color: palette.inkMuted }}>
                  A longer exhale than inhale.{"\n"}
                  <MonoText style={{ color: palette.line }}>Four in, six out.</MonoText>
                </BodyText>
                <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.xl, paddingTop: spacing.sm }}>
                  <View style={{ alignItems: "center", gap: 6 }}>
                    <View style={{ width: 64, height: 4, backgroundColor: palette.line }} />
                    <MonoText style={{ fontSize: 10, letterSpacing: 1, color: palette.line }}>INHALE</MonoText>
                  </View>
                  <View style={{ alignItems: "center", gap: 6 }}>
                    <View style={{ width: 96, height: 4, backgroundColor: palette.line }} />
                    <MonoText style={{ fontSize: 10, letterSpacing: 1, color: palette.line }}>EXHALE</MonoText>
                  </View>
                </View>
              </View>

              <View style={[flowStyles.brutalistPanel, flowStyles.brutalistShadowInk, { flexDirection: "row", gap: spacing.md }]}>
                <Icon name="info" size={20} color={palette.line} />
                <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24, flex: 1 }}>
                  “A six-second exhale activates the vagus nerve and slows the heart by the second cycle.”
                </BodyText>
              </View>
            </View>
          </DottedStageBackground>

          <SessionButton
            label={centreBeginLabel(sn, continueReady)}
            onPress={continueReady ? onContinue : () => undefined}
            disabled={!continueReady}
          />
        </View>
      );
    }

    if (sn === 3) {
      return (
        <View style={[styles.wrap, styles.unifiedWrap]}>
          <View style={[flowStyles.centreBreathWrap, { marginVertical: spacing.md }]}>
            <View style={[flowStyles.centreBreathRing, { opacity: 0.22 }]} />
            <View style={[flowStyles.centreBreathRingInner, { opacity: 0.22 }]} />
            <View style={[flowStyles.centreBreathCore, { padding: spacing.lg, backgroundColor: palette.line, borderWidth: 0 }]}>
              <MonoText style={{ color: palette.paper, fontSize: 22, letterSpacing: 3 }}>INHALE</MonoText>
            </View>
          </View>

          <View style={[flowStyles.centreInstructionBlock, { gap: spacing.sm }]}>
            <BodyText style={{ textAlign: "center", fontSize: 20, lineHeight: 30 }}>
              “Inhale four. Hold four. Exhale four.”
            </BodyText>
            <BodyText style={{ textAlign: "center", color: palette.inkMuted }}>
              A box-breath cycle. Four seconds in, four held, four out.
            </BodyText>
            <View style={{ width: "100%", height: 1, backgroundColor: palette.lineSoft, marginTop: spacing.sm }} />
            <MonoText style={{ fontSize: 10, letterSpacing: 2, color: palette.inkMuted, textAlign: "center" }}>
              THREE CYCLES. THE BREATH-HOLD IS THE UNFAMILIAR PART — IT BUILDS TOLERANCE FOR SILENCE IN SPEECH.
            </MonoText>
          </View>

          <SessionButton
            label={centreBeginLabel(sn, continueReady)}
            onPress={continueReady ? onContinue : () => undefined}
            disabled={!continueReady}
          />
        </View>
      );
    }

    if (sn === 36) {
      return (
        <View style={[styles.wrap, styles.unifiedWrap]}>
          <View style={{ width: "100%", gap: spacing.lg, alignItems: "center" }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderWidth: 2,
                borderColor: palette.line,
                backgroundColor: "#FDF6E3",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MonoText style={{ color: palette.line, fontSize: 22 }}>1</MonoText>
            </View>
            <DisplayText style={{ fontSize: 24, lineHeight: 32, textAlign: "center", fontStyle: "italic", maxWidth: 300 }}>
              {primaryLine.startsWith("(") ? primaryLine : `(${primaryLine})`}
            </DisplayText>
            <View style={{ width: 96, height: 1, backgroundColor: palette.lineSoft }} />
            <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 26, maxWidth: 280 }}>
              Today you perform. Re-record session one&apos;s prompt.
            </BodyText>
            <SessionButton
              label={centreBeginLabel(sn, continueReady)}
              onPress={continueReady ? onContinue : () => undefined}
              disabled={!continueReady}
            />
          </View>
        </View>
      );
    }

    if (sn >= 25 && sn <= 35) {
      const centreKicker =
        sn === 30 ? "STEP 01 / 05" : sn === 35 ? "01/05" : "STEP 01/05";
      const centreTitle = sn === 28 || sn === 29 ? "CENTRE" : undefined;
      const footnoteLine =
        instructionLines.length > 1 ? instructionLines[instructionLines.length - 1] : undefined;
      const sessionSubtitle =
        sn === 26
          ? "Data to Story"
          : sn === 27
            ? "Energy Calibration"
            : sn === 28
              ? "Hypothesis-Driven"
              : sn === 29
                ? "Full Pyramid"
                : sn === 32
                  ? "Executive Presence"
                  : sn === 33
                    ? "Influence Without Authority"
                    : sn === 34
                      ? "Memorable Closes"
                      : sn === 35
                        ? "Brand Voice"
                        : undefined;
      return (
        <View style={[styles.wrap, styles.unifiedWrap]}>
          <View style={{ width: "100%", gap: spacing.lg }}>
            <View style={{ alignItems: "center", gap: spacing.xs }}>
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, fontSize: 10 }}>{centreKicker}</MonoText>
              {centreTitle ? (
                <DisplayText style={{ fontSize: 28, lineHeight: 32, textAlign: "center" }}>{centreTitle}</DisplayText>
              ) : null}
              {sessionSubtitle ? (
                <MonoText style={{ color: palette.line, letterSpacing: 1 }}>{sessionSubtitle.toUpperCase()}</MonoText>
              ) : null}
            </View>
            <DisplayText
              style={{
                fontSize: sn === 34 ? 24 : 28,
                lineHeight: sn === 34 ? 30 : 34,
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              {primaryLine.startsWith("“") ? primaryLine : `“${primaryLine}”`}
            </DisplayText>
            {footnoteLine && footnoteLine !== primaryLine ? (
              <BodyText
                style={{
                  color: palette.inkMuted,
                  lineHeight: 26,
                  borderLeftWidth: 2,
                  borderLeftColor: palette.line,
                  paddingLeft: spacing.md,
                }}
              >
                {footnoteLine}
              </BodyText>
            ) : null}
            {sn === 28 ? (
              <View style={{ gap: spacing.xs, alignItems: "center" }}>
                {instructionLines.slice(1, -1).map((line) => (
                  <BodyText key={line} style={{ textAlign: "center", color: palette.inkMuted }}>
                    {line}
                  </BodyText>
                ))}
              </View>
            ) : null}
            {sn === 25 ? (
              <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.lg }}>
                {["CEO", "PEER", "CUSTOMER"].map((label) => (
                  <View
                    key={label}
                    style={[flowStyles.outlineBadge, { borderColor: palette.line, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }]}
                  >
                    <MonoText style={flowStyles.outlineBadgeText}>{label}</MonoText>
                  </View>
                ))}
              </View>
            ) : null}
            {sn === 27 ? (
              <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.lg, paddingVertical: spacing.md }}>
                {["QUIET", "NORMAL", "LOUD"].map((level) => (
                  <MonoText key={level} style={styles.vocalLevelLabel}>
                    {level}
                  </MonoText>
                ))}
              </View>
            ) : null}
            {sn === 30 ? (
              <View style={{ gap: spacing.sm, width: "100%" }}>
                {[
                  ["METRIC 01", "PACE", "Focus on the rhythm and speed of delivery."],
                  ["METRIC 02", "FILLERS", "Eliminate vocalized pauses and hesitations."],
                  ["METRIC 03", "INFLECTION", "Master pitch variation for engagement."],
                ].map(([tag, label, copy]) => (
                  <Panel
                    key={label}
                    style={{
                      gap: spacing.xs,
                      padding: spacing.md,
                      borderWidth: 2,
                      borderColor: palette.lineSoft,
                      backgroundColor: "#FDF6E3",
                      minHeight: 120,
                      justifyContent: "space-between",
                    }}
                  >
                    <MonoText style={{ color: palette.inkMuted, fontSize: 10, letterSpacing: 1 }}>{tag}</MonoText>
                    <DisplayText style={{ fontSize: 22, lineHeight: 26 }}>{label}</DisplayText>
                    <BodyText style={{ color: palette.inkMuted, fontSize: 14 }}>{copy}</BodyText>
                  </Panel>
                ))}
              </View>
            ) : null}
            {sn === 33 ? (
              <View style={{ width: "100%", gap: spacing.sm, padding: spacing.md, borderWidth: 2, borderColor: palette.lineSoft }}>
                {["STAKEHOLDER", "INCENTIVE", "RISK"].map((row) => (
                  <View key={row} style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: palette.lineSoft, paddingVertical: spacing.sm }}>
                    <MonoText style={{ color: palette.inkMuted, fontSize: 10 }}>{row}</MonoText>
                    <MonoText style={{ color: palette.line }}>—</MonoText>
                  </View>
                ))}
              </View>
            ) : null}
            {sn === 34 ? (
              <View style={[flowStyles.brutalistPanel, flowStyles.brutalistShadowInk, { padding: spacing.lg, width: "100%" }]}>
                <MonoText style={{ color: palette.line, letterSpacing: 2, marginBottom: spacing.sm }}>CLOSING SENTENCE</MonoText>
                <BodyText style={{ fontStyle: "italic", lineHeight: 28, textAlign: "center" }}>
                  One sentence. Sixty seconds of body. Then the close.
                </BodyText>
              </View>
            ) : null}
            {sn === 31 ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" }}>
                {["ACT I", "ACT II", "ACT III"].map((act) => (
                  <View key={act} style={[flowStyles.outlineBadge, { borderColor: palette.line, paddingHorizontal: spacing.md }]}>
                    <MonoText style={flowStyles.outlineBadgeText}>{act}</MonoText>
                  </View>
                ))}
              </View>
            ) : null}
            {sn === 29 ? (
              <View style={{ alignItems: "center", gap: 4, width: "100%" }}>
                {[
                  { label: "CONCLUSION", flex: 0.4 },
                  { label: "SUPPORT", flex: 0.65 },
                  { label: "EVIDENCE", flex: 0.9 },
                ].map((layer) => (
                  <View
                    key={layer.label}
                    style={{
                      alignSelf: "center",
                      width: `${Math.round(layer.flex * 100)}%` as `${number}%`,
                      backgroundColor: palette.line,
                      paddingVertical: spacing.sm,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: palette.black,
                    }}
                  >
                    <MonoText style={{ color: palette.paper, fontSize: 10, letterSpacing: 1 }}>{layer.label}</MonoText>
                  </View>
                ))}
              </View>
            ) : null}
            {sn === 32 ? (
              <View style={[flowStyles.brutalistPanel, flowStyles.brutalistShadowInk, { padding: spacing.md }]}>
                <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 26 }}>
                  Pace under 140. Inflection down. Pauses owned.
                </BodyText>
              </View>
            ) : null}
            <SessionButton
              label={centreBeginLabel(sn, continueReady)}
              onPress={continueReady ? onContinue : () => undefined}
              disabled={!continueReady}
            />
          </View>
        </View>
      );
    }

    if (sn === 5) {
      return (
        <View style={[styles.wrap, styles.unifiedWrap]}>
          <View style={{ width: "100%", gap: spacing.lg }}>
            <View style={{ alignItems: "center", gap: spacing.sm }}>
              <View style={[flowStyles.brutalistPanel, { paddingVertical: 10, paddingHorizontal: spacing.lg }]}>
                <MonoText style={{ letterSpacing: 2, color: palette.line }}>01 CENTRE</MonoText>
              </View>
            </View>
            <DisplayText style={{ fontSize: 32, lineHeight: 36, textAlign: "center" }}>Think of one recent win.</DisplayText>

            {secondaryLines ? (
              <BodyText style={[flowStyles.stagePullQuote, { maxWidth: 520 }]}>“{secondaryLines}”</BodyText>
            ) : null}

            <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 26 }}>
              Picking the specific moment now keeps it from being chosen mid-recording. This mental anchor ensures your delivery remains focused and your clarity score high.
            </BodyText>

            <SessionButton
              label={centreBeginLabel(sn, continueReady)}
              onPress={continueReady ? onContinue : () => undefined}
              disabled={!continueReady}
              style={{ alignSelf: "center", maxWidth: 260 }}
            />

            <View style={{ alignItems: "center", paddingTop: spacing.xl }}>
              <View style={{ width: 0, height: 0, borderLeftWidth: 42, borderRightWidth: 42, borderBottomWidth: 78, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: palette.lineSoft, opacity: 0.65 }} />
              <MonoText style={{ marginTop: spacing.md, color: palette.inkMuted, letterSpacing: 1, fontSize: 10 }}>FOUNDATION</MonoText>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.wrap, styles.unifiedWrap]}>
        {config.type === "vocal" && sn === 4 ? (
          <View style={flowStyles.centreBreathWrap}>
            <View style={[flowStyles.centreBreathRing, { opacity: 0.35 }]} />
            <View style={styles.vocalCore}>
              <Icon name="mic" size={40} color={palette.line} />
            </View>
            <View style={styles.vocalLevels}>
              {["QUIET", "NORMAL", "LOUD"].map((level) => (
                <MonoText key={level} style={styles.vocalLevelLabel}>
                  {level}
                </MonoText>
              ))}
            </View>
          </View>
        ) : config.type === "pause" && sn === 5 ? (
          <View style={[flowStyles.centreBreathWrap, { justifyContent: "center" }]}>
            <View style={[styles.pauseDot, { transform: [{ scale: quietPulse }] }]} />
            <Text style={styles.instruction}>{instruction}</Text>
          </View>
        ) : (
          <View style={flowStyles.centreBreathWrap}>
            <Animated.View
              style={[
                flowStyles.centreBreathRing,
                breathing && config.organicOrb
                  ? {
                      transform: [{ scale: organicProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }],
                      opacity: organicArrive,
                    }
                  : { transform: [{ scale: orbScale }], opacity: opacity * orbOpacity },
              ]}
            />
            <View style={flowStyles.centreBreathRingInner} />
            <View style={flowStyles.centreBreathCore}>
              <Icon name="air" size={48} color={palette.siennaAccent} />
            </View>
          </View>
        )}

        <View style={flowStyles.centreInstructionBlock}>
          <Text style={flowStyles.stageMetricText}>{primaryLine}</Text>
          {secondaryLines ? <Text style={flowStyles.stagePullQuote}>{secondaryLines}</Text> : null}
          {breathing && config.organicOrbVariant === "session2" ? (
            <View style={styles.inhaleExhaleRow}>
              <MonoText style={styles.inhaleExhalePill}>4s IN</MonoText>
              <MonoText style={styles.inhaleExhalePill}>6s OUT</MonoText>
            </View>
          ) : null}
          {breathing && !config.organicOrb ? (
            <Text style={styles.instruction} numberOfLines={1}>
              {instruction}
            </Text>
          ) : null}
          {config.organicOrb ? (
            <Animated.Text style={[styles.instruction, { opacity: organicInstructionOpacity }]} numberOfLines={1}>
              {instruction}
            </Animated.Text>
          ) : null}
        </View>

        {sn === 2 ? (
          <View style={[flowStyles.brutalistPanel, flowStyles.brutalistShadowInk, { width: "100%" }]}>
            <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24 }}>
              A six-second exhale activates the vagus nerve and slows the heart by the second cycle.
            </BodyText>
          </View>
        ) : null}

        <SessionButton
          label={centreBeginLabel(sn, continueReady)}
          onPress={continueReady ? onContinue : () => undefined}
          disabled={!continueReady}
        />
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { opacity }]}>
      <Text style={styles.framing} numberOfLines={3}>
        {config.framingText}
      </Text>

      <View style={styles.canvas}>
	            {breathing && config.organicOrb ? (
	              <View style={styles.organicCanvas}>
	                <View style={styles.orbWrap}>
	                  {config.organicOrbVariant === "session2" ? <View style={styles.session2FrameGhost} /> : null}
		                  <Animated.View
		                    style={[
		                      styles.organicOrb,
		                      config.organicOrbVariant === "session2" ? styles.organicOrbLarge : styles.organicOrbMedium,
	                      {
	                        opacity: organicArrive,
	                        transform: [
	                          { scale: organicArrive.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
	                          {
                            scale: organicProgress.interpolate({
                              inputRange: [0, 1],
                              outputRange: config.organicOrbVariant === "session2" ? [0.6, 1.1] : [1, 1.4],
                            }),
                          },
                          {
                            rotate: organicProgress.interpolate({
                              inputRange: [0, 1],
                              outputRange: config.organicOrbVariant === "session2" ? ["0deg", "0deg"] : ["0deg", "15deg"],
                            }),
                          },
                        ],
                        backgroundColor:
                          config.organicOrbVariant === "session2"
                            ? ("#7C2D12" as unknown as string)
                            : (organicProgress.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["#ffdbd0", "#ffb59e"],
                              }) as unknown as string),
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        shadowOpacity: organicProgress.interpolate({ inputRange: [0, 1], outputRange: [0.22, 0.35] }) as unknown as number,
                        shadowRadius: organicProgress.interpolate({ inputRange: [0, 1], outputRange: [18, 28] }) as unknown as number,
                      },
                    ]}
                  >
	                    {config.organicOrbVariant === "session2" ? (
	                      <>
	                        <View style={styles.session2OrbHighlight} />
	                        <View style={styles.session2OrbShade} />
	                        <View style={styles.orbInnerGlow} />
	                      </>
	                    ) : null}
	                  </Animated.View>

                  {config.organicOrbVariant === "session2" ? (
                    <View pointerEvents="none" style={styles.organicOverlay}>
                      <View style={styles.organicPill}>
                        <Text style={styles.organicPillText}>{session2Phase === "inhale" ? "Breathe in..." : "Breathe out..."}</Text>
                      </View>
                      <View style={styles.organicTimerRow}>
                        <View style={[styles.organicTimerPill, session2Phase === "inhale" ? styles.organicTimerPillActive : styles.organicTimerPillIdle]}>
                          <Text style={[styles.organicTimerText, session2Phase === "inhale" ? styles.organicTimerTextActive : styles.organicTimerTextIdle]}>
                            4s In
                          </Text>
                        </View>
                        <View style={[styles.organicTimerPill, session2Phase === "exhale" ? styles.organicTimerPillActive : styles.organicTimerPillIdle]}>
                          <Text style={[styles.organicTimerText, session2Phase === "exhale" ? styles.organicTimerTextActive : styles.organicTimerTextIdle]}>
                            6s Out
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : (
              <DottedStageBackground>
                <View style={styles.frame}>
              <View style={styles.grid} />
              <View style={styles.crosshairH} />
              <View style={styles.crosshairV} />

              {breathing ? (
                <View style={styles.orbWrap}>
                  <View style={styles.orbHalo} />
                  <View style={[styles.orb, { transform: [{ scale: orbScale }, { translateY: exhaleDrift }] }]} />
                  <View style={[styles.orbInner, { opacity: 0.55 + (orbScale - 0.94) * 2.2 }]} />
                </View>
              ) : config.type === "pause" ? (
                <View style={styles.minimalCenter}>
                  <View style={[styles.pulseDot, { transform: [{ scale: quietPulse }] }]} />
                </View>
              ) : config.type === "affirmation" ? (
                <View style={styles.minimalCenter}>
                  <Text style={styles.affirmationText}>{instruction}</Text>
                </View>
              ) : (
                <View style={styles.minimalCenter}>
                  <View style={styles.voiceLineTrack}>
                    <View style={[styles.voiceLine, { width: `${Math.round(20 + (quietPulse - 0.92) * 220)}%` }]} />
                  </View>
                  <Text style={styles.affirmationText}>{instruction}</Text>
                </View>
              )}
            </View>
          </DottedStageBackground>
        )}
      </View>

      {breathing ? (
        config.organicOrb ? (
          <Animated.Text style={[styles.instruction, { opacity: organicInstructionOpacity }]} numberOfLines={1}>
            {instruction}
          </Animated.Text>
        ) : (
          <Text style={styles.instruction} numberOfLines={1}>
            {instruction}
          </Text>
        )
      ) : null}

      <View style={styles.actionRow}>
        <PrimaryButton
          label={continueReady ? "CONTINUE" : "SETTLE IN"}
          onPress={continueReady ? onContinue : () => undefined}
          inverted={!continueReady}
        />
      </View>

      <InteractivePressable
        onPress={onSkip}
        style={[styles.skip, skipHinted && styles.skipHinted]}
      >
        <Text style={styles.skipText}>Skip</Text>
      </InteractivePressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  unifiedWrap: {
    paddingHorizontal: 0,
    paddingTop: spacing.sm,
    alignItems: "center",
  },
  topMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    opacity: 0.75,
  },
  stepMeta: {
    fontSize: 11,
    letterSpacing: 0.8,
    color: palette.inkMuted,
  },
  stepTitle: {
    fontFamily: type.display,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.8,
    color: palette.ink,
  },
  framing: {
    fontFamily: type.body,
    fontSize: 16,
    lineHeight: 26,
    color: palette.ink,
    maxWidth: 420,
  },
  canvas: {
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: 360,
    maxWidth: "100%",
    height: 360,
    borderWidth: 2,
    borderColor: palette.line,
    backgroundColor: palette.paper,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  organicCanvas: {
    width: "100%",
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    position: "absolute",
    top: 22,
    right: 22,
    bottom: 22,
    left: 22,
    borderWidth: 1,
    borderColor: palette.lineSoft,
    opacity: 0.8,
  },
  crosshairH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    top: "50%",
    backgroundColor: palette.lineSoft,
    opacity: 0.6,
  },
  crosshairV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    left: "50%",
    backgroundColor: palette.lineSoft,
    opacity: 0.6,
  },
  orbWrap: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
	  organicOrb: {
	    borderWidth: 2,
	    borderColor: "#7c2d12",
	    shadowColor: "#ffb59e",
	    shadowOffset: { width: 0, height: 0 },
	  },
	  organicOrbMedium: {
	    width: 140,
	    height: 140,
	  },
  organicOrbLarge: {
    width: 256,
    height: 256,
  },
  session2FrameGhost: {
    position: "absolute",
    width: 360,
    height: 360,
    borderWidth: 2,
    borderColor: "#7C2D12",
    borderRadius: 0,
    opacity: 0.1,
  },
  session2OrbHighlight: {
    position: "absolute",
    width: "92%",
    height: "92%",
    borderRadius: 0,
    backgroundColor: "#ff9b7b",
    opacity: 0.32,
    top: "6%",
    left: "6%",
  },
  session2OrbShade: {
    position: "absolute",
    width: "120%",
    height: "120%",
    borderRadius: 0,
    backgroundColor: "#5e1700",
    opacity: 0.28,
    right: "-28%",
    bottom: "-28%",
  },
  orbHighlight: {
    position: "absolute",
    width: "70%",
    height: "70%",
    borderRadius: 0,
    backgroundColor: "#ff9b7b",
    opacity: 0.55,
    top: "10%",
    left: "10%",
  },
  orbInnerGlow: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "rgba(253, 249, 245, 0.28)",
  },
  organicOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  organicPill: {
    backgroundColor: "rgba(253, 249, 245, 0.92)",
    borderWidth: 2,
    borderColor: "#7C2D12",
    borderRadius: 0,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  organicPillText: {
    fontFamily: type.display,
    fontSize: 18,
    lineHeight: 22,
    color: "#7C2D12",
  },
  organicTimerRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  organicTimerPill: {
    borderWidth: 2,
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderColor: "#7C2D12",
  },
  organicTimerPillActive: {
    backgroundColor: "#7C2D12",
  },
  organicTimerPillIdle: {
    backgroundColor: "transparent",
  },
  organicTimerText: {
    fontFamily: type.mono,
    fontSize: 12,
  },
  organicTimerTextActive: {
    color: "#FDF9F5",
  },
  organicTimerTextIdle: {
    color: "#7C2D12",
  },
  orbHalo: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: "#E7D4C4",
    opacity: 0.65,
  },
  orb: {
    width: 180,
    height: 180,
    borderRadius: 0,
    backgroundColor: "#EAD8CC",
    borderWidth: 2,
    borderColor: "#DCC5B1",
  },
  orbInner: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 0,
    backgroundColor: palette.paper,
    borderWidth: 2,
    borderColor: palette.lineSoft,
  },
  instruction: {
    fontFamily: type.display,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.6,
    color: palette.ink,
    textAlign: "center",
  },
  minimalCard: {
    width: "100%",
    maxWidth: 440,
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  minimalText: {
    fontSize: 26,
    lineHeight: 30,
    textAlign: "center",
  },
  minimalCenter: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  pulseDot: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: palette.line,
    backgroundColor: palette.paper,
  },
  affirmationText: {
    fontFamily: type.display,
    fontSize: 24,
    lineHeight: 30,
    textAlign: "center",
    color: palette.ink,
    letterSpacing: -0.6,
    maxWidth: 320,
  },
  voiceLineTrack: {
    width: "72%",
    height: 10,
    borderWidth: 2,
    borderColor: palette.lineSoft,
    overflow: "hidden",
    backgroundColor: palette.paper,
  },
  voiceLine: {
    height: "100%",
    backgroundColor: palette.line,
  },
  skip: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    opacity: 0.14,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  skipHinted: {
    opacity: 0.26,
  },
  skipText: {
    fontFamily: type.body,
    fontSize: 14,
    color: palette.inkMuted,
  },
  actionRow: {
    paddingTop: spacing.sm,
    width: "100%",
  },
  vocalCore: {
    width: 96,
    height: 96,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDF6E3",
    zIndex: 2,
  },
  vocalLevels: {
    position: "absolute",
    bottom: -8,
    flexDirection: "row",
    gap: spacing.md,
  },
  vocalLevelLabel: {
    fontSize: 9,
    letterSpacing: 0.8,
    color: palette.inkMuted,
  },
  pauseDot: {
    width: 20,
    height: 20,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: palette.line,
    backgroundColor: palette.paper,
  },
  inhaleExhaleRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  inhaleExhalePill: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: palette.line,
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

function getPhaseIndex({ inCycleMs, patternMs }: { inCycleMs: number; patternMs: number[] }) {
  let cursor = 0;
  for (let index = 0; index < patternMs.length; index += 1) {
    cursor += patternMs[index] ?? 0;
    if (inCycleMs < cursor) return index;
  }
  return Math.max(0, patternMs.length - 1);
}

function getPhaseProgress({
  inCycleMs,
  patternMs,
  phaseIndex,
}: {
  inCycleMs: number;
  patternMs: number[];
  phaseIndex: number;
}) {
  let start = 0;
  for (let index = 0; index < phaseIndex; index += 1) {
    start += patternMs[index] ?? 0;
  }
  return Math.max(0, inCycleMs - start);
}

function defaultLabelsForPattern(count: number) {
  if (count === 2) return ["Breathe in…", "Breathe out…"];
  if (count === 3) return ["Breathe in…", "Hold…", "Breathe out…"];
  return ["Breathe in…", "Hold…", "Breathe out…", "Hold…"];
}

function SprintProgressStrip({ activeIndex, total }: { activeIndex: number; total: number }) {
  return (
    <View style={sprintStyles.row}>
      {Array.from({ length: total }).map((_, index) => {
        const filled = index < activeIndex;
        const current = index === activeIndex;
        return (
          <View
            key={index}
            style={[
              sprintStyles.segment,
              filled && sprintStyles.segmentFilled,
              current && sprintStyles.segmentCurrent,
            ]}
          />
        );
      })}
    </View>
  );
}

const sprintStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
    width: "100%",
    maxWidth: 280,
    marginBottom: spacing.md,
  },
  segment: {
    flex: 1,
    height: 12,
    borderWidth: 2,
    borderColor: palette.line,
    backgroundColor: "transparent",
  },
  segmentFilled: {
    backgroundColor: palette.line,
  },
  segmentCurrent: {
    backgroundColor: palette.panelSoft,
  },
});
