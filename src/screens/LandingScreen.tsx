import React from "react";
import { StyleSheet, View } from "react-native";
import { AppHeader, BodyText, MonoText, PrimaryButton, Wordmark } from "../design-system/primitives";
import { Icon } from "../design-system/icons";
import { palette, spacing, type } from "../design-system/theme";

export function LandingScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <View style={styles.screen}>
      <AppHeader
        left={<Wordmark />}
        right={
          <View style={styles.headerRight}>
            <Icon name="globe" size={22} />
            <MonoText>EN</MonoText>
          </View>
        }
      />

      <View style={styles.body}>
        <BodyText style={styles.heroText}>
          Five minutes a day. Thirty-six sessions. You will hear the difference.
        </BodyText>

        <PrimaryButton label="LET'S BEGIN" onPress={onBegin} />

        <MonoText style={styles.signIn}>ALREADY HAVE AN ACCOUNT? SIGN IN</MonoText>

        <View style={styles.swatches}>
          <View style={[styles.swatch, { backgroundColor: palette.peach }]} />
          <View style={[styles.swatch, { backgroundColor: palette.sand }]} />
          <View style={[styles.swatch, { backgroundColor: palette.sky }]} />
        </View>

        <MonoText style={styles.footer}>© CLARITY COACH SYSTEMS MMXXIV</MonoText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 56,
    justifyContent: "space-between",
    paddingBottom: spacing.xl,
  },
  heroText: {
    fontFamily: type.display,
    color: palette.ink,
    textAlign: "center",
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -1.5,
  },
  signIn: {
    textAlign: "center",
    fontSize: 15,
  },
  swatches: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 36,
  },
  swatch: {
    width: 72,
    height: 72,
  },
  footer: {
    textAlign: "center",
    color: palette.lineSoft,
    fontSize: 14,
  },
});
