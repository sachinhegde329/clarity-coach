import React from "react";
import { View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel } from "../../../design-system/primitives";
import { palette, spacing } from "../../../design-system/theme";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";

export function MetricInsight({
  title,
  copy,
  value,
  foot,
  filled,
  wide,
  narrow,
}: {
  title: string;
  copy: string;
  value: string;
  foot: string;
  filled?: boolean;
  wide?: boolean;
  narrow?: boolean;
}) {
  return (
    <Panel tone={filled ? "soft" : "paper"} style={[styles.metricCard, wide && styles.metricWide, narrow && styles.metricNarrow]}>
      <MonoText style={styles.metricLabel}>{title}</MonoText>
      <BodyText>{copy}</BodyText>
      <View style={styles.metricFooter}>
        <DisplayText style={styles.metricBig}>{value}</DisplayText>
        <MonoText style={styles.metricFoot}>{foot}</MonoText>
      </View>
    </Panel>
  );
}
