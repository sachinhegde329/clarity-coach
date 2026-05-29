import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { BodyText, DisplayText, MonoText } from "../../../../design-system/primitives";
import { Icon } from "../../../../design-system/icons";
import { palette, spacing } from "../../../../design-system/theme";
import { sessionDefinitions } from "../../../../data/mockData";
import { SessionAnalysisStatusBanner } from "../../components/SessionAnalysisStatusBanner";
import { resolveLiveSeeData } from "../../utils/resolveLiveSeeData";
import type { SessionAnalysisProps } from "../types";
import { REFLECT_DURATION, UNLOCK_ALL_FOR_TESTING } from "../../constants";
import { formatTime } from "../../formatTime";
import { styles } from "../../sessionFlowStyles";
import { EditorialWaveform } from "../../components/EditorialWaveform";
import { MetricTile } from "../../components/MetricTile";
import { SessionAudioPlayer } from "../../components/SessionAudioPlayer";
import { SessionButton } from "../../components/SessionButton";
import {
  commitActionLabel,
  commitCtaLabels,
  commitRecordHintLabel,
  doCtaLabel,
  doRecordHintLabel,
  doRecordStyle,
  getSessionScreenConfig,
  listenCtaLabel,
  seeCtaLabels,
} from "../../unified/sessionScreenConfig";

type StitchStageProps = {
  session: (typeof sessionDefinitions)[number];
  sessionNumber: number;
  recordLimit: number;
  listenPlaying: boolean;
  listenProgress: number;
  recording: boolean;
  recordElapsed: number;
  overlayOn: boolean;
  reflectRecording: boolean;
  reflectElapsed: number;
  reflectionDone: boolean;
  onTogglePlay: () => void;
  onToggleRecording: () => void;
  onReplay: () => void;
  onToggleReflection: () => void;
  onRetakeReflection: () => void;
  selectedMetricLabel?: string | null;
  onSelectMetric?: (label: string) => void;
  onNext: () => void;
  analysis?: SessionAnalysisProps;
};

function useWaveform(sessionNumber: number) {
  return useMemo(
    () => Array.from({ length: 22 }).map((_, index) => 18 + ((sessionNumber * 9 + index * 13) % 58)),
    [sessionNumber],
  );
}

function MetaStrip({ kicker, line }: { kicker: string; line: string }) {
  return (
    <View style={{ borderLeftWidth: 4, borderLeftColor: palette.lineSoft, paddingLeft: spacing.md, gap: 4 }}>
      <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, fontSize: 10 }}>{kicker}</MonoText>
      <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>{line}</BodyText>
    </View>
  );
}

function PullQuoteCard({ quote }: { quote: string }) {
  return (
    <View style={[styles.listenQuoteCard, styles.brutalistShadowInk, { borderWidth: 2, borderColor: palette.line }]}>
      <BodyText style={[styles.listenQuoteText, { fontStyle: "italic" }]}>{quote}</BodyText>
    </View>
  );
}

const METRIC_PICK_OPTIONS = [
  { tag: "The Weakest", name: "PACE (WPM)", delta: "Rhythm focus", deltaColor: palette.line },
  { tag: "In The Middle", name: "FILLER COUNT", delta: "Precision focus", deltaColor: palette.inkMuted },
  { tag: "The Strongest", name: "INFLECTION RATE", delta: "Delivery focus", deltaColor: palette.moss },
] as const;

export function StitchUnifiedListen(props: StitchStageProps) {
  const { session, sessionNumber, listenPlaying, listenProgress, onTogglePlay, onNext } = props;

  if (sessionNumber === 25) {
    return <StitchListenSession25 {...props} />;
  }
  if (sessionNumber === 30) {
    return <StitchListenSession30 {...props} />;
  }
  if (sessionNumber === 36) {
    return <StitchListenSession36 {...props} />;
  }

  const lesson = session.stages.lesson;
  const waveform = useWaveform(sessionNumber);
  const listenComplete = listenProgress >= 100;
  const transcript = lesson.description ?? lesson.coachingPassages?.[0]?.text ?? "";
  const pullQuote = lesson.insightQuote?.replace(/^"|"$/g, "") ?? "";
  const conceptLine = session.focusLine ?? lesson.subtitle ?? "";

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      <MetaStrip
        kicker={`SESSION ${String(sessionNumber).padStart(2, "0")} • ${session.practiceTitle}`}
        line={conceptLine}
      />

      <DisplayText style={{ fontSize: 28, lineHeight: 32 }}>{lesson.title ?? session.arcTitle}</DisplayText>

      <View style={[styles.listenMainCard, styles.brutalistShadowInk]}>
        <View style={styles.listenCardHeader}>
          <MonoText style={styles.listenCardKicker}>PLAYBACK</MonoText>
          <MonoText style={styles.metricLabel}>
            {Math.round((listenProgress / 100) * 75)}s / {lesson.audioDuration ?? "01:15"}
          </MonoText>
        </View>
        <SessionAudioPlayer
          bars={waveform}
          playing={listenPlaying}
          progress={listenProgress}
          onTogglePlay={onTogglePlay}
          cta={lesson.waveformMeta}
        />
      </View>

      {transcript ? (
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.line, padding: spacing.md }]}>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>
            {transcript}
          </BodyText>
        </View>
      ) : null}

      {pullQuote ? <PullQuoteCard quote={pullQuote} /> : null}

      <SessionButton
        label={listenCtaLabel(sessionNumber, listenComplete)}
        onPress={onNext}
        disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING}
      />
    </View>
  );
}

