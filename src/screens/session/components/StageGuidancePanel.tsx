import React from "react";
import { View } from "react-native";
import { BodyText, MonoText } from "../../../design-system/primitives";
import type { StageGuidance } from "../../../data/stageGuidance";
import { styles } from "../sessionFlowStyles";

const ROWS: { key: keyof StageGuidance; label: string }[] = [
  { key: "psychological", label: "MINDSET" },
  { key: "scientific", label: "WHY IT WORKS" },
  { key: "motivation", label: "WHY NOW" },
  { key: "affirmation", label: "REMINDER" },
];

export function StageGuidancePanel({ guidance }: { guidance: StageGuidance }) {
  const entries = ROWS.map(({ key, label }) => ({ key, label, value: guidance[key] })).filter((row) => row.value);

  if (!entries.length) return null;

  return (
    <View style={styles.guidancePanel}>
      {entries.map((row) => (
        <View key={row.label} style={styles.guidanceRow}>
          <MonoText style={styles.guidanceLabel}>{row.label}</MonoText>
          <BodyText style={[styles.guidanceBody, row.key === "affirmation" && styles.guidanceAffirmation]}>{row.value}</BodyText>
        </View>
      ))}
    </View>
  );
}
