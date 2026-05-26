import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel, PrimaryButton } from "../../../design-system/primitives";
import { Icon } from "../../../design-system/icons";
import { palette, spacing, type } from "../../../design-system/theme";
import { InteractivePressable } from "../../../design-system/motion";
import { sessionDefinitions } from "../../../data/mockData";
import { LISTEN_DURATION, RECORD_DURATION, REFLECT_DURATION, UNLOCK_ALL_FOR_TESTING } from "../constants";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";
import { DottedStageBackground } from "../components/DottedStageBackground";
import { EditorialWaveform } from "../components/EditorialWaveform";
import { PhotoPlaceholder } from "../components/PhotoPlaceholder";
import { SessionProgressStrip } from "../components/SessionProgressStrip";
import { TextHighlight } from "../components/TextHighlight";
import { MetricInsight } from "../components/MetricInsight";

const LISTEN_TOTAL_SECONDS = LISTEN_DURATION;

function formatListenClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function parseAudioDuration(value?: string) {
  if (!value) return LISTEN_TOTAL_SECONDS;
  const match = value.match(/^(\d+):(\d{2})$/);
  if (!match?.[1] || !match[2]) return LISTEN_TOTAL_SECONDS;
  return Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10);
}

function SessionOneAudioPlayer({
  title,
  description,
  durationLabel,
  waveformMeta,
  listenPlaying,
  listenProgress,
  onTogglePlay,
}: {
  title: string;
  description: string;
  durationLabel: string;
  waveformMeta?: string;
  listenPlaying: boolean;
  listenProgress: number;
  onTogglePlay: () => void;
}) {
  const totalSeconds = parseAudioDuration(durationLabel);
  const elapsedSeconds = Math.min(totalSeconds, Math.round((listenProgress / 100) * totalSeconds));
  const waveformBars = useMemo(
    () =>
      Array.from({ length: 48 }).map((_, index) => {
        const base = 14 + (((index * 17) % 72) + (index % 7) * 2);
        return listenPlaying ? base + ((index + elapsedSeconds) % 5) * 4 : base;
      }),
    [elapsedSeconds, listenPlaying],
  );

  return (
    <Panel style={sessionOneStyles.playerCard}>
      <View style={sessionOneStyles.playerHeader}>
        <View style={sessionOneStyles.playerCopy}>
          <DisplayText style={sessionOneStyles.playerTitle}>{title}</DisplayText>
          <BodyText style={sessionOneStyles.playerDescription}>{description}</BodyText>
        </View>
        <View style={sessionOneStyles.liveBadge}>
          <MonoText style={sessionOneStyles.liveBadgeText}>{listenPlaying ? "PLAYING" : "READY"}</MonoText>
        </View>
      </View>

      <View style={sessionOneStyles.waveformWrap}>
        <EditorialWaveform bars={waveformBars} height={148} light />
      </View>
      {waveformMeta ? (
        <MonoText style={sessionOneStyles.waveformMeta}>{waveformMeta}</MonoText>
      ) : null}

      <View style={sessionOneStyles.controlsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={listenPlaying ? "Pause audio" : "Play audio"}
          onPress={onTogglePlay}
          style={({ pressed }) => [sessionOneStyles.playButton, pressed && sessionOneStyles.playButtonPressed]}
        >
          <MonoText style={sessionOneStyles.playButtonLabel}>{listenPlaying ? "II" : "▶"}</MonoText>
        </Pressable>

        <View style={sessionOneStyles.progressColumn}>
          <View style={sessionOneStyles.progressTrack}>
            <View style={[sessionOneStyles.progressFill, { width: `${listenProgress}%` }]} />
            <View style={[sessionOneStyles.progressThumb, { left: `${listenProgress}%` }]} />
          </View>
          <View style={sessionOneStyles.timeRow}>
            <MonoText style={sessionOneStyles.timeElapsed}>{formatListenClock(elapsedSeconds)}</MonoText>
            <MonoText style={sessionOneStyles.timeTotal}>{durationLabel}</MonoText>
          </View>
        </View>
      </View>
    </Panel>
  );
}

export function ListenStep({
  sessionNumber,
  content,
  listenPlaying,
  listenProgress,
  onTogglePlay,
  onNext,
}: {
  sessionNumber: number;
  content: (typeof sessionDefinitions)[number]["stages"]["lesson"];
  listenPlaying: boolean;
  listenProgress: number;
  onTogglePlay: () => void;
  onNext: () => void;
}) {
  const waveformBars = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, index) => 18 + (((index * 19) % 85) + (listenPlaying ? (index % 5) * 3 : 0))),
    [listenPlaying],
  );

  const sessionOneCoachingAnchors = sessionNumber === 1
    ? [
        "Fillers happen when your brain is searching for the next idea.",
        "They are not a weakness. They are a timing signal.",
        "When you slow down, they reduce naturally.",
      ]
    : [];

  if (sessionNumber === 1) {
    const totalSeconds = parseAudioDuration(content.audioDuration);
    const listenComplete = listenProgress >= 100;

    return (
      <View style={[styles.stepBody, { alignItems: "center" }]}>
        <View style={sessionOneStyles.layout}>
          <Panel tone="ink" style={sessionOneStyles.insightCard}>
            <MonoText style={sessionOneStyles.insightKicker}>{content.insightTitle}</MonoText>
            <BodyText style={sessionOneStyles.insightQuote}>{content.insightQuote}</BodyText>
          </Panel>

          <Panel tone="soft" style={sessionOneStyles.notesCard}>
            <View style={sessionOneStyles.notesSection}>
              <MonoText style={sessionOneStyles.notesLabel}>Key ideas</MonoText>
              {sessionOneCoachingAnchors.map((line) => (
                <View key={line} style={sessionOneStyles.bulletRow}>
                  <View style={sessionOneStyles.bullet} />
                  <BodyText style={sessionOneStyles.bulletText}>{line}</BodyText>
                </View>
              ))}
            </View>

            <View style={sessionOneStyles.notesDivider} />

            <View style={sessionOneStyles.notesSection}>
              <MonoText style={sessionOneStyles.notesLabel}>From the lesson</MonoText>
              {content.coachingPassages?.map((passage) => (
                <BodyText
                  key={passage.text}
                  style={[
                    sessionOneStyles.passageText,
                    passage.tone === "muted" ? sessionOneStyles.passageMuted : sessionOneStyles.passageDefault,
                  ]}
                >
                  {passage.text}
                </BodyText>
              ))}
            </View>
          </Panel>

          <SessionOneAudioPlayer
            title={content.title}
            description={content.description}
            durationLabel={content.audioDuration ?? formatListenClock(totalSeconds)}
            waveformMeta={content.waveformMeta}
            listenPlaying={listenPlaying}
            listenProgress={listenProgress}
            onTogglePlay={onTogglePlay}
          />

          <Panel tone="soft" style={sessionOneStyles.takeawayCard}>
            <MonoText style={sessionOneStyles.takeawayKicker}>Takeaway</MonoText>
            <BodyText style={sessionOneStyles.takeawayBody}>
              You don&apos;t remove fillers by forcing them out. You remove them by giving your thoughts space.
            </BodyText>
            <BodyText style={sessionOneStyles.takeawayHint}>
              In the next step, notice your patterns — not to fix them, just to see them.
            </BodyText>
          </Panel>

          <PrimaryButton label={listenComplete || UNLOCK_ALL_FOR_TESTING ? "NEXT" : "LISTEN TO CONTINUE"} onPress={onNext} inverted={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
        </View>
      </View>
    );
  }

  if (sessionNumber === 6) {
    return (
      <View style={styles.stepBody}>
        <Pressable onPress={() => undefined} style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.sm }}>
          <Icon name="back" size={16} color={palette.line} />
          <MonoText style={{ color: palette.line }}>BACK TO SESSIONS</MonoText>
        </Pressable>

        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted }}>MODULE 02</MonoText>
          <DisplayText style={{ fontSize: 24, lineHeight: 28, color: palette.ink }}>The Notice Sprint</DisplayText>
          <BodyText style={{ fontSize: 18, lineHeight: 30 }}>
            Today is different. You will hear your Session 1 baseline alongside your Session 5. Focus your attention on the nuance of the delivery. Listen for what changed.
          </BodyText>
        </View>

        <Panel style={{ gap: spacing.md }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View>
              <MonoText style={{ color: palette.line }}>RECORDING A</MonoText>
              <DisplayText style={{ fontSize: 22, lineHeight: 26, color: palette.ink }}>Session 1</DisplayText>
              <BodyText style={{ color: palette.inkMuted, fontStyle: "italic" }}>The Baseline</BodyText>
            </View>
            <View style={{ backgroundColor: "#E5D4C8", paddingHorizontal: 10, paddingVertical: 6 }}>
              <MonoText>ORIGINAL</MonoText>
            </View>
          </View>
          <EditorialWaveform bars={[24, 38, 52, 30, 64, 46, 76, 34, 24, 48, 68, 32, 56, 36, 24, 58, 36, 32, 44, 70, 38, 56, 30, 18, 12, 36, 62, 28, 46, 20]} />
          <PrimaryButton label="PLAY BASELINE" onPress={onTogglePlay} inverted />
        </Panel>

        <Panel style={{ gap: spacing.md }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View>
              <MonoText style={{ color: palette.line }}>RECORDING B</MonoText>
              <DisplayText style={{ fontSize: 22, lineHeight: 26, color: palette.ink }}>Session 5</DisplayText>
              <BodyText style={{ color: palette.inkMuted, fontStyle: "italic" }}>Recent Progress</BodyText>
            </View>
            <View style={{ backgroundColor: palette.line, paddingHorizontal: 10, paddingVertical: 6 }}>
              <MonoText style={{ color: palette.paper }}>LATEST</MonoText>
            </View>
          </View>
          <EditorialWaveform bars={[30, 46, 22, 70, 36, 82, 56, 88, 62, 36, 72, 48, 26, 58, 80, 64, 38, 22, 50, 76, 58, 42, 68, 30, 16, 42, 78, 52, 24, 14]} />
          <PrimaryButton label="PLAY RECENT" onPress={onTogglePlay} inverted />
        </Panel>

        <Panel tone="ink" style={{ gap: spacing.md }}>
          <DisplayText style={{ fontSize: 22, lineHeight: 26, color: palette.paper }}>Ready to see the data?</DisplayText>
          <BodyText style={{ color: "#F4DFD6" }}>
            After listening to both sessions, click below to reveal the specific trends and metrics analyzed from your vocal evolution.
          </BodyText>
          <PrimaryButton label="REVEAL TRENDS" onPress={onNext} inverted />
        </Panel>

        <PhotoPlaceholder height={170} />

        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.line, textDecorationLine: "underline" }}>INSTRUCTOR NOTE</MonoText>
          <BodyText style={{ fontStyle: "italic", color: palette.inkMuted }}>
            “The shift between Session 1 and Session 5 isn't just about volume; it's about the spatial awareness of your own voice. Notice the resonance in the lower frequencies. That's where the growth lives.”
          </BodyText>
        </View>
      </View>
    );
  }

  if (sessionNumber === 8) {
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.sm }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 8: FINDING YOUR PACE</MonoText>
          </View>
          <DisplayText style={{ fontSize: 32, lineHeight: 38 }}>
            The Credibility Zone:{"\n"}
            <TextHighlight>130-150 WPM</TextHighlight>
          </DisplayText>
          <BodyText style={{ fontSize: 18, lineHeight: 30 }}>
            Your pace isn't just about speed; it's about authority. In this step, we analyze the specific cadence that triggers trust in professional listeners.
          </BodyText>
        </View>

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <MonoText style={styles.metricLabel}>TIDBIT</MonoText>
          <BodyText style={{ color: palette.ink }}>
            “The 130-150 WPM band is where the brain processes vocal nuance most effectively without losing focus.”
          </BodyText>
        </Panel>

        <Panel style={{ gap: spacing.md }}>
          <View style={{ alignItems: "center", gap: spacing.sm }}>
            <Pressable onPress={onTogglePlay} style={[styles.audioActionButton, { width: 78, height: 78, backgroundColor: palette.paper }]}>
              <MonoText style={[styles.audioActionLabel, { color: palette.line }]}>{listenPlaying ? "II" : "▶"}</MonoText>
            </Pressable>
            <MonoText>LISTEN</MonoText>
          </View>
          <EditorialWaveform bars={waveformBars.slice(0, 24).map((value) => Math.min(78, value - 4))} light />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText>0:00</MonoText>
            <MonoText>2:45</MonoText>
          </View>
        </Panel>

        <Panel style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.line }}>ANALYSIS</MonoText>
          <BodyText>Notice the deliberate pauses between the 15-20 second mark. This creates “cognitive space” for the audience.</BodyText>
        </Panel>

        <PhotoPlaceholder height={136} />

        <Panel style={{ gap: spacing.md }}>
          <View style={{ borderBottomWidth: 2, borderColor: palette.lineSoft, paddingBottom: spacing.xs }}>
            <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>TRANSCRIPT</DisplayText>
          </View>
          {content.transcriptLines?.map((line, index) =>
            line.highlighted ? (
              <Panel key={index} tone="soft" style={{ gap: spacing.xs }}>
                <BodyText style={{ color: palette.ink }}>{line.text}</BodyText>
              </Panel>
            ) : (
              <BodyText key={index}>
                <MonoText style={{ color: palette.line }}>{line.time} </MonoText>
                {line.text}
              </BodyText>
            ),
          )}
        </Panel>

        <PrimaryButton label="MARK AS HEARD" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 9) {
    return (
      <View style={styles.stepBody}>
        <Panel tone="soft" style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 9: POWER PAUSES</MonoText>
          </View>
          <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>STEP 02: THE ART OF STRATEGIC SILENCE</DisplayText>
          <BodyText>
            A pause is never just a lack of sound. It is a tool for dominance, empathy, or reflection. Learn to distinguish
            between the pause that commands and the one that retreats.
          </BodyText>
        </Panel>

        <Panel style={{ gap: spacing.md }}>
          <PhotoPlaceholder height={192} />
          <Pressable onPress={onTogglePlay} style={{ position: "absolute", top: 66, alignSelf: "center", width: 64, height: 64, backgroundColor: palette.line, borderWidth: 2, borderColor: palette.line, justifyContent: "center", alignItems: "center" }}>
            <MonoText style={{ color: palette.paper, fontSize: 24 }}>{listenPlaying ? "II" : "▶"}</MonoText>
          </Pressable>
          <View style={{ gap: spacing.xs }}>
            <MonoText style={styles.metricLabel}>CURRENT AUDIO</MonoText>
            <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>Strategic Silence vs. Anxious Gaps</DisplayText>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <BodyText>Anxious Gaps</BodyText>
              <MonoText>12:45 / 18:00</MonoText>
            </View>
          </View>
          <EditorialWaveform bars={waveformBars.slice(0, 14).map((value) => 12 + (value % 34))} />
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <PrimaryButton label="DOWNLOAD AUDIO" onPress={() => undefined} inverted />
            <PrimaryButton label="MARK COMPLETE" onPress={onNext} />
          </View>
        </Panel>

        <Panel tone="soft" style={{ gap: spacing.md }}>
          <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>THE ANATOMY OF A PAUSE</DisplayText>
          {content.anatomy?.map((item) => (
            <Panel key={item.label} tone={item.muted ? "soft" : "paper"} style={{ gap: spacing.xs, opacity: item.muted ? 0.65 : 1 }}>
              <MonoText style={{ color: item.muted ? palette.inkMuted : palette.line }}>{item.label}</MonoText>
              <BodyText>{item.body}</BodyText>
            </Panel>
          ))}
        </Panel>

        <Panel style={{ gap: spacing.md }}>
          <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>TRANSCRIPT</DisplayText>
          {content.transcriptLines?.map((line, index) =>
            line.highlighted ? (
              <Panel key={index} tone="soft" style={{ gap: spacing.xs }}>
                <BodyText>
                  <MonoText style={{ color: palette.line }}>{line.time} </MonoText>
                  {line.text}
                </BodyText>
              </Panel>
            ) : (
              <BodyText key={index}>
                <MonoText style={{ color: palette.line }}>{line.time} </MonoText>
                {line.text}
              </BodyText>
            ),
          )}
        </Panel>

        <Panel tone="ink" style={{ gap: spacing.sm }}>
          <BodyText style={{ color: palette.paper, fontSize: 26, lineHeight: 34 }}>
            “Strategic silence is the architecture of a great conversation.”
          </BodyText>
          <MonoText style={{ color: "#EBCBBC" }}>TIDBIT: THE MASTER CLASS</MonoText>
        </Panel>
      </View>
      );
    }

  if (sessionNumber === 11) {
    const listenComplete = listenProgress >= 100;
    const audioTotal = content.audioDuration ?? "02:30";
    const totalSeconds = parseAudioDuration(audioTotal);
    const elapsedSeconds = Math.min(totalSeconds, Math.round((listenProgress / 100) * totalSeconds));
    const elapsedLabel = formatListenClock(elapsedSeconds);
    const transcript = content.description ?? "";

    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.xs }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 11: BREVITY</MonoText>
          <DisplayText style={{ fontSize: 42, lineHeight: 46 }}>{content.title ?? "Cutting unnecessary words"}</DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>{`${elapsedLabel} / ${audioTotal}`}</MonoText>
            <Pressable onPress={onTogglePlay} style={[styles.audioActionButton, { width: 56, height: 56, borderRadius: 28, backgroundColor: palette.line }]}>
              <MonoText style={[styles.audioActionLabel, { color: palette.paper }]}>{listenPlaying ? "II" : "▶"}</MonoText>
            </Pressable>
          </View>
          <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
            <EditorialWaveform bars={waveformBars.concat(waveformBars).slice(0, 22)} height={74} light />
          </View>
        </View>

        {content.insightQuote ? (
          <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
            <BodyText style={{ fontSize: 22, lineHeight: 32, fontStyle: "italic" }}>{content.insightQuote}</BodyText>
          </View>
        ) : null}

        <View style={{ gap: spacing.sm }}>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>
            A large share of professional speech carries words that can be removed without losing content. Three categories cover most of them.
          </BodyText>

          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#F1C7C7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                <MonoText style={{ color: "#7A1C1C" }}>Throat-clearers</MonoText>
              </View>
              <BodyText style={{ color: palette.inkMuted }}>— basically, essentially, sort of, kind of.</BodyText>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#F1C7C7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                <MonoText style={{ color: "#7A1C1C" }}>Hedges</MonoText>
              </View>
              <BodyText style={{ color: palette.inkMuted }}>— I think maybe, it might be that.</BodyText>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#F1C7C7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                <MonoText style={{ color: "#7A1C1C" }}>Padding</MonoText>
              </View>
              <BodyText style={{ color: palette.inkMuted }}>— at the end of the day, at this point in time.</BodyText>
            </View>
          </View>

          <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{transcript}</BodyText>
        </View>

        <PrimaryButton label="CONTINUE" onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 12) {
    const listenComplete = listenProgress >= 100;
    const audioTotal = content.audioDuration ?? "01:45";
    const totalSeconds = parseAudioDuration(audioTotal);
    const elapsedSeconds = Math.min(totalSeconds, Math.round((listenProgress / 100) * totalSeconds));
    const elapsedLabel = formatListenClock(elapsedSeconds);
    const transcript = content.description ?? "";
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.xs }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 12: REVIEW — FIRST WIN</MonoText>
          <DisplayText style={{ fontSize: 42, lineHeight: 46 }}>Reviewing your{"\n"}progress</DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.lg, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>COACH FEEDBACK</MonoText>
            <MonoText style={{ color: palette.inkMuted }}>{`${elapsedLabel} / ${audioTotal}`}</MonoText>
          </View>
          <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md }}>
            <View style={{ borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.md, backgroundColor: "#fff8f5" }}>
              <EditorialWaveform bars={waveformBars.concat(waveformBars).slice(0, 26)} height={62} light />
              <View style={{ position: "absolute", left: 12, top: 10, backgroundColor: palette.line, paddingHorizontal: 8, paddingVertical: 2 }}>
                <MonoText style={{ color: palette.paper, letterSpacing: 2 }}>TREND</MonoText>
              </View>
              <View style={{ position: "absolute", right: 12, top: 10, backgroundColor: palette.black, paddingHorizontal: 8, paddingVertical: 2 }}>
                <MonoText style={{ color: palette.paper, letterSpacing: 2 }}>SPRINT 3</MonoText>
              </View>
            </View>

            <Pressable onPress={onTogglePlay} style={[styles.audioActionButton, { width: 64, height: 64, backgroundColor: palette.line, alignSelf: "flex-start" }]}>
              <MonoText style={[styles.audioActionLabel, { color: palette.paper }]}>{listenPlaying ? "II" : "▶"}</MonoText>
            </Pressable>
          </View>
        </View>

        {content.insightQuote ? (
          <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
            <BodyText style={{ fontSize: 22, lineHeight: 32, fontStyle: "italic" }}>{content.insightQuote}</BodyText>
          </View>
        ) : null}

        <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{transcript}</BodyText>

        <PrimaryButton label="CONTINUE" onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 13) {
    const listenComplete = listenProgress >= 100;
    const transcript = content.description ?? "";
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.xs }}>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>02 LISTEN</MonoText>
          <DisplayText style={{ fontSize: 42, lineHeight: 46 }}>{content.title ?? "Bottom line up front."}</DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.lg }]}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>COACH_VOICE_v2.wav</MonoText>
          <View style={{ borderWidth: 1, borderColor: palette.lineSoft, padding: spacing.md, backgroundColor: "#FDF6E3" }}>
            <EditorialWaveform bars={waveformBars.concat(waveformBars).slice(0, 28)} height={70} light />
            <View style={{ position: "absolute", left: 10, top: 10, borderWidth: 1, borderColor: palette.lineSoft, backgroundColor: "#fff8f5", paddingHorizontal: 6, paddingVertical: 2 }}>
              <MonoText style={{ color: palette.inkMuted }}>START</MonoText>
            </View>
            <View style={{ position: "absolute", right: 10, top: 10, borderWidth: 1, borderColor: palette.lineSoft, backgroundColor: "#fff8f5", paddingHorizontal: 6, paddingVertical: 2 }}>
              <MonoText style={{ color: palette.inkMuted }}>BLUF DETECTED</MonoText>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: spacing.xl }}>
            <Pressable onPress={() => undefined} style={[styles.outlineBadge, { borderColor: palette.lineSoft }]}>
              <MonoText style={styles.outlineBadgeText}>↺10</MonoText>
            </Pressable>
            <Pressable onPress={onTogglePlay} style={[styles.audioActionButton, { width: 72, height: 72, backgroundColor: palette.black }]}>
              <MonoText style={[styles.audioActionLabel, { color: palette.paper }]}>{listenPlaying ? "II" : "▶"}</MonoText>
            </Pressable>
            <Pressable onPress={() => undefined} style={[styles.outlineBadge, { borderColor: palette.lineSoft }]}>
              <MonoText style={styles.outlineBadgeText}>10↻</MonoText>
            </Pressable>
          </View>
        </View>

        {content.insightQuote ? (
          <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
            <BodyText style={{ fontSize: 22, lineHeight: 32, fontStyle: "italic" }}>{content.insightQuote}</BodyText>
          </View>
        ) : null}

        <View style={{ gap: spacing.xs, alignItems: "flex-end" }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>TRANSCRIPT</MonoText>
        </View>
        <View style={{ borderLeftWidth: 2, borderLeftColor: palette.lineSoft, paddingLeft: spacing.md }}>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{transcript}</BodyText>
        </View>

        <PrimaryButton label="CONTINUE" onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 14) {
    const listenComplete = listenProgress >= 100;
    const transcript = content.description ?? "";
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.xs }}>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>SESSION 14 / STEP 02</MonoText>
          <DisplayText style={{ fontSize: 42, lineHeight: 46 }}>{content.title ?? "Three points, no more"}</DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.md }]}>
          <View style={{ position: "absolute", top: -12, left: 18, borderWidth: 2, borderColor: palette.black, backgroundColor: "#FDF6E3", paddingHorizontal: 10, paddingVertical: 4 }}>
            <MonoText style={{ color: palette.black, letterSpacing: 2 }}>LISTEN</MonoText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <Pressable onPress={onTogglePlay} style={[styles.audioActionButton, { width: 54, height: 54, backgroundColor: palette.black }]}>
              <MonoText style={[styles.audioActionLabel, { color: palette.paper }]}>{listenPlaying ? "II" : "▶"}</MonoText>
            </Pressable>
            <View style={{ flex: 1 }}>
              <EditorialWaveform bars={waveformBars.concat(waveformBars).slice(0, 22)} height={54} light />
            </View>
            <MonoText style={{ color: palette.inkMuted }}>{content.audioDuration ?? "02:45"}</MonoText>
          </View>
        </View>

        {content.insightQuote ? (
          <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
            <BodyText style={{ fontSize: 22, lineHeight: 32, fontStyle: "italic" }}>{content.insightQuote}</BodyText>
          </View>
        ) : null}

        <View style={{ borderLeftWidth: 2, borderLeftColor: palette.lineSoft, paddingLeft: spacing.md }}>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{transcript}</BodyText>
        </View>

        <PrimaryButton label="CONTINUE" onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 15) {
    const listenComplete = listenProgress >= 100;
    const transcript = content.description ?? "";
    return (
      <View style={styles.stepBody}>
        <View style={{ gap: spacing.xs }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 15 · STEP 02 / LISTEN</MonoText>
          <DisplayText style={{ fontSize: 42, lineHeight: 46 }}>{content.title ?? "First, second, finally"}</DisplayText>
        </View>

        {content.insightQuote ? (
          <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg }]}>
            <BodyText style={{ fontSize: 22, lineHeight: 32, fontStyle: "italic" }}>{content.insightQuote}</BodyText>
          </View>
        ) : null}

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.md }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={{ color: palette.inkMuted }}>00:00</MonoText>
            <MonoText style={{ color: palette.inkMuted }}>{content.audioDuration ?? "01:30"}</MonoText>
          </View>
          <Pressable onPress={onTogglePlay} style={[styles.audioActionButton, { width: 72, height: 72, borderRadius: 36, backgroundColor: palette.line, alignSelf: "center" }]}>
            <MonoText style={[styles.audioActionLabel, { color: palette.paper }]}>{listenPlaying ? "II" : "▶"}</MonoText>
          </Pressable>
          <EditorialWaveform bars={waveformBars.concat(waveformBars).slice(0, 26)} height={86} light />
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.sm }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>TRANSCRIPT</MonoText>
            <View style={{ height: 1, flex: 1, backgroundColor: palette.lineSoft }} />
          </View>
          <BodyText style={{ color: palette.inkMuted, lineHeight: 26 }}>{transcript}</BodyText>
        </View>

        <PrimaryButton label="CONTINUE" onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  if (sessionNumber === 16) {
    const listenComplete = listenProgress >= 100;
    const audioTotal = content.audioDuration ?? "03:45";
    const totalSeconds = parseAudioDuration(audioTotal);
    const elapsedSeconds = Math.min(totalSeconds, Math.round((listenProgress / 100) * totalSeconds));
    const elapsedLabel = formatListenClock(elapsedSeconds);
    const transcript = content.description ?? "";
    return (
      <View style={styles.stepBody}>
        <View style={{ alignItems: "center", gap: 2, marginTop: spacing.xs }}>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>SESSION 16</MonoText>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>STEP 02</MonoText>
        </View>

        <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <Icon name="listen" size={18} color={palette.line} />
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>LISTEN</MonoText>
          </View>
          <DisplayText style={{ fontSize: 42, lineHeight: 46 }}>{content.title ?? "Combining clarity tools"}</DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
          <View style={{ padding: spacing.lg, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Pressable onPress={onTogglePlay} style={[styles.audioActionButton, { width: 54, height: 54, backgroundColor: palette.line }]}>
              <MonoText style={[styles.audioActionLabel, { color: palette.paper }]}>{listenPlaying ? "II" : "▶"}</MonoText>
            </Pressable>
            <MonoText style={{ color: palette.inkMuted }}>{`${elapsedLabel} / ${audioTotal}`}</MonoText>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: palette.lineSoft, padding: spacing.lg, gap: spacing.md }}>
            <View style={{ height: 120, borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "#FDF6E3" }}>
              <View style={{ position: "absolute", left: 16, top: 16, backgroundColor: palette.line, paddingHorizontal: 8, paddingVertical: 2 }}>
                <MonoText style={{ color: palette.paper, letterSpacing: 2 }}>FILLER</MonoText>
              </View>
              <View style={{ position: "absolute", left: 140, top: 16, backgroundColor: palette.black, paddingHorizontal: 8, paddingVertical: 2 }}>
                <MonoText style={{ color: palette.paper, letterSpacing: 2 }}>SIGNPOST</MonoText>
              </View>
            </View>
          </View>
        </View>

        <BodyText style={{ color: palette.inkMuted, lineHeight: 26, marginTop: spacing.md }}>
          Skills are easy in isolation and harder in combination. This is dual-task load: each constraint takes attention, and attention is finite. When you attempt to employ a structural signpost while simultaneously eliminating filler words, your cognitive overhead increases exponentially.
        </BodyText>

        {content.insightQuote ? (
          <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md, marginTop: spacing.lg, backgroundColor: "rgba(239,223,216,0.35)", paddingVertical: spacing.md }}>
            <BodyText style={{ fontSize: 22, lineHeight: 32, fontStyle: "italic" }}>{content.insightQuote}</BodyText>
          </View>
        ) : null}

        <BodyText style={{ color: palette.inkMuted, lineHeight: 26, marginTop: spacing.md }}>
          {transcript}
        </BodyText>

        <PrimaryButton label="NEXT STEP" onPress={onNext} disabled={!listenComplete && !UNLOCK_ALL_FOR_TESTING} />
      </View>
    );
  }

  return (
    <View style={styles.stepBody}>
      <View style={styles.listenGrid}>
        <View style={styles.listenLeftColumn}>
          <Panel tone="soft" style={styles.lessonSurface}>
            <View style={styles.lessonTopRow}>
              <View style={{ flex: 1 }} />
              <View style={styles.liveBadge}>
                <MonoText style={styles.liveBadgeText}>LIVE{"\n"}ANALYSIS</MonoText>
              </View>
            </View>

            <View style={styles.waveformPanel}>
              {waveformBars.map((height, index) => (
                <View key={index} style={[styles.waveformBar, { height }]} />
              ))}
            </View>

            <View style={styles.audioControls}>
              <Pressable onPress={onTogglePlay} style={styles.audioActionButton}>
                <MonoText style={styles.audioActionLabel}>{listenPlaying ? "II" : "▶"}</MonoText>
              </Pressable>
              <View style={styles.audioTrack}>
                <View style={[styles.audioTrackProgress, { width: `${listenProgress}%` }]} />
              </View>
              <MonoText>{formatTime(LISTEN_DURATION)}</MonoText>
            </View>
          </Panel>

          <Panel style={styles.insightCard}>
            <MonoText style={styles.insightHeading}>{content.insightTitle}</MonoText>
            <BodyText style={styles.insightQuote}>{content.insightQuote}</BodyText>
          </Panel>
        </View>

        <View style={styles.listenRightColumn}>
          <Panel padded={false} style={styles.transcriptPanel}>
            <View style={styles.transcriptHeader}>
              <MonoText style={styles.transcriptHeaderText}>REAL-TIME TRANSCRIPT</MonoText>
              <MonoText style={styles.transcriptHeaderText}>CC</MonoText>
            </View>
            <View style={styles.transcriptBody}>
              {content.transcriptLines?.length ? (
                content.transcriptLines.map((line, index) =>
                  line.highlighted ? (
                    <View key={index} style={styles.transcriptHighlight}>
                      <DisplayText style={styles.transcriptHighlightTitle}>{content.transcriptHighlight}</DisplayText>
                      <MonoText style={styles.transcriptHighlightMeta}>{line.time}</MonoText>
                      <BodyText style={styles.transcriptFocus}>{line.text}</BodyText>
                    </View>
                  ) : (
                    <BodyText key={index} style={styles.transcriptMuted}>
                      <MonoText style={{ color: palette.line }}>{line.time} </MonoText>
                      {line.text}
                    </BodyText>
                  ),
                )
              ) : (
                <>
                  <BodyText style={styles.transcriptMuted}>{content.description}</BodyText>
                  <View style={styles.transcriptHighlight}>
                    <DisplayText style={styles.transcriptHighlightTitle}>{content.transcriptHighlight}</DisplayText>
                    <MonoText style={styles.transcriptHighlightMeta}>{content.transcriptMeta}</MonoText>
                  </View>
                </>
              )}
            </View>
            <View style={styles.transcriptFooter}>
              <PrimaryButton label="ADD SESSION BOOKMARK" onPress={() => undefined} inverted />
            </View>
          </Panel>
        </View>
      </View>

      <View style={styles.metricGrid}>
        {(content.metrics ?? [
          { label: "CLARITY", value: "—" },
          { label: "PACE", value: "—" },
          { label: "SYNC", value: "—" },
          { label: "SCORE", value: "—" },
        ]).slice(0, 4).map((metric) => (
          <Panel key={metric.label} style={styles.miniMetric}>
            <MonoText style={styles.metricLabel}>{metric.label}</MonoText>
            <MonoText style={styles.metricValue}>{metric.value}</MonoText>
          </Panel>
        ))}
      </View>

      <Panel padded={false} style={styles.figureCard}>
        <View style={styles.figureArt} />
        <View style={styles.figureTag}>
          <MonoText style={styles.figureLabel}>FIG. 02 — STRUCTURAL BREATHING</MonoText>
        </View>
      </Panel>

      <PrimaryButton label="NEXT STEP" onPress={onNext} />
    </View>
  );
}

