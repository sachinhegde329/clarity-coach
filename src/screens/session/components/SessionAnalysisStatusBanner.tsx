import React from "react";
import { View } from "react-native";
import { BodyText, MonoText } from "../../../design-system/primitives";
import { palette, spacing } from "../../../design-system/theme";
import { styles } from "../sessionFlowStyles";

export function SessionAnalysisStatusBanner({
  isProcessing,
  error,
}: {
  isProcessing: boolean;
  error: string | null;
}) {
  if (!isProcessing && !error) return null;

  return (
    <View
      style={[
        styles.brutalistPanel,
        styles.brutalistShadowInk,
        {
          padding: spacing.md,
          backgroundColor: error ? "rgba(166,74,66,0.08)" : palette.panel,
        },
      ]}
    >
      <MonoText style={styles.listenCardKicker}>{error ? "ANALYSIS ISSUE" : "ANALYSING CAPTURE"}</MonoText>
      <BodyText style={{ lineHeight: 22, marginTop: spacing.xs }}>
        {error ??
          "Uploading your recording, building transcript metrics, and preparing coaching readout."}
      </BodyText>
    </View>
  );
}
