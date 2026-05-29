import React from "react";
import { View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel } from "../../../design-system/primitives";
import { palette, spacing } from "../../../design-system/theme";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";

export function DottedStageBackground({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#E7D7CA",
        backgroundColor: palette.paper,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0.22,
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 8,
        }}
      >
        {Array.from({ length: 280 }).map((_, index) => (
          <View
            key={index}
            style={{
              width: "6.66%",
              alignItems: "center",
              justifyContent: "center",
              height: 18,
            }}
          >
            <View style={{ width: 2, height: 2, borderRadius: 99, backgroundColor: palette.line }} />
          </View>
        ))}
      </View>
      {children}
    </View>
  );
}