const sessionOneStyles = StyleSheet.create({
  layout: {
    width: "100%",
    maxWidth: 560,
    gap: spacing.lg,
  },
  playerCard: {
    gap: spacing.md,
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  playerCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  playerTitle: {
    fontSize: 24,
    lineHeight: 28,
    color: palette.line,
  },
  playerDescription: {
    color: palette.inkMuted,
  },
  liveBadge: {
    backgroundColor: palette.line,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  liveBadgeText: {
    color: palette.paper,
    fontSize: 10,
    letterSpacing: 1.6,
  },
  waveformWrap: {
    borderWidth: 1,
    borderColor: palette.lineSoft,
    backgroundColor: palette.panelSoft,
  },
  waveformMeta: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: palette.inkMuted,
    opacity: 0.85,
    textTransform: "uppercase",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  playButton: {
    width: 56,
    height: 56,
    backgroundColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  playButtonLabel: {
    color: palette.paper,
    fontSize: 22,
  },
  progressColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  progressTrack: {
    height: 6,
    backgroundColor: palette.panelSoft,
    borderWidth: 1,
    borderColor: palette.lineSoft,
    position: "relative",
    justifyContent: "center",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: palette.line,
  },
  progressThumb: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: palette.line,
    marginLeft: -6,
    top: -4,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeElapsed: {
    color: palette.inkMuted,
    fontVariant: ["tabular-nums"],
  },
  timeTotal: {
    color: palette.line,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  insightCard: {
    gap: spacing.sm,
  },
  insightKicker: {
    color: "#EBCBBC",
    letterSpacing: 1.2,
  },
  insightQuote: {
    color: palette.paper,
    fontSize: 18,
    lineHeight: 28,
    fontStyle: "italic",
  },
  notesCard: {
    gap: spacing.md,
  },
  notesSection: {
    gap: spacing.sm,
  },
  notesLabel: {
    color: palette.line,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  notesDivider: {
    height: 1,
    backgroundColor: palette.lineSoft,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: palette.line,
    marginTop: 9,
  },
  bulletText: {
    flex: 1,
    color: palette.ink,
    fontFamily: type.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
  },
  passageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  passageDefault: {
    color: palette.ink,
  },
  passageMuted: {
    color: palette.inkMuted,
    opacity: 0.72,
  },
  takeawayCard: {
    gap: spacing.sm,
  },
  takeawayKicker: {
    color: palette.line,
  },
  takeawayBody: {
    color: palette.ink,
  },
  takeawayHint: {
    color: palette.inkMuted,
  },
});
