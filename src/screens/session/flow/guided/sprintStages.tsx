import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { BodyText, DisplayText, MonoText, PrimaryButton } from "../../../../design-system/primitives";
import { Icon } from "../../../../design-system/icons";
import { palette, spacing } from "../../../../design-system/theme";
import type { SessionDefinition } from "../../../../data/mockData";
import { UNLOCK_ALL_FOR_TESTING } from "../../constants";
import { formatTime } from "../../formatTime";
import { styles } from "../../sessionFlowStyles";
import { EditorialWaveform } from "../../components/EditorialWaveform";
import { SessionAudioPlayer } from "../../components/SessionAudioPlayer";
import { resolveLiveSeeData } from "../../utils/resolveLiveSeeData";

type LessonContent = SessionDefinition["stages"]["lesson"];
type DoContent = SessionDefinition["stages"]["feedback"];
type SeeContent = SessionDefinition["stages"]["record"];
type CommitContent = SessionDefinition["stages"]["reflect"];

type ListenProps = {
  sessionNumber: number;
  session: SessionDefinition;
  content: LessonContent;
  listenPlaying: boolean;
  listenProgress: number;
  onTogglePlay: () => void;
  onNext: () => void;
};

type DoProps = {
  sessionNumber: number;
  content: DoContent;
  recordElapsed: number;
  recordLimit: number;
  recording: boolean;
  onToggleRecording: () => void;
  onNext: () => void;
};

import type { SessionAnalysisProps } from "../types";

type SeeProps = {
  sessionNumber: number;
  session: SessionDefinition;
  content: SeeContent;
  analysis?: SessionAnalysisProps;
  selectedMetricLabel?: string | null;
  onNext: () => void;
};

type CommitProps = {
  sessionNumber: number;
  session: SessionDefinition;
  content: CommitContent;
  reflectRecording: boolean;
  reflectionDone: boolean;
  onToggleReflection: () => void;
  onNext: () => void;
};

function useBars(seed: number) {
  return useMemo(
    () => Array.from({ length: 22 }).map((_, i) => 16 + ((seed * 11 + i * 13) % 52)),
    [seed],
  );
}

function SurgicalListenCard({
  title,
  subtitle,
  content,
  listenPlaying,
  listenProgress,
  onTogglePlay,
  onNext,
  cta = "CONTINUE",
}: {
  title: string;
  subtitle?: string;
  content: LessonContent;
  listenPlaying: boolean;
  listenProgress: number;
  onTogglePlay: () => void;
  onNext: () => void;
  cta?: string;
}) {
  const bars = useBars(title.length);
  const listenComplete = listenProgress >= 100;
  const transcript = content.description ?? "";
  const pullQuote = content.insightQuote?.replace(/^"|"$/g, "") ?? "";

  return (
    <View style={styles.stepBody}>
      <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md, gap: 4 }}>
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, fontSize: 10 }}>{subtitle ?? "LISTEN"}</MonoText>
        <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>{title}</DisplayText>
      </View>

      <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md, gap: spacing.md, borderWidth: 2, borderColor: palette.line }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Pressable
            onPress={onTogglePlay}
            style={[styles.audioActionButton, { width: 56, height: 56, backgroundColor: "#FDF6E3", borderWidth: 2, borderColor: palette.line }]}
          >
            <MonoText style={{ fontSize: 22, color: palette.line }}>{listenPlaying ? "II" : "▶"}</MonoText>
          </Pressable>
          <View style={{ alignItems: "flex-end" }}>
            <MonoText style={{ color: palette.line, letterSpacing: 1, fontSize: 10 }}>PLAYBACK</MonoText>
            <MonoText style={{ color: palette.line }}>
              {Math.round((listenProgress / 100) * 75)}s / {content.audioDuration ?? "01:15"}
            </MonoText>
          </View>
        </View>
        <SessionAudioPlayer bars={bars} playing={listenPlaying} progress={listenProgress} onTogglePlay={onTogglePlay} />
      </View>

      {transcript ? (
        <View style={[styles.brutalistPanel, { borderLeftWidth: 4, borderLeftColor: palette.line, padding: spacing.md }]}>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{transcript}</BodyText>
        </View>
      ) : null}

      {pullQuote ? (
        <View style={[styles.listenQuoteCard, styles.brutalistShadowInk, { borderWidth: 2, borderColor: palette.line, padding: spacing.md }]}>
          <BodyText style={{ fontStyle: "italic", lineHeight: 28, fontSize: 18 }}>{pullQuote}</BodyText>
        </View>
      ) : null}

      <PrimaryButton label={cta} onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
    </View>
  );
}

