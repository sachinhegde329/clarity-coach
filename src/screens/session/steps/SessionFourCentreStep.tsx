import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BodyText } from "../../../design-system/primitives";
import { Icon } from "../../../design-system/icons";
import { InteractivePressable } from "../../../design-system/motion";
import { palette, spacing, type } from "../../../design-system/theme";

const BAR_COUNT = 48;
const ORB_SIZE = 208;
const PRIMARY = "#7C2D12";
const PARCHMENT = "#FDF9F5";

type BlockKey = "quiet" | "normal" | "loud";

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  decay: number;
};

function WaveformIcon({ color }: { color: string }) {
  const heights = [16, 12, 8, 12, 16];
  return (
    <View style={styles.waveformIcon}>
      {heights.map((height, index) => (
        <View key={index} style={[styles.waveformIconBar, { height, backgroundColor: color }]} />
      ))}
    </View>
  );
}

function CheckIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          position: "absolute",
          width: size * 0.55,
          height: size * 0.12,
          backgroundColor: color,
          transform: [{ rotate: "-45deg" }, { translateX: -size * 0.08 }, { translateY: size * 0.06 }],
          borderRadius: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: size * 0.3,
          height: size * 0.12,
          backgroundColor: color,
          transform: [{ rotate: "45deg" }, { translateX: size * 0.1 }, { translateY: size * 0.14 }],
          borderRadius: 0,
        }}
      />
    </View>
  );
}

