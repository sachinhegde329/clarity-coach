import React from "react";
import { View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel } from "../../../design-system/primitives";
import { palette, spacing } from "../../../design-system/theme";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";

export function EditorialWaveform({
  bars,
  height = 92,
  light = false,
}: {
  bars: number[];
  height?: number;
  light?: boolean;
}) {
  return (
    <View
      style={{
        height,
        borderWidth: 1,
        borderColor: light ? "#E6D7CA" : palette.lineSoft,
        backgroundColor: light ? palette.paper : "#FFF9F2",
        paddingHorizontal: spacing.md,
        justifyContent: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
        {bars.map((bar, index) => (
          <View
            key={index}
            style={{
              width: 2,
              height: bar,
              backgroundColor: index % 4 === 0 && light ? "#C9A18E" : palette.line,
              opacity: light ? 0.85 : 1,
            }}
          />
        ))}
      </View>
    </View>
  );
}
