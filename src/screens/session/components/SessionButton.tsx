import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Icon } from "../../../design-system/icons";
import { MonoText } from "../../../design-system/primitives";
import { palette, spacing, type } from "../../../design-system/theme";

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
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}) {
  const isPrimary = variant === "primary";
  const disabledOpacity = disabled ? 0.45 : 1;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const animateTo = (value: number) => {
    Animated.spring(translateAnim, {
      toValue: value,
      tension: 220,
      friction: 18,
      useNativeDriver: true,
    }).start();
  };

  const translateX = translateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });
  const translateY = translateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => animateTo(1)}
      onPressOut={() => animateTo(0)}
      style={[fullWidth && styles.fullWidth, style]}
    >
      <View style={styles.shadowLayer}>
        <Animated.View
          style={[
            styles.button,
            isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
            { opacity: disabledOpacity, transform: [{ translateX }, { translateY }] },
          ]}
        >
          <View style={styles.labelRow}>
            {iconLeft ?? null}
            <MonoText style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>{label}</MonoText>
          </View>
          {icon ?? <Icon name="arrow" size={22} color={isPrimary ? palette.inkFocus : palette.parchmentSurface} />}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
  shadowLayer: {
    shadowOffset: { width: 4, height: 4 },
    shadowColor: palette.siennaAccent,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  button: {
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  buttonPrimary: {
    backgroundColor: palette.parchmentSurface,
    borderColor: palette.inkFocus,
  },
  buttonSecondary: {
    backgroundColor: palette.inkFocus,
    borderColor: palette.inkFocus,
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
    color: palette.inkFocus,
  },
  labelSecondary: {
    color: palette.parchmentSurface,
  },
});