function CalibrationBlock({ label, complete }: { label: string; complete: boolean }) {
  const checkScale = useRef(new Animated.Value(0)).current;
  const markedRef = useRef(false);

  useEffect(() => {
    if (!complete || markedRef.current) return;
    markedRef.current = true;
    Animated.spring(checkScale, {
      toValue: 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [complete, checkScale]);

  return (
    <View style={[styles.block, complete && styles.blockActive]}>
      <Text style={[styles.blockLabel, complete && styles.blockLabelActive]}>{label}</Text>
      <Animated.View
        style={[
          styles.blockCheckCircle,
          complete && styles.blockCheckCircleActive,
          { transform: [{ scale: complete ? checkScale : 1 }] },
        ]}
      >
        {complete ? <CheckIcon color={PARCHMENT} size={16} /> : null}
      </Animated.View>
    </View>
  );
}

import type { CentreData } from "../../../data/mockData";

export function SessionFourCentreStep({
  content,
  onSkip,
  onContinue,
}: {
  content?: CentreData;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const [currentDb, setCurrentDb] = useState(25);
  const [allComplete, setAllComplete] = useState(false);
  const [continueReady, setContinueReady] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>(() => Array.from({ length: BAR_COUNT }, () => 4));
  const [particles, setParticles] = useState<Particle[]>([]);
  const [blockStatus, setBlockStatus] = useState({ quiet: false, normal: false, loud: false });

  const timeRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const orbFieldRef = useRef({ width: ORB_SIZE, height: ORB_SIZE });
  const blockStatusRef = useRef(blockStatus);
  blockStatusRef.current = blockStatus;
  const particlesRef = useRef<Particle[]>(
    Array.from({ length: 20 }, () => ({
      x: ORB_SIZE / 2,
      y: ORB_SIZE / 2,
      size: 1,
      speedX: 0,
      speedY: 0,
      life: 1,
      decay: 0.01,
    })),
  );

  const orbScale = useRef(new Animated.Value(1)).current;
  const aura1Scale = useRef(new Animated.Value(1)).current;
  const aura2Scale = useRef(new Animated.Value(1)).current;
  const symbolScale = useRef(new Animated.Value(1)).current;
  const aura1Breath = useRef(new Animated.Value(1)).current;
  const aura2Breath = useRef(new Animated.Value(1)).current;

  const markComplete = (key: BlockKey) => {
    if (blockStatusRef.current[key]) return;
    const next = { ...blockStatusRef.current, [key]: true };
    setBlockStatus(next);
    if (next.quiet && next.normal && next.loud) {
      setTimeout(() => {
        setAllComplete(true);
        Animated.spring(symbolScale, {
          toValue: 1.1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }).start();
        setContinueReady(true);
      }, 300);
    }
  };

  const resetParticle = (particle: Particle, width: number, height: number) => {
    particle.x = width / 2;
    particle.y = height / 2;
    particle.size = Math.random() * 1.2 + 0.3;
    particle.speedX = (Math.random() - 0.5) * 1.5;
    particle.speedY = (Math.random() - 0.5) * 1.5;
    particle.life = 1;
    particle.decay = Math.random() * 0.01 + 0.005;
  };

  useEffect(() => {
    const breathe1 = Animated.loop(
      Animated.sequence([
        Animated.timing(aura1Breath, { toValue: 1.15, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(aura1Breath, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    const breathe2 = Animated.loop(
      Animated.sequence([
        Animated.timing(aura2Breath, { toValue: 1.12, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(aura2Breath, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    breathe1.start();
    breathe2.start();

    const { width, height } = orbFieldRef.current;
    particlesRef.current.forEach((particle) => resetParticle(particle, width, height));

    const tick = () => {
      timeRef.current += 0.02;
      const time = timeRef.current;

      const noiseBase = 25;
      const sinWave = Math.sin(time * 0.6) * 12;
      const burst = Math.random() > 0.94 ? Math.random() * 50 : 0;
      const nextDb = Math.round(Math.max(15, Math.min(105, noiseBase + sinWave + Math.random() * 8 + burst)));
      setCurrentDb(nextDb);

      const energyFactor = nextDb / 100;
      const scaleVal = 1 + energyFactor * 0.1;
      orbScale.setValue(scaleVal);
      aura1Scale.setValue(1.2 + energyFactor * 0.7);
      aura2Scale.setValue(1.1 + energyFactor * 0.4);

      const fieldWidth = orbFieldRef.current.width;
      const fieldHeight = orbFieldRef.current.height;
      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX * (nextDb / 20);
        particle.y += particle.speedY * (nextDb / 20);
        particle.life -= particle.decay;
        if (particle.life <= 0) resetParticle(particle, fieldWidth, fieldHeight);
      });
      setParticles([...particlesRef.current]);

      const nextHeights = Array.from({ length: BAR_COUNT }, (_, index) => {
        const dist = Math.abs(index - BAR_COUNT / 2);
        const normDist = 1 - dist / (BAR_COUNT / 2);
        const height = 4 + (Math.sin(time * 8 + index * 0.15) * 6 + nextDb * 0.3) * normDist;
        return Math.min(height, 40);
      });
      setWaveHeights(nextHeights);

      const blocks = blockStatusRef.current;
      if (nextDb > 30 && !blocks.quiet) markComplete("quiet");
      if (nextDb > 55 && blocks.quiet && !blocks.normal) markComplete("normal");
      if (nextDb > 80 && blocks.normal && !blocks.loud) markComplete("loud");

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      breathe1.stop();
      breathe2.stop();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [aura1Breath, aura1Scale, aura2Breath, aura2Scale, orbScale, symbolScale]);

  const dbLabel = useMemo(() => String(currentDb).padStart(2, "0"), [currentDb]);
  const meterWidth = `${Math.min(currentDb, 100)}%` as const;

  const onOrbLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    orbFieldRef.current = { width, height };
    particlesRef.current.forEach((particle) => resetParticle(particle, width, height));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.acousticGrid} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, index) => (
          <View key={`h-${index}`} style={[styles.gridLineHorizontal, { top: index * 24 }]} />
        ))}
        {Array.from({ length: 20 }).map((_, index) => (
          <View key={`v-${index}`} style={[styles.gridLineVertical, { left: index * 24 }]} />
        ))}
      </View>

      <View style={styles.instructionHeader}>
        <Text style={styles.title}>{content?.title ?? "Calibration"}</Text>
        <BodyText style={styles.subtitle}>
          {content?.onScreenLines?.[0] ?? content?.prompt ?? "Speak clearly to calibrate your acoustic environment range."}
        </BodyText>
        {content?.underOrbMeta ?? content?.quote ? (
          <BodyText style={[styles.subtitle, { color: palette.inkMuted, fontStyle: "italic" }]}>
            {content?.underOrbMeta ?? content?.quote}
          </BodyText>
        ) : null}
      </View>

      <View style={styles.centreAnchor} onLayout={onOrbLayout}>
        <Animated.View style={{ transform: [{ scale: aura1Breath }] }}>
          <Animated.View
            style={[
              styles.aura,
              styles.auraLayer1,
              {
                transform: [{ scale: aura1Scale }],
              },
            ]}
          />
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: aura2Breath }] }}>
          <Animated.View
            style={[
              styles.aura,
              styles.auraLayer2,
              {
                transform: [{ scale: aura2Scale }],
              },
            ]}
          />
        </Animated.View>

        <Animated.View style={[styles.orb, { transform: [{ scale: orbScale }] }]}>
          <View style={styles.orbGradient} pointerEvents="none" />
          <Animated.View style={[styles.symbolWrap, { transform: [{ scale: symbolScale }] }]}>
            {allComplete ? <CheckIcon color={PARCHMENT} size={40} /> : <WaveformIcon color={PARCHMENT} />}
          </Animated.View>
          <View style={styles.metricCard}>
            <View style={styles.dbRow}>
              <Text style={styles.dbValue}>{dbLabel}</Text>
              <Text style={styles.dbUnit}>dB</Text>
            </View>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, { width: meterWidth }]} />
            </View>
          </View>
          <View style={styles.particleLayer} pointerEvents="none">
            {particles.map((particle, index) => (
              <View
                key={index}
                style={[
                  styles.particle,
                  {
                    left: particle.x,
                    top: particle.y,
                    width: particle.size * 2,
                    height: particle.size * 2,
                    opacity: particle.life * 0.5,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </View>

      <View style={styles.blocksRow}>
        <CalibrationBlock label="QUIET" complete={blockStatus.quiet} />
        <CalibrationBlock label="NORMAL" complete={blockStatus.normal} />
        <CalibrationBlock label="LOUD" complete={blockStatus.loud} />
      </View>

      <View style={styles.waveformRow}>
        {waveHeights.map((height, index) => (
          <View key={index} style={[styles.waveBar, { height }]} />
        ))}
      </View>

      <View style={styles.footer}>
        <InteractivePressable onPress={onSkip} style={styles.footerIconButton}>
          <View style={styles.footerDash} />
        </InteractivePressable>
        <InteractivePressable onPress={continueReady ? onContinue : onSkip} style={styles.footerIconButton}>
          <Icon name="arrow" size={28} color={continueReady ? palette.line : palette.inkMuted} />
        </InteractivePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
    minHeight: 560,
  },
  acousticGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
    overflow: "hidden",
  },
  gridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(124, 45, 18, 0.05)",
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(124, 45, 18, 0.05)",
  },
  instructionHeader: {
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: type.display,
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: -0.96,
    fontWeight: "800",
    color: PRIMARY,
  },
  subtitle: {
    maxWidth: 320,
    textAlign: "center",
    color: palette.inkMuted,
    lineHeight: 28,
    opacity: 0.8,
  },
  centreAnchor: {
    width: "100%",
    maxWidth: 320,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  aura: {
    position: "absolute",
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: 0,
  },
  auraLayer1: {
    backgroundColor: "rgba(124, 45, 18, 0.2)",
  },
  auraLayer2: {
    backgroundColor: "rgba(124, 45, 18, 0.3)",
    opacity: 0.3,
  },
  orb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: PRIMARY,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 20,
  },
  orbGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  symbolWrap: {
    marginBottom: 8,
    zIndex: 30,
  },
  waveformIcon: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 40,
  },
  waveformIconBar: {
    width: 2.5,
    borderRadius: 0,
  },
  metricCard: {
    zIndex: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: PRIMARY,
    borderRadius: 0,
    backgroundColor: "rgba(253, 249, 245, 0.1)",
    alignItems: "center",
  },
  dbRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  dbValue: {
    fontFamily: type.mono,
    fontSize: 48,
    lineHeight: 48,
    fontWeight: "700",
    color: PARCHMENT,
    letterSpacing: -1.6,
    fontVariant: ["tabular-nums"],
  },
  dbUnit: {
    fontFamily: type.mono,
    fontSize: 10,
    color: "rgba(253, 249, 245, 0.6)",
    marginLeft: 4,
    letterSpacing: 2,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  meterTrack: {
    marginTop: 4,
    width: 64,
    height: 4,
    borderRadius: 0,
    backgroundColor: "rgba(253, 249, 245, 0.2)",
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    backgroundColor: PARCHMENT,
    borderRadius: 0,
  },
  particleLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    opacity: 0.1,
  },
  particle: {
    position: "absolute",
    borderRadius: 0,
    backgroundColor: PARCHMENT,
    marginLeft: -1,
    marginTop: -1,
  },
  blocksRow: {
    width: "100%",
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: spacing.lg,
  },
  block: {
    flex: 1,
    borderWidth: 2,
    borderColor: PRIMARY,
    borderRadius: 0,
    backgroundColor: PARCHMENT,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 20,
    shadowColor: PRIMARY,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  blockActive: {
    backgroundColor: PRIMARY,
  },
  blockLabel: {
    fontFamily: type.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: "rgba(85, 66, 61, 0.5)",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  blockLabelActive: {
    color: PARCHMENT,
  },
  blockCheckCircle: {
    width: 40,
    height: 40,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: "rgba(124, 45, 18, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  blockCheckCircleActive: {
    borderColor: PARCHMENT,
  },
  waveformRow: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    opacity: 0.2,
    overflow: "hidden",
    paddingHorizontal: spacing.lg,
  },
  waveBar: {
    width: 2,
    borderRadius: 0,
    backgroundColor: PRIMARY,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  footerIconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  footerDash: {
    width: 24,
    height: 3,
    backgroundColor: "rgba(124, 45, 18, 0.4)",
    borderRadius: 0,
  },
});
