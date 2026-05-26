import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel, PrimaryButton } from "../../../design-system/primitives";
import { Icon } from "../../../design-system/icons";
import { palette, spacing, type } from "../../../design-system/theme";
import { InteractivePressable } from "../../../design-system/motion";
import { sessionDefinitions } from "../../../data/mockData";
import { RECORD_DURATION, REFLECT_DURATION } from "../constants";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";
import { DottedStageBackground } from "../components/DottedStageBackground";
import { EditorialWaveform } from "../components/EditorialWaveform";
import { PhotoPlaceholder } from "../components/PhotoPlaceholder";
import { SessionProgressStrip } from "../components/SessionProgressStrip";
import { TextHighlight } from "../components/TextHighlight";
import { MetricInsight } from "../components/MetricInsight";

export function DoStep({
  sessionNumber,
  content,
  recordElapsed,
  recordLimit = RECORD_DURATION,
  recording,
  onToggleRecording,
  onResetRecording,
  onNext,
}: {
  sessionNumber: number;
  content: (typeof sessionDefinitions)[number]["stages"]["feedback"];
  recordElapsed: number;
  recordLimit?: number;
  recording: boolean;
  onToggleRecording: () => void;
  onResetRecording?: () => void;
  onNext: () => void;
}) {
  const timeLeft = Math.max(0, recordLimit - recordElapsed);
  const bars = Array.from({ length: 16 }).map((_, index) => 12 + (((index * 11) + recordElapsed * 3) % 42));

  if (sessionNumber === 6) {
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.sm }}>
          <View style={{ alignSelf: "flex-start", backgroundColor: palette.line, paddingHorizontal: 10, paddingVertical: 6 }}>
            <MonoText style={{ color: palette.paper }}>REVIEW — HEAR YOURSELF</MonoText>
          </View>
          <BodyText style={{ fontSize: 18, lineHeight: 30, color: palette.inkMuted }}>
            {content.promptTitle}
          </BodyText>
          {content.preRecordMeta ? (
            <MonoText style={{ color: palette.inkMuted }}>{content.preRecordMeta}</MonoText>
          ) : null}
          <View style={{ height: 2, backgroundColor: palette.line }} />
        </View>

        <Panel padded={false} style={{ overflow: "hidden" }}>
          <View style={{ backgroundColor: palette.line, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingVertical: 8 }}>
            <MonoText style={{ color: palette.paper }}>01 BASELINE RECORDING</MonoText>
            <MonoText style={{ color: palette.paper }}>SESSION 1</MonoText>
          </View>
          <View style={{ padding: spacing.md, gap: spacing.md }}>
            <EditorialWaveform bars={[42, 52, 64, 50, 74, 88, 58, 42, 68, 78, 54, 48, 74, 64, 42, 48, 58, 74, 88, 78]} height={130} />
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <Panel tone="soft" style={{ flex: 1, gap: spacing.xs }}>
                <MonoText style={styles.metricLabel}>CLARITY INDEX</MonoText>
                <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>62%</DisplayText>
              </Panel>
              <Panel tone="soft" style={{ flex: 1, gap: spacing.xs }}>
                <MonoText style={styles.metricLabel}>TONE STABILITY</MonoText>
                <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>48%</DisplayText>
              </Panel>
            </View>
          </View>
        </Panel>

        <Panel padded={false} style={{ overflow: "hidden" }}>
          <View style={{ backgroundColor: palette.line, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingVertical: 8 }}>
            <MonoText style={{ color: palette.paper }}>02 POST-TRAINING</MonoText>
            <MonoText style={{ color: palette.paper }}>SESSION 5</MonoText>
          </View>
          <View style={{ padding: spacing.md, gap: spacing.md }}>
            <EditorialWaveform bars={[56, 62, 70, 64, 78, 94, 88, 72, 66, 74, 84, 92, 76, 70, 62, 68, 74, 84, 96, 80]} height={130} />
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <Panel tone="soft" style={{ flex: 1, gap: spacing.xs }}>
                <MonoText style={styles.metricLabel}>CLARITY INDEX</MonoText>
                <DisplayText style={{ fontSize: 24, lineHeight: 28, color: palette.line }}>89%</DisplayText>
              </Panel>
              <Panel tone="soft" style={{ flex: 1, gap: spacing.xs }}>
                <MonoText style={styles.metricLabel}>TONE STABILITY</MonoText>
                <DisplayText style={{ fontSize: 24, lineHeight: 28, color: palette.line }}>92%</DisplayText>
              </Panel>
            </View>
          </View>
        </Panel>

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.line }}>CLOSING NOTE</MonoText>
          <BodyText>
            {content.closingLine ?? "That was you, five sessions apart. The differences are the data."}
          </BodyText>
        </Panel>

        <PrimaryButton label="PLAY BOTH" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 7) {
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 07: CUTTING FILLERS</MonoText>
          </View>
          <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>THE FIRST CONSTRAINT</DisplayText>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.lg }}>
          <Panel tone="soft" style={{ flex: 0.42, justifyContent: "space-between", minHeight: 180 }}>
            <View style={{ gap: spacing.sm }}>
              <MonoText style={styles.metricLabel}>CURRENT CONSTRAINT</MonoText>
              <DisplayText style={{ fontSize: 28, lineHeight: 32 }}>"NO FILLERS.{'\n'}60 SECONDS."</DisplayText>
            </View>
            <MonoText>STRICT 1:00 LIMIT</MonoText>
          </Panel>

          <Panel style={{ flex: 0.58, gap: spacing.md }}>
            <MonoText style={styles.metricLabel}>PROMPT</MonoText>
            <BodyText style={{ color: palette.ink, fontSize: 22, lineHeight: 30 }}>
              “Describe your morning routine in vivid detail, focusing on the sequence of physical sensations.”
            </BodyText>
            <View style={{ borderTopWidth: 2, borderColor: palette.lineSoft, paddingTop: spacing.sm }}>
              <MonoText>TIPS: AVOID “UM”, “LIKE”, “SO”, “REALLY”.</MonoText>
            </View>
          </Panel>
        </View>

        <Panel tone="soft" style={{ alignItems: "center", gap: spacing.lg }}>
          <MonoText style={{ opacity: recording ? 1 : 0 }}>FILLER DETECTED</MonoText>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, height: 64 }}>
            {bars.slice(0, 7).map((height, index) => (
              <View key={index} style={{ width: 10, height: height + 12, backgroundColor: palette.line, borderRadius: 0 }} />
            ))}
          </View>
          <Pressable onPress={onToggleRecording} style={[styles.recordButtonCore, { width: 112, height: 112 }]}>
            <Icon name="mic" size={44} color={palette.paper} />
          </Pressable>
          <View style={{ alignItems: "center", gap: spacing.xs }}>
            <DisplayText style={{ fontSize: 40, lineHeight: 42 }}>{formatTime(timeLeft)}</DisplayText>
            <MonoText>{recording ? "LISTENING FOR FILLERS" : "TAP TO START RECORDING"}</MonoText>
          </View>
          <PrimaryButton label={recordElapsed >= recordLimit ? "OPEN FEEDBACK" : "CONTINUE"} onPress={onNext} />
        </Panel>
      </View>
    );
  }

  if (sessionNumber === 8) {
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.line }}>SESSION 8: FINDING YOUR PACE</MonoText>
          <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>THE "DO" PHASE</DisplayText>
        </View>

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <View style={[styles.outlineBadge, { alignSelf: "flex-end" }]}>
            <MonoText style={styles.outlineBadgeText}>ACTIVE STEP</MonoText>
          </View>
          <BodyText>
            For the next 60 seconds, your goal is to maintain a steady tempo. Aim for the 130-150 WPM sweet spot.
          </BodyText>
        </Panel>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <Panel style={{ flex: 0.66, gap: spacing.lg }}>
            <View>
              <MonoText style={styles.metricLabel}>CURRENT PROMPT</MonoText>
              <DisplayText style={{ fontSize: 26, lineHeight: 30 }}>"Tell me about your favorite book or movie."</DisplayText>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", borderTopWidth: 2, borderColor: palette.line, paddingTop: spacing.md }}>
              <View>
                <MonoText>TIMER</MonoText>
                <DisplayText style={{ fontSize: 30, lineHeight: 32 }}>{formatTime(timeLeft)}</DisplayText>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <MonoText>PACE LOCK</MonoText>
                <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>140 WPM</DisplayText>
              </View>
            </View>
          </Panel>

          <Panel tone="soft" style={{ flex: 0.34, gap: spacing.sm }}>
            <MonoText style={styles.metricLabel}>CONSTRAINTS</MonoText>
            {["60 SECONDS", "130-150 WPM", "NO FILLER WORDS"].map((item) => (
              <MonoText key={item}>✓ {item}</MonoText>
            ))}
          </Panel>
        </View>

        <Panel tone="soft" style={{ gap: spacing.lg }}>
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <MonoText>0 WPM</MonoText>
              <MonoText>140 WPM TARGET</MonoText>
              <MonoText>250 WPM</MonoText>
            </View>
            <View style={{ height: 42, borderWidth: 2, borderColor: palette.line, backgroundColor: palette.paper, overflow: "hidden" }}>
              <View style={{ position: "absolute", left: "52%", top: 0, bottom: 0, width: 2, backgroundColor: palette.line }} />
              <View style={{ width: "56%", height: "100%", backgroundColor: "#EBD7C7" }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <MonoText>RELAXED</MonoText>
              <MonoText>OPTIMAL ZONE</MonoText>
              <MonoText>FAST</MonoText>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.lg }}>
            <Pressable onPress={onToggleRecording} style={[styles.recordButtonCore, { width: 96, height: 96 }]}>
              <Icon name="mic" size={40} color={palette.paper} />
            </Pressable>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 8, height: 64 }}>
              {bars.slice(0, 10).map((height, index) => (
                <View key={index} style={{ width: 8, height: 8 + height, backgroundColor: palette.line }} />
              ))}
            </View>
          </View>
          <PrimaryButton label={recordElapsed >= recordLimit ? "OPEN FEEDBACK" : "CONTINUE"} onPress={onNext} />
        </Panel>
      </View>
    );
  }

  if (sessionNumber === 1) {
    const buttonLabel = recordElapsed >= recordLimit ? "CONTINUE TO FEEDBACK" : recording ? "KEEP GOING" : "START RECORDING";
    return (
      <View style={[styles.stepBody, { alignItems: "center" }]}>
        <View style={{ width: "100%", maxWidth: 560, gap: spacing.lg }}>
        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <MonoText style={styles.metricLabel}>BASELINE RECORDING</MonoText>
          <DisplayText style={{ fontSize: 28, lineHeight: 34 }}>Speak normally.</DisplayText>
          <BodyText>Don’t try to improve anything yet.</BodyText>
          <BodyText style={{ color: palette.inkMuted }}>
            This works best if you don’t adjust your style. Your real baseline shows us where to start.
          </BodyText>
        </Panel>

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <MonoText style={styles.metricLabel}>PROMPT</MonoText>
          <DisplayText style={{ fontSize: 24, lineHeight: 30 }}>Tell me about a recent project you worked on.</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>
            What was the goal, what happened, and what would you do differently?
          </BodyText>
        </Panel>

        <Panel style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.xl }}>
          <MonoText style={styles.remainingLabel}>REMAINING</MonoText>
          <DisplayText style={[styles.timerDisplay, timeLeft < 10 && styles.timerAlert]}>{formatTime(timeLeft)}</DisplayText>

          <Pressable onPress={onToggleRecording} style={styles.recordButtonWrap}>
            <View style={[styles.recordPulseRing, recording && styles.recordPulseRingActive]} />
            <View style={[styles.recordPulseRingLarge, recording && styles.recordPulseRingLargeActive]} />
            <View style={styles.recordButtonCore}>
              <Icon name="mic" size={40} color={palette.paper} />
            </View>
          </Pressable>

          <BodyText style={{ textAlign: "center", color: palette.inkMuted, maxWidth: 320 }}>
            {recording
              ? "Keep going. Don’t restart your thoughts."
              : "If you feel like slowing down artificially, don’t. Just speak as you would in a real conversation."}
          </BodyText>
        </Panel>

        <View style={styles.waveRow}>
          {bars.map((height, index) => (
            <View key={index} style={[styles.waveColumn, { height, opacity: recording ? 1 : 0.45 }]} />
          ))}
        </View>

        {recordElapsed >= recordLimit ? (
          <Panel tone="soft" style={{ gap: spacing.sm }}>
            <MonoText style={{ color: palette.line }}>REPLAY GUIDANCE</MonoText>
            <BodyText>Listen once before submitting.</BodyText>
            <BodyText style={{ color: palette.inkMuted }}>You’ll hear patterns you didn’t notice while speaking.</BodyText>
          </Panel>
        ) : null}

        <PrimaryButton label={buttonLabel} onPress={onNext} />
        </View>
      </View>
    );
  }

  if (sessionNumber === 9) {
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.sm }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 9: POWER PAUSES</MonoText>
          </View>
          <DisplayText style={{ fontSize: 30, lineHeight: 34, textAlign: "center" }}>
            WHAT IS A PROJECT YOU{"\n"}ARE CURRENTLY{"\n"}WORKING ON?
          </DisplayText>
        </View>

        <Panel style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.xl }}>
          <View style={{ width: 210, height: 210, borderRadius: 0, borderWidth: 8, borderColor: palette.line, borderLeftColor: "#EEE9E3", borderBottomColor: "#EEE9E3", justifyContent: "center", alignItems: "center" }}>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              {[0, 1, 2].map((index) => (
                <View key={index} style={{ width: 16, height: 16, borderWidth: 2, borderColor: palette.line, backgroundColor: index < 2 ? palette.line : palette.paper }} />
              ))}
            </View>
          </View>
          <MonoText style={{ color: palette.line, textAlign: "center" }}>2 / 3{"\n"}PAUSES</MonoText>
          <MonoText>90 SECONDS REQUIRED</MonoText>
        </Panel>

        <Panel tone="soft" style={{ alignItems: "center", gap: spacing.md, backgroundColor: "#F8DCD2" }}>
          <View style={{ width: 110, height: 110, borderWidth: 2, borderColor: palette.line, justifyContent: "center", alignItems: "center", backgroundColor: palette.paper }}>
            <Icon name="mic" size={42} color={palette.line} />
          </View>
          <DisplayText style={{ fontSize: 28, lineHeight: 32 }}>LISTENING</DisplayText>
          <MonoText>00:42 / 01:30</MonoText>
        </Panel>

        <PrimaryButton label="INSERT POWER PAUSE" onPress={onToggleRecording} />

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.line }}>PRECISION TIP</MonoText>
          <BodyText>
            Don't rush to the answer. Use the pause to visualize the specific physical space where this project happens. Silence is your scaffolding.
          </BodyText>
        </Panel>

        <PrimaryButton label={recordElapsed >= recordLimit ? "OPEN ANALYSIS" : "CONTINUE"} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 10) {
    return (
      <View style={styles.stepBody}>
        <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 10 · ARCHITECTURAL COHERENCE</MonoText>
          </View>

        <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>Describe a project{"\n"}you are passionate about.</DisplayText>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <Panel style={{ flex: 0.68, gap: spacing.md }}>
            <MonoText style={styles.metricLabel}>CURRENT PROMPT</MonoText>
            <BodyText style={{ fontSize: 22, lineHeight: 34 }}>{content.promptTitle}</BodyText>
            <View style={{ borderTopWidth: 1, borderColor: palette.lineSoft, paddingTop: spacing.md }}>
              <MonoText style={{ color: palette.line }}>End every sentence with downward inflection.</MonoText>
            </View>
          </Panel>
          <Panel tone="soft" style={{ flex: 0.32, gap: spacing.md }}>
            <View>
              <MonoText style={styles.metricLabel}>PITCH VARIANCE</MonoText>
              <DisplayText style={{ fontSize: 30, lineHeight: 34 }}>-4.2</DisplayText>
              <MonoText>ST</MonoText>
            </View>
            <View>
              <MonoText style={styles.metricLabel}>TONE SCORE</MonoText>
              <DisplayText style={{ fontSize: 30, lineHeight: 34 }}>88%</DisplayText>
            </View>
          </Panel>
        </View>

        <Panel tone="soft" style={{ gap: spacing.md }}>
          <MonoText style={styles.metricLabel}>LIVE TRANSCRIPTION</MonoText>
          <View style={{ minHeight: 180, borderWidth: 1, borderColor: "#E8D7CB", backgroundColor: "#FFFDFC", padding: spacing.md, justifyContent: "flex-end" }}>
            <BodyText style={{ color: palette.inkMuted }}>
              I care about this project because it helps the final recommendation land with more certainty and clearer authority.
            </BodyText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
            <Pressable onPress={onToggleRecording} style={[styles.recordButtonCore, { width: 94, height: 94 }]}>
              <Icon name="mic" size={38} color={palette.paper} />
            </Pressable>
            <View style={{ flex: 1, gap: spacing.md }}>
              <EditorialWaveform bars={bars.concat(bars).slice(0, 24).map((value) => value + 8)} height={84} />
              <MonoText>{recording ? "LISTENING FOR ENDINGS" : "TAP TO START CAPTURE"}</MonoText>
            </View>
          </View>
        </Panel>

        <PrimaryButton label={recordElapsed >= recordLimit ? "OPEN ANALYSIS" : "CONTINUE"} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 11) {
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.sm }}>
          <DisplayText style={{ fontSize: 54, lineHeight: 58, textTransform: "uppercase" }}>
            CUTTING{"\n"}UNNECESSARY WORDS
          </DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.lg }}>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>CONSTRAINT</MonoText>
            <View style={{ height: 1, backgroundColor: palette.lineSoft, marginTop: spacing.sm }} />
            <BodyText style={{ fontSize: 22, lineHeight: 30, marginTop: spacing.md }}>
              {content.constraint ?? "30-second answer. Hard cap. No warning."}
            </BodyText>
          </View>
        </View>

        <BodyText style={{ fontSize: 22, lineHeight: 34, textAlign: "center", marginTop: spacing.md }}>
          “{content.promptTitle}”
        </BodyText>

        {content.preRecordMeta ? (
          <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center", marginTop: spacing.md }}>
            <View style={{ width: 8, height: 8, borderRadius: 0, backgroundColor: palette.line }} />
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>METADATA: THIS SESSION USES A HARD-CAP TIMER.</MonoText>
          </View>
        ) : null}

        <View style={{ alignItems: "center", paddingVertical: spacing.xl }}>
          <Pressable onPress={onToggleRecording} style={{ width: 220, height: 220, borderRadius: 0, borderWidth: 10, borderColor: "#E5D6CA", alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: 180, height: 180, borderRadius: 0, backgroundColor: palette.line, alignItems: "center", justifyContent: "center" }}>
              <Icon name="mic" size={54} color={palette.paper} />
            </View>
          </Pressable>
        </View>

        <PrimaryButton label="CONTINUE" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 12) {
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 12: REVIEW</MonoText>
          <DisplayText style={{ fontSize: 44, lineHeight: 50, textTransform: "uppercase" }}>
            REPLAY YOUR{"\n"}STRONGEST SESSION
          </DisplayText>
          <BodyText style={{ color: palette.inkMuted, textAlign: "center" }}>
            Listen to the audio. Notice how your awareness is already shifting your behavior.
          </BodyText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.md }]}>
          <View style={{ position: "absolute", top: -12, left: 18, borderWidth: 2, borderColor: palette.black, backgroundColor: "#FDF6E3", paddingHorizontal: 10, paddingVertical: 4 }}>
            <MonoText style={{ color: palette.black, letterSpacing: 2 }}>CONSTRAINT</MonoText>
          </View>
          <BodyText style={{ fontSize: 22, lineHeight: 30 }}>
            Replay your best session from the past week. 30 seconds.
          </BodyText>
        </View>

        <View style={{ alignItems: "center", paddingVertical: spacing.lg }}>
          <View style={{ width: 140, height: 140, borderRadius: 0, borderWidth: 3, borderColor: palette.lineSoft, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: 110, height: 110, borderRadius: 0, borderWidth: 2, borderColor: palette.lineSoft, alignItems: "center", justifyContent: "center" }}>
              <Pressable onPress={onNext} style={{ width: 86, height: 86, borderRadius: 0, borderWidth: 3, borderColor: palette.black, alignItems: "center", justifyContent: "center" }}>
                <MonoText style={{ fontSize: 28 }}>▶</MonoText>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.md }]}>
          <EditorialWaveform bars={bars.concat(bars).slice(0, 28)} height={68} light />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>00:00</DisplayText>
            <MonoText style={{ color: palette.inkMuted }}>/ 00:30</MonoText>
          </View>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, textAlign: "center" }}>
            RE-LISTENING TO YOUR OWN AUDIO ACTIVATES SELF-MONITORING CIRCUITS.
          </MonoText>
        </View>

        <PrimaryButton label="CONTINUE" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 13) {
    const timeLeftSeconds = Math.max(0, recordLimit - recordElapsed);
    const blufLeft = Math.max(0, 8 - recordElapsed);
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 13 · ACTIVE DRILL</MonoText>
          </View>
          <BodyText style={{ color: palette.inkMuted }}>
            Constraint stack: conclusion in the first 8 seconds, 30 seconds total. BLUF first — everything else later.
          </BodyText>
          <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
            <Panel tone="soft" style={{ flexGrow: 1, flexBasis: 160, gap: spacing.xs }}>
              <MonoText style={styles.metricLabel}>TIME REMAINING</MonoText>
              <DisplayText style={{ fontSize: 30, lineHeight: 34 }}>{formatTime(timeLeftSeconds)}</DisplayText>
            </Panel>
            <Panel tone="soft" style={{ flexGrow: 1, flexBasis: 160, gap: spacing.xs }}>
              <MonoText style={styles.metricLabel}>BLUF WINDOW</MonoText>
              <DisplayText style={{ fontSize: 30, lineHeight: 34, color: "#B91C1C" }}>{formatTime(blufLeft)}</DisplayText>
            </Panel>
          </View>
        </Panel>

        <Panel tone="soft" style={{ alignItems: "center", gap: spacing.lg, paddingVertical: spacing.xl }}>
          <View style={{ width: 280, height: 280, alignItems: "center", justifyContent: "center" }}>
            <View style={{ position: "absolute", width: 280, height: 280, borderRadius: 0, borderWidth: 2, borderColor: palette.lineSoft }} />
            <View style={{ position: "absolute", width: 280, height: 280, borderRadius: 0, borderWidth: 2, borderColor: palette.line, opacity: 0.35 }} />
            <Pressable
              onPress={onToggleRecording}
              style={{
                width: 176,
                height: 176,
                borderRadius: 0,
                backgroundColor: palette.line,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 6,
                borderColor: palette.paper,
              }}
            >
              <Icon name="mic" size={54} color={palette.paper} />
            </Pressable>
          </View>
          <MonoText style={{ color: palette.line, letterSpacing: 3 }}>
            {recording ? "RECORDING…" : recordElapsed > 0 ? "TAP TO RESUME" : "TAP TO BEGIN RITUAL"}
          </MonoText>
        </Panel>

        <PrimaryButton label={recordElapsed >= recordLimit ? "OPEN ANALYSIS" : "CONTINUE"} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 14) {
    const timeLeftSeconds = Math.max(0, recordLimit - recordElapsed);
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 14 · RULE OF 3</MonoText>
          </View>
          <BodyText style={{ color: palette.inkMuted }}>{content.promptBody}</BodyText>
        </Panel>

        <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
          <Panel style={{ flexGrow: 1, flexBasis: 220, gap: spacing.md }}>
            <MonoText style={styles.metricLabel}>POINT TRACKER</MonoText>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              {[1, 2, 3].map((index) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderColor: palette.line,
                    backgroundColor: index <= Math.max(1, Math.floor(recordElapsed / 12) + 1) ? "#F4F0EC" : "#F4F0EC",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: spacing.md,
                  }}
                >
                  <DisplayText style={{ fontSize: 18, lineHeight: 22 }}>{index.toString().padStart(2, "0")}</DisplayText>
                </View>
              ))}
            </View>
            <MonoText style={{ color: palette.inkMuted }}>Point 1 detected: “Q4 Growth”</MonoText>
          </Panel>

          <Panel style={{ flexGrow: 1, flexBasis: 220, alignItems: "center", justifyContent: "center", gap: spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Icon name="clock" size={16} color={palette.line} />
              <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>{formatTime(timeLeftSeconds)}</DisplayText>
            </View>
            <Pressable onPress={onToggleRecording} style={[styles.recordButtonCore, { width: 132, height: 132, borderRadius: 0 }]}>
              <Icon name="mic" size={54} color={palette.paper} />
            </Pressable>
            <BodyText style={{ color: palette.inkMuted, textAlign: "center" }}>
              {recording ? "RECORDING IN PROGRESS" : "TAP TO RECORD"}
            </BodyText>
            <PrimaryButton label="FINISH SESSION" onPress={onNext} />
          </Panel>
        </View>
      </View>
    );
  }

  if (sessionNumber === 15) {
    const timeLeftSeconds = Math.max(0, recordLimit - recordElapsed);
    return (
      <View style={styles.stepBody}>
        <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
          <Panel style={{ flexGrow: 1, flexBasis: 240, gap: spacing.md }}>
            <MonoText style={styles.metricLabel}>THE PROMPT</MonoText>
            <BodyText style={{ fontSize: 18, lineHeight: 30 }}>{content.promptTitle}</BodyText>
            <BodyText style={{ color: palette.inkMuted }}>{content.promptBody}</BodyText>
          </Panel>

          <Panel tone="soft" style={{ flexGrow: 1, flexBasis: 240, alignItems: "center", justifyContent: "center", gap: spacing.md }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <MonoText style={styles.metricLabel}>TIME</MonoText>
                <MonoText style={{ color: palette.line }}>{formatTime(timeLeftSeconds)}</MonoText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <MonoText style={styles.metricLabel}>SIGNPOSTS</MonoText>
                <MonoText style={{ color: palette.line }}>1/3</MonoText>
              </View>
            </View>

            <Pressable onPress={onToggleRecording} style={[styles.recordButtonCore, { width: 72, height: 72, borderRadius: 0 }]}>
              <Icon name="mic" size={34} color={palette.paper} />
            </Pressable>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>{recording ? "RECORDING" : "TAP TO RECORD"}</MonoText>
            <EditorialWaveform bars={bars.concat(bars).slice(0, 18)} height={64} />

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: spacing.md, width: "100%", borderTopWidth: 1, borderColor: palette.lineSoft, paddingTop: spacing.md }}>
              <PrimaryButton label="RESTART" onPress={onResetRecording ?? (() => undefined)} inverted />
              <PrimaryButton label="FINISH" onPress={onNext} />
            </View>
          </Panel>
        </View>
      </View>
    );
  }

  if (sessionNumber === 16) {
    return (
      <View style={styles.stepBody}>
        <View style={{ alignItems: "center", gap: spacing.sm, marginTop: spacing.xs }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>STEP 03/05 · DO</MonoText>
          <DisplayText style={{ fontSize: 44, lineHeight: 50, fontFamily: type.mono }}>Stacked Constraints</DisplayText>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: 0, overflow: "hidden", marginTop: spacing.lg }]}>
          <View style={{ padding: spacing.lg, gap: spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <MonoText style={{ color: palette.line, fontSize: 22 }}>❝</MonoText>
              <DisplayText style={{ fontSize: 22, lineHeight: 28 }}>BLUF in 8 Words</DisplayText>
            </View>
            <View style={{ height: 1, backgroundColor: palette.lineSoft }} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <MonoText style={{ color: palette.line, fontSize: 22 }}>1-3</MonoText>
              <DisplayText style={{ fontSize: 22, lineHeight: 28 }}>Three Points</DisplayText>
            </View>
            <View style={{ height: 1, backgroundColor: palette.lineSoft }} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Icon name="clock" size={18} color={palette.line} />
              <DisplayText style={{ fontSize: 22, lineHeight: 28 }}>Under 50 Seconds</DisplayText>
            </View>
          </View>
        </View>

        <BodyText style={{ fontSize: 22, lineHeight: 34, fontStyle: "italic", textAlign: "center", marginTop: spacing.xl }}>
          “{content.promptTitle}”
        </BodyText>

        <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xl }}>
          {[
            ["Words", "0/8"],
            ["Points", "0/3"],
            ["Time", "00:00"],
          ].map(([label, value]) => (
            <View key={label} style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { flex: 1, alignItems: "center", paddingVertical: spacing.md, backgroundColor: "#F6EAE5" }]}>
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>{label}</MonoText>
              <DisplayText style={{ fontSize: 32, lineHeight: 36, fontFamily: type.mono }}>{value}</DisplayText>
            </View>
          ))}
        </View>

        <PrimaryButton label="BEGIN RECORDING" onPress={onToggleRecording} />
        <PrimaryButton label="CONTINUE" onPress={onNext} inverted />
      </View>
    );
  }

  return (
    <View style={styles.stepBody}>
      <MonoText style={styles.remainingLabel}>REMAINING</MonoText>
      <DisplayText style={[styles.timerDisplay, timeLeft < 10 && styles.timerAlert]}>{formatTime(timeLeft)}</DisplayText>

      {content.preRecordMeta ? <MonoText style={styles.recordingMeta}>{content.preRecordMeta}</MonoText> : null}

      <Pressable onPress={onToggleRecording} style={styles.recordButtonWrap}>
        <View style={[styles.recordPulseRing, recording && styles.recordPulseRingActive]} />
        <View style={[styles.recordPulseRingLarge, recording && styles.recordPulseRingLargeActive]} />
        <View style={styles.recordButtonCore}>
          <Icon name="mic" size={40} color={palette.paper} />
        </View>
      </Pressable>

      <MonoText style={styles.recordingMeta}>
        {recording ? "RECORDING IN PROGRESS" : recordElapsed >= recordLimit ? "RECORDING COMPLETE" : "TAP TO START RECORDING"}
      </MonoText>

      <View style={styles.waveRow}>
        {bars.map((height, index) => (
          <View key={index} style={[styles.waveColumn, { height, opacity: recording ? 1 : 0.45 }]} />
        ))}
      </View>

      <PrimaryButton label={recordElapsed >= recordLimit ? "OPEN FEEDBACK" : "CONTINUE"} onPress={onNext} />
    </View>
  );
}
