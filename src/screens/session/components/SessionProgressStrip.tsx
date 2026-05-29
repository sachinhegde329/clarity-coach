import React from "react";
import { View } from "react-native";
import { MonoText } from "../../../design-system/primitives";
import { styles } from "../sessionFlowStyles";

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
              <View
                style={[
                  styles.progressTrackFill,
                  (isActive || isDone) && styles.progressTrackFillActive,
                  isDone && styles.progressTrackFillDone,
                ]}
              />
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
