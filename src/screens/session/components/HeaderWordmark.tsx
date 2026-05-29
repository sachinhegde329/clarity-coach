import React from "react";
import { View } from "react-native";
import { DisplayText, LogoGlyph, MonoText } from "../../../design-system/primitives";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";

export function HeaderWordmark({ sessionElapsed, stepIndex }: { sessionElapsed?: number; stepIndex?: number }) {
  return (
    <View style={styles.headerWordmark}>
      <LogoGlyph barHeights={[10, 16, 24, 16, 10]} />
      <DisplayText style={styles.headerTitle}>CLARITY{"\n"}COACH</DisplayText>
      {typeof stepIndex === "number" ? (
        <View style={styles.headerMeta}>
          <MonoText>SESSION</MonoText>
          <MonoText>{String(stepIndex + 1).padStart(2, "0")}/05</MonoText>
          <MonoText style={styles.headerClock}>{formatTime(sessionElapsed ?? 0)}</MonoText>
        </View>
      ) : null}
    </View>
  );
}