const LISTEN_TITLES: Record<number, { title: string; subtitle?: string; cta?: string }> = {
  17: { title: "Master Answer", subtitle: "SESSION 17" },
  18: { title: "Pressure Introduction — First Hot Seat", subtitle: "SESSION 18" },
  19: { title: "How and what, not why", subtitle: "SESSION 19 · Calibrated Questions" },
  20: { title: "Mirroring and labelling", subtitle: "SESSION 20 · Tactical Empathy" },
  21: { title: "Accusation Audit", subtitle: "SESSION 21" },
  22: { title: "Acknowledge and redirect", subtitle: "SESSION 22 · Aikido Pivot" },
  23: { title: "Label and Pause", subtitle: "SESSION 23" },
  24: { title: "Pressure Replay", subtitle: "SESSION 24 · REVIEW — PRESSURE REPLAY" },
};

export function trySprintListen(props: ListenProps): React.ReactNode | null {
  const { sessionNumber, content } = props;
  const meta = LISTEN_TITLES[sessionNumber];
  if (!meta) return null;
  return (
    <SurgicalListenCard
      title={content.title ?? meta.title}
      subtitle={meta.subtitle}
      content={content}
      listenPlaying={props.listenPlaying}
      listenProgress={props.listenProgress}
      onTogglePlay={props.onTogglePlay}
      onNext={props.onNext}
      cta={meta.cta ?? "CONTINUE"}
    />
  );
}

const DO_TITLES: Record<number, { headline: string; micLabel?: string; cta?: string }> = {
  17: { headline: "Master Answer", micLabel: "TAP TO RECORD" },
  18: { headline: "Hot Seat", micLabel: "BEGIN ADVERSARIAL SESSION", cta: "BEGIN ADVERSARIAL SESSION" },
  19: { headline: "Calibrated Questions", micLabel: "TAP TO RECORD" },
  20: { headline: "Tactical Empathy", micLabel: "TAP TO RECORD" },
  21: { headline: "Begin Audit", micLabel: "BEGIN AUDIT", cta: "BEGIN AUDIT" },
  22: { headline: "Aikido Pivot", micLabel: "RECORD" },
  23: { headline: "Label and Pause", micLabel: "TAP TO RECORD" },
  24: { headline: "Pressure Replay", micLabel: "BEGIN REPLAY", cta: "BEGIN REPLAY" },
};

export function trySprintDo(props: DoProps): React.ReactNode | null {
  const { sessionNumber, content, recordElapsed, recordLimit, recording, onToggleRecording, onNext } = props;
  const meta = DO_TITLES[sessionNumber];
  if (!meta) return null;
  const bars = useBars(sessionNumber);
  const prompt = content.promptBody ?? content.promptTitle ?? content.constraint ?? "";

  return (
    <View style={styles.stepBody}>
      <DisplayText style={{ fontSize: 36, lineHeight: 40, textTransform: "uppercase" }}>{meta.headline}</DisplayText>

      {content.constraint ? (
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg }]}>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>CONSTRAINT</MonoText>
          <BodyText style={{ fontSize: 20, lineHeight: 28, marginTop: spacing.sm }}>{content.constraint}</BodyText>
        </View>
      ) : null}

      {prompt ? (
        <BodyText style={{ fontSize: 22, lineHeight: 34, textAlign: "center", fontStyle: "italic" }}>
          &ldquo;{prompt.replace(/^"|"$/g, "")}&rdquo;
        </BodyText>
      ) : null}

      <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.lg }}>
        <DisplayText style={{ fontSize: 40, lineHeight: 44 }}>{formatTime(recordElapsed)}</DisplayText>
        <Pressable
          onPress={onToggleRecording}
          style={{ width: 96, height: 96, borderRadius: 0, borderWidth: 3, borderColor: palette.line, backgroundColor: recording ? palette.line : "#FDF6E3", alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="mic" size={40} color={recording ? palette.paper : palette.line} />
        </Pressable>
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>
          {recording ? "RECORDING…" : meta.micLabel ?? "TAP TO RECORD"}
        </MonoText>
        <EditorialWaveform bars={bars.slice(0, 12)} height={48} />
      </View>

      <PrimaryButton
        label={meta.cta ?? (recordElapsed >= recordLimit ? "CONTINUE" : "CONTINUE")}
        onPress={onNext}
      />
    </View>
  );
}

const SEE_TITLES: Record<number, string> = {
  17: "Master Answer Review",
  18: "Hot Seat Replay",
  19: "Question Calibration",
  20: "Empathy Playback",
  21: "Audit Review",
  22: "Pivot Analysis",
  23: "Label Review",
  24: "Pressure Replay",
};

