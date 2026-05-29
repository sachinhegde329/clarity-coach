import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { MonoText, PrimaryButton } from "../../../design-system/primitives";
import { Icon } from "../../../design-system/icons";
import { palette, spacing, type } from "../../../design-system/theme";
import { InteractivePressable } from "../../../design-system/motion";

const PHASE_MS = 4000;
const TOTAL_MS = 30000;
const PARTICLE_COUNT = 60;

const TERRACOTTA = "#9a3412";
const SLATE = "#334155";
const OCHRE = "#d97706";

type BreathPhase = "in" | "hold" | "out" | "hold-out";

type Particle = {
  x: number;
  y: number;
  size: number;
  angle: number;
  speed: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
};

function phaseColor(phase: BreathPhase) {
  if (phase === "in") return TERRACOTTA;
  if (phase === "hold" || phase === "hold-out") return SLATE;
  return OCHRE;
}

function particleFactor(phase: BreathPhase) {
  if (phase === "in") return 1.4;
  if (phase === "out") return -1.5;
  return 0.15;
}

import type { CentreData } from "../../../data/mockData";

export function SessionThreeCentreStep({
  content,
  onSkip,
  onContinue,
}: {
  content?: CentreData;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const [phase, setPhase] = useState<BreathPhase>("in");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [continueReady, setContinueReady] = useState(false);
  const [skipHinted, setSkipHinted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const mountedRef = useRef(true);
  const phaseRef = useRef<BreathPhase>("in");
  const totalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const secondTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);

  const coreSize = useRef(new Animated.Value(80)).current;
  const midSize = useRef(new Animated.Value(107)).current;
  const outerSize = useRef(new Animated.Value(133)).current;
  const coreColor = useRef(new Animated.Value(0)).current;
  const midOpacity = useRef(new Animated.Value(0.4)).current;
  const outerOpacity = useRef(new Animated.Value(0.4)).current;
  const gridScale = useRef(new Animated.Value(1)).current;
  const gridOpacity = useRef(new Animated.Value(0.3)).current;
  const shimmer = useRef(new Animated.Value(1)).current;
  const affirmationOpacity = useRef(new Animated.Value(0)).current;
  const affirmationY = useRef(new Animated.Value(24)).current;

  const particlesRef = useRef<Particle[]>([]);
  const shimmerLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const initParticle = (particle: Particle, phaseValue: BreathPhase) => {
    particle.x = 160;
    particle.y = 160;
    particle.size = Math.random() * 2.5 + 0.5;
    particle.angle = Math.random() * Math.PI * 2;
    particle.speed = Math.random() * 0.8 + 0.2;
    particle.opacity = Math.random() * 0.4;
    particle.life = 0;
    particle.maxLife = 120 + Math.random() * 100;
    particle.color = phaseColor(phaseValue);
  };

  const animateSizes = (target: "expanded" | "contracted", duration = PHASE_MS) => {
    const coreTarget = target === "expanded" ? 240 : 80;
    const midTarget = target === "expanded" ? 293 : 107;
    const outerTarget = target === "expanded" ? 347 : 133;
    const midOp = target === "expanded" ? 0.4 : 0.22;
    const outerOp = target === "expanded" ? 0.4 : 0.18;

    Animated.parallel([
      Animated.timing(coreSize, { toValue: coreTarget, duration, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95), useNativeDriver: false }),
      Animated.timing(midSize, { toValue: midTarget, duration, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95), useNativeDriver: false }),
      Animated.timing(outerSize, { toValue: outerTarget, duration, easing: Easing.bezier(0.45, 0.05, 0.55, 0.95), useNativeDriver: false }),
      Animated.timing(midOpacity, { toValue: midOp, duration, useNativeDriver: true }),
      Animated.timing(outerOpacity, { toValue: outerOp, duration, useNativeDriver: true }),
    ]).start();
  };

  const showAffirmation = (text: string, color: string) => {
    affirmationOpacity.setValue(0);
    affirmationY.setValue(24);
    Animated.parallel([
      Animated.timing(affirmationOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(affirmationY, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    return { text, color };
  };

  const hideAffirmation = () => {
    Animated.parallel([
      Animated.timing(affirmationOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(affirmationY, { toValue: 24, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const startShimmer = () => {
    shimmerLoopRef.current?.stop();
    shimmerLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1.02, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    shimmerLoopRef.current.start();
  };

  const stopShimmer = () => {
    shimmerLoopRef.current?.stop();
    shimmer.setValue(1);
  };

  const setCoreTone = (tone: "terracotta" | "slate" | "ochre", duration = PHASE_MS) => {
    const target = tone === "terracotta" ? 0 : tone === "slate" ? 1 : 2;
    Animated.timing(coreColor, { toValue: target, duration, useNativeDriver: false }).start();
  };

  const playPhase = (nextPhase: BreathPhase) => {
    if (!mountedRef.current) return;
    phaseRef.current = nextPhase;
    setPhase(nextPhase);

    if (nextPhase === "in") {
      stopShimmer();
      setCoreTone("terracotta");
      animateSizes("expanded");
      Animated.parallel([
        Animated.timing(gridScale, { toValue: 1.1, duration: PHASE_MS, useNativeDriver: true }),
        Animated.timing(gridOpacity, { toValue: 0.4, duration: PHASE_MS, useNativeDriver: true }),
      ]).start();
      hideAffirmation();
      phaseTimerRef.current = setTimeout(() => playPhase("hold"), PHASE_MS);
      return;
    }

    if (nextPhase === "hold") {
      startShimmer();
      setCoreTone("slate");
      showAffirmation("This silence is yours.", SLATE);
      phaseTimerRef.current = setTimeout(() => playPhase("out"), PHASE_MS);
      return;
    }

    if (nextPhase === "out") {
      stopShimmer();
      setCoreTone("ochre");
      animateSizes("contracted");
      Animated.parallel([
        Animated.timing(gridScale, { toValue: 1, duration: PHASE_MS, useNativeDriver: true }),
        Animated.timing(gridOpacity, { toValue: 0.2, duration: PHASE_MS, useNativeDriver: true }),
      ]).start();
      hideAffirmation();
      phaseTimerRef.current = setTimeout(() => playPhase("hold-out"), PHASE_MS);
      return;
    }

    hideAffirmation();
    phaseTimerRef.current = setTimeout(() => playPhase("in"), PHASE_MS);
  };

  useEffect(() => {
    mountedRef.current = true;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const particle = {} as Particle;
      initParticle(particle, "in");
      return particle;
    });
    setParticles([...particlesRef.current]);

    coreSize.setValue(80);
    midSize.setValue(107);
    outerSize.setValue(133);
    playPhase("in");

    secondTimerRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    totalTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setContinueReady(true);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    }, TOTAL_MS);

    hintTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setSkipHinted(true);
    }, 12000);

    const tickParticles = () => {
      const currentPhase = phaseRef.current;
      const factor = particleFactor(currentPhase);
      particlesRef.current.forEach((particle) => {
        particle.color = phaseColor(currentPhase);
        particle.x += Math.cos(particle.angle) * particle.speed * factor;
        particle.y += Math.sin(particle.angle) * particle.speed * factor;
        particle.life += 1;
        if (particle.life > particle.maxLife) initParticle(particle, currentPhase);
        const dist = Math.hypot(particle.x - 160, particle.y - 160);
        if (dist > 300) initParticle(particle, currentPhase);
      });
      setParticles([...particlesRef.current]);
      frameRef.current = requestAnimationFrame(tickParticles);
    };
    frameRef.current = requestAnimationFrame(tickParticles);

    return () => {
      mountedRef.current = false;
      if (secondTimerRef.current) clearInterval(secondTimerRef.current);
      if (totalTimerRef.current) clearTimeout(totalTimerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      shimmerLoopRef.current?.stop();
    };
  }, []);

  const progressWidth = useMemo(() => Math.min(100, (elapsedSeconds / 30) * 100), [elapsedSeconds]);

  const coreBackground = coreColor.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [TERRACOTTA, SLATE, OCHRE],
  });

  const affirmationCopy = phase === "hold" ? "This silence is yours." : "";

  const affirmationTone = phase === "hold" ? SLATE : TERRACOTTA;

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <MonoText style={styles.badgeText}>STAGE 02: CORE EXPANSION</MonoText>
        </View>
        <Text style={styles.title}>{content?.title ?? "Reset"}</Text>
        {content?.onScreenLines?.[0] ? (
          <MonoText style={[styles.badgeText, { textAlign: "center", marginTop: spacing.sm }]}>{content.onScreenLines[0]}</MonoText>
        ) : null}
        {content?.underOrbMeta ?? content?.quote ? (
          <MonoText style={[styles.badgeText, { textAlign: "center", marginTop: spacing.xs, color: palette.inkMuted }]}>
            {content?.underOrbMeta ?? content?.quote}
          </MonoText>
        ) : null}
      </View>

      <View style={styles.canvas}>
        <Animated.View
          style={[
            styles.energyGrid,
            {
              opacity: gridOpacity,
              transform: [{ scale: gridScale }],
            },
          ]}
        >
          {Array.from({ length: 120 }).map((_, index) => (
            <View key={index} style={styles.gridDot}>
              <View style={styles.gridDotPoint} />
            </View>
          ))}
        </Animated.View>

        <Text style={[styles.backgroundWord, (phase === "hold" || phase === "hold-out") && styles.backgroundWordActive]}>
          The{"\n"}Held{"\n"}Note
        </Text>

        <View style={styles.orbField}>
          <View style={styles.particleLayer} pointerEvents="none">
            {particles.map((particle, index) => (
              <View
                key={index}
                style={{
                  position: "absolute",
                  left: particle.x,
                  top: particle.y,
                  width: particle.size * 2,
                  height: particle.size * 2,
                  borderRadius: 0,
                  backgroundColor: particle.color,
                  opacity: particle.opacity,
                  marginLeft: -particle.size,
                  marginTop: -particle.size,
                }}
              />
            ))}
          </View>

          <Animated.View style={[styles.orbOuter, { width: outerSize, height: outerSize, opacity: outerOpacity }]} />
          <Animated.View style={[styles.orbMid, { width: midSize, height: midSize, opacity: midOpacity }]} />
          <Animated.View
            style={[
              styles.orbCore,
              {
                width: coreSize,
                height: coreSize,
                backgroundColor: coreBackground,
              },
            ]}
          >
            <Animated.View style={{ transform: [{ scale: shimmer }] }}>
              <View style={styles.orbSpec} />
            </Animated.View>
          </Animated.View>

          <Animated.View
            style={[
              styles.affirmationWrap,
              {
                opacity: affirmationOpacity,
                transform: [{ translateY: affirmationY }],
              },
            ]}
            pointerEvents="none"
          >
            <Text style={[styles.affirmation, { color: affirmationTone }]}>{affirmationCopy}</Text>
          </Animated.View>
        </View>
      </View>

      <View style={styles.phaseRow}>
        <PhaseBlock icon="wave" label="IN" seconds="4s" active={phase === "in"} tone="terracotta" />
        <View style={styles.phaseDivider} />
        <PhaseBlock icon="stats" label="HOLD" seconds="4s" active={phase === "hold"} tone="slate" />
        <View style={styles.phaseDivider} />
        <PhaseBlock icon="library" label="OUT" seconds="4s" active={phase === "out" || phase === "hold-out"} tone="ochre" />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <View>
            <MonoText style={styles.footerKicker}>Architecture of Breath</MonoText>
            <Text style={styles.footerTitle}>Square Rhythm: 4-4-4-4</Text>
          </View>
          <InteractivePressable onPress={onSkip} style={[styles.skipButton, skipHinted && styles.skipButtonVisible]}>
            <View style={styles.skipInner}>
              <Text style={styles.skipButtonText}>SKIP</Text>
              <Icon name="arrow" size={14} color={palette.inkMuted} />
            </View>
          </InteractivePressable>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressBackdrop} />
          <View style={[styles.progressFill, { width: `${progressWidth}%` }]} />
        </View>

        <View style={styles.actionRow}>
          <PrimaryButton
            label={continueReady ? "CONTINUE" : "SETTLE IN"}
            onPress={continueReady ? onContinue : () => undefined}
            inverted={!continueReady}
          />
        </View>
      </View>
    </View>
  );
}

