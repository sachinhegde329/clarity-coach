import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { MonoText } from "../../../design-system/primitives";
import { styles } from "../sessionFlowStyles";

function AnimatedProgressFill({ active, done }: { active: boolean; done: boolean }) {
  const widthAnim = useRef(new Animated.Value(done || active ? 1 : 0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const prevDone = useRef(done);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: done || active ? 1 : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();

    if (done && !prevDone.current) {
      pulseAnim.setValue(0);
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();
    }
    prevDone.current = done;
  }, [done, active, widthAnim, pulseAnim]);

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View
      style={[
        styles.progressTrackFill,
        { width },
        (active || done) && styles.progressTrackFillActive,
        done && styles.progressTrackFillDone,
      ]}
    />
  );
}

export function SessionProgressStrip({
  activeIndex,
  compact = false,
}: {
  activeIndex: number;
  compact?: boolean;
}) {
  const steps = ["RESET", "LISTEN", "DO", "SEE", "COMMIT"];

  return (
    <View style={[styles.progressStrip, compact && styles.progressStripCompact]}>
      {steps.map((label, index) => {
        const isActive = index === activeIndex;
        const isDone = index < activeIndex;

        return (
          <View key={label} style={styles.progressStep}>
            <View style={styles.progressTrack}>
              <AnimatedProgressFill active={isActive} done={isDone} />
            </View>
            <MonoText style={[styles.progressLabel, (isActive || isDone) && styles.progressLabelActive]}>
              {`0${index + 1} ${label}`}
            </MonoText>
          </View>
        );
      })}
    </View>
  );
}
