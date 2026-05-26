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
import { StepMeta } from "../components/StepMeta";
import { TextHighlight } from "../components/TextHighlight";
import { MetricInsight } from "../components/MetricInsight";

export function CommitStep({
  sessionNumber,
  content,
  reflectElapsed,
  reflectRecording,
  reflectionDone,
  onToggleRecording,
  onRetake,
  onNext,
}: {
  sessionNumber: number;
  content: (typeof sessionDefinitions)[number]["stages"]["reflect"];
  reflectElapsed: number;
  reflectRecording: boolean;
  reflectionDone: boolean;
  onToggleRecording: () => void;
  onRetake: () => void;
  onNext: () => void;
}) {
  const progress = `${(reflectElapsed / REFLECT_DURATION) * 100}%` as const;
  const bars = Array.from({ length: 12 }).map((_, index) => 18 + (((index * 13) + reflectElapsed * 8) % 52));

  if (sessionNumber === 6) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.lg, paddingVertical: spacing.xl }}>
          <MonoText style={{ color: palette.line }}>FINAL REFLECTION</MonoText>
          <BodyText style={{ fontSize: 20, lineHeight: 34 }}>What is the one habit I most want to break?</BodyText>

          <View style={[styles.outlineBadge, { width: "100%", paddingVertical: 16 }]}>
            <MonoText style={styles.outlineBadgeText}>◷ Free response (30 seconds)</MonoText>
          </View>

          <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.xl }}>
            <Pressable onPress={onToggleRecording} style={{ width: 120, height: 120, backgroundColor: palette.line, justifyContent: "center", alignItems: "center" }}>
              <Icon name={reflectionDone ? "spark" : "mic"} size={48} color={palette.paper} />
            </Pressable>
            <MonoText style={{ color: palette.line, fontSize: 18 }}>
              {reflectRecording ? "RECORDING..." : "TAP TO REFLECT"}
            </MonoText>
          </View>
        </Panel>

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.line }}>SPRINT SUMMARY</MonoText>
          <BodyText>{content.bodyText}</BodyText>
        </Panel>

        <View style={{ backgroundColor: "#0D5A84", borderWidth: 2, borderColor: palette.line, padding: spacing.lg, gap: spacing.md }}>
          <MonoText style={{ color: "#BBDCF3" }}>SPRINT 1</MonoText>
          <BodyText style={{ color: "#99C2E4", fontSize: 20, lineHeight: 34, fontFamily: type.bodyMedium }}>
            You're 88% through your clarity journey.
          </BodyText>
        </View>

        <PrimaryButton label="COMPLETE SPRINT 1" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 1) {
    const suggestedOpeners = [
      "Tomorrow I will notice when…",
      "Tomorrow I will catch myself when…",
    ];
    return (
      <View style={[styles.stepBody, { alignItems: "center" }]}>
        <View style={{ width: "100%", maxWidth: 560, gap: spacing.lg }}>
        <View style={styles.reflectHeader}>
          <MonoText style={styles.reflectKicker}>SESSION 01 · COMMIT</MonoText>
          <DisplayText style={styles.reflectTitle}>One sentence into the mic.</DisplayText>
          <BodyText style={{ color: palette.inkMuted, marginTop: spacing.xs }}>
            What will you notice tomorrow when you speak?
          </BodyText>
          <BodyText style={{ color: palette.inkMuted }}>
            Not what you’ll fix. What you’ll pay attention to.
          </BodyText>
        </View>
        <Panel style={styles.reflectRecorder}>
          <View style={styles.reflectTopBar}>
            <View style={[styles.reflectProgress, { width: progress }]} />
            <View style={styles.reflectTopLabels}>
              <MonoText style={styles.reflectTopLabel}>{reflectElapsed}s</MonoText>
              <MonoText style={styles.reflectTopLabel}>{REFLECT_DURATION}s CAP</MonoText>
            </View>
          </View>
          <View style={styles.waveRow}>
            {bars.map((height, index) => (
              <View key={index} style={[styles.waveColumn, { height, backgroundColor: palette.lineSoft, opacity: reflectRecording ? 1 : 0.5 }]} />
            ))}
          </View>
          <View style={styles.tapRecordWrap}>
            <Pressable onPress={onToggleRecording} style={styles.tapRecordButton}>
              <Icon name={reflectionDone ? "play" : "mic"} size={32} color={palette.paper} />
            </Pressable>
            <MonoText style={styles.tapRecordLabel}>
              {reflectRecording ? "RECORDING..." : reflectionDone ? "REVIEW RECORDING" : "TAP TO RECORD"}
            </MonoText>
            <BodyText style={{ color: palette.inkMuted, textAlign: "center", marginTop: spacing.xs }}>
              Say it simply. No need to sound perfect.
            </BodyText>
          </View>
        </Panel>

        {reflectionDone ? (
          <Panel tone="soft" style={{ gap: spacing.xs }}>
            <MonoText style={{ color: palette.line }}>SAVED</MonoText>
            <BodyText>You’ll hear this again at the end of your journey.</BodyText>
            <BodyText style={{ color: palette.inkMuted }}>What you notice changes how you speak.</BodyText>
          </Panel>
        ) : null}

        <Panel tone="ink" style={styles.suggestedOpener}>
          <View style={styles.suggestedHeadingRow}>
            <MonoText style={styles.suggestedHeading}>SUGGESTED OPENER</MonoText>
          </View>
          <View style={{ gap: spacing.xs }}>
            {suggestedOpeners.map((line) => (
              <BodyText key={line} style={styles.suggestedCopy}>
                {line}
              </BodyText>
            ))}
          </View>
        </Panel>
        <PrimaryButton label="FINISH" onPress={onNext} />
        <PrimaryButton label="RETAKE AUDIO" onPress={onRetake} inverted />
        </View>
      </View>
    );
  }

  if (sessionNumber === 7) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 07 · STEP 05</MonoText>
          </View>
          <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>
            Tomorrow I will catch one filler before...
          </DisplayText>
          <BodyText>
            Complete this sentence out loud. State a specific situation where you usually struggle with filler words.
          </BodyText>
        </Panel>

        <Panel tone="soft" style={{ gap: spacing.md }}>
          <BodyText style={{ fontStyle: "italic", color: palette.inkMuted }}>
            “Verbal commitment anchors the brain’s correction mechanism 40% faster than internal thought.”
          </BodyText>
        </Panel>

        <Panel style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.xl }}>
          <DisplayText style={{ fontSize: 56, lineHeight: 60 }}>{reflectionDone ? "DONE" : "15:00"}</DisplayText>
          <MonoText style={{ textAlign: "center" }}>
            Hold the button and speak your commitment. Be clear, be bold.
          </MonoText>
          <Pressable onPress={onToggleRecording} style={[styles.tapRecordButton, { width: 120, height: 120, borderRadius: 0 }]}>
            <Icon name={reflectionDone ? "spark" : "mic"} size={44} color={palette.paper} />
          </Pressable>
          <MonoText>{reflectRecording ? "READY TO CAPTURE" : "HOLD TO RECORD"}</MonoText>
        </Panel>
        <PrimaryButton label="FINISH SESSION" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 8) {
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.line }}>SESSION 8: FINDING YOUR PACE</MonoText>
          <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>COMMIT TO THE{"\n"}PACE.</DisplayText>
        </View>

        <Panel style={{ gap: spacing.md }}>
          <BodyText style={{ fontSize: 20, lineHeight: 32 }}>{content.promptTitle}</BodyText>
        </Panel>

        <PhotoPlaceholder height={280} />

        <View style={{ alignItems: "center", gap: spacing.sm }}>
          <DisplayText style={{ fontSize: 28, lineHeight: 32 }}>00:15</DisplayText>
          <Pressable onPress={onToggleRecording} style={{ width: 110, height: 110, borderWidth: 4, borderColor: "#E3E8F0", justifyContent: "center", alignItems: "center", backgroundColor: palette.paper }}>
            <Icon name={reflectionDone ? "spark" : "mic"} size={42} color={palette.ink} />
          </Pressable>
          <MonoText>HOLD TO RECORD YOUR COMMITMENT</MonoText>
        </View>

        <View style={{ height: 2, backgroundColor: "#E6D9CD" }} />

        <View style={{ gap: spacing.md }}>
          <MonoText style={{ color: palette.line }}>WHY THIS MATTERS</MonoText>
          <BodyText>{content.scienceNote}</BodyText>
          <MonoText style={{ color: palette.line }}>THE NEXT STEP</MonoText>
          <BodyText>{content.nextStep}</BodyText>
        </View>

        <PrimaryButton label="COMPLETE SESSION" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 9) {
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.line }}>SESSION 09: POWER PAUSES</MonoText>
          <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>FINAL STEP:{"\n"}COMMITMENT</DisplayText>
          <View style={{ width: 120, height: 3, backgroundColor: palette.line }} />
        </View>

        <Panel style={{ gap: spacing.md }}>
          <View style={{ position: "absolute", top: -12, left: -1, backgroundColor: palette.line, paddingHorizontal: 8, paddingVertical: 4 }}>
            <MonoText style={{ color: palette.paper }}>PROMPT</MonoText>
          </View>
          <BodyText style={{ fontSize: 22, lineHeight: 38, marginTop: spacing.md }}>
            “Tomorrow I will pause before answering...”
          </BodyText>
        </Panel>

        <View style={{ borderWidth: 2, borderColor: palette.line, borderStyle: "dashed", padding: spacing.lg, alignItems: "center", gap: spacing.md }}>
          <MonoText>RECORD YOUR INTENT</MonoText>
          <DisplayText style={{ fontSize: 42, lineHeight: 46, color: palette.line }}>00:15</DisplayText>
          <Pressable onPress={onToggleRecording} style={{ width: 130, height: 130, borderWidth: 4, borderColor: palette.line, justifyContent: "center", alignItems: "center", backgroundColor: palette.paper }}>
            <Icon name={reflectionDone ? "spark" : "mic"} size={44} color={palette.line} />
          </Pressable>
          <BodyText style={{ textAlign: "center", color: palette.inkMuted }}>{content.bodyText}</BodyText>
        </View>

        <View style={{ borderLeftWidth: 4, borderColor: palette.line, paddingLeft: spacing.md, gap: spacing.sm }}>
          <MonoText style={{ color: palette.line }}>WHY THIS MATTERS</MonoText>
          <BodyText>{content.scienceNote}</BodyText>
        </View>

        <PrimaryButton label="COMPLETE SESSION" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 10) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <MonoText style={{ color: palette.line }}>SESSION 10 · FINAL STEP</MonoText>
          <BodyText style={{ fontSize: 22, lineHeight: 36 }}>{content.promptTitle}</BodyText>
          <BodyText>{content.bodyText}</BodyText>
        </Panel>

        <Panel tone="soft" style={{ alignItems: "center", gap: spacing.lg, paddingVertical: spacing.xl }}>
          <View style={{ width: 156, height: 156, borderRadius: 999, borderWidth: 6, borderColor: palette.line, borderTopColor: "#E9DCD2", justifyContent: "center", alignItems: "center" }}>
            <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>00:15</DisplayText>
          </View>
          <Pressable onPress={onToggleRecording} style={[styles.tapRecordButton, { width: 126, height: 126 }]}>
            <Icon name={reflectionDone ? "spark" : "mic"} size={44} color={palette.paper} />
          </Pressable>
          <MonoText>{reflectRecording ? "RECORDING..." : "HOLD TO RECORD"}</MonoText>
        </Panel>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          {[
            ["CONCISE", "92%"],
            ["FILLERS", "1.2/MIN"],
            ["CLARITY", "HIGH"],
          ].map(([label, value]) => (
            <Panel key={label} tone="soft" style={{ flex: 1, gap: spacing.xs }}>
              <MonoText style={styles.metricLabel}>{label}</MonoText>
              <DisplayText style={{ fontSize: 20, lineHeight: 24 }}>{value}</DisplayText>
            </Panel>
          ))}
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <PrimaryButton label="BACK" onPress={onRetake} inverted />
          <PrimaryButton label="COMPLETE SESSION" onPress={onNext} />
        </View>
      </View>
    );
  }

  if (sessionNumber === 11) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.lg, paddingVertical: spacing.xl }}>
          <MonoText style={{ color: palette.line }}>FINAL STEP: ACTION PLAN</MonoText>
          <DisplayText style={{ fontSize: 56, lineHeight: 60 }}>Tomorrow{"\n"}I will...</DisplayText>
          <View style={{ backgroundColor: "#F4F0EC", padding: spacing.lg }}>
            <BodyText style={{ fontSize: 24, lineHeight: 42, fontStyle: "italic" }}>
              {content.suggestedOpener}
            </BodyText>
          </View>
          <View style={{ alignItems: "center", gap: spacing.md }}>
            <DisplayText style={{ fontSize: 54, lineHeight: 58 }}>00:15</DisplayText>
            <Pressable onPress={onToggleRecording} style={{ width: 132, height: 132, borderRadius: 999, borderWidth: 4, borderColor: palette.line, justifyContent: "center", alignItems: "center" }}>
              <View style={{ width: 78, height: 78, backgroundColor: palette.line, justifyContent: "center", alignItems: "center", borderRadius: 18 }}>
                <Icon name={reflectionDone ? "spark" : "mic"} size={36} color={palette.paper} />
              </View>
            </Pressable>
            <MonoText>HOLD TO RECORD</MonoText>
          </View>
        </Panel>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          {[
            ["SESSION AVG", "142 WPM"],
            ["FILLER COUNT", "02"],
            ["CLARITY SCORE", "94% ↑"],
          ].map(([label, value]) => (
            <Panel key={label} style={{ flex: 1, gap: spacing.sm }}>
              <MonoText style={styles.metricLabel}>{label}</MonoText>
              <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>{value}</DisplayText>
            </Panel>
          ))}
        </View>

        <PrimaryButton
          label={reflectionDone ? "COMPLETE SESSION" : "HOLD TO RECORD"}
          onPress={reflectionDone ? onNext : onToggleRecording}
        />
      </View>
    );
  }

  if (sessionNumber === 12) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 12 · COMMIT</MonoText>
          </View>
          <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>Seal the trend.</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>
            State your commitment clearly. This is stored as your primary goal for tomorrow’s review.
          </BodyText>
        </Panel>

        <Panel tone="soft" style={{ alignItems: "center", gap: spacing.lg, paddingVertical: spacing.xl }}>
          <DisplayText style={{ fontSize: 54, lineHeight: 58 }}>{formatTime(Math.max(0, REFLECT_DURATION - reflectElapsed))}</DisplayText>
          <Pressable onPress={onToggleRecording} style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: palette.line, alignItems: "center", justifyContent: "center" }}>
            <Icon name={reflectionDone ? "spark" : "mic"} size={44} color={palette.paper} />
          </Pressable>
          <MonoText style={{ color: palette.inkMuted }}>
            {reflectRecording ? "RECORDING COMMITMENT…" : reflectionDone ? "COMMITMENT SEALED" : "BEGIN RECORDING"}
          </MonoText>
        </Panel>

        <PrimaryButton
          label={reflectionDone ? "COMPLETE SESSION" : "BEGIN RECORDING"}
          onPress={reflectionDone ? onNext : onToggleRecording}
        />
      </View>
    );
  }

  if (sessionNumber === 13) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 13: THE EXECUTIVE SUMMARY</MonoText>
          </View>
          <DisplayText style={{ fontSize: 34, lineHeight: 38, textTransform: "uppercase" }}>Final reflection</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>
            {content.suggestedOpener}
          </BodyText>
        </Panel>

        <Panel tone="soft" style={{ alignItems: "center", gap: spacing.lg, paddingVertical: spacing.xl }}>
          <DisplayText style={{ fontSize: 54, lineHeight: 58 }}>{formatTime(Math.max(0, REFLECT_DURATION - reflectElapsed))}</DisplayText>
          <Pressable onPress={onToggleRecording} style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: palette.line, alignItems: "center", justifyContent: "center" }}>
            <Icon name={reflectionDone ? "spark" : "mic"} size={48} color={palette.paper} />
          </Pressable>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>
            {reflectRecording ? "RECORDING…" : reflectionDone ? "SAVED" : "HOLD TO COMMIT"}
          </MonoText>
        </Panel>

        <PrimaryButton
          label={reflectionDone ? "COMPLETE SESSION" : "HOLD TO COMMIT"}
          onPress={reflectionDone ? onNext : onToggleRecording}
        />
      </View>
    );
  }

  if (sessionNumber === 14) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 14 · COMMIT</MonoText>
          </View>
          <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>Lock the triad.</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>
            Record the commitment you’ll use tomorrow to structure your points before you speak.
          </BodyText>
        </Panel>

        <Panel tone="soft" style={{ alignItems: "center", gap: spacing.lg, paddingVertical: spacing.xl }}>
          <DisplayText style={{ fontSize: 54, lineHeight: 58 }}>{formatTime(Math.max(0, REFLECT_DURATION - reflectElapsed))}</DisplayText>
          <Pressable onPress={onToggleRecording} style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: palette.line, alignItems: "center", justifyContent: "center" }}>
            <Icon name={reflectionDone ? "spark" : "mic"} size={44} color={palette.paper} />
          </Pressable>
          <MonoText style={{ color: palette.inkMuted }}>
            {reflectRecording ? "RECORDING…" : reflectionDone ? "COMMITMENT SAVED" : "RECORD COMMITMENT"}
          </MonoText>
        </Panel>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <PrimaryButton label="RETAKE" onPress={onRetake} inverted />
          <PrimaryButton
            label={reflectionDone ? "COMPLETE SESSION" : "RECORD COMMITMENT"}
            onPress={reflectionDone ? onNext : onToggleRecording}
          />
        </View>
      </View>
    );
  }

  if (sessionNumber === 15) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 15</MonoText>
          </View>
          <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>Signposting</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>
            “Tomorrow I will signal my structure before…”
          </BodyText>
        </Panel>

        <Panel tone="soft" style={{ alignItems: "center", gap: spacing.lg, paddingVertical: spacing.xl }}>
          <Pressable onPress={onToggleRecording} style={{ width: 86, height: 86, borderRadius: 43, backgroundColor: palette.line, alignItems: "center", justifyContent: "center" }}>
            <Icon name={reflectionDone ? "spark" : "mic"} size={38} color={palette.paper} />
          </Pressable>
          <MonoText style={{ color: palette.inkMuted }}>00:15 / LIMIT</MonoText>
          <MonoText style={{ color: palette.inkMuted }}>
            {reflectRecording ? "RECORDING…" : reflectionDone ? "SAVED" : "RECORD"}
          </MonoText>
        </Panel>

        <PrimaryButton
          label={reflectionDone ? "COMPLETE SESSION" : "RECORD"}
          onPress={reflectionDone ? onNext : onToggleRecording}
        />
      </View>
    );
  }

  if (sessionNumber === 16) {
    return (
      <View style={styles.stepBody}>
        <View style={{ alignItems: "center", gap: spacing.sm }}>
          <DisplayText style={{ fontSize: 52, lineHeight: 56, textTransform: "uppercase" }}>Commit</DisplayText>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 16</MonoText>
          <DisplayText style={{ fontSize: 42, lineHeight: 46 }}>Stacked Constraints</DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden", marginTop: spacing.lg }]}>
          <View style={{ padding: spacing.lg, gap: spacing.md }}>
            <BodyText style={{ fontSize: 26, lineHeight: 38, fontStyle: "italic" }}>
              “Tomorrow I will deliver a complete argument in…”
            </BodyText>
            <View style={{ height: 1, backgroundColor: palette.lineSoft }} />
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>INSTRUCTION</MonoText>
            <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>
              Plan five seconds. Speak the structure you planned.
            </BodyText>
          </View>
        </View>

        <View style={{ alignItems: "center", paddingVertical: spacing.xl, gap: spacing.md }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <Icon name="clock" size={18} color={palette.line} />
            <DisplayText style={{ fontSize: 36, lineHeight: 40, fontFamily: type.mono }}>00:00.00</DisplayText>
          </View>

          <Pressable onPress={onToggleRecording} style={{ width: 132, height: 132, borderRadius: 66, borderWidth: 3, borderColor: palette.black, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 14, borderColor: "#2E2E2E", alignItems: "center", justifyContent: "center" }}>
              <Icon name={reflectionDone ? "spark" : "mic"} size={44} color={palette.line} />
            </View>
          </Pressable>

          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>TAP TO BEGIN</MonoText>
        </View>

        <PrimaryButton label="COMPLETE SESSION" onPress={onNext} />
      </View>
    );
  }

  return (
    <View style={styles.stepBody}>
      <Panel style={styles.reflectRecorder}>
        <View style={styles.reflectTopBar}>
          <View style={[styles.reflectProgress, { width: progress }]} />
          <View style={styles.reflectTopLabels}>
            <MonoText style={styles.reflectTopLabel}>{reflectElapsed}s</MonoText>
            <MonoText style={styles.reflectTopLabel}>{REFLECT_DURATION}s CAP</MonoText>
          </View>
        </View>

        <View style={styles.waveRow}>
          {bars.map((height, index) => (
            <View key={index} style={[styles.waveColumn, { height, backgroundColor: palette.lineSoft, opacity: reflectRecording ? 1 : 0.5 }]} />
          ))}
        </View>

        <View style={styles.tapRecordWrap}>
          <Pressable onPress={onToggleRecording} style={styles.tapRecordButton}>
            <Icon name={reflectionDone ? "play" : "mic"} size={32} color={palette.paper} />
          </Pressable>
          <MonoText style={styles.tapRecordLabel}>
            {reflectRecording ? "RECORDING..." : reflectionDone ? "REVIEW RECORDING" : "TAP TO RECORD"}
          </MonoText>
        </View>
      </Panel>

      <PrimaryButton label="COMMIT REFLECTION" onPress={onNext} />
      <PrimaryButton label="RETAKE AUDIO" onPress={onRetake} inverted />
    </View>
  );
}