function StitchListenSession30({ session, sessionNumber, selectedMetricLabel, onSelectMetric, onNext }: StitchStageProps) {
  const lesson = session.stages.lesson;
  const transcript = lesson.description ?? "";
  const pullQuote = lesson.insightQuote?.replace(/^"|"$/g, "") ?? "";
  const waveform = useWaveform(sessionNumber);

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      <MetaStrip kicker={`SESSION ${String(sessionNumber).padStart(2, "0")} • ${session.practiceTitle}`} line="One metric, nothing else" />
      <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { borderWidth: 2, borderColor: palette.line, padding: spacing.md, gap: spacing.sm }]}>
        <MonoText style={styles.listenCardKicker}>AI INSIGHT</MonoText>
        <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{transcript}</BodyText>
        <EditorialWaveform bars={waveform.slice(0, 12)} height={48} />
      </View>
      {pullQuote ? <PullQuoteCard quote={pullQuote} /> : null}
      <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, fontSize: 10 }}>SELECT FOCUS AREA</MonoText>
      <View style={{ gap: spacing.sm }}>
        {METRIC_PICK_OPTIONS.map((opt, index) => {
          const active = (selectedMetricLabel ?? "").toUpperCase() === opt.name.toUpperCase();
          return (
            <Pressable
              key={opt.tag}
              onPress={() => onSelectMetric?.(opt.name.toUpperCase())}
              style={[
                styles.brutalistPanel,
                styles.brutalistShadowInk,
                {
                  padding: spacing.md,
                  borderColor: palette.line,
                  borderWidth: 2,
                  backgroundColor: active ? palette.paper : palette.panelSoft,
                },
              ]}
            >
              <MonoText style={{ color: palette.inkMuted, fontSize: 10, marginBottom: spacing.xs }}>{opt.tag.toUpperCase()}</MonoText>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: spacing.sm }}>
                <DisplayText style={{ fontSize: 22, lineHeight: 26 }}>{opt.name}</DisplayText>
                <BodyText style={{ color: opt.deltaColor }}>{opt.delta}</BodyText>
              </View>
            </Pressable>
          );
        })}
      </View>
      <SessionButton label="CONTINUE" onPress={onNext} disabled={!selectedMetricLabel && !UNLOCK_ALL_FOR_TESTING} />
    </View>
  );
}

