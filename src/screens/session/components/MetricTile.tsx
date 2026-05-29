import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";
import { DisplayText, MonoText, Panel } from "../../../design-system/primitives";
import { styles } from "../sessionFlowStyles";

function parseNumericValue(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const numberPart = Number(match[1]);
  if (!Number.isFinite(numberPart)) return null;
  return { numberPart, suffix: (match[2] ?? "").trimStart() };
}

export function MetricTile({
  label,
  value,
  reveal,
}: {
  label: string;
  value: string;
  reveal?: { delayMs?: number; fadeMs?: number; countUpMs?: number };
}) {
  const opacity = useRef(new Animated.Value(reveal ? 0 : 1)).current;
  const [displayValue, setDisplayValue] = useState(value);

  const numeric = useMemo(() => parseNumericValue(value), [value]);

  useEffect(() => {
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;

      if (reveal) {
        opacity.setValue(0);
        Animated.timing(opacity, {
          toValue: 1,
          duration: reveal.fadeMs ?? 220,
          useNativeDriver: true,
        }).start();
      }

      if (!reveal?.countUpMs || !numeric) {
        setDisplayValue(value);
        return;
      }

      const startTime = Date.now();
      const duration = Math.max(0, reveal.countUpMs);

      const tick = () => {
        if (cancelled) return;
        const elapsed = Date.now() - startTime;
        const t = duration === 0 ? 1 : Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(numeric.numberPart * eased);
        setDisplayValue(`${current}${numeric.suffix ? ` ${numeric.suffix}` : ""}`.trim());
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    delayTimer = setTimeout(start, reveal?.delayMs ?? 0);

    return () => {
      cancelled = true;
      if (delayTimer) clearTimeout(delayTimer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      opacity.stopAnimation();
    };
  }, [numeric, opacity, reveal, value]);

  return (
    <Animated.View style={{ opacity }}>
      <Panel tone="soft" style={styles.guidedMetricTile}>
        <MonoText style={styles.metricLabel}>{label}</MonoText>
        <DisplayText style={styles.guidedMetricValue}>{displayValue}</DisplayText>
      </Panel>
    </Animated.View>
  );
}
