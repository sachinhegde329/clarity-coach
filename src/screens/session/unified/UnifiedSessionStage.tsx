import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, View } from "react-native";
import { BodyText, DisplayText, MonoText } from "../../../design-system/primitives";
import { Icon } from "../../../design-system/icons";
import { palette, spacing, type } from "../../../design-system/theme";
import { sessionDefinitions, type SessionStage } from "../../../data/mockData";
import { SessionAnalysisStatusBanner } from "../components/SessionAnalysisStatusBanner";
import { resolveLiveSeeData } from "../utils/resolveLiveSeeData";
import type { SessionAnalysisProps } from "../flow/types";
import { RECORD_DURATION, REFLECT_DURATION, UNLOCK_ALL_FOR_TESTING } from "../constants";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";
import { EditorialWaveform } from "../components/EditorialWaveform";
import { MetricTile } from "../components/MetricTile";
import { SessionAudioPlayer } from "../components/SessionAudioPlayer";
import { SessionButton } from "../components/SessionButton";
import { SessionProgressStrip } from "../components/SessionProgressStrip";
import { DottedStageBackground } from "../components/DottedStageBackground";
import {
  commitCtaLabels,
  commitActionLabel,
  commitRecordHintLabel,
  doCtaLabel,
  doRecordHintLabel,
  doRecordStyle,
  listenCtaLabel,
  seeCtaLabels,
} from "../unified/sessionScreenConfig";
// Sessions 25–36 render via flow/guided/GuidedStageView → stitchStages (not here).