function StitchListenSession36({ session, sessionNumber, onNext }: StitchStageProps) {
  const lesson = session.stages.lesson;
  const transcript = lesson.description ?? lesson.coachingPassages?.[0]?.text ?? "";
  const pullQuote = lesson.insightQuote?.replace(/^"|"$/g, "") ?? "";
  const waveform = useWaveform(sessionNumber);

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      <MetaStrip kicker={`SESSION ${String(sessionNumber).padStart(2, "0")} • ${session.practiceTitle}`} line="The transformation" />
      {pullQuote ? <PullQuoteCard quote={pullQuote} /> : null}
      <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{transcript}</BodyText>
      <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { borderWidth: 2, borderColor: palette.line, padding: spacing.md, gap: spacing.md }]}>
        <MonoText style={styles.listenCardKicker}>VISUAL PREVIEW</MonoText>
        <View style={{ gap: spacing.xs }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={styles.metricLabel}>S36 (TODAY)</MonoText>
            <MonoText style={styles.metricLabel}>02:00</MonoText>
          </View>
          <EditorialWaveform bars={waveform.slice(0, 16)} height={56} />
        </View>
        <View style={{ gap: spacing.xs, opacity: 0.7 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={styles.metricLabel}>S01 (BASELINE)</MonoText>
            <MonoText style={styles.metricLabel}>01:45</MonoText>
          </View>
          <EditorialWaveform bars={waveform.slice(4, 14)} height={48} />
        </View>
      </View>
      <SessionButton label="CONTINUE" onPress={onNext} />
    </View>
  );
}

function StitchDoSession36(props: StitchStageProps) {
  const { session, sessionNumber, recordLimit, recording, recordElapsed, onToggleRecording, onNext } = props;
  const doContent = session.stages.feedback;
  const promptQuote = doContent.promptBody ?? doContent.promptTitle ?? "";
  const waveform = useWaveform(sessionNumber);
  const captured = recordElapsed > 0 && !recording;
  const dimPrompt = recording;

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      <View style={{ alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
        <MonoText style={{ color: palette.line, letterSpacing: 2, fontSize: 10 }}>SESSION 36 : DO</MonoText>
        <DisplayText style={{ fontSize: 32, lineHeight: 36, textAlign: "center" }}>The Capstone</DisplayText>
        <BodyText style={{ color: palette.inkMuted, textAlign: "center", lineHeight: 24, maxWidth: 280 }}>
          No constraints. No live feedback. This is your baseline, revisited.
        </BodyText>
      </View>

      <View
        style={[
          styles.brutalistPanel,
          styles.brutalistShadowInk,
          {
            padding: spacing.lg,
            gap: spacing.sm,
            borderWidth: 2,
            borderColor: palette.line,
            backgroundColor: "#FDF6E3",
            opacity: dimPrompt ? 0.45 : 1,
          },
        ]}
      >
        <View style={{ position: "absolute", top: -12, alignSelf: "center", left: "30%", right: "30%", alignItems: "center" }}>
          <View style={{ backgroundColor: palette.paper, paddingHorizontal: spacing.sm, borderWidth: 2, borderColor: palette.line }}>
            <MonoText style={{ fontSize: 10, letterSpacing: 2, color: palette.line }}>THE CHALLENGE</MonoText>
          </View>
        </View>
        <BodyText style={{ fontStyle: "italic", lineHeight: 28, fontSize: 20, textAlign: "center", marginTop: spacing.sm }}>
          &ldquo;{promptQuote.replace(/^"|"$/g, "")}&rdquo;
        </BodyText>
        <MonoText style={[styles.metricLabel, { textAlign: "center", color: palette.inkMuted }]}>(ORIGINAL SESSION 1 PROMPT)</MonoText>
      </View>

      <View style={{ alignItems: "center", gap: spacing.md, minHeight: 200, justifyContent: "flex-end" }}>
        {recording || captured ? (
          <View style={{ alignItems: "center", gap: spacing.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <View style={{ width: 10, height: 10, borderRadius: 0, backgroundColor: captured ? palette.moss : palette.peach }} />
              <MonoText style={{ color: captured ? palette.moss : palette.peach, letterSpacing: 2, fontSize: 11 }}>
                {captured ? "CAPTURED" : "RECORDING"}
              </MonoText>
            </View>
            <DisplayText style={styles.doTimerDisplay}>{formatTime(recordElapsed)}</DisplayText>
            <EditorialWaveform bars={waveform.slice(0, 12)} height={40} />
          </View>
        ) : null}
        <Pressable
          onPress={onToggleRecording}
          style={[
            styles.doRecordButton,
            styles.brutalistShadowInk,
            {
              width: 96,
              height: 96,
              borderRadius: 0,
              backgroundColor: palette.paper,
              borderWidth: 2,
              borderColor: recording ? palette.peach : palette.line,
            },
          ]}
        >
          <Icon name={captured ? "spark" : "mic"} size={44} color={recording ? palette.peach : palette.line} />
        </Pressable>
        <MonoText style={[styles.metricLabel, { letterSpacing: 2 }]}>
          {captured
            ? "PROCEEDING TO REVIEW…"
            : recording
              ? "RECORDING"
              : doRecordHintLabel(sessionNumber, recording, recordElapsed)}
        </MonoText>
      </View>

      {(captured || recordElapsed >= recordLimit) && (
        <SessionButton label={doCtaLabel(sessionNumber, recordElapsed, recordLimit)} onPress={onNext} />
      )}
    </View>
  );
}

function StitchListenSession25(props: StitchStageProps) {
  const { session, sessionNumber, listenPlaying, listenProgress, onTogglePlay, onNext } = props;
  const lesson = session.stages.lesson;
  const waveform = useWaveform(sessionNumber);
  const listenComplete = listenProgress >= 100;
  const conceptLine = session.focusLine ?? lesson.subtitle ?? "";
  const pullQuote = lesson.insightQuote?.replace(/^"|"$/g, "") ?? "";
  const transcript =
    lesson.description ??
    "The mistake most professionals make about audience is to think it changes the message. It does not. It changes the framing…";

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      <MetaStrip kicker={`SESSION ${String(sessionNumber).padStart(2, "0")} • ${session.practiceTitle}`} line={conceptLine} />
      <DisplayText style={{ fontSize: 28, lineHeight: 32 }}>{lesson.title ?? "One message, three audiences."}</DisplayText>

      <View style={[styles.listenMainCard, styles.brutalistShadowInk]}>
        <View style={styles.listenCardHeader}>
          <MonoText style={styles.listenCardKicker}>PLAYBACK</MonoText>
          <MonoText style={styles.metricLabel}>
            {Math.round((listenProgress / 100) * 75)}s / {lesson.audioDuration ?? "01:15"}
          </MonoText>
        </View>
        <View style={{ position: "relative", minHeight: 96 }}>
          <View style={{ position: "absolute", left: "15%", top: 4, zIndex: 2, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.lineSoft, paddingHorizontal: 4 }}>
            <MonoText style={{ fontSize: 9, color: palette.inkMuted }}>THE MISTAKE</MonoText>
          </View>
          <View style={{ position: "absolute", left: "50%", top: 4, zIndex: 2, backgroundColor: palette.line, paddingHorizontal: 4 }}>
            <MonoText style={{ fontSize: 9, color: palette.paper }}>FRAMING PIVOT</MonoText>
          </View>
          <SessionAudioPlayer bars={waveform} playing={listenPlaying} progress={listenProgress} onTogglePlay={onTogglePlay} />
        </View>
      </View>

      <View style={[styles.brutalistPanel, { borderLeftWidth: 4, borderLeftColor: palette.line, padding: spacing.md, backgroundColor: palette.panelSoft }]}>
        <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{transcript}</BodyText>
      </View>

      {pullQuote ? <PullQuoteCard quote={pullQuote} /> : null}

      <SessionButton
        label={listenCtaLabel(sessionNumber, listenComplete)}
        onPress={onNext}
        disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING}
      />
    </View>
  );
}

export function StitchUnifiedDo(props: StitchStageProps) {
  const {
    session,
    sessionNumber,
    recordLimit,
    recording,
    recordElapsed,
    onToggleRecording,
    onNext,
  } = props;
  const doContent = session.stages.feedback;
  const waveform = useWaveform(sessionNumber);
  const recordProgress = Math.min(100, Math.round((recordElapsed / recordLimit) * 100));
  const recordSecondsLeft = Math.max(0, recordLimit - recordElapsed);
  const recordStyle = doRecordStyle(sessionNumber);
  const recordSize = recordStyle === "circle-large" ? 112 : recordStyle === "square" ? 96 : 88;
  const recordRadius = recordStyle === "square" ? 8 : recordSize / 2;
  const promptQuote = doContent.promptBody ?? doContent.promptTitle ?? "";

  if (sessionNumber === 36) {
    return <StitchDoSession36 {...props} />;
  }

  if (sessionNumber === 34) {
    const bodySeconds = 60;
    const inClosePhase = recordElapsed >= bodySeconds;
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <DisplayText style={{ fontSize: 28, lineHeight: 32 }}>Memorable Closes</DisplayText>
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md, gap: spacing.sm, borderColor: palette.line }]}>
          <MonoText style={styles.doConstraintBadgeText}>CHALLENGE: CONSTRAINT</MonoText>
          <BodyText style={{ fontStyle: "italic", lineHeight: 28, fontSize: 18 }}>{promptQuote}</BodyText>
          <View style={{ gap: spacing.xs }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <MonoText style={{ width: 40, textAlign: "right", color: palette.line }}>60s</MonoText>
              <View style={[styles.guidedProgressTrack, { flex: 1 }]}>
                <View style={[styles.guidedProgressFill, { width: inClosePhase ? "100%" : `${Math.min(100, (recordElapsed / bodySeconds) * 100)}%` }]} />
              </View>
              <MonoText style={styles.metricLabel}>BODY</MonoText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <MonoText style={{ width: 40, textAlign: "right" }}>01</MonoText>
              <View style={{ flex: 1, borderTopWidth: 2, borderStyle: "dashed", borderColor: palette.lineSoft }} />
              <MonoText style={styles.metricLabel}>SENTENCE</MonoText>
            </View>
          </View>
        </View>
        <DisplayText style={[styles.doTimerDisplay, inClosePhase ? { color: palette.line } : null]}>
          {formatTime(recordElapsed)}
        </DisplayText>
        <Pressable
          onPress={onToggleRecording}
          style={[styles.brutalistPanel, styles.brutalistShadowInk, { height: 120, justifyContent: "center", alignItems: "center", borderColor: inClosePhase ? palette.line : palette.lineSoft }]}
        >
          <EditorialWaveform bars={waveform.slice(0, 8)} height={48} />
        </Pressable>
        <MonoText style={{ textAlign: "center", color: inClosePhase ? palette.line : palette.inkMuted, letterSpacing: 1 }}>
          {inClosePhase ? "DELIVER CLOSE NOW" : recording ? "RECORDING…" : "READY"}
        </MonoText>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md }}>
          <Pressable onPress={() => { if (recording) onToggleRecording(); }}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>RESTART</MonoText>
          </Pressable>
          <SessionButton label="FINISH" onPress={onNext} />
        </View>
      </View>
    );
  }

  if (sessionNumber === 35) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, fontSize: 10 }}>SESSION 35 · 03 / 05 : DO</MonoText>
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md, gap: spacing.sm }]}>
          <MonoText style={styles.doConstraintBadgeText}>CHALLENGE: OPEN</MonoText>
          <BodyText style={{ fontStyle: "italic", lineHeight: 28, fontSize: 18 }}>{promptQuote}</BodyText>
        </View>
        <DisplayText style={styles.doTimerDisplay}>{formatTime(recordElapsed)}</DisplayText>
        <Pressable
          onPress={onToggleRecording}
          style={[styles.doRecordButton, styles.brutalistShadowInk, { alignSelf: "center", width: 96, height: 96, borderRadius: 0, backgroundColor: recording ? palette.line : palette.paper, borderWidth: 3, borderColor: palette.line }]}
        >
          <View style={{ width: 24, height: 24, backgroundColor: palette.paper, borderRadius: 0 }} />
        </Pressable>
        <MonoText style={{ textAlign: "center", color: palette.inkMuted, letterSpacing: 1 }}>RECORDING LIVE</MonoText>
        <SessionButton label="END & ANALYZE" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 25) {
    const audiences = ["CEO", "PEER", "CUSTOMER"] as const;
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <DisplayText style={{ fontSize: 26, lineHeight: 30 }}>Audience-Aware Framing</DisplayText>
        {doContent.constraint ? (
          <View style={[styles.doConstraintCard, styles.brutalistShadowInk]}>
            <MonoText style={styles.doConstraintBadgeText}>{doContent.constraint.toUpperCase()}</MonoText>
          </View>
        ) : null}
        {promptQuote ? (
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md }]}>
            <BodyText style={{ fontStyle: "italic", lineHeight: 28, fontSize: 18 }}>{promptQuote}</BodyText>
          </View>
        ) : null}
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          {audiences.map((label, i) => (
            <View
              key={label}
              style={[
                styles.brutalistPanel,
                styles.brutalistShadowInk,
                {
                  flex: 1,
                  padding: spacing.sm,
                  borderColor: i === 1 ? palette.line : palette.lineSoft,
                  backgroundColor: i === 1 ? "#FDF6E3" : palette.paper,
                },
              ]}
            >
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>{String(i + 1).padStart(2, "0")} {label}</MonoText>
              <EditorialWaveform bars={waveform.slice(i * 3, i * 3 + 6)} height={32} />
              <MonoText style={{ color: palette.inkMuted, fontSize: 10, textAlign: "center" }}>
                {i === 0 ? "DONE" : i === 1 ? "REC" : "WAITING"}
              </MonoText>
            </View>
          ))}
        </View>
        <MonoText style={{ textAlign: "center", color: palette.inkMuted }}>
          {formatTime(recordElapsed)} / {formatTime(recordLimit)}
        </MonoText>
        <Pressable
          onPress={onToggleRecording}
          style={[styles.doRecordButton, styles.brutalistShadowInk, { alignSelf: "center", width: 56, height: 56, borderRadius: 0, backgroundColor: palette.black }]}
        >
          <MonoText style={{ color: palette.paper }}>{recording ? "■" : "●"}</MonoText>
        </Pressable>
        <SessionButton label={doCtaLabel(sessionNumber, recordElapsed, recordLimit)} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 31) {
    const beats = ["SETUP", "CONFLICT", "RESOLUTION", "CALL"];
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <DisplayText style={{ fontSize: 28, lineHeight: 32 }}>NARRATIVE BEATS</DisplayText>
        <BodyText style={{ color: palette.inkMuted, lineHeight: 24, fontStyle: "italic" }}>{promptQuote}</BodyText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
          {beats.map((beat, i) => (
            <View
              key={beat}
              style={[
                styles.brutalistPanel,
                styles.brutalistShadowInk,
                {
                  padding: spacing.sm,
                  borderColor: i === 0 ? palette.line : palette.lineSoft,
                  backgroundColor: i === 0 ? "#FDF6E3" : palette.paper,
                },
              ]}
            >
              <MonoText style={{ color: palette.line }}>{beat}</MonoText>
            </View>
          ))}
        </View>
        <View style={{ alignItems: "center", gap: spacing.md }}>
          <DisplayText style={styles.doTimerDisplay}>{formatTime(recordElapsed)}</DisplayText>
          <Pressable
            onPress={onToggleRecording}
            style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 88, height: 88, borderRadius: 0, backgroundColor: recording ? palette.line : "#FDF6E3" }]}
          >
            <Icon name="mic" size={40} color={recording ? palette.paper : palette.line} />
          </Pressable>
          <MonoText style={styles.metricLabel}>{recording ? "RECORDING…" : "TAP TO RECORD"}</MonoText>
        </View>
        <SessionButton label={doCtaLabel(sessionNumber, recordElapsed, recordLimit)} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 30) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>Lab Session — One Metric</DisplayText>
        <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>{promptQuote}</BodyText>
        <View style={{ gap: spacing.sm }}>
          {[
            ["PACE", "Focus on rhythm and speed"],
            ["FILLERS", "Eliminate vocalized pauses"],
            ["INFLECTION", "Master pitch variation"],
          ].map(([label, hint]) => (
            <View key={label} style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md, borderColor: palette.line }]}>
              <MonoText style={styles.metricLabel}>{label}</MonoText>
              <BodyText style={{ color: palette.inkMuted }}>{hint}</BodyText>
            </View>
          ))}
        </View>
        <View style={{ alignItems: "center", gap: spacing.md }}>
          <Pressable
            onPress={onToggleRecording}
            style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 88, height: 88, borderRadius: 0, backgroundColor: recording ? palette.line : "#FDF6E3" }]}
          >
            <Icon name="mic" size={40} color={recording ? palette.paper : palette.line} />
          </Pressable>
          <MonoText style={styles.metricLabel}>{doRecordHintLabel(sessionNumber, recording, recordElapsed)}</MonoText>
        </View>
        <SessionButton label={doCtaLabel(sessionNumber, recordElapsed, recordLimit)} onPress={onNext} />
      </View>
    );
  }

  const doTitle =
    sessionNumber === 28
      ? "HYPOTHESIS-DRIVEN"
      : sessionNumber === 29
        ? "FULL PYRAMID"
        : sessionNumber === 31
          ? "CHALLENGE: ADVERSARIAL (NARRATIVE)"
          : sessionNumber === 32
            ? "SESSION 32: EXECUTIVE PRESENCE"
              : sessionNumber === 35
              ? "OPEN PITCH"
              : sessionNumber === 33
                ? "INFLUENCE WITHOUT AUTHORITY"
              : sessionNumber === 26
                ? "DATA TO STORY"
                : sessionNumber === 27
                  ? "ENERGY CALIBRATION"
                  : "DO";

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      <DisplayText style={{ fontSize: 28, lineHeight: 32 }}>{doTitle}</DisplayText>

      {doContent.constraint ? (
        <View style={[styles.doConstraintCard, styles.brutalistShadowInk]}>
          <MonoText style={styles.doConstraintBadgeText}>{doContent.constraint.toUpperCase()}</MonoText>
          {doContent.timeLimit ? (
            <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>{doContent.timeLimit}</MonoText>
          ) : null}
        </View>
      ) : null}

      {promptQuote ? (
        <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
          <BodyText style={{ fontStyle: "italic", lineHeight: 28, fontSize: 20 }}>{promptQuote}</BodyText>
        </View>
      ) : null}

      <View style={{ alignItems: "center", gap: spacing.md }}>
        {sessionNumber !== 35 ? (
          <>
            <DisplayText style={styles.doTimerDisplay}>{formatTime(recordSecondsLeft)}</DisplayText>
            <MonoText style={styles.metricLabel}>REMAINING</MonoText>
          </>
        ) : null}
        <Pressable
          onPress={onToggleRecording}
          style={[
            styles.doRecordButton,
            styles.brutalistShadowInk,
            {
              width: recordSize,
              height: recordSize,
              borderRadius: 0,
              backgroundColor: recording ? palette.line : "#FDF6E3",
            },
          ]}
        >
          <Icon name="mic" size={recordStyle === "circle-large" ? 48 : 40} color={recording ? palette.paper : palette.line} />
        </Pressable>
        <MonoText style={styles.metricLabel}>{doRecordHintLabel(sessionNumber, recording, recordElapsed)}</MonoText>
        <View style={[styles.guidedProgressTrack, { width: "100%" }]}>
          <View style={[styles.guidedProgressFill, { width: `${recordProgress}%` }]} />
        </View>
      </View>

      <SessionButton label={doCtaLabel(sessionNumber, recordElapsed, recordLimit)} onPress={onNext} />
    </View>
  );
}

