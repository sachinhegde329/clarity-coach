import React from "react";
import { View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel } from "../../../design-system/primitives";
import { palette, spacing } from "../../../design-system/theme";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";

export function PhotoPlaceholder({ height = 144, label }: { height?: number; label?: string }) {
  return (
    <View
      style={{
        height,
        backgroundColor: palette.black,
        borderWidth: 1,
        borderColor: palette.lineSoft,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: "140%",
          height: 24,
          backgroundColor: "rgba(255,255,255,0.08)",
          transform: [{ rotate: "-18deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: "140%",
          height: 12,
          backgroundColor: "rgba(255,255,255,0.14)",
          transform: [{ rotate: "28deg" }],
        }}
      />
      {label ? (
        <View style={{ backgroundColor: palette.paper, borderWidth: 2, borderColor: palette.line, paddingHorizontal: 12, paddingVertical: 8 }}>
          <MonoText style={{ color: palette.line }}>{label}</MonoText>
        </View>
      ) : null}
    </View>
  );
}
