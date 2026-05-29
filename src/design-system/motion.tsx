import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Icon } from "./icons";
import { DisplayText, MonoText, Panel } from "./primitives";
import { palette } from "./theme";

// ─── Haptic Feedback ────────────────────────────────────────────────

export function triggerHaptic(
  type: "light" | "medium" | "heavy" | "selection" | "success" | "warning" | "error" = "light",
) {
  try {
    const Haptics = require("expo-haptics");
    switch (type) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "selection":
        Haptics.selectionAsync();
        break;
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch {
    // Haptics unavailable — silently ignore
  }
}

// ─── Directional Slide Transition ───────────────────────────────────

type SlideTransitionProps = {
  children: ReactNode;
  direction: "forward" | "backward" | "none";
  duration?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
  onRest?: () => void;
};

/**
 * Slides content in from the left (backward) or right (forward),
 * with a simultaneous fade. Designed for staged navigation.
 */
export function SlideTransition({
  children,
  direction,
  duration = 350,
  distance = 60,
  style,
  onRest,
}: SlideTransitionProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const prevDirection = useRef(direction);

  useEffect(() => {
    const isInitial = prevDirection.current === direction && direction !== "none";
    if (isInitial) return;

    anim.setValue(direction === "forward" ? 1 : direction === "backward" ? -1 : 0);
    prevDirection.current = direction;

    if (direction === "none") return;

    Animated.parallel([
      Animated.timing(anim, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(onRest);
  }, [anim, direction, duration, onRest]);

  const opacity = anim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const translateX = anim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [distance, 0, -distance],
  });

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
}

// ─── Animated Count-Up ──────────────────────────────────────────────

type AnimatedCountUpProps = {
  value: number;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  formatFn?: (value: number) => string;
};

export function AnimatedCountUp({
  value,
  duration = 800,
  delay = 0,
  style,
  formatFn = String,
}: AnimatedCountUpProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const displayed = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [anim, value, duration, delay]);

  useEffect(() => {
    const listener = anim.addListener(({ value: progress }) => {
      displayed.setValue(Math.round(progress * value));
    });
    return () => anim.removeListener(listener);
  }, [anim, displayed, value]);

  const [displayText, setDisplayText] = React.useState(formatFn(0));

  useEffect(() => {
    const id = anim.addListener(({ value: progress }) => {
      const currentValue = Math.round(progress * value);
      setDisplayText(formatFn(currentValue));
    });
    return () => anim.removeListener(id);
  }, [anim, formatFn, value]);

  return <Animated.Text style={style}>{displayText}</Animated.Text>;
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
};

export function Reveal({ children, delay = 0, distance = 14, style }: RevealProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 520,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

type InteractivePressableProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function InteractivePressable({
  children,
  onPress,
  style,
  disabled,
}: InteractivePressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      tension: 220,
      friction: 18,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => animateTo(0.97)}
      onPressOut={() => animateTo(1)}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </Pressable>
  );
}

type FloatingOrbProps = {
  size: number;
  color?: string;
  opacity?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  duration?: number;
  amplitude?: number;
  style?: StyleProp<ViewStyle>;
};

export function FloatingOrb({
  size,
  color = palette.panelSoft,
  opacity = 0.7,
  top,
  right,
  bottom,
  left,
  duration = 5200,
  amplitude = 12,
  style,
}: FloatingOrbProps) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [drift, duration]);

  const translateY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -amplitude],
  });
  const scale = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          top,
          right,
          bottom,
          left,
          transform: [{ translateY }, { scale }],
        },
        style,
      ]}
    />
  );
}

type BreathPulseProps = {
  active: boolean;
  children: ReactNode;
  size?: number;
};

/** Gentle scale pulse around centre-stage breath UI. */
export function BreathPulse({ active, children, size = 260 }: BreathPulseProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: "#E7D4C4",
          transform: [{ scale }],
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          width: size * 0.76,
          height: size * 0.76,
          borderRadius: (size * 0.76) / 2,
          borderWidth: 2,
          borderColor: "#DCC5B1",
          transform: [{ scale }],
          opacity: 0.9,
        }}
      />
      {children}
    </View>
  );
}