export function StitchUnifiedSee(props: StitchStageProps) {
  const { session, sessionNumber, overlayOn, onReplay, onNext, analysis } = props;
  const liveSee = useMemo(
    () => resolveLiveSeeData({ sessionNumber: session.sessionNumber, record: session.stages.record, analysis }),
    [analysis, session.sessionNumber, session.stages.record],
  );
  const commentary = liveSee.commentary;
  const waveform = useWaveform(sessionNumber);
  const cta = seeCtaLabels(sessionNumber);
  const metrics = liveSee.metrics;
  const headline = session.stages.record.headerMeta ?? commentary.headline ?? session.stages.record.title;
  const pullLine = commentary.lines[0] ?? session.stages.record.subline ?? "";

  if (sessionNumber === 29) {
    const pyramidLayers = [
      { label: "CONCLUSION", flex: 0.35 },
      { label: "SUPPORT I", flex: 0.55 },
      { label: "SUPPORT II", flex: 0.75 },
      { label: "SUPPORT III", flex: 0.95 },
    ];
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 2 }}>04 / 05: SEE</MonoText>
        <View style={{ alignItems: "center", gap: 4, marginVertical: spacing.md, width: "100%" }}>
          {pyramidLayers.map((layer) => (
            <View
              key={layer.label}
              style={[
                styles.brutalistShadowInk,
                {
                  width: `${Math.round(layer.flex * 100)}%`,
                  alignSelf: "center",
                  backgroundColor: palette.line,
                  borderWidth: 2,
                  borderColor: palette.black,
                  paddingVertical: spacing.sm,
                  alignItems: "center",
                },
              ]}
            >
              <MonoText style={{ color: palette.paper, letterSpacing: 1, fontSize: 10 }}>{layer.label}</MonoText>
            </View>
          ))}
        </View>
        {pullLine ? <PullQuoteCard quote={pullLine} /> : null}
        <View style={styles.guidedMetricsRow}>
          {metrics.map((metric) => (
            <MetricTile key={metric.label} label={metric.label} value={`${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`.trim()} />
          ))}
        </View>
        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 35) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 2 }}>04 / 05: SEE</MonoText>
        <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>Brand Voice</DisplayText>
        {pullLine ? <PullQuoteCard quote={pullLine} /> : null}
        <View style={styles.guidedMetricsRow}>
          {metrics.map((metric) => (
            <MetricTile key={metric.label} label={metric.label} value={`${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`.trim()} />
          ))}
        </View>
        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 36) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 2 }}>04 / 05: SEE</MonoText>
        <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>Capstone Evaluation</DisplayText>
        <BodyText style={{ fontStyle: "italic", lineHeight: 28, fontSize: 20 }}>{pullLine}</BodyText>
        <View style={styles.guidedMetricsRow}>
          {metrics.map((metric) => (
            <MetricTile
              key={metric.label}
              label={metric.label}
              value={`${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`.trim()}
            />
          ))}
        </View>
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.md }]}>
          <EditorialWaveform bars={waveform.concat(waveform).slice(0, 20)} height={64} light />
          <MonoText style={[styles.metricLabel, { color: palette.peach, marginTop: spacing.sm }]}>SESSION 01 VS SESSION 36</MonoText>
        </View>
        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 25) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 2 }}>04 / 05: SEE</MonoText>
        <DisplayText style={{ fontSize: 28, lineHeight: 32 }}>Audience-Aware Framing</DisplayText>
        <MonoText style={styles.listenCardKicker}>TRIPTYCH ANALYSIS</MonoText>
        {["FRAME 01", "FRAME 02", "FRAME 03"].map((frame, i) => (
          <View key={frame} style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.sm, gap: spacing.xs }]}>
            <MonoText style={{ color: palette.line }}>{frame}</MonoText>
            <EditorialWaveform bars={waveform.slice(i * 4, i * 4 + 8)} height={40} />
          </View>
        ))}
        {pullLine ? <PullQuoteCard quote={pullLine} /> : null}
        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 27) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 2 }}>04 / 05: SEE</MonoText>
        <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>{session.arcTitle}</DisplayText>
        {pullLine ? <PullQuoteCard quote={pullLine} /> : null}
        <View style={styles.guidedMetricsRow}>
          {metrics.map((metric) => (
            <MetricTile key={metric.label} label={metric.label} value={`${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`.trim()} />
          ))}
        </View>
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md, alignItems: "center" }]}>
          <EditorialWaveform bars={waveform.slice(0, 24)} height={56} />
        </View>
        {cta.secondary ? (
          <SessionButton label={cta.secondary} onPress={onReplay} variant="secondary" iconLeft={<Icon name="play" size={18} color={palette.black} />} />
        ) : null}
        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 31) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 2 }}>04 / 05: SEE</MonoText>
        <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>Hero&apos;s Journey</DisplayText>
        {pullLine ? <PullQuoteCard quote={pullLine} /> : null}
        <View style={styles.guidedMetricsRow}>
          {metrics.map((metric) => (
            <MetricTile key={metric.label} label={metric.label} value={`${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`.trim()} />
          ))}
        </View>
        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      <SessionAnalysisStatusBanner isProcessing={liveSee.isProcessing} error={liveSee.error} />
      <MonoText style={{ color: palette.line, letterSpacing: 2 }}>04 / 05: SEE</MonoText>
      {headline ? <DisplayText style={styles.stageHeadline}>{headline}</DisplayText> : null}
      <DisplayText style={{ fontSize: 22, lineHeight: 26, color: palette.inkMuted }}>{session.arcTitle}</DisplayText>

      <View style={styles.guidedMetricsRow}>
        {metrics.map((metric, index) => (
          <MetricTile
            key={metric.label}
            label={metric.label}
            value={`${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`.trim()}
          />
        ))}
      </View>

      {pullLine ? <PullQuoteCard quote={pullLine} /> : null}
      {liveSee.coachNote ? (
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.md }]}>
          <MonoText style={styles.listenCardKicker}>COACH NOTE</MonoText>
          <BodyText style={{ lineHeight: 24, fontStyle: "italic" }}>{liveSee.coachNote}</BodyText>
        </View>
      ) : null}

      {cta.secondary && sessionNumber !== 27 ? (
        <SessionButton
          label={overlayOn ? "HIDE OVERLAY" : cta.secondary}
          onPress={onReplay}
          variant="secondary"
          iconLeft={<Icon name="play" size={18} color={palette.black} />}
        />
      ) : null}

      <SessionButton label={cta.primary} onPress={onNext} />
    </View>
  );
}