function PhaseBlock({
  icon,
  label,
  seconds,
  active,
  tone,
}: {
  icon: "wave" | "stats" | "library";
  label: string;
  seconds: string;
  active: boolean;
  tone: "terracotta" | "slate" | "ochre";
}) {
  const color = tone === "terracotta" ? TERRACOTTA : tone === "slate" ? SLATE : OCHRE;
  const muted = active ? color : "rgba(28, 28, 25, 0.22)";

  return (
    <View style={styles.phaseBlock}>
      <Icon name={icon} size={18} color={muted} />
      <View
        style={[
          styles.diamond,
          active && styles.diamondActive,
          { borderColor: active ? color : "rgba(28, 28, 25, 0.18)", backgroundColor: active ? color : "transparent" },
        ]}
      />
      <MonoText style={[styles.phaseSeconds, { color: muted }]}>{seconds}</MonoText>
      <MonoText style={[styles.phaseLabel, { color: muted }]}>{label}</MonoText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    backgroundColor: "#fdf9f5",
  },
  hero: {
    alignItems: "center",
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  badge: {
    borderWidth: 1,
    borderColor: "rgba(94, 23, 0, 0.12)",
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: "rgba(94, 23, 0, 0.6)",
    fontSize: 10,
  },
  title: {
    fontFamily: type.display,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    textTransform: "uppercase",
    color: palette.ink,
  },
  canvas: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minHeight: 360,
  },
  energyGrid: {
    position: "absolute",
    width: "200%",
    height: "200%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
    transform: [{ translateX: "-25%" }, { translateY: "-25%" }],
  },
  gridDot: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  gridDotPoint: {
    width: 2,
    height: 2,
    borderRadius: 0,
    backgroundColor: "rgba(154, 52, 18, 0.35)",
  },
  backgroundWord: {
    position: "absolute",
    textAlign: "center",
    fontFamily: type.display,
    fontSize: 96,
    lineHeight: 86,
    fontWeight: "800",
    textTransform: "uppercase",
    color: "rgba(154, 52, 18, 0.02)",
  },
  backgroundWordActive: {
    color: "rgba(154, 52, 18, 0.08)",
    letterSpacing: 4,
  },
  orbField: {
    width: 320,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  particleLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 26,
  },
  orbOuter: {
    position: "absolute",
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.2)",
    backgroundColor: "rgba(51, 65, 85, 0.06)",
  },
  orbMid: {
    position: "absolute",
    borderRadius: 0,
    backgroundColor: "rgba(217, 119, 6, 0.2)",
  },
  orbCore: {
    position: "absolute",
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: TERRACOTTA,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    zIndex: 25,
  },
  orbSpec: {
    width: 12,
    height: 12,
    borderRadius: 0,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  affirmationWrap: {
    position: "absolute",
    top: "100%",
    marginTop: 48,
    width: 280,
    alignItems: "center",
  },
  affirmation: {
    fontFamily: type.display,
    fontSize: 22,
    lineHeight: 26,
    fontStyle: "italic",
    textAlign: "center",
  },
  phaseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingBottom: spacing.xl,
  },
  phaseBlock: {
    alignItems: "center",
    gap: 8,
    minWidth: 68,
  },
  phaseDivider: {
    width: 32,
    height: 1,
    backgroundColor: "rgba(94, 23, 0, 0.1)",
  },
  diamond: {
    width: 14,
    height: 14,
    transform: [{ rotate: "45deg" }],
    borderWidth: 2,
  },
  diamondActive: {
    transform: [{ rotate: "45deg" }, { scale: 1.4 }],
  },
  phaseSeconds: {
    fontSize: 14,
    fontWeight: "700",
  },
  phaseLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
  },
  footer: {
    gap: spacing.lg,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerKicker: {
    fontSize: 10,
    letterSpacing: 1.4,
    color: "rgba(94, 23, 0, 0.4)",
  },
  footerTitle: {
    fontFamily: type.display,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
    color: palette.ink,
  },
  skipButton: {
    opacity: 0.7,
  },
  skipButtonVisible: {
    opacity: 1,
  },
  skipInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(94, 23, 0, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 0,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  skipButtonText: {
    fontFamily: type.mono,
    fontSize: 11,
    letterSpacing: 1.4,
    color: "rgba(94, 23, 0, 0.6)",
  },
  progressTrack: {
    height: 4,
    borderRadius: 0,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(94, 23, 0, 0.05)",
  },
  progressBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(154, 52, 18, 0.08)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: TERRACOTTA,
  },
  actionRow: {
    paddingTop: spacing.sm,
  },
});
