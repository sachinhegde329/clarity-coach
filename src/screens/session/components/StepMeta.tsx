import React from "react";
import { View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel } from "../../../design-system/primitives";
import { palette, spacing } from "../../../design-system/theme";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";

export function StepMeta({ left, right }: { left: string; right: string }) {
  return (
    <View style={styles.stepMeta}>
      <MonoText>{left}</MonoText>
      <MonoText>{right}</MonoText>
    </View>
  );
}
