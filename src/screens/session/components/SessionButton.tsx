import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Icon } from "../../../design-system/icons";
import { MonoText } from "../../../design-system/primitives";
import { InteractivePressable } from "../../../design-system/motion";
import { palette, spacing, type } from "../../../design-system/theme";

/** Commit-to-Journey brutalist button — standard for all session 1–5 CTAs. */
export function SessionButton({
  label,
  onPress,
  variant = "primary",
  icon,
  iconLeft,
  disabled,
  fullWidth = true,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  iconLeft?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}) {
  const isPrimary = variant === "primary";
  const disabledOpacity = disabled ? 0.45 : 1;

  return (
    <InteractivePressable onPress={onPress} disabled={disabled} style={[fullWidth && styles.fullWidth, style]}>
      <View
        style={[
          styles.button,
          isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
          { opacity: disabledOpacity },
        ]}
      >
        <View style={styles.labelRow}>
          {iconLeft ?? null}
          <MonoText style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>{label}</MonoText>
        </View>
        {icon ?? <Icon name="arrow" size={22} color={isPrimary ? palette.paper : palette.black} />}
      </View>
    </InteractivePressable>
  );
}

const INK = "#2E2E2E";
const PARCHMENT = "#FDF6E3";
const PRIMARY = "#6c2f00";

const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
  button: {
    minHeight: 56,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: INK,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonPrimary: {
    backgroundColor: PRIMARY,
    borderColor: INK,
  },
  buttonSecondary: {
    backgroundColor: PARCHMENT,
    borderColor: INK,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 1,
  },
  label: {
    fontFamily: type.mono,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  labelPrimary: {
    color: palette.paper,
  },
  labelSecondary: {
    color: palette.black,
  },
});