export function CelebrationOverlay({
  visible,
  title = "Session complete",
  subtitle = "Nice work. Keep going.",
  onDone,
}: {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0.96)).current;

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, index) => {
        const angle = (index / 18) * Math.PI * 2;
        return {
          key: `p-${index}`,
          x: Math.cos(angle) * (40 + (index % 6) * 7),
          y: Math.sin(angle) * (40 + ((index + 3) % 6) * 7),
          size: 6 + (index % 4) * 2,
          delay: 40 + (index % 6) * 35,
          color: index % 3 === 0 ? palette.line : index % 3 === 1 ? palette.blush : "#F3E2D3",
        };
      }),
    [],
  );

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(0);
    rise.setValue(0);
    pop.setValue(0.96);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(pop, { toValue: 1, tension: 200, friction: 14, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 1, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [opacity, onDone, pop, rise, visible]);

  if (!visible) return null;

  const translateY = rise.interpolate({ inputRange: [0, 1], outputRange: [22, -18] });

  return (
    <Pressable onPress={onDone} style={celebrateStyles.overlay} accessibilityLabel="Session completion celebration">
      <Animated.View style={[celebrateStyles.backdrop, { opacity }]} />
      <Animated.View style={[celebrateStyles.centerWrap, { opacity, transform: [{ translateY }, { scale: pop }] }]}>
        <View style={celebrateStyles.particleField} pointerEvents="none">
          {particles.map((particle) => (
            <Particle
              key={particle.key}
              x={particle.x}
              y={particle.y}
              size={particle.size}
              delay={particle.delay}
              color={particle.color}
              visible={visible}
            />
          ))}
        </View>

        <Panel style={celebrateStyles.card}>
          <View style={celebrateStyles.iconHalo}>
            <Icon name="spark" size={28} color={palette.paper} />
          </View>
          <DisplayText style={celebrateStyles.title}>{title}</DisplayText>
          <MonoText style={celebrateStyles.subtitle}>{subtitle}</MonoText>
        </Panel>
      </Animated.View>
    </Pressable>
  );
}

function Particle({
  x,
  y,
  size,
  delay,
  color,
  visible,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
  visible: boolean;
}) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    t.setValue(0);
    Animated.timing(t, { toValue: 1, duration: 900, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [delay, t, visible]);

  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [0, x] });
  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, y] });
  const particleOpacity = t.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 1, 0] });
  const scale = t.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.6, 1, 0.9] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: color,
        opacity: particleOpacity,
        transform: [{ translateX }, { translateY }, { scale }],
      }}
    />
  );
}

export function PulseDots({ count = 3 }: { count?: number }) {
  const dots = useMemo(() => Array.from({ length: count }), [count]);

  return (
    <View style={styles.dotRow}>
      {dots.map((_, index) => (
        <PulsingDot key={index} delay={index * 180} />
      ))}
    </View>
  );
}

function PulsingDot({ delay }: { delay: number }) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 600,
            delay,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 600,
            delay,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 600,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.35,
            duration: 600,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [delay, opacity, scale]);

  return <Animated.View style={[styles.dot, { opacity, transform: [{ scale }] }]} />;
}

/** Wraps a section with a staggered fade+slide reveal. Use consecutive indices for cascading entry. */
export function RevealSection({
  children,
  index = 0,
  staggerMs = 100,
  distance = 16,
  style,
}: {
  children: ReactNode;
  index?: number;
  staggerMs?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        delay: index * staggerMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 460,
        delay: index * staggerMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, staggerMs, opacity, translateY]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

/** Gentle breath-scale pulse on a wrapped element. Active toggles the loop. */
export function PulseWrapper({
  active,
  children,
  scaleAmplitude = 0.04,
  duration = 1800,
}: {
  active: boolean;
  children: ReactNode;
  scaleAmplitude?: number;
  duration?: number;
}) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      Animated.timing(pulse, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: duration / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: duration / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulse, duration]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1 + scaleAmplitude],
  });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {children}
    </Animated.View>
  );
}

// ─── Animated Recording Button ──────────────────────────────────────

type PulsingRecordButtonProps = {
  active: boolean;
  size?: number;
  onPress: () => void;
  children: ReactNode;
  ringColor?: string;
};

export function PulsingRecordButton({
  active,
  size = 128,
  onPress,
  children,
  ringColor = "rgba(124,45,18,0.22)",
}: PulsingRecordButtonProps) {
  const outerRingScale = useRef(new Animated.Value(1)).current;
  const innerRingScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      Animated.parallel([
        Animated.timing(outerRingScale, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(innerRingScale, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(outerRingScale, {
            toValue: 1.08,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(innerRingScale, {
            toValue: 1.12,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(outerRingScale, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(innerRingScale, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, outerRingScale, innerRingScale]);

  const ringSize = size + 20;
  const innerRingSize = size + 48;

  return (
    <Pressable onPress={onPress}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          style={{
            position: "absolute",
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderWidth: 4,
            borderColor: ringColor,
            transform: [{ scale: outerRingScale }],
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            width: innerRingSize,
            height: innerRingSize,
            borderRadius: innerRingSize / 2,
            borderWidth: 2,
            borderColor: ringColor.replace("0.22", "0.12"),
            transform: [{ scale: innerRingScale }],
          }}
        />
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: palette.line,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  dotRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: palette.line,
  },
});

const celebrateStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 10, 8, 0.14)",
  },
  centerWrap: {
    width: "100%",
    paddingHorizontal: 18,
    alignItems: "center",
  },
  particleField: {
    position: "absolute",
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    gap: 10,
  },
  iconHalo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: palette.line,
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    textAlign: "center",
  },
  subtitle: {
    color: palette.inkMuted,
    textAlign: "center",
    letterSpacing: 0.4,
  },
});
