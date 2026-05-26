import React from "react";
import { View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel } from "../../../design-system/primitives";
import { palette, spacing } from "../../../design-system/theme";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";

export function TextHighlight({ children }: { children: React.ReactNode }) {
  return <MonoText style={{ backgroundColor: palette.line, color: palette.paper, paddingHorizontal: 6 }}>{children}</MonoText>;
}