export function trySprintSee(props: SeeProps): React.ReactNode | null {
  const { sessionNumber, session, content, analysis, onNext } = props;
  const title = SEE_TITLES[sessionNumber];
  if (!title) return null;
  const bars = useBars(sessionNumber);
  const liveSee = useMemo(
    () => resolveLiveSeeData({ sessionNumber, record: session.stages.record, analysis }),
    [analysis, sessionNumber, session.stages.record],
  );
  const metrics = liveSee.metrics.length > 0 ? liveSee.metrics : (content.metrics ?? session.stages.record.metrics ?? []);

  return (
    <View style={styles.stepBody}>
      <MonoText style={{ color: palette.line, letterSpacing: 2 }}>04 / 05 · SEE</MonoText>
      <DisplayText style={{ fontSize: 40, lineHeight: 44 }}>{title}</DisplayText>
      {content.subline ? <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{content.subline}</BodyText> : null}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        {metrics.slice(0, 3).map((m) => (
          <View key={m.label} style={[styles.brutalistPanel, styles.brutalistShadowInk, { flex: 1, minWidth: 100, padding: spacing.sm }]}>
            <MonoText style={{ color: palette.inkMuted, fontSize: 10 }}>{m.label}</MonoText>
            <DisplayText style={{ fontSize: 22, lineHeight: 26 }}>{m.value}</DisplayText>
          </View>
        ))}
      </View>
      <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.md }]}>
        <EditorialWaveform bars={bars} height={64} light />
      </View>
      <PrimaryButton label="CONTINUE TO COMMIT" onPress={onNext} />
    </View>
  );
}

const COMMIT_TITLES: Record<number, string> = {
  17: "Master Answer",
  18: "Pressure Introduction",
  19: "Calibrated Questions",
  20: "Tactical Empathy",
  21: "Accusation Audit",
  22: "Aikido Pivot",
  23: "Label and Pause",
  24: "Review — Pressure Replay",
};

export function trySprintCommit(props: CommitProps): React.ReactNode | null {
  const { sessionNumber, content, reflectRecording, reflectionDone, onToggleReflection, onNext } = props;
  const title = COMMIT_TITLES[sessionNumber];
  if (!title) return null;
  const opener = content.suggestedOpener?.replace(/^"|"$/g, "") ?? content.promptTitle ?? "Tomorrow I will notice…";

  return (
    <View style={styles.stepBody}>
      <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, fontSize: 10 }}>SESSION {sessionNumber} · COMMIT</MonoText>
      <DisplayText style={{ fontSize: 36, lineHeight: 40 }}>{title}</DisplayText>
      <DisplayText style={{ fontSize: 28, lineHeight: 32, marginTop: spacing.md }}>Tomorrow I will notice…</DisplayText>
      <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, borderLeftWidth: 4, borderLeftColor: palette.line }]}>
        <BodyText style={{ fontStyle: "italic", lineHeight: 28, fontSize: 18 }}>&ldquo;{opener}&rdquo;</BodyText>
      </View>
      <View style={{ alignItems: "center", gap: spacing.md }}>
        <Pressable
          onPress={onToggleReflection}
          style={{ width: 110, height: 110, borderRadius: 0, borderWidth: 3, borderColor: palette.line, alignItems: "center", justifyContent: "center", backgroundColor: "#FDF6E3" }}
        >
          <Icon name="mic" size={44} color={palette.line} />
        </Pressable>
        <MonoText style={{ color: palette.line, letterSpacing: 2 }}>
          {reflectionDone ? "SAVED" : reflectRecording ? "RECORDING" : "HOLD TO COMMIT"}
        </MonoText>
      </View>
      <PrimaryButton label={reflectionDone ? "COMPLETE SESSION" : "RECORD COMMITMENT"} onPress={reflectionDone ? onNext : onToggleReflection} />
    </View>
  );
}

export function isSprintGuidedSession(sessionNumber: number) {
  return sessionNumber >= 17 && sessionNumber <= 24;
}

/** @deprecated Use isSprintGuidedSession */
export function isLegacyStitchSession(sessionNumber: number) {
  return isSprintGuidedSession(sessionNumber);
}

/** @deprecated Use trySprintListen */
export const tryLegacyListen = trySprintListen;
/** @deprecated Use trySprintDo */
export const tryLegacyDo = trySprintDo;
/** @deprecated Use trySprintSee */
export const tryLegacySee = trySprintSee;
/** @deprecated Use trySprintCommit */
export const tryLegacyCommit = trySprintCommit;
