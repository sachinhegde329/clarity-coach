import React from "react";
import { Pressable, View } from "react-native";
import { MonoText, Panel } from "../../../design-system/primitives";
import { spacing } from "../../../design-system/theme";
import { styles } from "../sessionFlowStyles";
import { EditorialWaveform } from "./EditorialWaveform";

export function SessionAudioPlayer({
  bars,
  playing,
  progress,
  onTogglePlay,
  cta,
}: {
  bars: number[];
  playing: boolean;
  progress: number;
  onTogglePlay: () => void;
  cta?: string;
}) {
  return (
    <Panel style={styles.guidedAudioPanel}>
      <View style={styles.guidedAudioHeader}>
        <Pressable onPress={onTogglePlay} style={styles.guidedPlayButton}>
          <MonoText style={styles.guidedPlayLabel}>{playing ? "II" : "▶"}</MonoText>
        </Pressable>
        <View style={{ flex: 1, gap: spacing.sm }}>
          <EditorialWaveform bars={bars} height={118} />
          <View style={styles.guidedProgressTrack}>
            <View style={[styles.guidedProgressFill, { width: `${progress}%` }]} />
          </View>
          {cta ? <MonoText style={styles.guidedAudioMeta}>{cta}</MonoText> : null}
        </View>
      </View>
    </Panel>
  );
}