function AnimatedWaveformBars({ bars, playing }: { bars: number[]; playing: boolean }) {
  const breath = useRef(new Animated.Value(0)).current;
  const barAnims = useRef(bars.map((h) => new Animated.Value(h))).current;
  const breathRange = useMemo(() =>
    bars.map((bar) => ({
      lo: Math.max(4, bar * 0.2),
      hi: Math.min(110, bar * 2.0),
    })),
    [bars],
  );

  useEffect(() => {
    if (!playing) {
      breath.setValue(0);
      barAnims.forEach((anim, i) => {
        const base = bars[i] ?? 30;
        Animated.timing(anim, { toValue: base, duration: 200, useNativeDriver: false }).start();
      });
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(breath, { toValue: 0, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [playing, bars, breath, barAnims]);

  useEffect(() => {
    if (!playing) return;
    const id = breath.addListener(({ value }) => {
      barAnims.forEach((anim, i) => {
        const r = breathRange[i] ?? { lo: 8, hi: 60 };
        anim.setValue(r.lo + (r.hi - r.lo) * value);
      });
    });
    return () => breath.removeListener(id);
  }, [playing, breath, barAnims, breathRange]);

  const fillerIndices = new Set([2, 6, 11, 16, 19]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row", alignItems: "flex-end", gap: 2, paddingBottom: 4, minWidth: "100%" }}>
      {bars.map((_, index) => {
        const isFiller = fillerIndices.has(index);
        return (
          <View key={index} style={{ alignItems: "center", position: "relative" }}>
            <Animated.View style={{
              width: 5,
              height: barAnims[index],
              backgroundColor: isFiller ? palette.error : palette.siennaAccent,
              opacity: isFiller ? 1 : 0.7,
            }} />
            {isFiller ? (
              <View style={{
                position: "absolute",
                top: -16,
                backgroundColor: palette.error,
                paddingHorizontal: 4,
                paddingVertical: 1,
              }}>
                <MonoText style={{ color: palette.white, fontSize: 6, letterSpacing: 0.3 }}>FILLER</MonoText>
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

type UnifiedProps = {
  session: (typeof sessionDefinitions)[number];
  sessionNumber: number;
  stage: SessionStage;
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
  onNext: () => void;
  analysis?: SessionAnalysisProps;
};

export function UnifiedSessionStage(props: UnifiedProps) {
  const { sessionNumber, stage } = props;

  switch (stage) {
    case "lesson":
      return <UnifiedListen {...props} />;
    case "feedback":
      return <UnifiedDo {...props} />;
    case "record":
      return <UnifiedSee {...props} />;
    case "reflect":
      return <UnifiedCommit {...props} />;
    default:
      return null;
  }
}

function UnifiedListen(props: UnifiedProps) {
  const { session, sessionNumber, listenPlaying, listenProgress, onTogglePlay, onNext } = props;
  const lesson = session.stages.lesson;
  const waveform = useWaveform(session.sessionNumber);
  const listenComplete = listenProgress >= 100;
  const transcript = lesson.description ?? lesson.coachingPassages?.[0]?.text ?? "";
  const pullQuote = lesson.insightQuote;
  const tidbitTitle = lesson.title ?? "SESSION TRANSCRIPT";
  const [transcriptOpen, setTranscriptOpen] = useState(() => sessionNumber === 5);

  if (sessionNumber === 6) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.line, letterSpacing: 1, fontSize: 10 }}>02 / 05</MonoText>
          <DisplayText style={{ fontSize: 44, lineHeight: 48 }}>{lesson.title ?? "Review - Hear Yourself"}</DisplayText>
        </View>

        {pullQuote ? (
          <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
            <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 30, fontSize: 20 }}>{pullQuote}</BodyText>
          </View>
        ) : null}

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ paddingHorizontal: spacing.md, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 6 PROTOCOL</MonoText>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon name="listen" size={16} color={palette.line} />
              <MonoText style={{ color: palette.line, letterSpacing: 2 }}>60S TIDBIT</MonoText>
            </View>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: palette.lineSoft, padding: spacing.md, gap: spacing.md }}>
            <BodyText style={{ fontSize: 20, lineHeight: 30 }}>{lesson.description}</BodyText>
            <View style={{ borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.md }}>
              <EditorialWaveform bars={waveform.concat(waveform).slice(0, 18)} height={46} />
            </View>
          </View>
        </View>

        <SessionButton label={listenCtaLabel(sessionNumber, listenComplete)} onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 7) {
    const secondsTotal = 180;
    const secondsElapsed = Math.round((listenProgress / 100) * secondsTotal);
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
            <View style={{ gap: 4 }}>
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 1, fontSize: 10 }}>PROTOCOL PROGRESS</MonoText>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      height: 8,
                      borderWidth: 1,
                      borderColor: palette.lineSoft,
                      backgroundColor: i < 2 ? palette.line : "transparent",
                    }}
                  />
                ))}
              </View>
            </View>
            <MonoText style={{ color: palette.inkMuted, fontSize: 10, letterSpacing: 1 }}>Step 02/05</MonoText>
          </View>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 1, fontSize: 10 }}>SESSION 07: STEP 02 LISTEN</MonoText>
          <DisplayText style={{ fontSize: 40, lineHeight: 44 }}>{lesson.title ?? "FILLER REDUCTION IN PRACTICE"}</DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ gap: 4 }}>
              <MonoText style={styles.metricLabel}>CURRENT PLAYBACK</MonoText>
              <DisplayText style={{ fontSize: 22, lineHeight: 26 }}>{formatTime(secondsElapsed)} / {formatTime(secondsTotal)}</DisplayText>
            </View>
            <Pressable onPress={onTogglePlay} style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 64, height: 64, borderRadius: 0, backgroundColor: palette.line }]}>
              <MonoText style={{ color: palette.paper, fontSize: 18 }}>{listenPlaying ? "II" : "▶"}</MonoText>
            </Pressable>
          </View>
          <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>
            <View style={{ borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.sm, backgroundColor: "rgba(239,223,216,0.35)" }}>
              <View style={{ position: "absolute", top: 8, left: "44%", paddingHorizontal: 10, paddingVertical: 4, backgroundColor: palette.black }}>
                <MonoText style={{ color: palette.paper, fontSize: 10, letterSpacing: 1 }}>FILLER DETECTED</MonoText>
              </View>
              <EditorialWaveform bars={waveform.concat(waveform).slice(0, 24)} height={64} />
            </View>
          </View>
        </View>

        {pullQuote ? (
          <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
            <BodyText style={{ color: palette.line, fontStyle: "italic", lineHeight: 28, fontSize: 20 }}>{pullQuote}</BodyText>
          </View>
        ) : null}

        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>ANALYSIS TRANSCRIPT</MonoText>
          <View style={{ height: 1, backgroundColor: palette.lineSoft }} />
          <BodyText style={{ lineHeight: 26 }}>{transcript}</BodyText>
        </View>

        {lesson.keyConcept ? (
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)" }]}>
            <MonoText style={styles.listenCardKicker}>{lesson.keyConcept.title}</MonoText>
            <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>{lesson.keyConcept.body}</BodyText>
          </View>
        ) : null}

        <SessionButton label={listenCtaLabel(sessionNumber, listenComplete)} onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 8) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 1, fontSize: 10 }}>02 / 05 · LISTEN</MonoText>
        <DisplayText style={{ fontSize: 46, lineHeight: 50 }}>{lesson.title ?? "The 130 to 150 band"}</DisplayText>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.md, gap: spacing.sm }}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>CURRENT SECTION</MonoText>
            <DisplayText style={{ fontSize: 28, lineHeight: 32, color: palette.line }}>Core Tidbit</DisplayText>
          </View>
          <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.sm }}>
            <SessionAudioPlayer bars={waveform} playing={listenPlaying} progress={listenProgress} onTogglePlay={onTogglePlay} cta={lesson.waveformMeta} />
          </View>
        </View>

        {pullQuote ? (
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)", borderLeftWidth: 4, borderLeftColor: palette.line }]}>
            <BodyText style={{ color: palette.line, fontStyle: "italic", lineHeight: 28, fontSize: 20 }}>{pullQuote}</BodyText>
          </View>
        ) : null}

        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>TRANSCRIPT ALIGNMENT</MonoText>
          <BodyText style={{ lineHeight: 26 }}>
            <BodyText style={{ backgroundColor: "rgba(239,223,216,0.65)" }}>
              {transcript.split(".")[0] ? `${transcript.split(".")[0]}.` : transcript}
            </BodyText>
            {" "}
            {transcript.split(".").slice(1).join(".").trim()}
          </BodyText>
        </View>

        <SessionButton label={listenCtaLabel(sessionNumber, listenComplete)} onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 9) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 1, fontSize: 10 }}>02 / 05 · LISTEN</MonoText>
        <DisplayText style={{ fontSize: 46, lineHeight: 50 }}>{lesson.title ?? "STRATEGIC SILENCE"}</DisplayText>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>{formatTime(Math.round((listenProgress / 100) * 60))} / 01:00</DisplayText>
            <Pressable onPress={onTogglePlay} style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 64, height: 64, borderRadius: 0, backgroundColor: palette.line }]}>
              <MonoText style={{ color: palette.paper, fontSize: 18 }}>{listenPlaying ? "II" : "▶"}</MonoText>
            </Pressable>
          </View>
          <View style={{ padding: spacing.md }}>
            <View style={{ borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.md, backgroundColor: "rgba(239,223,216,0.25)" }}>
              <EditorialWaveform bars={waveform.concat(waveform).slice(0, 22)} height={86} />
            </View>
          </View>
        </View>

        {pullQuote ? (
          <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
            <BodyText style={{ color: palette.line, fontStyle: "italic", lineHeight: 28, fontSize: 20 }}>{pullQuote}</BodyText>
          </View>
        ) : null}

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: palette.paper }]}>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>
            {transcript}
          </BodyText>
        </View>

        <SessionButton label={listenCtaLabel(sessionNumber, listenComplete)} onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 10) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 1, fontSize: 10 }}>02 / 05 - LISTEN</MonoText>
        <DisplayText style={{ fontSize: 44, lineHeight: 48 }}>{lesson.title ?? "The certainty sound"}</DisplayText>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.md, gap: spacing.sm }}>
            <View style={{ alignSelf: "flex-end", borderWidth: 1, borderColor: palette.lineSoft, paddingHorizontal: spacing.md, paddingVertical: 8 }}>
              <MonoText style={{ color: palette.line, letterSpacing: 2 }}>PITCH DROP DETECTED</MonoText>
            </View>
            <View style={{ borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.md, backgroundColor: "rgba(239,223,216,0.25)" }}>
              <EditorialWaveform bars={waveform.concat(waveform).slice(0, 22)} height={74} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Pressable onPress={onTogglePlay} style={[styles.brutalistPanel, { padding: spacing.sm, borderWidth: 2, borderColor: palette.black }]}>
                <MonoText style={{ color: palette.black, fontSize: 18 }}>{listenPlaying ? "II" : "▶"}</MonoText>
              </Pressable>
              <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>0:24</DisplayText>
              <MonoText style={{ color: palette.inkMuted }}>OF 1:00 TOTAL</MonoText>
            </View>
          </View>
        </View>

        {pullQuote ? (
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)" }]}>
            <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 28, fontSize: 20 }}>{pullQuote}</BodyText>
          </View>
        ) : null}

        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>TRANSCRIPT</MonoText>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{transcript}</BodyText>
          <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md, backgroundColor: "rgba(239,223,216,0.35)", paddingVertical: spacing.sm }}>
            <BodyText style={{ lineHeight: 26 }}>
              A two-semitone drop on the final syllable reads as resolved.
            </BodyText>
          </View>
        </View>

        <SessionButton label={listenCtaLabel(sessionNumber, listenComplete)} onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 3) {
    const metricA = lesson.metrics?.[0];
    const metricB = lesson.metrics?.[1];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        {pullQuote ? (
          <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk]}>
            <BodyText style={styles.stagePullQuote}>{pullQuote}</BodyText>
          </View>
        ) : null}

        <View style={[styles.listenMainCard, styles.brutalistShadowInk]}>
          <MonoText style={styles.listenCardKicker}>60S TIDBIT</MonoText>
          <SessionAudioPlayer
            bars={waveform}
            playing={listenPlaying}
            progress={listenProgress}
            onTogglePlay={onTogglePlay}
            cta={lesson.waveformMeta}
          />
          <View style={{ gap: spacing.sm }}>
            <MonoText style={styles.listenCardKicker}>LIVE TRANSCRIPT</MonoText>
            <ScrollView style={styles.listenTranscriptBox} nestedScrollEnabled showsVerticalScrollIndicator={false}>
              <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>{transcript}</BodyText>
            </ScrollView>
          </View>
        </View>

        {(metricA || metricB) ? (
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            {metricA ? (
              <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { flex: 1 }]}>
                <MonoText style={styles.metricLabel}>{metricA.label}</MonoText>
                <DisplayText style={{ fontSize: 26, lineHeight: 30, color: palette.line }}>{metricA.value}</DisplayText>
              </View>
            ) : null}
            {metricB ? (
              <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { flex: 1 }]}>
                <MonoText style={styles.metricLabel}>{metricB.label}</MonoText>
                <DisplayText style={{ fontSize: 26, lineHeight: 30, color: palette.line }}>{metricB.value}</DisplayText>
              </View>
            ) : null}
          </View>
        ) : null}

        <SessionButton label={listenCtaLabel(sessionNumber, listenComplete)} onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 4) {
    const tidbitCardTitle = (session.arcTitle || session.practiceTitle || "ENERGY").split(/\s+/)[0]?.toUpperCase() || "ENERGY";
    const transcriptLines = (lesson.coachingPassages?.length ? lesson.coachingPassages : [{ text: transcript }]).map(
      (entry, index, all) => {
        const interval = Math.floor(60 / Math.max(1, all.length));
        const totalSeconds = Math.min(59, index * interval);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const time = `${minutes}:${String(seconds).padStart(2, "0")}`;
        return { time, text: entry.text, muted: entry.tone === "muted" };
      },
    );

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        {pullQuote ? (
          <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk]}>
            <BodyText style={styles.stagePullQuote}>{pullQuote}</BodyText>
          </View>
        ) : null}

        <View style={[styles.listenMainCard, styles.brutalistShadowInk]}>
          <MonoText style={styles.listenCardKicker}>60S TIDBIT</MonoText>
          <DisplayText style={{ fontSize: 34, lineHeight: 38, marginTop: 2 }}>{tidbitCardTitle}</DisplayText>
          <SessionAudioPlayer bars={waveform} playing={listenPlaying} progress={listenProgress} onTogglePlay={onTogglePlay} cta={lesson.waveformMeta} />
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <View style={{ height: 1, backgroundColor: palette.lineSoft, flex: 1 }} />
              <MonoText style={[styles.listenCardKicker, { textAlign: "center" }]}>TRANSCRIPT</MonoText>
              <View style={{ height: 1, backgroundColor: palette.lineSoft, flex: 1 }} />
            </View>
            <ScrollView style={[styles.listenTranscriptBox, { maxHeight: 320 }]} nestedScrollEnabled showsVerticalScrollIndicator={false}>
              <View style={{ gap: spacing.md }}>
                {transcriptLines.map((line) => (
                  <BodyText key={line.time} style={{ color: line.muted ? palette.inkMuted : palette.black, lineHeight: 24 }}>
                    <MonoText style={{ color: palette.line }}>{line.time} </MonoText>
                    {line.text}
                  </BodyText>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <SessionButton label={listenCtaLabel(sessionNumber, listenComplete)} onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 5) {
    const transcriptLines = (lesson.coachingPassages?.length ? lesson.coachingPassages : [{ text: transcript }]).map(
      (entry, index, all) => {
        const interval = Math.floor(60 / Math.max(1, all.length));
        const totalSeconds = Math.min(59, index * interval);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const time = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        return { time, text: entry.text, muted: entry.tone === "muted" };
      },
    );

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
            <MonoText style={{ color: palette.line, letterSpacing: 1, fontSize: 10 }}>CURRENT PHASE</MonoText>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 1, fontSize: 10 }}>STEP 2</MonoText>
          </View>
          <DisplayText style={{ fontSize: 46, lineHeight: 50 }}>{lesson.title ?? "Listen"}</DisplayText>
          <SessionProgressStrip activeIndex={1} compact />
        </View>

        {pullQuote ? (
          <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { paddingTop: spacing.lg }]}>
            <View style={{ position: "absolute", top: -2, left: -2, width: 36, height: 36, backgroundColor: palette.line, borderWidth: 2, borderColor: palette.black, alignItems: "center", justifyContent: "center" }}>
              <MonoText style={{ color: palette.paper, fontSize: 14 }}>"</MonoText>
            </View>
            <BodyText style={styles.stagePullQuote}>{pullQuote}</BodyText>
          </View>
        ) : null}

        <View style={[styles.listenMainCard, styles.brutalistShadowInk]}>
          <MonoText style={styles.listenCardKicker}>CORE TIDBIT</MonoText>
          <SessionAudioPlayer bars={waveform} playing={listenPlaying} progress={listenProgress} onTogglePlay={onTogglePlay} cta={lesson.waveformMeta} />
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={transcriptOpen ? "Collapse transcript" : "Expand transcript"}
            onPress={() => setTranscriptOpen((open) => !open)}
            style={{ backgroundColor: palette.black, paddingHorizontal: spacing.md, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <MonoText style={{ color: palette.paper, letterSpacing: 1 }}>TRANSCRIPT</MonoText>
            <MonoText style={{ color: palette.paper, opacity: 0.75 }}>{transcriptOpen ? "▾" : "▸"}</MonoText>
          </Pressable>
          {transcriptOpen ? (
            <View style={{ padding: spacing.md }}>
              <View style={{ gap: spacing.md }}>
                {transcriptLines.map((line) => (
                  <BodyText key={line.time} style={{ color: line.muted ? palette.inkMuted : palette.black, lineHeight: 24 }}>
                    <MonoText style={{ color: palette.line }}>{line.time} </MonoText>
                    {line.text}
                  </BodyText>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        <SessionButton label={listenCtaLabel(sessionNumber, listenComplete)} onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 1) {
    const audioFileName = `SAMPLE_A_${String(sessionNumber).padStart(2, "0")}.WAV`;
    const totalSeconds = 105;
    const [elapsedMs, setElapsedMs] = useState(0);
    const elapsedRef = useRef(0);
    const playStartRef = useRef(0);

    useEffect(() => {
      if (!listenPlaying) {
        if (listenProgress >= 100) {
          elapsedRef.current = totalSeconds * 1000;
          setElapsedMs(totalSeconds * 1000);
        }
        return;
      }
      playStartRef.current = Date.now() - elapsedRef.current;
      const ticker = setInterval(() => {
        const now = Date.now();
        const ms = Math.min(totalSeconds * 1000, now - playStartRef.current);
        elapsedRef.current = ms;
        setElapsedMs(ms);
      }, 50);
      return () => clearInterval(ticker);
    }, [listenPlaying, listenProgress, totalSeconds]);

    const elapsedSec = Math.min(totalSeconds, elapsedMs / 1000);
    const elapsedLabel = `${String(Math.floor(elapsedSec / 60)).padStart(2, "0")}:${String(Math.floor(elapsedSec) % 60).padStart(2, "0")}`;
    const totalLabel = `01:${String(totalSeconds % 60).padStart(2, "0")}`;
    const guideDescription = "Fillers are cognitive stall tactics\u2014sounds or words like \"um,\" \"ah,\" or \"so\" that we use while our brain searches for the next thought. By identifying them, we regain the space to choose silence.";
    const translateAnim = useRef(new Animated.Value(0)).current;

    const onPressIn = useCallback(() => {
      Animated.spring(translateAnim, { toValue: 1, tension: 220, friction: 18, useNativeDriver: true }).start();
    }, [translateAnim]);
    const onPressOut = useCallback(() => {
      Animated.spring(translateAnim, { toValue: 0, tension: 220, friction: 18, useNativeDriver: true }).start();
    }, [translateAnim]);
    const btnTranslateX = translateAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });
    const btnTranslateY = translateAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{
          backgroundColor: palette.parchmentSurface,
          borderWidth: 2,
          borderColor: palette.siennaAccent,
          padding: 24,
          shadowColor: palette.siennaAccent,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 0,
          gap: 16,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon name="spark" size={20} color={palette.siennaAccent} />
            <MonoText style={{ color: palette.inkFocus, fontSize: 12, letterSpacing: 1.2 }}>GUIDE</MonoText>
          </View>
          <DisplayText style={{ fontSize: 24, lineHeight: 28, color: palette.onSurface }}>{lesson.title}</DisplayText>
          <BodyText style={{ color: palette.onSurfaceVariant, lineHeight: 24 }}>{guideDescription}</BodyText>
        </View>

        <View style={{
          backgroundColor: palette.white,
          borderWidth: 2,
          borderColor: palette.inkFocus,
          padding: spacing.md,
          gap: spacing.md,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Pressable
                onPress={onTogglePlay}
                style={({ pressed }) => [{
                  width: 48, height: 48,
                  backgroundColor: palette.siennaAccent,
                  borderWidth: 2, borderColor: palette.inkFocus,
                  alignItems: "center", justifyContent: "center",
                  shadowColor: palette.inkFocus,
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1, shadowRadius: 0, elevation: 0,
                }, pressed && { opacity: 0.88, transform: [{ translateY: 1 }] }]}
              >
                <MonoText style={{ color: palette.parchmentSurface, fontSize: 20 }}>
                  {listenPlaying ? "II" : "▶"}
                </MonoText>
              </Pressable>
              <View>
                <MonoText style={{ color: palette.inkFocus, fontSize: 12, letterSpacing: 1 }}>{audioFileName}</MonoText>
                <MonoText style={{ color: palette.onSurfaceVariant, fontSize: 14, letterSpacing: 0.5 }}>
                  {elapsedLabel} / {totalLabel}
                </MonoText>
              </View>
            </View>
            <Icon name="wave" size={24} color={palette.outline} />
          </View>

          <View style={{
            height: 96,
            backgroundColor: palette.surfaceContainerLow,
            borderWidth: 1,
            borderColor: palette.outlineVariant,
            overflow: "hidden",
            paddingHorizontal: spacing.md,
            justifyContent: "center",
          }}>
            <AnimatedWaveformBars bars={waveform} playing={listenPlaying} />
          </View>
        </View>

        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.outline, letterSpacing: 1.2, textTransform: "uppercase" }}>Transcript</MonoText>
          <ScrollView style={{ maxHeight: 192 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
            <View style={{ borderLeftWidth: 4, borderLeftColor: palette.outlineVariant, paddingLeft: spacing.lg, gap: spacing.md }}>
              {lesson.coachingPassages?.map((passage, i) => (
                <BodyText key={i} style={{
                  color: i === 1 ? palette.onSurface : palette.onSurfaceVariant,
                  backgroundColor: i === 1 ? palette.surfaceContainerHighest : "transparent",
                  padding: i === 1 ? 8 : 0,
                  lineHeight: 24,
                  opacity: i === 1 ? 1 : 0.5,
                }}>
                  {passage.text}
                </BodyText>
              ))}
            </View>
          </ScrollView>
        </View>

        {pullQuote ? (
          <View style={{ position: "relative", paddingVertical: 32, marginVertical: spacing.sm }}>
            <View style={{
              position: "absolute", top: 0, left: 0,
              width: 32, height: 32,
              borderTopWidth: 2, borderLeftWidth: 2,
              borderColor: palette.siennaAccent,
            }} />
            <View style={{ paddingHorizontal: 40 }}>
              <BodyText style={{
                fontFamily: type.bodyMedium,
                fontSize: 20, lineHeight: 28,
                color: palette.primary,
                fontStyle: "italic",
                textAlign: "center",
              }}>
                {pullQuote}
              </BodyText>
            </View>
            <View style={{
              position: "absolute", bottom: 0, right: 0,
              width: 32, height: 32,
              borderBottomWidth: 2, borderRightWidth: 2,
              borderColor: palette.siennaAccent,
            }} />
          </View>
        ) : null}

        <Pressable
          onPress={onNext}
          disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Animated.View style={{
            backgroundColor: palette.siennaAccent,
            borderWidth: 2,
            borderColor: palette.inkFocus,
            paddingVertical: 24,
            paddingHorizontal: spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            shadowColor: palette.siennaAccent,
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 0,
            opacity: !listenComplete && !UNLOCK_ALL_FOR_TESTING ? 0.45 : 1,
            transform: [{ translateX: btnTranslateX }, { translateY: btnTranslateY }],
          }}>
            <MonoText style={{
              color: palette.parchmentSurface,
              fontSize: 18,
              letterSpacing: 3.2,
              textTransform: "uppercase",
            }}>
              {listenComplete || UNLOCK_ALL_FOR_TESTING ? "NEXT STEP: PRACTICE" : "LISTEN TO CONTINUE"}
            </MonoText>
            <Animated.View style={{ transform: [{ translateX: btnTranslateX }] }}>
              <MonoText style={{ color: palette.parchmentSurface, fontSize: 22 }}>→</MonoText>
            </Animated.View>
          </Animated.View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.guidedStepBodyUnified]}>
      {pullQuote ? (
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.line }]}>
          <BodyText style={styles.stagePullQuote}>{pullQuote}</BodyText>
        </View>
      ) : null}

      <View style={[styles.listenMainCard, styles.brutalistShadowInk]}>
        <View style={styles.listenCardHeader}>
          {sessionNumber > 5 ? (
            <MonoText style={styles.listenCardKicker}>
              SESSION {String(sessionNumber).padStart(2, "0")} · {tidbitTitle.toUpperCase()}
            </MonoText>
          ) : (
            <MonoText style={styles.listenCardKicker}>60S TIDBIT</MonoText>
          )}
          <MonoText style={styles.metricLabel}>
            {Math.round((listenProgress / 100) * 105)}s / 01:45
          </MonoText>
        </View>
        <SessionAudioPlayer bars={waveform} playing={listenPlaying} progress={listenProgress} onTogglePlay={onTogglePlay} cta={lesson.waveformMeta} />
        <View style={{ gap: spacing.sm }}>
          <MonoText style={styles.listenCardKicker}>SESSION TRANSCRIPT</MonoText>
          <ScrollView style={styles.listenTranscriptBox} nestedScrollEnabled showsVerticalScrollIndicator={false}>
            <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>{transcript}</BodyText>
          </ScrollView>
        </View>
      </View>

      {sessionNumber === 2 && lesson.anatomy?.length ? (
        <View style={[styles.listenInsightCard, styles.brutalistShadowInk]}>
          <MonoText style={styles.listenCardKicker}>WHY PACE MATTERS</MonoText>
          {lesson.anatomy.slice(0, 1).map((item) => (
            <BodyText key={item.label} style={{ color: palette.inkMuted }}>
              {item.body}
            </BodyText>
          ))}
          <View style={[styles.brutalistPanel, { marginTop: spacing.sm }]}>
            <MonoText style={styles.metricLabel}>TARGET CADENCE</MonoText>
            <DisplayText style={{ fontSize: 28, color: palette.line }}>125 WPM</DisplayText>
          </View>
        </View>
      ) : null}

      {sessionNumber !== 2 && pullQuote && sessionNumber < 25 ? (
        <View style={[styles.listenQuoteCard, styles.brutalistShadowInk]}>
          <BodyText style={styles.listenQuoteText}>{pullQuote}</BodyText>
        </View>
      ) : null}

      {sessionNumber === 1 && lesson.anatomy?.length ? (
        <View style={[styles.listenInsightCard, styles.brutalistShadowInk, { gap: spacing.md }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <Icon name="spark" size={20} color={palette.line} />
            <MonoText style={styles.listenCardKicker}>GUIDE</MonoText>
          </View>
          {lesson.anatomy.slice(0, 1).map((item) => (
            <View key={item.label} style={{ gap: spacing.sm }}>
              <DisplayText style={{ fontSize: 22, lineHeight: 28 }}>{item.label}</DisplayText>
              <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>
                {item.body}
              </BodyText>
            </View>
          ))}
        </View>
      ) : null}

      <SessionButton label={listenCtaLabel(sessionNumber, listenComplete)} onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
    </View>
  );
}

function UnifiedDo(props: UnifiedProps) {
  const { session, sessionNumber, recordLimit, recording, recordElapsed, onToggleRecording, onNext } = props;
  const doContent = session.stages.feedback;
  const recordProgress = Math.min(100, Math.round((recordElapsed / recordLimit) * 100));
  const recordSecondsLeft = Math.max(0, recordLimit - recordElapsed);
  const recordStyle = doRecordStyle(sessionNumber);
  const waveform = useWaveform(session.sessionNumber);

  if (sessionNumber === 6) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ alignItems: "center", gap: spacing.xs }}>
          <MonoText style={{ color: palette.line, letterSpacing: 1 }}>03 / 05</MonoText>
          <DisplayText style={{ fontSize: 44, lineHeight: 48 }}>DO</DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { paddingVertical: spacing.sm }]}>
          <MonoText style={[styles.listenCardKicker, { textAlign: "center" }]}>CONSTRAINT</MonoText>
          <DisplayText style={{ fontSize: 28, lineHeight: 32, textAlign: "center", color: palette.black }}>
            {(doContent.constraint ?? "Listen. Do not record.").replace(/\.\s*/g, ".\n")}
          </DisplayText>
        </View>

        <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
          <DisplayText style={{ fontSize: 32, lineHeight: 38 }}>
            {doContent.promptTitle ?? "Baseline plays. Then five seconds of silence. Then session five plays."}
          </DisplayText>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>~3:00 TOTAL</MonoText>
          <DisplayText style={{ fontSize: 28, lineHeight: 32, color: palette.line }}>00:00</DisplayText>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.md }}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>SESSION 1 (BASELINE)</MonoText>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: palette.lineSoft, padding: spacing.sm, minHeight: 96, backgroundColor: palette.paper }}>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={[styles.outlineBadge, { borderColor: palette.lineSoft }]}>
                <MonoText style={[styles.outlineBadgeText, { color: palette.inkMuted }]}>FILLER</MonoText>
              </View>
              <View style={[styles.outlineBadge, { borderColor: palette.lineSoft }]}>
                <MonoText style={[styles.outlineBadgeText, { color: palette.inkMuted }]}>PACE DROP</MonoText>
              </View>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "center", gap: spacing.xs }}>
          <View style={{ width: 1, height: 16, backgroundColor: palette.lineSoft }} />
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { paddingHorizontal: spacing.xl, paddingVertical: spacing.sm }]}>
            <DisplayText style={{ fontSize: 22, lineHeight: 26, color: palette.black }}>5</DisplayText>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>SECONDS</MonoText>
          </View>
          <View style={{ width: 1, height: 16, backgroundColor: palette.lineSoft }} />
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.md }}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>SESSION 5</MonoText>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: palette.lineSoft, padding: spacing.sm, minHeight: 96, backgroundColor: palette.paper }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
              <View style={[styles.outlineBadge, { borderColor: palette.lineSoft, backgroundColor: "#8A9A7D" }]}>
                <MonoText style={[styles.outlineBadgeText, { color: palette.paper }]}>CLEAR</MonoText>
              </View>
              <MonoText style={{ color: palette.inkMuted }}>01:45</MonoText>
              <View style={[styles.outlineBadge, { borderColor: palette.lineSoft, backgroundColor: "#8A9A7D" }]}>
                <MonoText style={[styles.outlineBadgeText, { color: palette.paper }]}>STRONG</MonoText>
              </View>
            </View>
          </View>
        </View>

        <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 24 }}>
          {doContent.preRecordMeta ?? "Take the five seconds of silence to compare — don't rush the gap."}
        </BodyText>

        <BodyText style={{ textAlign: "center", fontStyle: "italic", letterSpacing: 1 }}>
          {doContent.closingLine ? `“${doContent.closingLine.toUpperCase()}”` : "“THAT WAS YOU, FIVE SESSIONS APART.\nTHE DIFFERENCES ARE THE DATA.”"}
        </BodyText>

        <SessionButton label="SEE TRENDS" onPress={onNext} variant="secondary" />
      </View>
    );
  }

  if (doContent.listenOnly || doContent.replayMode) {
    return (
      <View style={styles.guidedStepBodyUnified}>
        <BodyText style={styles.doPromptQuote}>{doContent.promptBody}</BodyText>
        <EditorialWaveform bars={waveform.concat(waveform).slice(0, 28)} height={120} />
        <SessionButton label={doContent.listenOnly ? "PLAY BOTH" : "START REPLAY"} onPress={onNext} />
      </View>
    );
  }

  const recordSize = recordStyle === "circle-large" ? 160 : recordStyle === "square" ? 128 : 96;
  const recordRadius = recordStyle === "square" ? 0 : recordSize / 2;

  if (sessionNumber === 7) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
            <MonoText style={{ color: palette.line, letterSpacing: 1 }}>STEP 03/05</MonoText>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>SESSION 07</MonoText>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={i} style={{ flex: 1, height: 8, borderWidth: 1, borderColor: palette.lineSoft, backgroundColor: i < 3 ? palette.line : "transparent" }} />
            ))}
          </View>
          <DisplayText style={{ fontSize: 38, lineHeight: 42 }}>Session 07: Step 03{"\n"}Do</DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.md, flexDirection: "row", justifyContent: "space-between" }}>
            <View style={[styles.doConstraintBadge, { backgroundColor: palette.black }]}>
              <MonoText style={styles.doConstraintBadgeText}>CONSTRAINT</MonoText>
            </View>
            <MonoText style={{ color: palette.line, fontSize: 18, letterSpacing: 1 }}>60s</MonoText>
          </View>
          <View style={{ padding: spacing.md, gap: spacing.md }}>
            <BodyText style={{ fontSize: 22, lineHeight: 30, fontStyle: "italic" }}>
              “No fillers. 60 seconds.”
            </BodyText>
            <View style={{ height: 1, backgroundColor: palette.lineSoft }} />
            <View style={{ gap: spacing.xs }}>
              <MonoText style={[styles.metricLabel, { letterSpacing: 2 }]}>PROMPT</MonoText>
              <BodyText style={{ fontSize: 18, lineHeight: 28, color: palette.inkMuted }}>
                {doContent.promptBody ?? doContent.promptTitle}
              </BodyText>
            </View>
          </View>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { alignItems: "center", paddingVertical: spacing.xl, gap: spacing.lg }]}>
          <DisplayText style={{ fontSize: 72, lineHeight: 76, color: palette.line }}>{(recordSecondsLeft).toFixed(1)}</DisplayText>
          <Pressable onPress={onToggleRecording} style={{ width: 96, height: 96, borderRadius: 0, backgroundColor: palette.line, alignItems: "center", justifyContent: "center", shadowColor: "#2E2E2E", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
            <Icon name="mic" size={40} color={palette.paper} />
          </Pressable>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>TAP TO BEGIN RECORDING</MonoText>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { flexDirection: "row", gap: spacing.md, alignItems: "center" }]}>
          <Icon name="spark" size={18} color={palette.line} />
          <BodyText style={{ flex: 1, color: palette.inkMuted, fontStyle: "italic", lineHeight: 24 }}>
            The dot logs each filler. Review after — watching it live splits attention and the move suffers.
          </BodyText>
        </View>

        <SessionButton label={recordElapsed >= recordLimit ? "PROCEED TO SEE" : "CONTINUE TO SEE"} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 8) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 1 }}>03 / 05 · DO</MonoText>
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>CONSTRAINT</MonoText>
          </View>
          <DisplayText style={{ fontSize: 30, lineHeight: 34, color: palette.line }}>
            Pace lock at <BodyText style={{ backgroundColor: "rgba(239,223,216,0.65)" }}>140 WPM</BodyText>.{"\n"}60 seconds.
          </DisplayText>
        </View>

        <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md, gap: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>PROMPT</MonoText>
          <DisplayText style={{ fontSize: 32, lineHeight: 38 }}>
            {doContent.promptBody ?? doContent.promptTitle}
          </DisplayText>
        </View>

        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>LIVE PACE</MonoText>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>-- WPM</MonoText>
          </View>
          <View style={{ height: 44, borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "rgba(239,223,216,0.25)" }}>
            <View style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, backgroundColor: palette.lineSoft }} />
            <View style={{ position: "absolute", left: "33%", top: 0, bottom: 0, width: 2, backgroundColor: palette.lineSoft, opacity: 0.6 }} />
            <View style={{ position: "absolute", right: "33%", top: 0, bottom: 0, width: 2, backgroundColor: palette.lineSoft, opacity: 0.6 }} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={{ color: palette.inkMuted }}>0</MonoText>
            <MonoText style={{ color: palette.inkMuted }}>TARGET 140</MonoText>
            <MonoText style={{ color: palette.inkMuted }}>MAX</MonoText>
          </View>
        </View>

        <View style={{ alignItems: "center", gap: spacing.md }}>
          <DisplayText style={{ fontSize: 72, lineHeight: 76, color: palette.black }}>{formatTime(recordSecondsLeft)}</DisplayText>
          <SessionButton label="RECORD" onPress={onToggleRecording} iconLeft={<Icon name="mic" size={18} color={palette.paper} />} />
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { borderStyle: "dashed" }]}>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>
            Glance the indicator, do not stare. Continuous monitoring activates dual-task load and the pace itself drifts.
          </BodyText>
        </View>

        <SessionButton label={recordElapsed >= recordLimit ? "PROCEED TO SEE" : "CONTINUE TO SEE"} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 9) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 1 }}>03 / 05</MonoText>
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg }]}>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>CONSTRAINT</MonoText>
          <DisplayText style={{ fontSize: 30, lineHeight: 34 }}>Three pauses required. 90{"\n"}seconds.</DisplayText>
        </View>

        <BodyText style={{ fontSize: 26, lineHeight: 34, fontStyle: "italic", textAlign: "center" }}>
          “{doContent.promptBody ?? doContent.promptTitle}”
        </BodyText>

        <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.md }}>
          <View style={{ width: 220, height: 220, borderRadius: 0, borderWidth: 6, borderColor: palette.line, borderLeftColor: "rgba(239,223,216,0.55)", borderBottomColor: "rgba(239,223,216,0.55)", alignItems: "center", justifyContent: "center" }}>
            <DisplayText style={{ fontSize: 42, lineHeight: 46, color: palette.line }}>{formatTime(recordSecondsLeft)}</DisplayText>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>REMAINING</MonoText>
          </View>
          <Pressable onPress={onToggleRecording} style={{ width: 96, height: 96, borderRadius: 0, backgroundColor: palette.line, alignItems: "center", justifyContent: "center", shadowColor: "#2E2E2E", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
            <Icon name="mic" size={40} color={palette.paper} />
          </Pressable>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)" }]}>
          <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 24 }}>
            A ring counts each pause over half a second. Place them after completed thoughts, not in the middle of phrases.
          </BodyText>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          {["PAUSE 1", "PAUSE 2", "PAUSE 3"].map((label) => (
            <View key={label} style={[styles.brutalistPanel, styles.brutalistShadowInk, { flex: 1, alignItems: "center", paddingVertical: spacing.md }]}>
              <View style={{ width: 14, height: 14, borderRadius: 0, borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "transparent" }} />
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 1, marginTop: spacing.sm }}>{label}</MonoText>
            </View>
          ))}
        </View>

        <SessionButton label={recordElapsed >= recordLimit ? "PROCEED TO SEE" : "CONTINUE TO SEE"} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 10) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 2 }}>SESSION 10</MonoText>
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>03 / 05 - DO</MonoText>
        <DisplayText style={{ fontSize: 46, lineHeight: 50 }}>Downward Inflection</DisplayText>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg }]}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>CONSTRAINT</MonoText>
          <DisplayText style={{ fontSize: 30, lineHeight: 34, color: palette.line }}>
            End every sentence{"\n"}with downward{"\n"}inflection.
          </DisplayText>
          <MonoText style={{ color: palette.inkMuted, marginTop: spacing.sm }}>◷ 60 seconds</MonoText>
        </View>

        <View style={{ borderLeftWidth: 3, borderLeftColor: palette.lineSoft, paddingLeft: spacing.md, gap: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>PROMPT</MonoText>
          <BodyText style={{ fontSize: 22, lineHeight: 30, color: palette.inkMuted }}>
            {doContent.promptBody ?? doContent.promptTitle}
          </BodyText>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)", minHeight: 180 }]}>
          <View style={{ position: "absolute", left: spacing.md, right: spacing.md, top: 18, bottom: 18 }}>
            <View style={{ position: "absolute", left: "72%", top: "18%", width: 18, height: 48, backgroundColor: "#8A9A7D" }} />
            <View style={{ position: "absolute", left: "58%", top: "52%", width: 14, height: 44, borderWidth: 2, borderColor: palette.line, backgroundColor: palette.paper }} />
          </View>
        </View>

        <BodyText style={{ color: palette.inkMuted, letterSpacing: 1 }}>
          Green marks each landed terminal, parchment each lifted one.
        </BodyText>

        <SessionButton label="RECORD" onPress={onToggleRecording} iconLeft={<Icon name="mic" size={18} color={palette.paper} />} />
      </View>
    );
  }

  if (sessionNumber === 3) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={[styles.doConstraintCard, styles.brutalistShadowInk]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={styles.doConstraintBadge}>
              <MonoText style={styles.doConstraintBadgeText}>OPEN PROMPT</MonoText>
            </View>
            <MonoText style={styles.metricLabel}>NO RULE</MonoText>
          </View>
          <BodyText style={styles.doPromptQuote}>{doContent.promptBody || doContent.promptTitle}</BodyText>
          {doContent.tips ? (
            <View style={{ borderTopWidth: 1, borderTopColor: palette.lineSoft, paddingTop: spacing.sm }}>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>META PERSPECTIVE</MonoText>
              <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>{doContent.tips}</BodyText>
            </View>
          ) : null}
        </View>

        <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm }}>
          <DisplayText style={styles.doTimerDisplay}>{formatTime(recordSecondsLeft)}</DisplayText>
          <MonoText style={styles.metricLabel}>REMAINING</MonoText>
          <Pressable
            onPress={onToggleRecording}
            style={[
              styles.doRecordButton,
              styles.brutalistShadowInk,
              { width: 116, height: 116, borderRadius: 0, backgroundColor: recording ? palette.line : "#FDF6E3" },
            ]}
          >
            <Icon name="mic" size={44} color={recording ? palette.paper : palette.line} />
          </Pressable>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk]}>
          <MonoText style={styles.metricLabel}>LIVE CAPTURE</MonoText>
          <EditorialWaveform bars={waveform.slice(0, 24)} height={48} />
        </View>

        <SessionButton label={recordElapsed >= recordLimit ? "OPEN SEE" : "CONTINUE TO SEE"} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 4) {
    const readyForSee = recordElapsed >= recordLimit || UNLOCK_ALL_FOR_TESTING;
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <DottedStageBackground>
          <View style={{ gap: spacing.md }}>
            <View style={[styles.doConstraintCard, styles.brutalistShadowInk]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <MonoText style={styles.metricLabel}>CONSTRAINT CARD</MonoText>
                <Icon name="spark" size={18} color={palette.line} />
              </View>
              <BodyText style={styles.doPromptQuote}>{doContent.constraint ?? doContent.promptBody ?? doContent.promptTitle}</BodyText>
              {doContent.nouns?.length ? (
                <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.sm, paddingTop: spacing.sm }}>
                  {doContent.nouns.slice(0, 3).map((noun) => (
                    <View key={noun} style={[styles.doConstraintBadge, { backgroundColor: palette.line }]}>
                      <MonoText style={styles.doConstraintBadgeText}>{noun.toUpperCase()}</MonoText>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>

            <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 24 }}>
              {doContent.tips ?? "Improvisation surfaces your default delivery. That default is what we are measuring today."}
            </BodyText>

            <View style={{ alignItems: "center", gap: spacing.sm, paddingTop: spacing.sm }}>
              <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { paddingVertical: 8, paddingHorizontal: spacing.lg }]}>
                <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.paper }}>{formatTime(recordSecondsLeft)}</DisplayText>
              </View>
              <Pressable
                onPress={onToggleRecording}
                style={[
                  styles.doRecordButton,
                  styles.brutalistShadowInk,
                  { width: 140, height: 140, borderRadius: 0, backgroundColor: recording ? palette.line : "#FDF6E3" },
                ]}
              >
                <Icon name="mic" size={50} color={recording ? palette.paper : palette.line} />
              </Pressable>
              <MonoText style={styles.metricLabel}>{recording ? "RECORDING" : "TAP TO BEGIN RECORDING"}</MonoText>
            </View>

            <View style={[styles.brutalistPanel, styles.brutalistShadowInk]}>
              <MonoText style={styles.metricLabel}>LIVE CAPTURE</MonoText>
              <EditorialWaveform bars={waveform.slice(0, 24)} height={48} light />
            </View>
          </View>
        </DottedStageBackground>

        {readyForSee ? (
          <SessionButton label="NEXT STEP: REVIEW" onPress={onNext} />
        ) : null}
      </View>
    );
  }

  if (sessionNumber === 5) {
    const readyForSee = recordElapsed >= recordLimit || UNLOCK_ALL_FOR_TESTING;
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ alignItems: "center", gap: spacing.sm }}>
          <MonoText style={{ color: palette.line, letterSpacing: 2, fontSize: 10 }}>STEP 03: DO</MonoText>
          <DisplayText style={{ fontSize: 38, lineHeight: 42, textAlign: "center" }}>
            {(doContent.constraint ?? "THE WIN YOU\nALREADY CHOSE.").toUpperCase()}
          </DisplayText>
          {(doContent.promptBody ?? doContent.promptTitle) ? (
            <BodyText style={{ textAlign: "center", color: palette.inkMuted }}>
              “{doContent.promptBody ?? doContent.promptTitle}”
            </BodyText>
          ) : null}
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { paddingVertical: spacing.xl, alignItems: "center" }]}>
          <MonoText style={[styles.metricLabel, { color: palette.peach }]}>REMAINING_BUFFER</MonoText>
          <DisplayText style={{ fontSize: 58, lineHeight: 62, color: palette.paper }}>{formatTime(recordSecondsLeft)}</DisplayText>
          <MonoText style={[styles.metricLabel, { color: palette.peach }]}>VOICE_CAPTURE_ACTIVE</MonoText>
        </View>

        <View style={{ alignItems: "center", gap: spacing.md }}>
          <Pressable onPress={onToggleRecording} style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 96, height: 96, borderRadius: 0, backgroundColor: palette.line }]}>
            <Icon name="mic" size={40} color={palette.paper} />
          </Pressable>
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { width: "100%" }]}>
            <EditorialWaveform bars={waveform.slice(0, 20)} height={46} light />
          </View>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk]}>
          <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24 }}>
            Focus on the specific feeling of the moment. Precision in your narrative leads to clarity in your strategy.
          </BodyText>
        </View>

        {readyForSee ? (
          <SessionButton label="OPEN STEP 04: SEE" onPress={onNext} />
        ) : null}
      </View>
    );
  }

  if (sessionNumber === 36) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 2, textAlign: "center" }}>THE CAPSTONE</MonoText>
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.sm }]}>
          <MonoText style={styles.metricLabel}>THE CHALLENGE</MonoText>
          <BodyText style={{ fontStyle: "italic", lineHeight: 28, fontSize: 20, textAlign: "center" }}>
            {doContent.promptBody ?? doContent.promptTitle}
          </BodyText>
          <MonoText style={[styles.metricLabel, { textAlign: "center", color: palette.inkMuted }]}>(ORIGINAL SESSION 1 PROMPT)</MonoText>
        </View>
        <View style={{ alignItems: "center", gap: spacing.md }}>
          <Pressable
            onPress={onToggleRecording}
            style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 96, height: 96, borderRadius: 0, backgroundColor: palette.paper }]}
          >
            <Icon name="mic" size={44} color={palette.line} />
          </Pressable>
          <MonoText style={styles.metricLabel}>{doRecordHintLabel(sessionNumber, recording, recordElapsed)}</MonoText>
        </View>
        {recordElapsed >= recordLimit ? (
          <SessionButton label={doCtaLabel(sessionNumber, recordElapsed, recordLimit)} onPress={onNext} />
        ) : null}
      </View>
    );
  }

  if (sessionNumber === 1) {
    const timeLeft = Math.max(0, recordLimit - recordElapsed);
    const isComplete = recordElapsed >= recordLimit;
    const waveformBars = useMemo(() => Array.from({ length: 20 }).map((_, i) => 12 + ((i * 7 + recordElapsed * 3) % 36)), [recordElapsed]);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const waveAnims = useRef(waveformBars.map((h) => new Animated.Value(h))).current;

    useEffect(() => {
      if (recording) {
        const pulse = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          ]),
        );
        pulse.start();
        return () => pulse.stop();
      } else {
        pulseAnim.setValue(1);
      }
    }, [recording, pulseAnim]);

    useEffect(() => {
      if (!recording) return;
      const anims = waveAnims.map((anim, i) => {
        const base = waveformBars[i] ?? 20;
        return Animated.sequence([
          Animated.timing(anim, { toValue: Math.min(80, base + 12 + Math.random() * 28), duration: 200 + Math.random() * 150, useNativeDriver: false }),
          Animated.timing(anim, { toValue: Math.max(8, base - 4 - Math.random() * 14), duration: 200 + Math.random() * 150, useNativeDriver: false }),
          Animated.timing(anim, { toValue: base, duration: 150, useNativeDriver: false }),
        ]);
      });
      const parallel = Animated.parallel(anims);
      const interval = setInterval(() => {
        const nextAnims = waveAnims.map((anim, i) => {
          const base = waveformBars[i] ?? 20;
          return Animated.sequence([
            Animated.timing(anim, { toValue: Math.min(80, base + 12 + Math.random() * 28), duration: 200 + Math.random() * 150, useNativeDriver: false }),
            Animated.timing(anim, { toValue: Math.max(8, base - 4 - Math.random() * 14), duration: 200 + Math.random() * 150, useNativeDriver: false }),
            Animated.timing(anim, { toValue: base, duration: 150, useNativeDriver: false }),
          ]);
        });
        Animated.parallel(nextAnims).start();
      }, 500);
      return () => {
        clearInterval(interval);
        waveAnims.forEach((anim, i) => anim.setValue(waveformBars[i] ?? 20));
      };
    }, [recording, waveformBars, waveAnims]);

    const statusLabel = recording ? "RECORDING ACTIVE..." : isComplete ? "SESSION COMPLETE" : "TAP TO BEGIN RECORDING";
    const btnBorderColor = recording ? palette.error : isComplete ? palette.sageSuccess : palette.siennaAccent;
    const btnShadow = recording ? palette.error : palette.siennaAccent;

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{
          backgroundColor: palette.parchmentSurface,
          borderWidth: 2,
          borderColor: palette.inkFocus,
          padding: 20,
          gap: 12,
          shadowColor: palette.siennaAccent,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 0,
        }}>
          <MonoText style={{ color: palette.siennaAccent, fontSize: 12, letterSpacing: 1.2 }}>
            PROMPT
          </MonoText>
          <BodyText style={{ fontSize: 20, lineHeight: 28, color: palette.inkFocus }}>
            {doContent.promptBody ?? doContent.promptTitle}
          </BodyText>
        </View>

        <View style={{
          backgroundColor: palette.surfaceContainer,
          borderWidth: 2,
          borderColor: palette.outline,
          padding: 20,
          gap: 12,
        }}>
          <MonoText style={{ color: palette.outline, fontSize: 12, letterSpacing: 1.2 }}>
            CONSTRAINT
          </MonoText>
          <BodyText style={{ color: palette.onSurfaceVariant }}>
            {doContent.constraint}
          </BodyText>
        </View>

        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <View style={{
            backgroundColor: palette.inkFocus,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderWidth: 2,
            borderColor: palette.siennaAccent,
            marginBottom: 48,
            shadowColor: palette.siennaAccent,
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 0,
          }}>
            <MonoText style={{ fontSize: 24, letterSpacing: 1.2, color: palette.parchmentSurface }}>
              {formatTime(timeLeft)}
            </MonoText>
          </View>

          <Pressable onPress={onToggleRecording}>
            <Animated.View style={{
              width: 128,
              height: 128,
              borderRadius: 64,
              borderWidth: 4,
              borderColor: btnBorderColor,
              backgroundColor: palette.parchmentSurface,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: recording ? `${palette.error}80` : btnShadow,
              shadowOffset: recording ? { width: 0, height: 0 } : { width: 4, height: 4 },
              shadowOpacity: recording ? 0.6 : 1,
              shadowRadius: recording ? 20 : 0,
              elevation: recording ? 8 : 0,
              transform: recording ? [{ scale: pulseAnim }] : undefined,
            }}>
              <View style={{
                position: "absolute",
                width: 128,
                height: 128,
                borderRadius: 64,
                borderWidth: 2,
                borderColor: `${palette.siennaAccent}4D`,
                borderStyle: "dashed",
              }} />

              {recording ? (
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: 4,
                  backgroundColor: palette.error,
                }} />
              ) : isComplete ? (
                <View style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
                  <Icon name="check" size={48} color={palette.sageSuccess} />
                </View>
              ) : (
                <Icon name="mic" size={48} color={palette.primary} />
              )}
            </Animated.View>
          </Pressable>

          <MonoText style={{
            color: palette.siennaAccent,
            fontSize: 12,
            letterSpacing: 1.2,
            marginTop: 24,
            fontWeight: "700",
          }}>
            {statusLabel}
          </MonoText>
        </View>

        <View style={{ opacity: recording ? 0.6 : 0.3 }}>
          <View style={{ height: 64, flexDirection: "row", alignItems: "flex-end", gap: 4, overflow: "hidden" }}>
            {waveAnims.map((anim, i) => (
              <Animated.View key={i} style={{
                flex: 1,
                height: anim,
                backgroundColor: recording ? palette.siennaAccent : palette.outline,
                maxWidth: 6,
                opacity: recording ? 0.85 : 0.5,
              }} />
            ))}
          </View>
        </View>

        <SessionButton label={doCtaLabel(sessionNumber, recordElapsed, recordLimit)} onPress={onNext} />
      </View>
    );
  }

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      {doContent.preRecordMeta ? (
        <BodyText style={[styles.stagePullQuote, { textAlign: "center" }]}>{doContent.preRecordMeta}</BodyText>
      ) : null}

      {doContent.constraint ? (
        <View style={[styles.doConstraintCard, styles.brutalistShadowInk]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={styles.doConstraintBadge}>
              <MonoText style={styles.doConstraintBadgeText}>
                {doContent.challengeType?.toUpperCase() ?? "OPEN PROMPT"}
              </MonoText>
            </View>
            <MonoText style={styles.metricLabel}>{doContent.timeLimit ? `${doContent.timeLimit}S` : "NO RULE"}</MonoText>
          </View>
          <BodyText style={styles.doPromptQuote}>{doContent.constraint}</BodyText>
        </View>
      ) : null}

      {doContent.nouns?.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
          {doContent.nouns.map((noun) => (
            <View key={noun} style={styles.outlineBadge}>
              <MonoText style={styles.outlineBadgeText}>{noun.toUpperCase()}</MonoText>
            </View>
          ))}
        </View>
      ) : null}

      {(doContent.promptBody || doContent.promptTitle) && sessionNumber !== 4 ? (
        <View style={{ gap: spacing.sm }}>
          <MonoText style={styles.metricLabel}>CURRENT PROMPT</MonoText>
          <BodyText style={styles.doPromptQuote}>{doContent.promptBody ?? doContent.promptTitle}</BodyText>
        </View>
      ) : null}

      {sessionNumber === 4 && doContent.promptBody ? (
        <BodyText style={[styles.doPromptQuote, { textAlign: "center" }]}>{doContent.promptBody}</BodyText>
      ) : null}

      <View style={{ alignItems: "center", gap: spacing.md, marginTop: spacing.xs }}>
        <DisplayText style={styles.doTimerDisplay}>{formatTime(recordSecondsLeft)}</DisplayText>
        <MonoText style={styles.metricLabel}>REMAINING</MonoText>
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
          <Icon name="mic" size={recordStyle === "circle-large" ? 56 : 44} color={recording ? palette.paper : palette.line} />
        </Pressable>
        <MonoText style={styles.metricLabel}>
          {doRecordHintLabel(sessionNumber, recording, recordElapsed)}
        </MonoText>
        <View style={[styles.guidedProgressTrack, { width: "100%" }]}>
          <View style={[styles.guidedProgressFill, { width: `${recordProgress}%` }]} />
        </View>
      </View>

      {(sessionNumber === 2 || sessionNumber === 3) && (
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { marginTop: spacing.sm }]}>
          <MonoText style={styles.metricLabel}>LIVE CAPTURE</MonoText>
          <EditorialWaveform bars={waveform.slice(0, 24)} height={48} />
        </View>
      )}

      <SessionButton label={doCtaLabel(sessionNumber, recordElapsed, recordLimit)} onPress={onNext} />
    </View>
  );
}