export function StitchUnifiedCommit(props: StitchStageProps) {
  const {
    session,
    sessionNumber,
    reflectRecording,
    reflectElapsed,
    reflectionDone,
    onToggleReflection,
    onRetakeReflection,
    onNext,
  } = props;
  const reflect = session.stages.reflect;
  const reflectProgress = Math.min(100, Math.round((reflectElapsed / REFLECT_DURATION) * 100));
  const waveform = useWaveform(sessionNumber);
  const cta = commitCtaLabels(sessionNumber);
  const opener = reflect.suggestedOpener?.replace(/^"|"$/g, "") ?? reflect.promptTitle ?? "Tomorrow I will notice…";
  const sectionTitle =
    sessionNumber >= 25 && sessionNumber <= 36
      ? `Session ${sessionNumber} · ${session.arcTitle}`
      : session.arcTitle ?? `Session ${sessionNumber}`;

  if (sessionNumber === 36) {
    const prompt = reflect.suggestedOpener ?? reflect.bodyText ?? "What did you become?";
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 1 }}>05 / 05</MonoText>
        <DisplayText style={{ fontSize: 48, lineHeight: 54 }}>{prompt}</DisplayText>
        <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
          <BodyText style={{ color: palette.inkMuted, fontSize: 20, lineHeight: 32 }}>
            {reflect.metaLine ?? "Thirty-six sessions of recorded choices sit behind the answer."}
          </BodyText>
        </View>
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.md, alignItems: "center" }]}>
          <Pressable
            onPress={onToggleReflection}
            style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 96, height: 96, borderRadius: 0, backgroundColor: palette.paper }]}
          >
            <Icon name="mic" size={40} color={palette.line} />
          </Pressable>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>
            {commitRecordHintLabel(sessionNumber, reflectRecording, reflectionDone)}
          </MonoText>
          <EditorialWaveform bars={waveform.slice(0, 14)} height={40} light />
        </View>
        {reflectionDone ? (
          <SessionButton label="COMPLETE PROGRAM" onPress={onNext} />
        ) : (
          <SessionButton
            label={commitRecordHintLabel(sessionNumber, reflectRecording, reflectionDone)}
            onPress={onToggleReflection}
            iconLeft={<Icon name="mic" size={18} color={palette.paper} />}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      <View style={{ flexDirection: "row", gap: 4, marginBottom: spacing.md }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 10,
              backgroundColor: i < 4 ? palette.line : "transparent",
              borderWidth: 1,
              borderColor: palette.line,
            }}
          />
        ))}
      </View>

      <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, fontSize: 10 }}>{sectionTitle.toUpperCase()}</MonoText>
      <DisplayText style={{ fontSize: 36, lineHeight: 40 }}>Tomorrow I will notice…</DisplayText>

      <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.line, padding: spacing.md, gap: spacing.sm }]}>
        <BodyText style={{ fontStyle: "italic", lineHeight: 26, color: palette.inkMuted }}>&ldquo;{opener}&rdquo;</BodyText>
        {reflect.metaLine ? (
          <MonoText style={{ color: palette.inkMuted, fontSize: 11 }}>Record a one-sentence commitment.</MonoText>
        ) : null}
      </View>

      <View style={{ alignItems: "center", gap: spacing.md }}>
        <Pressable
          onPress={onToggleReflection}
          style={[
            styles.doRecordButton,
            styles.brutalistShadowInk,
            {
              width: 120,
              height: 120,
              borderRadius: 0,
              backgroundColor: palette.paper,
              borderWidth: 3,
              borderColor: palette.line,
            },
          ]}
        >
          <Icon name={reflectionDone ? "spark" : "mic"} size={48} color={palette.line} />
        </Pressable>
        <MonoText style={{ color: palette.line, letterSpacing: 2 }}>
          {commitRecordHintLabel(sessionNumber, reflectRecording, reflectionDone)}
        </MonoText>
        <View style={[styles.guidedProgressTrack, { width: "80%" }]}>
          <View style={[styles.guidedProgressFill, { width: `${reflectProgress}%` }]} />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
        {sessionNumber === 25 ? (
          <SessionButton label="SKIP" onPress={onNext} variant="secondary" style={{ flex: 0 }} />
        ) : null}
        <View style={{ flex: 1 }}>
          {!reflectionDone ? (
            <SessionButton
              label={commitActionLabel(sessionNumber, false, sessionDefinitions.length)}
              onPress={onToggleReflection}
              iconLeft={<Icon name="mic" size={18} color={palette.paper} />}
            />
          ) : (
            <SessionButton
              label={commitActionLabel(sessionNumber, true, sessionDefinitions.length)}
              onPress={onNext}
            />
          )}
        </View>
      </View>
    </View>
  );
}

/** @deprecated Use getGuidedRendererId from sessionStageRouter */
export function isStitchFinalPassSession(sessionNumber?: number) {
  return sessionNumber !== undefined && sessionNumber >= 25 && sessionNumber <= 36;
}
