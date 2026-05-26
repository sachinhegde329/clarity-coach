import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette } from "./theme";

type IconName =
  | "profile"
  | "globe"
  | "menu"
  | "today"
  | "journey"
  | "library"
  | "stats"
  | "back"
  | "arrow"
  | "centre"
  | "listen"
  | "do"
  | "see"
  | "commit"
  | "mic"
  | "play"
  | "spark"
  | "lock"
  | "close"
  | "briefcase"
  | "clock"
  | "wave"
  | "medal"
  | "bolt"
  | "psychology"
  | "casino"
  | "check"
  | "videocam"
  | "chevronDown"
  | "info";

export function Icon({ name, size = 24, color = palette.ink }: { name: IconName; size?: number; color?: string }) {
  switch (name) {
    case "profile":
      return (
        <View style={[styles.circle, { width: size, height: size, borderColor: color }]}>
          <View style={[styles.profileHead, { borderColor: color, width: size * 0.28, height: size * 0.28, top: size * 0.18 }]} />
          <View style={[styles.profileBody, { borderColor: color, width: size * 0.52, height: size * 0.24, bottom: size * 0.16 }]} />
        </View>
      );
    case "globe":
      return (
        <View style={[styles.circle, { width: size, height: size, borderColor: color }]}>
          <View style={[styles.globeVertical, { backgroundColor: color, height: size * 0.72 }]} />
          <View style={[styles.globeHorizontal, { backgroundColor: color, width: size * 0.72 }]} />
        </View>
      );
    case "menu":
      return (
        <View style={{ gap: 4 }}>
          {[0, 1, 2].map((line) => (
            <View key={line} style={{ width: size, height: 2, backgroundColor: color }} />
          ))}
        </View>
      );
    case "today":
      return (
        <View style={[styles.circle, { width: size, height: size, borderColor: color, justifyContent: "center", alignItems: "center" }]}>
          <View style={[styles.targetRing, { width: size * 0.46, height: size * 0.46, borderColor: color }]} />
          <View style={{ width: size * 0.12, height: size * 0.12, borderRadius: 999, backgroundColor: color }} />
        </View>
      );
    case "journey":
      return (
        <View style={{ width: size, height: size, justifyContent: "center" }}>
          <View style={[styles.sparkLine, { borderColor: color }]}>
            <View style={[styles.sparkDot, { left: 0, bottom: 0, backgroundColor: color }]} />
            <View style={[styles.sparkDot, { left: size * 0.32, bottom: size * 0.3, backgroundColor: color }]} />
            <View style={[styles.sparkDot, { left: size * 0.58, bottom: size * 0.12, backgroundColor: color }]} />
            <View style={[styles.sparkDot, { left: size * 0.82, bottom: size * 0.46, backgroundColor: color }]} />
          </View>
        </View>
      );
    case "library":
      return (
        <View style={[styles.bookWrap, { width: size, height: size * 0.78, borderColor: color }]}>
          <View style={[styles.bookPage, { borderColor: color }]} />
          <View style={[styles.bookPage, { borderColor: color }]} />
        </View>
      );
    case "stats":
      return (
        <View style={{ width: size, height: size, flexDirection: "row", alignItems: "flex-end", gap: 3 }}>
          {[0.4, 0.7, 0.95].map((factor, index) => (
            <View key={index} style={{ flex: 1, height: size * factor, borderWidth: 2, borderColor: color }} />
          ))}
        </View>
      );
    case "centre":
      return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: size * 0.26,
              height: size * 0.26,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: color,
              marginBottom: size * 0.06,
            }}
          />
          <View style={{ width: size, height: size * 0.48, alignItems: "center" }}>
            <View
              style={{
                width: size * 0.34,
                height: size * 0.18,
                borderWidth: 2,
                borderColor: color,
                borderTopWidth: 0,
                borderBottomLeftRadius: 999,
                borderBottomRightRadius: 999,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: size * 0.12,
                width: size * 0.66,
                height: 2,
                backgroundColor: color,
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                width: size * 0.74,
                height: 2,
                backgroundColor: color,
                opacity: 0.7,
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                width: size * 0.26,
                height: size * 0.18,
                borderLeftWidth: 2,
                borderBottomWidth: 2,
                borderColor: color,
                transform: [{ rotate: "45deg" }],
                left: size * 0.16,
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                width: size * 0.26,
                height: size * 0.18,
                borderRightWidth: 2,
                borderBottomWidth: 2,
                borderColor: color,
                transform: [{ rotate: "-45deg" }],
                right: size * 0.16,
              }}
            />
          </View>
        </View>
      );
    case "listen":
      return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: size * 0.78,
              height: size * 0.78,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: color,
              borderLeftColor: "transparent",
              borderBottomColor: "transparent",
              transform: [{ rotate: "-35deg" }],
            }}
          />
          <View
            style={{
              position: "absolute",
              width: size * 0.44,
              height: size * 0.44,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: color,
              borderLeftColor: "transparent",
              borderBottomColor: "transparent",
              transform: [{ rotate: "-35deg" }],
              opacity: 0.9,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: size * 0.16,
              height: size * 0.16,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: color,
              right: size * 0.18,
              bottom: size * 0.22,
            }}
          />
        </View>
      );
    case "do":
      return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: size * 0.34,
              height: size * 0.56,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: color,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: size * 0.16,
              width: size * 0.62,
              height: size * 0.26,
              borderWidth: 2,
              borderColor: color,
              borderTopWidth: 0,
              borderBottomLeftRadius: 999,
              borderBottomRightRadius: 999,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: size * 0.06,
              width: size * 0.46,
              height: 2,
              backgroundColor: color,
              opacity: 0.9,
            }}
          />
        </View>
      );
    case "see":
      return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: size * 0.94,
              height: size * 0.56,
              borderWidth: 2,
              borderColor: color,
              borderRadius: 999,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: size * 0.22,
              height: size * 0.22,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: color,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: size * 0.08,
              height: size * 0.08,
              borderRadius: 999,
              backgroundColor: color,
            }}
          />
        </View>
      );
    case "commit":
      return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: size * 0.82, height: size * 0.82, borderWidth: 2, borderColor: color }} />
          <View
            style={{
              position: "absolute",
              width: size * 0.44,
              height: size * 0.22,
              borderLeftWidth: 2,
              borderBottomWidth: 2,
              borderColor: color,
              transform: [{ rotate: "-45deg" }],
              marginTop: size * 0.06,
            }}
          />
        </View>
      );
    case "back":
      return <Text style={{ fontSize: size, color, fontWeight: "700" }}>←</Text>;
    case "arrow":
      return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: size * 0.55, height: 2, backgroundColor: color }} />
          <View
            style={{
              position: "absolute",
              right: size * 0.12,
              width: size * 0.28,
              height: size * 0.28,
              borderTopWidth: 2,
              borderRightWidth: 2,
              borderColor: color,
              transform: [{ rotate: "45deg" }],
            }}
          />
        </View>
      );
    case "mic":
      return <Text style={{ fontSize: size, color }}>◉</Text>;
    case "play":
      return <Text style={{ fontSize: size * 0.85, color }}>▷</Text>;
    case "spark":
      return <Text style={{ fontSize: size * 0.8, color }}>✦</Text>;
    case "lock":
      return <Text style={{ fontSize: size * 0.8, color }}>⌂</Text>;
    case "close":
      return <Text style={{ fontSize: size * 0.9, color }}>✕</Text>;
    case "briefcase":
      return (
        <View style={[styles.briefcase, { width: size, height: size * 0.74, borderColor: color }]}>
          <View style={[styles.briefcaseHandle, { borderColor: color, width: size * 0.42, height: size * 0.18, top: -size * 0.14 }]} />
          <View style={[styles.briefcaseLatch, { backgroundColor: color }]} />
        </View>
      );
    case "clock":
      return (
        <View style={[styles.circle, { width: size, height: size, borderColor: color }]}>
          <View style={[styles.clockHandVertical, { backgroundColor: color, height: size * 0.26 }]} />
          <View style={[styles.clockHandHorizontal, { backgroundColor: color, width: size * 0.2, right: size * 0.18 }]} />
        </View>
      );
    case "wave":
      return (
        <View style={{ width: size, height: size, justifyContent: "center", gap: 4 }}>
          {[0.5, 0.8, 0.62, 0.92, 0.55].map((factor, index) => (
            <View key={index} style={{ height: 2, width: size * factor, backgroundColor: color }} />
          ))}
        </View>
      );
    case "medal":
      return (
        <View style={{ width: size, height: size, alignItems: "center" }}>
          <View style={styles.medalRibbonRow}>
            <View style={[styles.medalRibbon, { backgroundColor: color }]} />
            <View style={[styles.medalRibbon, { backgroundColor: color }]} />
          </View>
          <View style={[styles.circle, { width: size * 0.66, height: size * 0.66, borderColor: color, marginTop: -2 }]} />
        </View>
      );
    case "bolt":
      return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: size * 0.36,
              height: size * 0.78,
              backgroundColor: color,
              transform: [{ rotate: "-8deg" }, { skewY: "-6deg" }],
            }}
          />
          <View
            style={{
              position: "absolute",
              top: size * 0.06,
              left: size * 0.38,
              width: 0,
              height: 0,
              borderLeftWidth: size * 0.12,
              borderRightWidth: size * 0.12,
              borderBottomWidth: size * 0.18,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: color,
              transform: [{ rotate: "180deg" }],
            }}
          />
        </View>
      );
    case "psychology":
      return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <View style={[styles.circle, { width: size * 0.72, height: size * 0.72, borderColor: color }]} />
          <View
            style={{
              position: "absolute",
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: 999,
              backgroundColor: color,
              top: size * 0.12,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: size * 0.5,
              height: 2,
              backgroundColor: color,
              bottom: size * 0.22,
              transform: [{ rotate: "-12deg" }],
            }}
          />
        </View>
      );
    case "casino":
      return (
        <View style={[styles.dice, { width: size * 0.82, height: size * 0.82, borderColor: color }]}>
          {[
            { top: 3, left: 3 },
            { top: 3, right: 3 },
            { center: true },
            { bottom: 3, left: 3 },
            { bottom: 3, right: 3 },
          ].map((dot, index) => (
            <View
              key={index}
              style={[
                styles.diceDot,
                { backgroundColor: color },
                dot.center
                  ? { top: "50%", left: "50%", marginTop: -2, marginLeft: -2 }
                  : dot,
              ]}
            />
          ))}
        </View>
      );
    case "check":
      return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: size * 0.22,
              height: size * 0.42,
              borderLeftWidth: 2.5,
              borderBottomWidth: 2.5,
              borderColor: color,
              transform: [{ rotate: "-45deg" }],
              marginTop: size * 0.04,
              marginLeft: -size * 0.04,
            }}
          />
        </View>
      );
    case "videocam":
      return (
        <View style={{ width: size, height: size * 0.72, justifyContent: "center" }}>
          <View style={[styles.videocamBody, { borderColor: color, width: size * 0.62, height: size * 0.62 }]} />
          <View
            style={{
              position: "absolute",
              right: 0,
              width: size * 0.22,
              height: size * 0.22,
              borderTopWidth: size * 0.11,
              borderBottomWidth: size * 0.11,
              borderLeftWidth: size * 0.16,
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: color,
            }}
          />
        </View>
      );
    case "chevronDown":
      return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: size * 0.42,
              height: size * 0.42,
              borderRightWidth: 2,
              borderBottomWidth: 2,
              borderColor: color,
              transform: [{ rotate: "45deg" }],
              marginTop: -size * 0.12,
            }}
          />
        </View>
      );
    case "info":
      return (
        <View style={[styles.circle, { width: size, height: size, borderColor: color, justifyContent: "center", alignItems: "center" }]}>
          <Text style={{ fontSize: size * 0.7, color, fontWeight: "700" }}>i</Text>
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 2,
    borderRadius: 999,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  profileHead: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 999,
  },
  profileBody: {
    position: "absolute",
    borderWidth: 2,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomWidth: 0,
  },
  globeVertical: {
    position: "absolute",
    width: 2,
  },
  globeHorizontal: {
    position: "absolute",
    height: 2,
  },
  targetRing: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 999,
  },
  sparkLine: {
    height: "70%",
    borderBottomWidth: 2,
    transform: [{ skewX: "-18deg" }],
  },
  sparkDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 999,
  },
  bookWrap: {
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  bookPage: {
    flex: 1,
    borderRightWidth: 1,
  },
  briefcase: {
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  briefcaseHandle: {
    position: "absolute",
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  briefcaseLatch: {
    width: 8,
    height: 2,
  },
  clockHandVertical: {
    position: "absolute",
    width: 2,
    top: "22%",
  },
  clockHandHorizontal: {
    position: "absolute",
    height: 2,
  },
  medalRibbonRow: {
    flexDirection: "row",
    gap: 4,
  },
  medalRibbon: {
    width: 6,
    height: 12,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  dice: {
    borderWidth: 2,
    borderRadius: 4,
    position: "relative",
  },
  diceDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 999,
  },
  videocamBody: {
    borderWidth: 2,
    borderRadius: 4,
  },
});