function UnifiedSee(props: UnifiedProps) {
  const { session, sessionNumber, overlayOn, onReplay, onNext, analysis } = props;
  const liveSee = useMemo(
    () => resolveLiveSeeData({ sessionNumber: session.sessionNumber, record: session.stages.record, analysis }),
    [analysis, session.sessionNumber, session.stages.record],
  );
  const commentary = liveSee.commentary;
  const waveform = useWaveform(session.sessionNumber);
  const cta = seeCtaLabels(sessionNumber);
  const metrics = liveSee.metrics;
  const headline = session.stages.record.headerMeta ?? commentary.headline ?? session.stages.record.title;

  const metricReveal = session.stages.record.reveal?.sequential
    ? { durationMs: 400, staggerMs: 120, fadeMs: 220 }
    : null;

  const MetricCard = ({
    kicker,
    children,
    style,
    ink = false,
  }: {
    kicker: string;
    children: React.ReactNode;
    style?: any;
    ink?: boolean;
  }) => (
    <View style={[ink ? styles.brutalistPanelInk : styles.brutalistPanel, styles.brutalistShadowInk, style]}>
      <MonoText style={styles.listenCardKicker}>{kicker}</MonoText>
      {children}
    </View>
  );

  if (sessionNumber === 6) {
    const insight = commentary.lines?.[0] ?? session.stages.record.commentary ?? session.stages.record.environmentCopy;
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>04 / 05</MonoText>
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 1, alignSelf: "flex-end" }}>SEE</MonoText>
        <DisplayText style={{ fontSize: 44, lineHeight: 48 }}>
          Five data points.{"\n"}Enough to see{"\n"}direction, not enough{"\n"}to predict trajectory.
        </DisplayText>

        <MetricCard kicker="FILLER TRAJECTORY" style={{ padding: 0, overflow: "hidden" }}>
          <View style={{ padding: spacing.md }}>
            <EditorialWaveform bars={waveform.concat(waveform).slice(0, 22)} height={88} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm }}>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>S1</MonoText>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>S6</MonoText>
            </View>
          </View>
        </MetricCard>

        <MetricCard kicker="PACE STABILITY" style={{ padding: 0, overflow: "hidden" }}>
          <View style={{ padding: spacing.md }}>
            <EditorialWaveform bars={waveform.concat(waveform).slice(0, 22).map((v) => Math.max(10, v - 10))} height={88} light />
            <MonoText style={[styles.metricLabel, { color: palette.inkMuted, marginTop: spacing.sm }]}>130-150 ZONE</MonoText>
          </View>
        </MetricCard>

        <MetricCard kicker="INFLECTION TREND" style={{ padding: 0, overflow: "hidden" }}>
          <View style={{ padding: spacing.md }}>
            <EditorialWaveform bars={waveform.concat(waveform).slice(0, 22).map((v) => Math.max(10, v - 18))} height={88} />
            <MonoText style={[styles.metricLabel, { color: palette.inkMuted, alignSelf: "flex-end", marginTop: spacing.sm }]}>S6</MonoText>
          </View>
        </MetricCard>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.line, padding: spacing.md }]}>
          <BodyText style={{ lineHeight: 24 }}>{insight}</BodyText>
        </View>

        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 7) {
    const filler = metrics.find((m) => /filler/i.test(m.label)) ?? metrics[0];
    const pace = metrics.find((m) => /pace|wpm/i.test(m.label)) ?? metrics[1];
    const target = metrics.find((m) => /target|zone/i.test(m.label)) ?? metrics[2];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 1 }}>SESSION 07: STEP 04 SEE</MonoText>
        <DisplayText style={{ fontSize: 38, lineHeight: 44 }}>
          Filler count on first{"\n"}attempt sets your{"\n"}baseline for the move.
        </DisplayText>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <MetricCard kicker="FILLER COUNT" style={{ flex: 1 }}>
            <DisplayText style={{ fontSize: 46, lineHeight: 50, color: palette.line }}>{filler?.value ?? "—"}</DisplayText>
          </MetricCard>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <MetricCard kicker="PACE (WPM)" style={{ flex: 1 }}>
            <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.black }}>{pace?.value ?? "—"}</DisplayText>
          </MetricCard>
          <MetricCard kicker="TARGET (%)" style={{ flex: 1 }}>
            <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.black }}>{target?.value ?? "—"}</DisplayText>
          </MetricCard>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={styles.listenCardKicker}>SESSION RECORDING ANALYSIS</MonoText>
            <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>03:42 / 05:00</MonoText>
          </View>
          <EditorialWaveform bars={waveform.concat(waveform).slice(0, 30)} height={80} />
        </View>

        <MetricCard kicker="ARGUMENT STRUCTURE" style={{ padding: spacing.md, alignItems: "center" }}>
          <View style={{ width: "100%", height: 160, backgroundColor: "rgba(239,223,216,0.35)", borderWidth: 1, borderColor: palette.lineSoft, alignItems: "center", justifyContent: "center" }}>
            <MonoText style={{ color: palette.inkMuted }}>PYRAMID</MonoText>
          </View>
        </MetricCard>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.line, gap: spacing.sm }]}>
          <MonoText style={styles.listenCardKicker}>COACH'S NOTE</MonoText>
          <BodyText style={{ lineHeight: 24, color: palette.inkMuted, fontStyle: "italic" }}>
            First exposure to the constraint typically lands here. The reduction shows across the next four sessions as the half-second-before cue becomes recognisable — not through harder trying.
          </BodyText>
        </View>

        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 8) {
    const mean = metrics.find((m) => /mean|avg|pace/i.test(m.label)) ?? metrics[0];
    const zone = metrics.find((m) => /zone|time/i.test(m.label)) ?? metrics[1];
    const insight = commentary.lines?.[0] ?? session.stages.record.subline ?? session.stages.record.commentary;
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 1 }}>04 / 05 - SEE</MonoText>
        <DisplayText style={{ fontSize: 44, lineHeight: 48 }}>Finding the rhythm.</DisplayText>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <MetricCard kicker="MEAN WPM" style={{ flex: 1 }}>
            <DisplayText style={{ fontSize: 46, lineHeight: 50, color: palette.black }}>{mean?.value ?? "—"}</DisplayText>
          </MetricCard>
          <MetricCard kicker="TIME IN ZONE" style={{ flex: 1 }}>
            <DisplayText style={{ fontSize: 46, lineHeight: 50, color: "#7D8D79" }}>{zone?.value ?? "—"}</DisplayText>
          </MetricCard>
        </View>

        <MetricCard kicker="PACE VARIANCE" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.black }}>Low</DisplayText>
          <View style={{ width: 44, height: 44, borderWidth: 1, borderColor: palette.lineSoft, backgroundColor: "rgba(125,141,121,0.2)", alignItems: "center", justifyContent: "center" }}>
            <MonoText style={{ color: "#7D8D79" }}>→</MonoText>
          </View>
        </MetricCard>

        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>PACE CONSISTENCY (60S)</MonoText>
            <MonoText style={{ color: "#7D8D79", letterSpacing: 2 }}>OPTIMAL BAND</MonoText>
          </View>
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md }]}>
            <EditorialWaveform bars={waveform.concat(waveform).slice(0, 30)} height={120} light />
          </View>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.line, padding: spacing.md }]}>
          <BodyText style={{ lineHeight: 24 }}>{insight}</BodyText>
        </View>

        <SessionButton label={cta.primary} onPress={onNext} variant="secondary" />
        {cta.secondary ? <SessionButton label={cta.secondary} onPress={onReplay} variant="secondary" iconLeft={<Icon name="play" size={18} color={palette.black} />} /> : null}
      </View>
    );
  }

  if (sessionNumber === 9) {
    const pauseCount = metrics.find((m) => /pause/i.test(m.label)) ?? metrics[0];
    const avgPause = metrics.find((m) => /avg/i.test(m.label)) ?? metrics[1];
    const pace = metrics.find((m) => /pace|wpm/i.test(m.label)) ?? metrics[2];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 1 }}>STEP 04/05 · SESSION 09</MonoText>
        <DisplayText style={{ fontSize: 46, lineHeight: 50 }}>SILENCE WITH{"\n"}INTENT.</DisplayText>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <MetricCard kicker="PAUSE COUNT" style={{ flex: 1, minHeight: 120, justifyContent: "space-between" }}>
            <DisplayText style={{ fontSize: 38, lineHeight: 42, color: palette.line }}>{pauseCount?.value ?? "—"}</DisplayText>
          </MetricCard>
          <MetricCard kicker="AVG PAUSE" style={{ flex: 1, minHeight: 120, justifyContent: "space-between" }}>
            <DisplayText style={{ fontSize: 38, lineHeight: 42, color: palette.line }}>{avgPause?.value ?? "—"}</DisplayText>
          </MetricCard>
        </View>

        <MetricCard kicker="PACE (WPM)" style={{ minHeight: 70, justifyContent: "flex-end" }}>
          <DisplayText style={{ fontSize: 38, lineHeight: 42, color: palette.line, textAlign: "right" }}>{pace?.value ?? "—"}</DisplayText>
        </MetricCard>

        <MetricCard kicker="RECORDING TIMELINE (90S)" style={{ padding: spacing.md }}>
          <EditorialWaveform bars={waveform.concat(waveform).slice(0, 34)} height={120} />
        </MetricCard>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)", gap: spacing.sm, padding: spacing.md }]}>
          {commentary.lines.slice(0, 2).map((line) => (
            <BodyText key={line} style={{ fontSize: 22, lineHeight: 30 }}>
              {line}
            </BodyText>
          ))}
        </View>

        <SessionButton label={cta.primary} onPress={onNext} variant="secondary" />
      </View>
    );
  }

  if (sessionNumber === 10) {
    const inflection = metrics.find((m) => /inflection/i.test(m.label)) ?? metrics[0];
    const variance = metrics.find((m) => /variance/i.test(m.label)) ?? metrics[1];
    const pace = metrics.find((m) => /pace|wpm/i.test(m.label)) ?? metrics[2];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>04 / 05 - SEE</MonoText>
        <DisplayText style={{ fontSize: 46, lineHeight: 50 }}>Certainty in the drop.</DisplayText>

        {headline ? (
          <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
            <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 28, fontSize: 20 }}>{headline}</BodyText>
          </View>
        ) : null}

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.lg }]}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>INFLECTION RATE</MonoText>
          <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
            <DisplayText style={{ fontSize: 46, lineHeight: 50 }}>{inflection?.value ?? "—"}</DisplayText>
            <MonoText style={{ color: "#7D8D79", fontSize: 20 }}>↗</MonoText>
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: spacing.md }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={{ flex: 1, height: 8, backgroundColor: i < 4 ? palette.line : "rgba(46,46,46,0.15)", borderWidth: 1, borderColor: palette.lineSoft }} />
            ))}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <MetricCard kicker="PITCH VARIANCE" style={{ flex: 1, minHeight: 120, justifyContent: "flex-end" }}>
            <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>Low</DisplayText>
          </MetricCard>
          <MetricCard kicker="PACE (WPM)" style={{ flex: 1, minHeight: 120, justifyContent: "flex-end" }}>
            <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>{pace?.value ?? "—"}</DisplayText>
          </MetricCard>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)", padding: spacing.md, gap: spacing.sm }]}>
          {commentary.lines.slice(0, 2).map((line) => (
            <BodyText key={line} style={{ lineHeight: 26 }}>
              {line}
            </BodyText>
          ))}
        </View>

        <SessionButton label={cta.primary} onPress={onNext} variant="secondary" />
      </View>
    );
  }

  if (sessionNumber === 1) {
    // Match the Session 01 "INITIAL FEEDBACK" card stack rhythm from Stitch.
    const fillers = metrics.find((m) => /filler/i.test(m.label)) ?? metrics[0];
    const pace = metrics.find((m) => /pace|wpm/i.test(m.label)) ?? metrics[1];
    const uptalk = metrics.find((m) => /uptalk|inflection/i.test(m.label)) ?? metrics[2];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ gap: spacing.md }}>
          {fillers ? (
            <MetricCard kicker="FILLERS" style={{ padding: spacing.md }}>
              <BodyText style={{ color: palette.inkMuted, lineHeight: 22 }}>
                The “um”, “ah”, and “like” occurrences in your speech pattern.
              </BodyText>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                <DisplayText style={{ fontSize: 54, lineHeight: 58, color: palette.line }}>{fillers.value}</DisplayText>
                <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>NO DELTAS</MonoText>
              </View>
            </MetricCard>
          ) : null}

          {pace ? (
            <MetricCard kicker="PACE" style={{ padding: spacing.md }}>
              <BodyText style={{ color: palette.inkMuted, lineHeight: 22 }}>
                Your words per minute. Aim for rhythmic clarity over pure speed.
              </BodyText>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                <View style={{ flexDirection: "row", alignItems: "flex-end", gap: spacing.sm }}>
                  <DisplayText style={{ fontSize: 54, lineHeight: 58, color: palette.line }}>{pace.value}</DisplayText>
                  <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>WPM</MonoText>
                </View>
                <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>STARTING LINE</MonoText>
              </View>
            </MetricCard>
          ) : null}

          {uptalk ? (
            <MetricCard kicker="UPTALK" style={{ padding: spacing.md }}>
              <BodyText style={{ color: palette.inkMuted, lineHeight: 22 }}>
                Rising intonation at sentence ends.
              </BodyText>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                <DisplayText style={{ fontSize: 38, lineHeight: 42, color: palette.line }}>{uptalk.value}</DisplayText>
                <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>SENTENCES</MonoText>
              </View>
            </MetricCard>
          ) : null}
        </View>

        <MetricCard kicker="EXPERT COMMENTARY" style={{ padding: spacing.md }}>
          <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24 }}>
            {commentary.lines[0] ?? "None of this is a verdict. It is the starting line."}
          </BodyText>
        </MetricCard>

        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 2) {
    const pace = metrics.find((m) => /pace|wpm/i.test(m.label)) ?? metrics[0];
    const filler = metrics.find((m) => /filler/i.test(m.label)) ?? metrics[1];
    const total = metrics.find((m) => /time|duration/i.test(m.label)) ?? metrics[2];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        {headline ? <DisplayText style={styles.stageHeadline}>{headline}</DisplayText> : null}

        <MetricCard kicker="PACE (WPM)" style={{ padding: spacing.md }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <DisplayText style={{ fontSize: 56, lineHeight: 60, color: palette.line }}>
              {pace?.value ?? "—"}
            </DisplayText>
            <View style={[styles.outlineBadge, { borderColor: palette.lineSoft }]}>
              <MonoText style={[styles.outlineBadgeText, { color: palette.inkMuted }]}>IN-ZONE</MonoText>
            </View>
          </View>
          <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>WORDS PER MINUTE</MonoText>
          <View style={[styles.brutalistPanel, { borderWidth: 1, padding: spacing.sm }]}>
            <EditorialWaveform bars={waveform.concat(waveform).slice(0, 20)} height={46} />
          </View>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 22 }}>
            Notice what that pace feels like compared to your baseline.
          </BodyText>
        </MetricCard>

        <View style={{ gap: spacing.md }}>
          {filler ? (
            <MetricCard kicker="FILLER COUNT" style={{ padding: spacing.md }}>
              <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>{String(filler.value).padStart(2, "0")}</DisplayText>
              <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      borderWidth: 1,
                      borderColor: palette.lineSoft,
                      backgroundColor: i < 4 ? palette.line : "transparent",
                    }}
                  />
                ))}
              </View>
            </MetricCard>
          ) : null}

          {total ? (
            <MetricCard kicker="TOTAL TIME" style={{ padding: spacing.md }}>
              <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>{total.value}</DisplayText>
              <View style={{ height: 1, backgroundColor: palette.lineSoft, marginTop: spacing.xs }} />
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>TARGET: 02:00</MonoText>
            </MetricCard>
          ) : null}
        </View>

        <View style={[styles.listenInsightCard, styles.brutalistShadowInk, { padding: spacing.md, gap: spacing.md }]}>
          <MonoText style={styles.listenCardKicker}>ANALYTIC INSIGHT</MonoText>
          {commentary.lines.slice(0, 2).map((line) => (
            <BodyText key={line} style={{ lineHeight: 24 }}>
              {line}
            </BodyText>
          ))}
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ width: 2, backgroundColor: palette.lineSoft }} />
            <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 22, flex: 1 }}>
              The most effective communicators aren’t the fastest; they use silence to emphasize the weight of their words.
            </BodyText>
          </View>
          <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>CLARITY COACH AI</MonoText>
        </View>

        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 3) {
    const pauseFreq = metrics.find((m) => /pause/i.test(m.label)) ?? metrics[0];
    const pace = metrics.find((m) => /pace|wpm/i.test(m.label)) ?? metrics[1];
    const filler = metrics.find((m) => /filler/i.test(m.label)) ?? metrics[2];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        {headline ? <DisplayText style={styles.stageHeadline}>{headline}</DisplayText> : null}

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <MetricCard kicker="PAUSE FREQ" style={{ flex: 1, padding: spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
              <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>{pauseFreq?.value ?? "—"}</DisplayText>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>/ MIN</MonoText>
            </View>
          </MetricCard>
          <MetricCard kicker="PACE (WPM)" style={{ flex: 1, padding: spacing.md }}>
            <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.black }}>{pace?.value ?? "—"}</DisplayText>
          </MetricCard>
        </View>

        {filler ? (
          <MetricCard kicker="FILLER COUNT" style={{ padding: spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: spacing.sm }}>
              <DisplayText style={{ fontSize: 34, lineHeight: 38, color: "#BA1A1A" }}>{filler.value}</DisplayText>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>TOTAL</MonoText>
            </View>
          </MetricCard>
        ) : null}

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingVertical: 10 }}>
            <MonoText style={styles.listenCardKicker}>SESSION RECORDING ANALYSIS</MonoText>
            <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>00:45 / 01:20</MonoText>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: palette.lineSoft, flexDirection: "row" }}>
            <View style={{ flex: 1, padding: spacing.md, gap: spacing.sm }}>
              <EditorialWaveform bars={waveform.slice(0, 10)} height={72} />
              <View style={{ flexDirection: "row", gap: 8 }}>
                {["UM", "AH"].map((t) => (
                  <View key={t} style={[styles.outlineBadge, { borderColor: palette.lineSoft }]}>
                    <MonoText style={[styles.outlineBadgeText, { color: "#BA1A1A" }]}>{t}</MonoText>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ width: 1, backgroundColor: palette.lineSoft }} />
            <View style={{ flex: 1, padding: spacing.md, gap: spacing.sm }}>
              <EditorialWaveform bars={waveform.slice(10, 20)} height={72} />
              <View style={[styles.outlineBadge, { alignSelf: "flex-start", borderColor: palette.lineSoft }]}>
                <MonoText style={[styles.outlineBadgeText, { color: "#BA1A1A" }]}>SO</MonoText>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.line, gap: spacing.md }]}>
          <BodyText style={{ lineHeight: 24 }}>
            {commentary.lines[0] ?? "One pause in sixty seconds. Listeners had little processing time between sentences."}
          </BodyText>
          <View style={[styles.brutalistPanel, { backgroundColor: "rgba(239,223,216,0.45)" }]}>
            <BodyText style={{ color: palette.inkMuted, fontFamily: "Courier", lineHeight: 22 }}>
              Many of those fillers landed where a pause would have. Sprint 2 works on the swap.
            </BodyText>
          </View>
        </View>

        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 4) {
    const energy = metrics.find((m) => /energy/i.test(m.label)) ?? metrics[0];
    const pace = metrics.find((m) => /pace|wpm/i.test(m.label)) ?? metrics[1];
    const filler = metrics.find((m) => /filler/i.test(m.label)) ?? metrics[2];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        {headline ? <DisplayText style={styles.stageHeadline}>{headline}</DisplayText> : null}

        <View style={{ gap: spacing.md }}>
          <MetricCard kicker="ENERGY SCORE" style={{ minHeight: 140 }}>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
                <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>{energy?.value ?? "—"}</DisplayText>
                <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>/100</MonoText>
              </View>
            </View>
          </MetricCard>
          <MetricCard kicker="PACE (WPM)" style={{ minHeight: 120 }}>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
                <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.black }}>{pace?.value ?? "—"}</DisplayText>
                <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>AVG</MonoText>
              </View>
            </View>
          </MetricCard>
          <MetricCard kicker="FILLER COUNT" style={{ minHeight: 120 }}>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
                <DisplayText style={{ fontSize: 34, lineHeight: 38, color: "#BA1A1A" }}>{filler?.value ?? "—"}</DisplayText>
                <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>TOTAL</MonoText>
              </View>
            </View>
          </MetricCard>
        </View>

        <MetricCard kicker="ENERGY TIMELINE" style={{ padding: spacing.md }}>
          <MonoText style={[styles.metricLabel, { color: palette.inkMuted, alignSelf: "flex-end" }]}>00:00 - 02:45</MonoText>
          <EditorialWaveform bars={waveform.concat(waveform).slice(0, 26)} height={84} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {["INTRO", "ARGUMENT", "CLOSE"].map((t) => (
              <MonoText key={t} style={[styles.metricLabel, { color: palette.inkMuted }]}>{t}</MonoText>
            ))}
          </View>
        </MetricCard>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.line }]}>
          <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24 }}>
            {commentary.lines[0] ?? "Energy held near-flat across the recording. Sprint 5 is where we shape this on purpose."}
          </BodyText>
        </View>

        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 5) {
    const inflection = metrics.find((m) => /inflection/i.test(m.label)) ?? metrics[0];
    const pace = metrics.find((m) => /pace|wpm/i.test(m.label)) ?? metrics[1];
    const filler = metrics.find((m) => /filler/i.test(m.label)) ?? metrics[2];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        {headline ? <DisplayText style={styles.stageHeadline}>“{headline}”</DisplayText> : null}
        {session.stages.record.subline ? (
          <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 24 }}>
            {session.stages.record.subline}
          </BodyText>
        ) : null}

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <MetricCard kicker="INFLECTION RATE" style={{ flex: 1 }}>
            <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>{inflection?.value ?? "—"}</DisplayText>
            <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>LANDED</MonoText>
          </MetricCard>
          <MetricCard kicker="PACE" style={{ flex: 1 }}>
            <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>{pace?.value ?? "—"}</DisplayText>
            <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>WPM</MonoText>
          </MetricCard>
        </View>

        <MetricCard kicker="FILLER COUNT">
          <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>{filler?.value ?? "—"}</DisplayText>
          <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>INCIDENCES</MonoText>
        </MetricCard>

        <MetricCard kicker="TERMINAL PITCH TRAJECTORY" style={{ padding: spacing.md }}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 10, height: 10, backgroundColor: palette.line }} />
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>STATEMENT</MonoText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: palette.lineSoft, backgroundColor: "transparent" }} />
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>UPSPEAK</MonoText>
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.md }}>
            <EditorialWaveform bars={waveform.concat(waveform).slice(0, 28)} height={110} />
          </View>
          <View style={[styles.brutalistPanel, { backgroundColor: "rgba(239,223,216,0.35)" }]}>
            <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24 }}>
              {commentary.lines[0] ??
                "Effective authority is signaled by a downward tonal shift at the end of declarative sentences."}
            </BodyText>
          </View>
        </MetricCard>

        <SessionButton label={cta.primary} onPress={onNext} />
        {cta.secondary ? (
          <SessionButton label={cta.secondary} onPress={onReplay} variant="secondary" />
        ) : null}
      </View>
    );
  }

  if (sessionNumber === 36) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 2 }}>CAPSTONE EVALUATION</MonoText>
        <BodyText style={{ fontStyle: "italic", lineHeight: 28, fontSize: 20 }}>
          {headline ?? session.stages.record.subline ?? "Session 1 above, Session 36 below. Six metrics. Six deltas."}
        </BodyText>
        <View style={styles.guidedMetricsRow}>
          {metrics.map((metric, index) => (
            <MetricTile
              key={metric.label}
              label={metric.label}
              value={`${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`.trim()}
              reveal={
                metricReveal
                  ? {
                      delayMs: index * metricReveal.staggerMs,
                      fadeMs: metricReveal.fadeMs,
                      countUpMs: metricReveal.durationMs,
                    }
                  : undefined
              }
            />
          ))}
        </View>
        <View style={[styles.listenInsightCard, styles.brutalistShadowInk]}>
          <MonoText style={styles.listenCardKicker}>COACH COMMENTARY</MonoText>
          {commentary.lines.map((line) => (
            <BodyText key={line} style={{ lineHeight: 24 }}>
              {line}
            </BodyText>
          ))}
        </View>
        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 1) {
    const filler = metrics.find((m) => /filler/i.test(m.label)) ?? metrics[0];
    const pace = metrics.find((m) => /pace|wpm/i.test(m.label)) ?? metrics[1];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        {headline ? <DisplayText style={styles.stageHeadline}>{headline}</DisplayText> : null}

        <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 24, fontSize: 16 }}>
          These numbers describe this ninety seconds, not a trend.
        </BodyText>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          {filler ? (
            <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { flex: 1, gap: spacing.xs }]}>
              <MonoText style={styles.metricLabel}>FILLER COUNT</MonoText>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: spacing.xs }}>
                <DisplayText style={{ fontSize: 36, lineHeight: 40, color: palette.line }}>
                  {String(filler.value).padStart(2, "0")}
                </DisplayText>
                <MonoText style={[styles.metricLabel, { color: palette.inkMuted, fontSize: 10 }]}>TOTAL</MonoText>
              </View>
            </View>
          ) : null}
          {pace ? (
            <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { flex: 1, gap: spacing.xs }]}>
              <MonoText style={styles.metricLabel}>PACE (WPM)</MonoText>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: spacing.xs }}>
                <DisplayText style={{ fontSize: 36, lineHeight: 40, color: palette.line }}>
                  {pace.value}
                </DisplayText>
                <MonoText style={[styles.metricLabel, { color: palette.inkMuted, fontSize: 10 }]}>STABLE</MonoText>
              </View>
            </View>
          ) : null}
        </View>

        <View style={{ gap: spacing.sm }}>
          {commentary.lines[0] ? (
            <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.line, flexDirection: "row", gap: spacing.md }]}>
              <Icon name="psychology" size={20} color={palette.line} />
              <BodyText style={{ color: palette.inkMuted, lineHeight: 24, flex: 1 }}>{commentary.lines[0]}</BodyText>
            </View>
          ) : null}
          {commentary.lines[1] ? (
            <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.moss, flexDirection: "row", gap: spacing.md }]}>
              <Icon name="wave" size={20} color={palette.moss} />
              <BodyText style={{ color: palette.inkMuted, lineHeight: 24, flex: 1 }}>{commentary.lines[1]}</BodyText>
            </View>
          ) : null}
        </View>

        <View style={{ gap: spacing.sm }}>
          <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>ARGUMENT STRUCTURE</MonoText>
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { alignItems: "center", paddingVertical: spacing.lg }]}>
            <View style={{ width: 48, height: 40, backgroundColor: palette.lineSoft, alignItems: "center", justifyContent: "center" }}>
              <MonoText style={{ fontSize: 8, color: palette.paper, letterSpacing: 1 }}>CONC</MonoText>
            </View>
            <View style={{ width: 128, height: 40, backgroundColor: palette.line, marginTop: -2, alignItems: "center", justifyContent: "center" }}>
              <MonoText style={{ fontSize: 8, color: palette.paper, letterSpacing: 1 }}>SUPPORT 01 & 02</MonoText>
            </View>
            <View style={{ width: 192, height: 40, backgroundColor: palette.line, marginTop: -2, alignItems: "center", justifyContent: "center" }}>
              <MonoText style={{ fontSize: 8, color: palette.paper, letterSpacing: 1 }}>FOUNDATION</MonoText>
            </View>
          </View>
        </View>

        <SessionButton label={cta.primary} onPress={onNext} />
      </View>
    );
  }

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      <SessionAnalysisStatusBanner isProcessing={liveSee.isProcessing} error={liveSee.error} />
      {headline ? <DisplayText style={styles.stageHeadline}>{headline}</DisplayText> : null}

      <View style={styles.guidedMetricsRow}>
        {metrics.map((metric, index) => (
          <MetricTile
            key={metric.label}
            label={metric.label}
            value={`${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`.trim()}
            reveal={
              metricReveal
                ? {
                    delayMs: index * metricReveal.staggerMs,
                    fadeMs: metricReveal.fadeMs,
                    countUpMs: metricReveal.durationMs,
                  }
                : undefined
            }
          />
        ))}
      </View>

      {sessionNumber === 5 ? (
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { gap: spacing.md }]}>
          <MonoText style={styles.listenCardKicker}>TERMINAL PITCH TRAJECTORY</MonoText>
          <EditorialWaveform bars={waveform.slice(0, 20)} height={100} />
          <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24 }}>
            {session.stages.record.subline ?? commentary.lines[0]}
          </BodyText>
        </View>
      ) : (
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk]}>
          <MonoText style={styles.listenCardKicker}>{sessionNumber === 3 ? "SESSION RECORDING ANALYSIS" : "ENERGY TIMELINE"}</MonoText>
          <EditorialWaveform bars={waveform.concat(waveform).slice(0, 34)} height={120} />
        </View>
      )}

      <View style={[styles.listenInsightCard, styles.brutalistShadowInk]}>
        <MonoText style={styles.listenCardKicker}>{sessionNumber === 2 ? "ANALYTIC INSIGHT" : "COACH COMMENTARY"}</MonoText>
        {liveSee.coachNote ? (
          <BodyText style={{ lineHeight: 24, fontStyle: "italic" }}>{liveSee.coachNote}</BodyText>
        ) : null}
        {commentary.lines.map((line) => (
          <BodyText key={line} style={{ lineHeight: 24 }}>
            {line}
          </BodyText>
        ))}
      </View>

      {session.stages.record.subline && sessionNumber !== 5 ? (
        <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24 }}>{session.stages.record.subline}</BodyText>
      ) : null}

      {cta.secondary ? (
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

function UnifiedCommit(props: UnifiedProps) {
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
  const waveform = useWaveform(session.sessionNumber);
  const cta = commitCtaLabels(sessionNumber);

  const Trapezoid = ({
    label,
    height = 140,
  }: {
    label: string;
    height?: number;
  }) => (
    <View style={{ alignItems: "center", justifyContent: "flex-end", height }}>
      <View
        style={{
          width: "88%",
          height: height * 0.6,
          backgroundColor: palette.line,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          transform: [{ skewX: "-12deg" }],
        }}
      />
      <View style={{ position: "absolute", bottom: height * 0.18 }}>
        <MonoText style={{ color: palette.peach, letterSpacing: 2 }}>{label}</MonoText>
      </View>
    </View>
  );

  if (sessionNumber === 1) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md }]}>
          <MonoText style={styles.listenCardKicker}>FOCUS SUMMARY</MonoText>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>
            Session 1 focused on physiological grounding and vocal resonance. Awareness of fillers is the primary metric for the next 24 hours.
          </BodyText>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md }]}>
          <MonoText style={styles.listenCardKicker}>METRIC BASELINE</MonoText>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: spacing.xs }}>
            <DisplayText style={{ fontSize: 36, lineHeight: 40, color: palette.line }}>14</DisplayText>
            <MonoText style={[styles.metricLabel, { color: palette.inkMuted, fontSize: 10 }]}>FILLERS / MIN</MonoText>
          </View>
        </View>

        <View style={{ gap: spacing.xs }}>
          <MonoText style={{ color: palette.line, letterSpacing: 1 }}>VOICE PROMPT</MonoText>
          <DisplayText style={{ fontSize: 34, lineHeight: 38, fontStyle: "italic" }}>Tomorrow I will{"\n"}notice…</DisplayText>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md, gap: spacing.lg }]}>
          <View style={[styles.brutalistPanel, { borderWidth: 1, padding: spacing.sm, flexDirection: "row", justifyContent: "space-between" }]}>
            <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>0s</MonoText>
            <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>15s CAP</MonoText>
          </View>
          <View style={{ alignItems: "center", gap: spacing.lg }}>
            <EditorialWaveform bars={waveform.slice(0, 14)} height={64} />
            <Pressable
              onPress={onToggleReflection}
              style={[
                styles.doRecordButton,
                styles.brutalistShadowInk,
                {
                  width: 96,
                  height: 96,
                  borderRadius: 0,
                  backgroundColor: palette.paper,
                  borderColor: palette.line,
                },
              ]}
            >
              <View style={{ width: 56, height: 56, borderRadius: 0, backgroundColor: palette.line, alignItems: "center", justifyContent: "center" }}>
                <Icon name="mic" size={24} color={palette.paper} />
              </View>
            </Pressable>
            <MonoText style={[styles.metricLabel, { color: palette.line }]}>
              {reflectRecording ? "RECORDING" : reflectionDone ? "SAVED" : "TAP TO RECORD"}
            </MonoText>
          </View>
        </View>

        {reflect.suggestedOpener ? (
          <View style={[styles.listenQuoteCard, styles.brutalistShadowInk, { padding: spacing.md }]}>
            <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
              <Icon name="spark" size={18} color={palette.peach} />
              <MonoText style={[styles.listenCardKicker, { color: palette.peach }]}>SUGGESTED OPENER</MonoText>
            </View>
            <BodyText style={{ color: palette.peach, fontStyle: "italic", lineHeight: 24 }}>
              {reflect.suggestedOpener}
            </BodyText>
          </View>
        ) : null}

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { alignItems: "center", paddingVertical: spacing.lg }]}>
          <MonoText style={[styles.metricLabel, { color: palette.inkMuted, marginBottom: spacing.md }]}>STRUCTURE PYRAMID (AWARENESS)</MonoText>
          <View style={{ width: 192, height: 160, alignItems: "center", justifyContent: "flex-end" }}>
            <View style={{ width: 48, height: 36, borderWidth: 2, borderColor: palette.lineSoft, opacity: 0.3, marginBottom: -2 }} />
            <View style={{ width: 96, height: 36, borderWidth: 2, borderColor: palette.lineSoft, opacity: 0.4, marginBottom: -2 }} />
            <View style={{ width: 144, height: 36, borderWidth: 2, borderColor: palette.lineSoft, opacity: 0.5, marginBottom: -2 }} />
            <View style={{ width: 192, height: 44, backgroundColor: palette.line, opacity: 0.85, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: palette.line }}>
              <MonoText style={{ color: palette.peach, letterSpacing: 2, fontSize: 10 }}>GROUNDING</MonoText>
            </View>
          </View>
        </View>

        {!reflectionDone ? (
          <SessionButton
            label={cta.primary}
            onPress={onToggleReflection}
            iconLeft={<Icon name="mic" size={18} color={palette.paper} />}
          />
        ) : (
          <SessionButton label={session.sessionNumber >= sessionDefinitions.length ? "COMPLETE PROGRAM" : "COMPLETE SESSION"} onPress={onNext} />
        )}

        {cta.secondary ? (
          <SessionButton label={cta.secondary} onPress={onRetakeReflection} variant="secondary" />
        ) : null}
      </View>
    );
  }

  if (sessionNumber === 6) {
    const prompt = reflect.suggestedOpener ?? reflect.promptTitle ?? "What did you become?";
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 1 }}>05 / 05</MonoText>
        <MonoText style={{ color: palette.line, letterSpacing: 1, alignSelf: "flex-start" }}>COMMIT</MonoText>

        <DisplayText style={{ fontSize: 48, lineHeight: 54 }}>{prompt}</DisplayText>

        <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
          <BodyText style={{ color: palette.inkMuted, fontSize: 22, lineHeight: 34 }}>
            {reflect.bodyText ?? "Thirty-six sessions of recorded choices sit behind the answer. Speak with that in front of you."}
          </BodyText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.md, gap: spacing.md, alignItems: "center" }}>
            <Pressable onPress={onToggleReflection} style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 96, height: 96, borderRadius: 0, backgroundColor: palette.paper }]}>
              <Icon name="mic" size={40} color={palette.line} />
            </Pressable>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>RECORD CAPSTONE INTENT</MonoText>
            <EditorialWaveform bars={waveform.slice(0, 14)} height={40} light />
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: palette.lineSoft }} />
        <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 26 }}>
          {reflect.metaLine ?? "Six sessions of noticing is the prerequisite the rest of the programme builds on."}
        </BodyText>

        <SessionButton
          label={cta.primary}
          onPress={onNext}
          variant="secondary"
        />
      </View>
    );
  }

  if (sessionNumber === 7) {
    const coachNote = reflect.metaLine ?? reflect.bodyText;
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <MonoText style={{ color: palette.line, letterSpacing: 1 }}>STEP 05/05</MonoText>
          </View>
          <SessionProgressStrip activeIndex={4} compact />
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 3, textAlign: "center" }}>ACTIVE PHASE: CONSOLIDATION</MonoText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg }]}>
          <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 28, fontSize: 20 }}>
            {reflect.suggestedOpener ?? "Tomorrow I will catch one filler before it leaves my lips, pausing in the gap for exactly half a second."}
          </BodyText>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)", padding: spacing.lg, gap: spacing.md }]}>
          <MonoText style={{ color: palette.line, letterSpacing: 2, textAlign: "center" }}>RECORD COMMITMENT</MonoText>
          <BodyText style={{ textAlign: "center", color: palette.inkMuted }}>Hold to record 15s audio pledge</BodyText>
          <View style={{ alignItems: "center", gap: spacing.md, paddingTop: spacing.sm }}>
            <Pressable onPress={onToggleReflection} style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 110, height: 110, borderRadius: 0, backgroundColor: palette.paper }]}>
              <Icon name={reflectionDone ? "spark" : "mic"} size={44} color={palette.line} />
            </Pressable>
            <View style={{ width: "100%", borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.sm, backgroundColor: palette.paper }}>
              <EditorialWaveform bars={waveform.concat(waveform).slice(0, 22)} height={40} light />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>REC: COMMIT_07_05</MonoText>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>00:15</MonoText>
            </View>
          </View>
        </View>

        {coachNote ? (
          <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { borderLeftWidth: 4, borderLeftColor: palette.line, padding: spacing.md }]}>
            <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24 }}>
              {coachNote}
            </BodyText>
          </View>
        ) : null}

        <SessionButton
          label={reflectionDone ? "COMPLETE SESSION" : cta.primary}
          onPress={reflectionDone ? onNext : onToggleReflection}
        />
      </View>
    );
  }

  if (sessionNumber === 8) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, textAlign: "center" }}>SESSION 8</MonoText>
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { paddingVertical: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
          <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>05</DisplayText>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>/ 05</MonoText>
        </View>

        <DisplayText style={{ fontSize: 46, lineHeight: 50, textAlign: "center" }}>COMMIT</DisplayText>
        <BodyText style={{ textAlign: "center", color: palette.inkMuted, fontStyle: "italic", lineHeight: 28, fontSize: 22 }}>
          {reflect.suggestedOpener ?? "Tomorrow I will start my hardest conversation at…"}
        </BodyText>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ position: "absolute", top: -12, alignSelf: "center", paddingHorizontal: spacing.lg, paddingVertical: 6, backgroundColor: palette.line }}>
            <MonoText style={{ color: palette.paper, letterSpacing: 2 }}>15s PLEDGE</MonoText>
          </View>
          <View style={{ padding: spacing.xl, gap: spacing.lg, alignItems: "center" }}>
            <Pressable onPress={onToggleReflection} style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 96, height: 96, borderRadius: 0, backgroundColor: palette.paper }]}>
              <Icon name={reflectionDone ? "spark" : "mic"} size={40} color={palette.line} />
            </Pressable>
            <EditorialWaveform bars={waveform.concat(waveform).slice(0, 20)} height={56} light />
          </View>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)" }]}>
          <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 26 }}>
            Pace resets every time the breath does. The first sentence of the next hard conversation is where to place it.
          </BodyText>
        </View>

        <SessionButton label={reflectionDone ? "COMPLETE SESSION" : cta.primary} onPress={reflectionDone ? onNext : onToggleReflection} />
      </View>
    );
  }

  if (sessionNumber === 9) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ alignItems: "center", gap: spacing.sm }}>
          <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: 0 }]}>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>05 COMMIT</MonoText>
          </View>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.md }]}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>PROMPT</MonoText>
          <BodyText style={{ fontStyle: "italic", lineHeight: 30, fontSize: 22 }}>
            {reflect.suggestedOpener ?? "Tomorrow I will pause before answering…"}
          </BodyText>

          <View style={{ borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.md, backgroundColor: palette.paper }}>
            <EditorialWaveform bars={waveform.concat(waveform).slice(0, 40)} height={34} light />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm }}>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>0:00</MonoText>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>REC</MonoText>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>0:15</MonoText>
            </View>
          </View>

          <Pressable onPress={onToggleReflection} style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 76, height: 76, borderRadius: 0, alignSelf: "center", backgroundColor: palette.line }]}>
            <Icon name={reflectionDone ? "spark" : "mic"} size={34} color={palette.paper} />
          </Pressable>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)", borderLeftWidth: 4, borderLeftColor: palette.line }]}>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>
            The first deliberate pause in a real conversation costs the most attention. The ones after run on the pattern the first one sets.
          </BodyText>
        </View>

        <SessionButton label={reflectionDone ? "COMPLETE SESSION" : cta.primary} onPress={reflectionDone ? onNext : onToggleReflection} />
      </View>
    );
  }

  if (sessionNumber === 10) {
    const coachNote = reflect.metaLine ?? reflect.bodyText ?? reflect.scienceNote;
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>SESSION 10</MonoText>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>05 / 05</MonoText>
        </View>

        <DisplayText style={{ fontSize: 46, lineHeight: 50, textAlign: "center" }}>COMMIT</DisplayText>
        <BodyText style={{ textAlign: "center", color: palette.line, fontStyle: "italic", lineHeight: 28, fontSize: 22 }}>
          {reflect.suggestedOpener ?? "Tomorrow I will land my recommendation with…"}
        </BodyText>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.lg, gap: spacing.lg, alignItems: "center" }}>
            <View style={{ width: "100%", borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.md, backgroundColor: palette.paper }}>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>15s PLEDGE</MonoText>
              <EditorialWaveform bars={waveform.concat(waveform).slice(0, 20)} height={56} light />
            </View>
            <Pressable onPress={onToggleReflection} style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 92, height: 92, borderRadius: 0, backgroundColor: palette.paper }]}>
              <Icon name={reflectionDone ? "spark" : "mic"} size={40} color={palette.line} />
            </Pressable>
            <View style={{ width: "100%", borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.lg, backgroundColor: palette.paper, alignItems: "center", gap: spacing.sm }}>
              <DisplayText style={{ fontSize: 22, lineHeight: 26 }}>Coach Note:</DisplayText>
              <BodyText style={{ textAlign: "center", color: palette.inkMuted, lineHeight: 26 }}>
                {coachNote ?? "Two semitones on the last syllable. The sentence in front of it inherits the certainty."}
              </BodyText>
            </View>
          </View>
        </View>

        <SessionButton label={reflectionDone ? "COMPLETE SESSION" : cta.primary} onPress={reflectionDone ? onNext : onToggleReflection} />
      </View>
    );
  }

  if (sessionNumber === 36) {
    const prompt = reflect.suggestedOpener ?? reflect.promptTitle ?? "What did you become?";
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <MonoText style={{ color: palette.line, letterSpacing: 1 }}>05 / 05</MonoText>
        <DisplayText style={{ fontSize: 48, lineHeight: 54 }}>{prompt}</DisplayText>
        <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
          <BodyText style={{ color: palette.inkMuted, fontSize: 22, lineHeight: 34 }}>
            {reflect.bodyText ?? reflect.metaLine ?? "Thirty-six sessions of recorded choices sit behind the answer. Speak with that in front of you."}
          </BodyText>
        </View>
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.md, alignItems: "center" }]}>
          <Pressable onPress={onToggleReflection} style={[styles.doRecordButton, styles.brutalistShadowInk, { width: 96, height: 96, borderRadius: 0, backgroundColor: palette.paper }]}>
            <Icon name="mic" size={40} color={palette.line} />
          </Pressable>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>
            {commitRecordHintLabel(sessionNumber, reflectRecording, reflectionDone)}
          </MonoText>
          <EditorialWaveform bars={waveform.slice(0, 14)} height={40} light />
        </View>
        <SessionButton
          label={commitActionLabel(sessionNumber, reflectionDone, sessionDefinitions.length)}
          onPress={reflectionDone ? onNext : onToggleReflection}
          iconLeft={!reflectionDone ? <Icon name="mic" size={18} color={palette.paper} /> : undefined}
        />
      </View>
    );
  }

  if (sessionNumber === 2) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ alignItems: "center", justifyContent: "flex-end", height: 200 }}>
          <View style={{ width: 48, height: 50, borderWidth: 2, borderColor: palette.lineSoft, opacity: 0.3, alignItems: "center", justifyContent: "center" }} />
          <View style={{ width: 96, height: 50, borderWidth: 2, borderColor: palette.lineSoft, opacity: 0.5, marginTop: -2, alignItems: "center", justifyContent: "center" }} />
          <View style={[styles.brutalistShadowInk, { width: 192, height: 64, backgroundColor: palette.line, marginTop: -2, alignItems: "center", justifyContent: "center" }]}>
            <MonoText style={{ color: palette.peach, letterSpacing: 2 }}>GROUNDING</MonoText>
          </View>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md, alignItems: "center" }]}>
          <MonoText style={[styles.listenCardKicker, { textAlign: "center" }]}>TRANSCRIPTION</MonoText>
          <MonoText style={[styles.listenCardKicker, { textAlign: "center" }]}>PREVIEW</MonoText>
          <BodyText style={{ fontSize: 22, lineHeight: 28, textAlign: "center" }}>
            {reflect.suggestedOpener?.replace(/^"|"$/g, "") ?? "Tomorrow I will notice my pace when…"}
          </BodyText>
          <View style={[styles.brutalistPanel, { borderWidth: 1, padding: spacing.sm, width: "100%" }]}>
            <BodyText style={{ color: palette.line, lineHeight: 22 }}>…recording is ready</BodyText>
          </View>
        </View>

        {!reflectionDone ? (
          <SessionButton
            label={cta.primary}
            onPress={onToggleReflection}
            iconLeft={<Icon name="mic" size={18} color={palette.paper} />}
          />
        ) : (
          <SessionButton
            label={session.sessionNumber >= sessionDefinitions.length ? "COMPLETE PROGRAM" : "COMPLETE SESSION"}
            onPress={onNext}
          />
        )}
      </View>
    );
  }

  if (sessionNumber === 3) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk]}>
          <BodyText style={{ color: palette.inkMuted, fontStyle: "italic", lineHeight: 24 }}>
            {reflect.suggestedOpener ?? "Tomorrow I will pause when…"}
          </BodyText>
        </View>

        {reflect.metaLine ? (
          <BodyText style={{ color: palette.inkMuted, lineHeight: 24, borderLeftWidth: 3, borderLeftColor: palette.lineSoft, paddingLeft: spacing.md }}>
            {reflect.metaLine}
          </BodyText>
        ) : null}

        <View style={{ alignItems: "center", gap: spacing.sm }}>
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { width: "100%", alignItems: "center" }]}>
            <Trapezoid label="GROUNDING" height={140} />
          </View>
          <View style={{ flexDirection: "row", gap: spacing.lg }}>
            <View style={{ alignItems: "center" }}>
              <DisplayText style={{ fontSize: 24, lineHeight: 28, color: palette.line }}>03</DisplayText>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>SPRINT</MonoText>
            </View>
            <View style={{ width: 1, backgroundColor: palette.lineSoft }} />
            <View style={{ alignItems: "center" }}>
              <DisplayText style={{ fontSize: 24, lineHeight: 28, color: palette.line }}>05</DisplayText>
              <MonoText style={[styles.metricLabel, { color: palette.inkMuted }]}>SESSION</MonoText>
            </View>
          </View>
        </View>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: spacing.md, alignItems: "center" }]}>
          <MonoText style={[styles.outlineBadgeText, { color: palette.line }]}>WAITING FOR INPUT</MonoText>
        </View>

        {!reflectionDone ? (
          <SessionButton
            label={cta.primary}
            onPress={onToggleReflection}
            iconLeft={<Icon name="mic" size={18} color={palette.paper} />}
          />
        ) : (
          <SessionButton
            label={session.sessionNumber >= sessionDefinitions.length ? "COMPLETE PROGRAM" : "COMPLETE SESSION"}
            onPress={onNext}
          />
        )}
      </View>
    );
  }

  if (sessionNumber === 4) {
    const metricA = session.stages.record.metrics?.[0];
    const metricB = session.stages.record.metrics?.[1];

    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        {reflect.suggestedOpener ? (
          <View style={[styles.commitQuoteBlock, { paddingLeft: spacing.sm }]}>
            <BodyText style={styles.commitQuoteText}>{reflect.suggestedOpener}</BodyText>
          </View>
        ) : null}

        {reflect.metaLine ? (
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 1, textAlign: "center" }}>{reflect.metaLine.toUpperCase()}</MonoText>
        ) : null}

        <View style={{ alignItems: "center", marginVertical: spacing.sm }}>
          <View style={{ width: 240, height: 240, borderRadius: 0, borderWidth: 2, borderColor: palette.line, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: 280, height: 280, borderRadius: 0, borderWidth: 2, borderColor: palette.lineSoft, borderStyle: "dashed", position: "absolute" }} />
            <Icon name="spark" size={40} color={palette.line} />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { flex: 1, alignItems: "center" }]}>
            <MonoText style={styles.listenCardKicker}>PITCH</MonoText>
            <DisplayText style={{ fontSize: 26, lineHeight: 30, color: palette.line }}>
              {(metricA?.value ?? "STABLE").toString().toUpperCase()}
            </DisplayText>
          </View>
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { flex: 1, alignItems: "center" }]}>
            <MonoText style={styles.listenCardKicker}>PACE</MonoText>
            <DisplayText style={{ fontSize: 26, lineHeight: 30, color: palette.line }}>
              {metricB?.value ?? "85 BPM"}
            </DisplayText>
          </View>
        </View>

        {!reflectionDone ? (
          <SessionButton
            label={cta.primary}
            onPress={onToggleReflection}
            iconLeft={<Icon name="mic" size={18} color={palette.paper} />}
          />
        ) : (
          <SessionButton
            label={session.sessionNumber >= sessionDefinitions.length ? "COMPLETE PROGRAM" : "COMPLETE SESSION"}
            onPress={onNext}
          />
        )}

        <MonoText style={{ color: palette.inkMuted, letterSpacing: 1, textAlign: "center", fontSize: 10 }}>
          PRESS TO BEGIN YOUR FINAL VOCAL SPRINT
        </MonoText>
      </View>
    );
  }

  if (sessionNumber === 5) {
    return (
      <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <MonoText style={{ color: palette.line, letterSpacing: 1 }}>05 / 05</MonoText>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 1 }}>FINAL STEP</MonoText>
          </View>
          <View style={{ height: 2, backgroundColor: palette.lineSoft }} />
        </View>

        {reflect.suggestedOpener ? (
          <View style={[styles.commitQuoteBlock, { paddingLeft: spacing.sm }]}>
            <BodyText style={styles.commitQuoteText}>{reflect.suggestedOpener}</BodyText>
          </View>
        ) : null}

        {reflect.metaLine ? (
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)" }]}>
            <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>{reflect.metaLine}</BodyText>
          </View>
        ) : null}

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ paddingHorizontal: spacing.md, paddingVertical: 10, flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={styles.listenCardKicker}>INPUT MONITOR</MonoText>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 0, backgroundColor: reflectionDone ? palette.line : "#BA1A1A" }} />
              <MonoText style={[styles.metricLabel, { color: reflectionDone ? palette.line : "#BA1A1A" }]}>
                {reflectionDone ? "SAVED" : "READY"}
              </MonoText>
            </View>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: palette.lineSoft, padding: spacing.md, alignItems: "center" }}>
            <EditorialWaveform bars={waveform.slice(0, 14)} height={54} />
          </View>
        </View>

        {!reflectionDone ? (
          <SessionButton
            label={cta.primary}
            onPress={onToggleReflection}
            iconLeft={<Icon name="mic" size={18} color={palette.paper} />}
          />
        ) : (
          <SessionButton
            label={session.sessionNumber >= sessionDefinitions.length ? "COMPLETE PROGRAM" : "COMPLETE SESSION"}
            onPress={onNext}
          />
        )}

        <MonoText style={{ color: palette.inkMuted, letterSpacing: 1, textAlign: "center", fontSize: 10 }}>
          Press to begin your 15-second commitment recording. Focus on the pitch drop.
        </MonoText>

        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "rgba(239,223,216,0.35)", flexDirection: "row", gap: spacing.md, alignItems: "center" }]}>
          <View style={{ width: 42, height: 42, borderWidth: 1, borderColor: palette.lineSoft, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: 0, height: 0, borderLeftWidth: 12, borderRightWidth: 12, borderBottomWidth: 18, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: palette.line }} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <MonoText style={[styles.listenCardKicker, { textAlign: "center" }]}>STRUCTURE CHECK</MonoText>
            <BodyText style={{ color: palette.inkMuted, lineHeight: 22, fontStyle: "italic" }}>
              Recording this commitment completes your daily argument structure for Sprint 3.
            </BodyText>
          </View>
        </View>

      </View>
    );
  }

  return (
    <View style={[styles.guidedStepBodyUnified, styles.unifiedStageBodyCompact]}>
      {reflect.suggestedOpener ? (
        <View style={styles.commitQuoteBlock}>
          <BodyText style={styles.commitQuoteText}>{reflect.suggestedOpener}</BodyText>
        </View>
      ) : null}

      {reflect.metaLine ? (
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk]}>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 24 }}>{reflect.metaLine}</BodyText>
        </View>
      ) : null}

      {sessionNumber === 2 ? (
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk]}>
          <MonoText style={styles.listenCardKicker}>TRANSCRIPTION PREVIEW</MonoText>
          <BodyText style={{ fontStyle: "italic", lineHeight: 24 }}>
            {reflect.suggestedOpener?.replace(/^"|"$/g, "") ?? "Tomorrow I will notice..."}
          </BodyText>
        </View>
      ) : (
        <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { minHeight: 100, alignItems: "center", justifyContent: "center" }]}>
          <MonoText style={styles.metricLabel}>INPUT MONITOR</MonoText>
          <EditorialWaveform bars={waveform.slice(0, 12)} height={56} />
          <MonoText style={[styles.metricLabel, { color: reflectRecording ? "#BA1A1A" : palette.inkMuted }]}>
            {reflectRecording ? "RECORDING" : reflectionDone ? "SAVED" : "READY"}
          </MonoText>
        </View>
      )}

      <View style={{ alignItems: "center", gap: spacing.md }}>
        <Pressable onPress={onToggleReflection} style={[styles.doRecordButton, styles.brutalistShadowInk, { backgroundColor: palette.line }]}>
          <Icon name={reflectionDone ? "spark" : "mic"} size={44} color={palette.paper} />
        </Pressable>
        <View style={[styles.guidedProgressTrack, { width: "100%" }]}>
          <View style={[styles.guidedProgressFill, { width: `${reflectProgress}%` }]} />
        </View>
        <MonoText style={styles.metricLabel}>
          {commitRecordHintLabel(sessionNumber, reflectRecording, reflectionDone)}
        </MonoText>
      </View>

      {cta.secondary ? (
        <SessionButton label={cta.secondary} onPress={onRetakeReflection} variant="secondary" />
      ) : null}

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
  );
}

function useWaveform(sessionNumber: number) {
  return useMemo(
    () => Array.from({ length: 22 }).map((_, index) => 18 + ((sessionNumber * 9 + index * 13) % 58)),
    [sessionNumber],
  );
}
