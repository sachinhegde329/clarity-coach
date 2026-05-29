export const palette = {
  // Legacy app colors (keep for backward compat)
  canvas: "#F8F1EA",
  paper: "#FCF7F1",
  panel: "#F1E3D6",
  panelSoft: "#F7ECE1",
  blush: "#F4DDD1",
  apricot: "#E9C5AF",
  line: "#6A210B",
  lineSoft: "#D8B7A3",
  ink: "#6A210B",
  inkMuted: "#7F675B",
  shadow: "#6A210B",
  peach: "#C88256",
  sand: "#E8D8CB",
  sky: "#F4ECE5",
  moss: "#8A9578",
  mint: "#E9E0D8",
  white: "#FFFFFF",
  black: "#2C140D",

  // Design system colors
  parchmentSurface: "#FDF6E3",
  siennaAccent: "#8B4513",
  inkFocus: "#2E2E2E",
  sageSuccess: "#7A8C70",
  primary: "#6c2f00",
  surface: "#fff8f5",
  outline: "#877369",
  outlineVariant: "#dac2b6",
  error: "#ba1a1a",
  onPrimary: "#ffffff",
  onSurface: "#221a16",
  onSurfaceVariant: "#54433a",
  onPrimaryContainer: "#ffc29f",
  inverseSurface: "#372f2a",
  inverseOnSurface: "#feeee6",
  inversePrimary: "#ffb68c",
  surfaceContainer: "#fbebe3",
  surfaceContainerLow: "#fff1eb",
  surfaceContainerHigh: "#f5e5de",
  surfaceContainerHighest: "#efdfd8",
  surfaceDim: "#e6d7d0",
  surfaceBright: "#fff8f5",
  surfaceVariant: "#efdfd8",
  background: "#fff8f5",
  onBackground: "#221a16",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radii = {
  sm: 0,
  md: 0,
  lg: 0,
  full: 0,
};

export const hardShadow = (color: string = palette.siennaAccent, offset: number = 4) => ({
  shadowColor: color,
  shadowOffset: { width: offset, height: offset },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 0,
});

export const type = {
  display: "Chivo_800ExtraBold",
  heading: "Chivo_800ExtraBold",
  body: "LibreFranklin_400Regular",
  bodyMedium: "LibreFranklin_500Medium",
  bodyBold: "LibreFranklin_700Bold",
  mono: "JetBrainsMono_600SemiBold",
  monoBold: "JetBrainsMono_700Bold",
};
