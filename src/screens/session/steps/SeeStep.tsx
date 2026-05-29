import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel, PrimaryButton } from "../../../design-system/primitives";
import { Icon } from "../../../design-system/icons";
import { hardShadow, palette, spacing, type } from "../../../design-system/theme";
import { InteractivePressable } from "../../../design-system/motion";
import { sessionDefinitions } from "../../../data/mockData";
import { SessionAnalysisStatusBanner } from "../components/SessionAnalysisStatusBanner";
import { resolveLiveSeeData } from "../utils/resolveLiveSeeData";
import type { SessionAnalysisProps } from "../flow/types";
import { RECORD_DURATION, REFLECT_DURATION } from "../constants";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";
import { DottedStageBackground } from "../components/DottedStageBackground";
import { EditorialWaveform } from "../components/EditorialWaveform";
import { PhotoPlaceholder } from "../components/PhotoPlaceholder";
import { SessionProgressStrip } from "../components/SessionProgressStrip";
import { TextHighlight } from "../components/TextHighlight";
import { MetricInsight } from "../components/MetricInsight";

export function SeeStep({
  sessionNumber,
  content,
  overlayOn,
  onReplay,
  onNext,
  sessionElapsed,
  analysis,
}: {
  sessionNumber: number;
  content: (typeof sessionDefinitions)[number]["stages"]["record"];
  overlayOn: boolean;
  onReplay: () => void;
  onNext: () => void;
  sessionElapsed: number;
  analysis?: SessionAnalysisProps;
}) {
  const liveSee = useMemo(
    () => resolveLiveSeeData({ sessionNumber, record: content, analysis }),
    [analysis, content, sessionNumber],
  );

  if (sessionNumber === 1) {
    const metrics = (liveSee.metrics.length ? liveSee.metrics : content.metrics ?? []).slice(0, 3);
    const commentary = liveSee.commentary;
    const displayMetrics =
      metrics.length > 0
        ? metrics
        : [
            { label: "FILLERS", value: "—", description: content.commentary },
            { label: "PACE", value: "—", description: content.environmentCopy, bar: 50 },
            { label: "UPTALK", value: "—", description: content.commentary },
          ];

    const fillersMetric = displayMetrics.find((m) => m.label.toLowerCase().includes("filler"));
    const paceMetric = displayMetrics.find((m) => m.label.toLowerCase().includes("pace"));
    const fillersValue = fillersMetric?.value ?? "—";
    const paceNum = paceMetric?.value ?? "—";
    const fillerLine = commentary.lines?.[0] ?? "Six fillers in ninety seconds. Within the typical first-session range.";
    const paceLine = commentary.lines?.[1] ?? "Pace is optimal for executive delivery. Maintaining 140\u2013150 WPM ensures listeners can process complexity without fatigue.";

    return (
      <View style={styles.stepBody}>
        {/* 6-Bar Progress Strip */}
        <View style={{ flexDirection: "row", gap: 4, height: 12, marginBottom: 32 }}>
          <View style={{ flex: 1, backgroundColor: palette.siennaAccent }} />
          <View style={{ flex: 1, backgroundColor: palette.siennaAccent }} />
          <View style={{ flex: 1, backgroundColor: palette.siennaAccent }} />
          <View style={{ flex: 1, borderWidth: 1, borderColor: palette.siennaAccent, backgroundColor: "transparent" }} />
          <View style={{ flex: 1, borderWidth: 1, borderColor: palette.inkFocus, backgroundColor: "transparent" }} />
          <View style={{ flex: 1, borderWidth: 1, borderColor: palette.inkFocus, backgroundColor: "transparent" }} />
        </View>

        {/* Headline */}
        <View style={{ marginBottom: 24 }}>
          <DisplayText style={{ fontSize: 32, lineHeight: 36, marginBottom: 8 }}>
            04/05 - SEE
          </DisplayText>
          <BodyText style={{ color: palette.onSurfaceVariant }}>
            {content.subline ?? "These numbers describe this ninety seconds, not a trend."}
          </BodyText>
        </View>

        {/* Metric Bento Grid */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
          {/* Filler Metric */}
          <View style={{
            flex: 1,
            backgroundColor: palette.parchmentSurface,
            borderWidth: 2,
            borderColor: palette.inkFocus,
            padding: 20,
            ...hardShadow(palette.siennaAccent, 4),
            justifyContent: "space-between",
            height: 128,
          }}>
            <MonoText style={{ fontSize: 12, color: palette.onSurfaceVariant }}>
              FILLER COUNT
            </MonoText>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
              <MonoText style={{ fontSize: 36, color: palette.siennaAccent }}>
                {fillersValue}
              </MonoText>
              <MonoText style={{ fontSize: 10, color: palette.onSurfaceVariant }}>
                TOTAL
              </MonoText>
            </View>
          </View>

          {/* Pace Metric */}
          <View style={{
            flex: 1,
            backgroundColor: palette.parchmentSurface,
            borderWidth: 2,
            borderColor: palette.inkFocus,
            padding: 20,
            ...hardShadow(palette.siennaAccent, 4),
            justifyContent: "space-between",
            height: 128,
          }}>
            <MonoText style={{ fontSize: 12, color: palette.onSurfaceVariant }}>
              PACE (WPM)
            </MonoText>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
              <MonoText style={{ fontSize: 36, color: palette.siennaAccent }}>
                {paceNum}
              </MonoText>
              <MonoText style={{ fontSize: 10, color: palette.onSurfaceVariant }}>
                STABLE
              </MonoText>
            </View>
          </View>
        </View>

        {/* Commentary Section */}
        <View style={{ gap: 12, marginBottom: 32 }}>
          <View style={{
            flexDirection: "row",
            gap: 16,
            padding: 16,
            borderLeftWidth: 4,
            borderLeftColor: palette.siennaAccent,
            backgroundColor: palette.surfaceContainerLow,
          }}>
            <View style={{ width: 24, height: 24, backgroundColor: palette.siennaAccent, alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 14, height: 14, borderWidth: 2, borderColor: palette.parchmentSurface, borderRadius: 999 }} />
              <View style={{ position: "absolute", width: 6, height: 6, borderRadius: 999, backgroundColor: palette.parchmentSurface }} />
            </View>
            <BodyText style={{ flex: 1, color: palette.onSurface }}>
              {fillerLine}
            </BodyText>
          </View>

          <View style={{
            flexDirection: "row",
            gap: 16,
            padding: 16,
            borderLeftWidth: 4,
            borderLeftColor: palette.sageSuccess,
            backgroundColor: palette.surfaceContainerLow,
          }}>
            <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 20, height: 20, borderWidth: 2, borderColor: palette.sageSuccess, borderRadius: 999 }} />
              <View style={{ position: "absolute", width: 8, height: 8, backgroundColor: palette.sageSuccess, borderRadius: 999 }} />
            </View>
            <BodyText style={{ flex: 1, color: palette.onSurface }}>
              {paceLine}
            </BodyText>
          </View>
        </View>

        {/* Pyramid */}
        <View style={{ marginBottom: 32 }}>
          <MonoText style={{ fontSize: 12, color: palette.onSurfaceVariant, marginBottom: 16, letterSpacing: 1 }}>
            ARGUMENT STRUCTURE
          </MonoText>
          <View style={{
            width: "100%",
            aspectRatio: 16 / 9,
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: palette.surfaceContainerHighest,
            opacity: 0.92,
            borderWidth: 1,
            borderColor: palette.outlineVariant,
            padding: 16,
          }}>
            <View style={{ width: 192, height: 160, justifyContent: "flex-end" }}>
              <View style={{
                width: 48, height: 40,
                backgroundColor: palette.outline,
                alignSelf: "center",
                marginBottom: 4,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <MonoText style={{ fontSize: 8, color: palette.parchmentSurface }}>CONC</MonoText>
              </View>
              <View style={{
                width: 128, height: 40,
                backgroundColor: palette.siennaAccent,
                alignSelf: "center",
                marginBottom: 4,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <MonoText style={{ fontSize: 8, color: palette.parchmentSurface }}>SUPPORT 01 & 02</MonoText>
              </View>
              <View style={{
                width: 192, height: 40,
                backgroundColor: palette.siennaAccent,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <MonoText style={{ fontSize: 8, color: palette.parchmentSurface }}>FOUNDATION</MonoText>
              </View>
            </View>
          </View>
        </View>

        {/* Primary Action */}
        <InteractivePressable onPress={onNext}>
          <View style={{
            backgroundColor: palette.siennaAccent,
            paddingVertical: 24,
            paddingHorizontal: 32,
            borderWidth: 2,
            borderColor: palette.inkFocus,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            ...hardShadow(palette.siennaAccent, 4),
          }}>
            <MonoText style={{ color: palette.parchmentSurface, fontSize: 16, letterSpacing: 1 }}>
              COMMIT TO JOURNEY
            </MonoText>
            <Icon name="arrow" size={26} color={palette.parchmentSurface} />
          </View>
        </InteractivePressable>
      </View>
    );
  }

  if (sessionNumber === 6) {
    return (
      <View style={styles.stepBody}>
        <DottedStageBackground>
          <View style={{ padding: spacing.lg, gap: spacing.lg }}>
            <Panel style={{ gap: spacing.sm }}>
              <MonoText style={{ color: palette.inkMuted }}>SESSION 6 REVIEW</MonoText>
              <BodyText style={{ color: palette.inkMuted }}>Sprint 1 Trend Reveal</BodyText>
              <PrimaryButton label="SHARE INSIGHT" onPress={() => undefined} />
            </Panel>

            <Panel style={{ gap: spacing.sm }}>
              <MonoText style={styles.metricLabel}>AGGREGATE SCORE</MonoText>
              <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>Clarity Score</DisplayText>
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: spacing.md }}>
                <DisplayText style={{ fontSize: 72, lineHeight: 72, color: palette.line }}>72</DisplayText>
                <View style={{ backgroundColor: "#F5D4C6", paddingHorizontal: 8, paddingVertical: 6 }}>
                  <MonoText>↑ +12% vs S5</MonoText>
                </View>
              </View>
              <BodyText>Your highest clarity mark since Sprint 1 kickoff. Technical articulation is peaking.</BodyText>
            </Panel>

            <Panel style={{ gap: spacing.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                  <MonoText style={styles.metricLabel}>SPEECH PATTERNS</MonoText>
                  <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>Filler Trajectory</DisplayText>
                </View>
                <MonoText>Session 1-5</MonoText>
              </View>
              <View style={{ height: 180, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: palette.line, paddingLeft: spacing.sm, paddingBottom: spacing.sm, justifyContent: "flex-end" }}>
                <View style={{ position: "absolute", left: 8, right: 8, top: 18, bottom: 18 }}>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
                    {[0.72, 0.58, 0.67, 0.26, 0.1].map((point, index) => (
                      <View key={index} style={{ alignItems: "center", flex: 1 }}>
                        <View style={{ width: 2, height: `${point * 100}%`, backgroundColor: "transparent" }} />
                        <View style={{ position: "absolute", bottom: `${point * 100}%`, width: 8, height: 8, borderRadius: 0, backgroundColor: palette.line }} />
                      </View>
                    ))}
                  </View>
                  <View style={{ position: "absolute", left: 26, right: 26, bottom: 30, height: 2, backgroundColor: palette.line, transform: [{ rotate: "-24deg" }] }} />
                  <View style={{ position: "absolute", left: 84, right: 84, bottom: 56, height: 2, backgroundColor: palette.line, transform: [{ rotate: "18deg" }] }} />
                  <View style={{ position: "absolute", left: 136, right: 42, bottom: 48, height: 2, backgroundColor: palette.line, transform: [{ rotate: "-34deg" }] }} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm }}>
                  {["S1", "S2", "S3", "S4", "S5"].map((label) => (
                    <MonoText key={label}>{label}</MonoText>
                  ))}
                </View>
              </View>
              <BodyText style={{ fontStyle: "italic", color: palette.inkMuted }}>
                {"\u201C"}Notice the sharp decline in 'um/ah' usage during Session 4. Stability is normalizing.{"\u201D"}
              </BodyText>
            </Panel>

            <Panel style={{ gap: spacing.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>PACE{"\n"}STABILITY</DisplayText>
                <MonoText>WPM Consistency</MonoText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 140 }}>
                {[
                  ["MON", 78, "#EAD9C7"],
                  ["TUE", 92, palette.paper],
                  ["WED", 96, palette.line],
                  ["THU", 66, "#EAD9C7"],
                  ["FRI", 88, palette.paper],
                ].map(([day, barHeight, color]) => (
                  <View key={day as string} style={{ alignItems: "center", gap: spacing.sm }}>
                    <View style={{ width: 34, height: barHeight as number, borderWidth: 1, borderColor: palette.line, backgroundColor: color as string }} />
                    <MonoText>{day as string}</MonoText>
                  </View>
                ))}
              </View>
            </Panel>

            <Panel tone="ink" style={{ gap: spacing.sm }}>
              <MonoText style={{ color: "#E8B29A" }}>CRITICAL INSIGHT</MonoText>
              <DisplayText style={{ fontSize: 30, lineHeight: 34, color: "#F4D1C4" }}>Downward Inflection{"\n"}Trend</DisplayText>
              <BodyText style={{ color: "#F4D1C4" }}>
                You are ending sentences with more authority. The "rising inflection" (upspeak) has decreased by <BodyText style={{ color: "#F4D1C4", fontFamily: type.bodyMedium }}>22%</BodyText> this sprint.
              </BodyText>
            </Panel>

            <Panel tone="soft" style={{ gap: spacing.md }}>
              <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>What did you notice?</DisplayText>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <View style={{ flex: 1, borderWidth: 1, borderColor: palette.lineSoft, paddingHorizontal: spacing.md, paddingVertical: 14, backgroundColor: palette.paper }}>
                  <BodyText style={{ color: palette.inkMuted }}>Add your observation...</BodyText>
                </View>
                <Pressable onPress={onNext} style={{ width: 56, backgroundColor: palette.line, alignItems: "center", justifyContent: "center" }}>
                  <MonoText style={{ color: palette.paper }}>▶</MonoText>
                </Pressable>
              </View>
            </Panel>

            <View style={{ gap: spacing.sm }}>
              <MonoText style={{ color: palette.inkMuted }}>SPRINT 1 FLASHBACKS</MonoText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
                {[0, 1, 2, 3].map((index) => (
                  <View key={index} style={{ width: "47%" }}>
                    <PhotoPlaceholder height={82} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </DottedStageBackground>
      </View>
    );
  }

  if (sessionNumber === 7) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 07</MonoText>
          </View>
          <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>CUTTING FILLERS</DisplayText>
        </Panel>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <Panel style={{ flex: 0.58, gap: spacing.md }}>
            <MonoText style={styles.metricLabel}>COACH INSIGHTS</MonoText>
            <BodyText style={{ color: palette.ink, fontSize: 22, lineHeight: 30 }}>
              “Two fillers in 60 seconds. A real drop from your baseline. Your pause structure is evolving from hesitation
              into intentional silence.”
            </BodyText>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <View style={styles.outlineBadge}>
                <MonoText style={styles.outlineBadgeText}>-40% FILLER RATE</MonoText>
              </View>
              <View style={styles.outlineBadge}>
                <MonoText style={styles.outlineBadgeText}>ELITE TIER</MonoText>
              </View>
            </View>
          </Panel>

          <Panel tone="soft" style={{ flex: 0.42, gap: spacing.md }}>
            <MonoText style={styles.metricLabel}>FILLER COUNT</MonoText>
            <DisplayText style={{ fontSize: 64, lineHeight: 64 }}>02</DisplayText>
            <MonoText>TOTAL OCCURRENCES</MonoText>
          </Panel>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <Panel style={{ flex: 1, gap: spacing.md }}>
            <MonoText style={styles.metricLabel}>SPEAKING PACE</MonoText>
            <DisplayText style={{ fontSize: 48, lineHeight: 50 }}>142 WPM</DisplayText>
            <View style={{ height: 10, borderWidth: 2, borderColor: palette.line }}>
              <View style={{ width: "71%", height: "100%", backgroundColor: palette.line }} />
            </View>
          </Panel>
          <Panel tone="soft" style={{ flex: 1, gap: spacing.md }}>
            <MonoText style={styles.metricLabel}>TIME-ON-TARGET</MonoText>
            <DisplayText style={{ fontSize: 48, lineHeight: 50 }}>94%</DisplayText>
            <BodyText>Duration spent with zero linguistic fillers.</BodyText>
          </Panel>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <PrimaryButton label="REVIEW CLIP" onPress={onReplay} inverted />
          <PrimaryButton label="CONTINUE TO FINAL STEP" onPress={onNext} />
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
          <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>PERFORMANCE{"\n"}ANALYSIS</DisplayText>
        </View>

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <BodyText style={{ fontSize: 22, lineHeight: 34, color: palette.ink }}>
            “You maintained 142 WPM — a highly authoritative and measured cadence.”
          </BodyText>
        </Panel>

        <Panel style={{ gap: spacing.md }}>
          <MonoText style={{ color: palette.line }}>WPM MEAN</MonoText>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: spacing.sm }}>
            <DisplayText style={{ fontSize: 62, lineHeight: 62, color: palette.line }}>142</DisplayText>
            <MonoText>WORDS / MIN</MonoText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, height: 92 }}>
            {[52, 58, 54, 62, 60, 61, 64, 60, 56, 58].map((bar, index) => (
              <View key={index} style={{ flex: 1, height: bar, backgroundColor: index === 6 ? "#6E1E08" : "#9E3B17" }} />
            ))}
          </View>
        </Panel>

        <Panel style={{ alignItems: "center", gap: spacing.md }}>
          <MonoText style={{ color: palette.line }}>TIME-IN-ZONE</MonoText>
          <View style={{ width: 150, height: 150, borderRadius: 0, backgroundColor: palette.line, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#5A1604" }}>
            <DisplayText style={{ color: palette.paper, fontSize: 34, lineHeight: 38 }}>88%</DisplayText>
          </View>
          <MonoText>TARGET CADENCE MET</MonoText>
        </Panel>

        <Panel style={{ gap: spacing.sm }}>
          <DisplayText style={{ fontSize: 22, lineHeight: 26 }}>PACE VARIANCE</DisplayText>
          <BodyText>Minimal deviation detected. Consistent flow.</BodyText>
          <View style={{ flexDirection: "row", gap: spacing.lg }}>
            <View>
              <MonoText style={styles.metricLabel}>VARIANCE</MonoText>
              <MonoText>± 4.2%</MonoText>
            </View>
            <View>
              <MonoText style={styles.metricLabel}>SESSION</MonoText>
              <MonoText>08:24</MonoText>
            </View>
          </View>
        </Panel>

        <PrimaryButton label="NEXT: DEEP REFLECTION" onPress={onNext} />
        <PrimaryButton label="RETAKE MEASUREMENT" onPress={onReplay} inverted />
        <PhotoPlaceholder height={182} />
      </View>
    );
  }

  if (sessionNumber === 9) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={{ alignSelf: "flex-end", backgroundColor: palette.line, paddingHorizontal: 10, paddingVertical: 6 }}>
            <MonoText style={{ color: palette.paper }}>STEP 04</MonoText>
          </View>
          <MonoText style={{ color: palette.inkMuted }}>SESSION 9: POWER PAUSES</MonoText>
          <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>SEE THE SILENCE</DisplayText>
          <BodyText>
            Three pauses hit. Notice how the silence created room for your next point to land. Your rhythm is becoming an instrument of clarity.
          </BodyText>
        </Panel>

        <Panel style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText>PAUSE COUNT</MonoText>
            <MonoText>3</MonoText>
          </View>
          <DisplayText style={{ fontSize: 62, lineHeight: 62, color: palette.line }}>03</DisplayText>
          <MonoText>INTENTIONAL STOPS</MonoText>
        </Panel>

        <Panel style={{ gap: spacing.md }}>
          <MonoText>AVG. PAUSE LENGTH</MonoText>
          <DisplayText style={{ fontSize: 58, lineHeight: 60, color: palette.line }}>2.4 SEC</DisplayText>
          <View style={{ height: 12, borderWidth: 1, borderColor: palette.line }}>
            <View style={{ width: "66%", height: "100%", backgroundColor: palette.line }} />
          </View>
        </Panel>

        <Panel style={{ gap: spacing.md }}>
          <MonoText>CURRENT PACE</MonoText>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: spacing.xs }}>
            <DisplayText style={{ fontSize: 56, lineHeight: 58, color: palette.line }}>132</DisplayText>
            <MonoText>WPM</MonoText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, height: 96 }}>
            {[36, 52, 68, 84, 66, 54, 40, 24, 42, 58].map((bar, index) => (
              <View key={index} style={{ flex: 1, height: bar, backgroundColor: "#9E3B17" }} />
            ))}
          </View>
        </Panel>

        <Panel padded={false} style={{ overflow: "hidden" }}>
          <View style={{ backgroundColor: palette.line, paddingHorizontal: spacing.md, paddingVertical: 8 }}>
            <MonoText style={{ color: palette.paper }}>SPEECH WAVEFORM ANALYSIS</MonoText>
          </View>
          <View style={{ minHeight: 180, padding: spacing.md, justifyContent: "space-between", backgroundColor: palette.paper }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <View style={{ position: "absolute", left: 0, right: 0, top: 16, bottom: 16, opacity: 0.18 }}>
                {Array.from({ length: 28 }).map((_, index) => (
                  <View key={index} style={{ position: "absolute", left: `${index * 3.6}%`, top: 0, bottom: 0, width: 1, backgroundColor: palette.line }} />
                ))}
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                {["PAUSE A", "PAUSE B", "PAUSE C"].map((label) => (
                  <View key={label} style={{ alignItems: "center", gap: spacing.xs }}>
                    <View style={{ width: 2, height: 56, backgroundColor: palette.line }} />
                    <MonoText>{label}</MonoText>
                  </View>
                ))}
              </View>
            </View>
            <BodyText style={{ fontStyle: "italic", color: palette.inkMuted }}>
              “Notice the clean break at 0:14. This is where your message resonance peaked.”
            </BodyText>
            <PrimaryButton label="REPLAY CLIP" onPress={onReplay} />
          </View>
        </Panel>

        <PrimaryButton label="PREVIOUS STEP" onPress={onReplay} inverted />
        <PrimaryButton label="NEXT: FINAL REFINEMENT" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 10) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <MonoText style={{ color: palette.line }}>SESSION 10 • STEP 04</MonoText>
            <MonoText style={{ color: palette.inkMuted }}>AUDIO STRUCTURAL TRACE</MonoText>
          </View>
          <DisplayText style={{ fontSize: 30, lineHeight: 34 }}>Performance Analysis</DisplayText>
          <BodyText style={{ fontSize: 20, lineHeight: 32 }}>{content.commentary}</BodyText>
        </Panel>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <Panel tone="ink" style={{ flex: 0.48, gap: spacing.sm }}>
            <MonoText style={{ color: "#E8C2B2" }}>INFLECTION RATE</MonoText>
            <DisplayText style={{ fontSize: 60, lineHeight: 60, color: palette.paper }}>84%</DisplayText>
            <MonoText style={{ color: "#E8C2B2" }}>AUTHORITATIVE ENDINGS</MonoText>
          </Panel>
          <Panel style={{ flex: 0.52, gap: spacing.md }}>
            <MonoText style={styles.metricLabel}>PITCH VARIANCE</MonoText>
            <View style={{ height: 120, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: palette.line, paddingBottom: spacing.sm }}>
              <View style={{ position: "absolute", left: 10, right: 10, top: 18, bottom: 24 }}>
                {[0.64, 0.58, 0.61, 0.52, 0.48, 0.56, 0.62, 0.6].map((point, index) => (
                  <View key={index} style={{ position: "absolute", left: `${index * 12}%`, bottom: `${point * 100}%`, width: 8, height: 8, borderRadius: 0, backgroundColor: palette.line }} />
                ))}
                <View style={{ position: "absolute", left: "6%", right: "20%", bottom: "59%", height: 2, backgroundColor: palette.line, transform: [{ rotate: "-12deg" }] }} />
                <View style={{ position: "absolute", left: "38%", right: "6%", bottom: "47%", height: 2, backgroundColor: palette.line, transform: [{ rotate: "10deg" }] }} />
              </View>
            </View>
            <MonoText>Pitch Variance (12%)</MonoText>
          </Panel>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <Panel tone="soft" style={{ flex: 1, gap: spacing.xs }}>
            <MonoText style={styles.metricLabel}>PITCH VARIANCE</MonoText>
            <DisplayText style={{ fontSize: 30, lineHeight: 34 }}>12%</DisplayText>
          </Panel>
          <Panel tone="soft" style={{ flex: 1, gap: spacing.xs }}>
            <MonoText style={styles.metricLabel}>PACE</MonoText>
            <DisplayText style={{ fontSize: 30, lineHeight: 34 }}>142 WPM</DisplayText>
          </Panel>
        </View>

        <Panel style={{ gap: spacing.md }}>
          <MonoText style={styles.metricLabel}>COACH COMMENTARY</MonoText>
          <BodyText>{content.commentary}</BodyText>
          <PrimaryButton label={overlayOn ? "HIDE OVERLAY" : "REPLAY WITH OVERLAY"} onPress={onReplay} />
        </Panel>

        <PhotoPlaceholder height={152} label={content.environment} />
        <PrimaryButton label="CONTINUE TO FINAL STEP" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 11) {
    return (
      <View style={styles.stepBody}>
        <MonoText style={{ color: palette.line }}>SESSION 11</MonoText>

        <Panel style={{ gap: spacing.sm }}>
          <MonoText style={styles.metricLabel}>BREVITY SCORE</MonoText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <DisplayText style={{ fontSize: 52, lineHeight: 56 }}>72%</DisplayText>
            <BodyText style={{ color: "#7D8D79" }}>▲ 12% vs last session</BodyText>
          </View>
        </Panel>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <Panel style={{ flex: 1, gap: spacing.xs }}>
            <MonoText style={styles.metricLabel}>SPEAKING PACE</MonoText>
            <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>138 <MonoText>WPM</MonoText></DisplayText>
          </Panel>
          <Panel style={{ flex: 1, gap: spacing.xs }}>
            <MonoText style={styles.metricLabel}>TIME USED</MonoText>
            <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>28 <MonoText>Seconds</MonoText></DisplayText>
            <BodyText style={{ color: "#7D8D79" }}>Target &lt; 30s</BodyText>
          </Panel>
        </View>

        <View style={{ gap: spacing.md }}>
          <MonoText style={{ color: palette.line }}>STRUCTURAL ANALYSIS</MonoText>
          {[
            ["#98A290", "STRONG OPENING", "Your first 5 seconds established immediate clarity."],
            [palette.line, "ELIMINATED FILLERS", "Zero usage of \"like\" or \"actually\" detected."],
            ["#D9C3B8", "CLOSING LOOP", "Consider a punchier final call to action next time."],
          ].map(([dot, title, copy]) => (
            <Panel key={title as string} style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <View style={{ width: 10, height: 10, borderRadius: 0, backgroundColor: dot as string }} />
                <MonoText style={{ color: title === "CLOSING LOOP" ? palette.inkMuted : palette.line }}>{title as string}</MonoText>
              </View>
              <BodyText>{copy as string}</BodyText>
            </Panel>
          ))}
        </View>

        <View style={{ gap: spacing.md }}>
          <MonoText style={{ color: palette.line }}>TRANSCRIPT INSIGHT</MonoText>
          <Panel tone="soft" style={{ gap: spacing.sm }}>
            <BodyText>
              "The current project roadmap <BodyText style={{ color: palette.line, fontFamily: type.bodyMedium }}>is clear</BodyText>. By prioritizing the Q4 objectives, we ensure <BodyText style={{ color: palette.line, fontFamily: type.bodyMedium }}>direct stakeholder alignment</BodyText> without resource dilution."
            </BodyText>
          </Panel>
        </View>

        <PrimaryButton label="REPLAY AUDIO" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 12) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 12 · SPRINT 2 REVIEW</MonoText>
          </View>
          <DisplayText style={{ fontSize: 44, lineHeight: 50, textTransform: "uppercase" }}>FIRST WIN</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>
            The goal isn’t perfect. It’s measurable. You’re now consistent enough to build structure under pressure.
          </BodyText>
        </Panel>

        <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
          <Panel style={{ flexGrow: 1, flexBasis: 160, gap: spacing.xs }}>
            <MonoText style={styles.metricLabel}>CLARITY SCORE</MonoText>
            <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>94%</DisplayText>
          </Panel>
          <Panel style={{ flexGrow: 1, flexBasis: 160, gap: spacing.xs }}>
            <MonoText style={styles.metricLabel}>FILLERS / MIN</MonoText>
            <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>1.2</DisplayText>
          </Panel>
          <Panel style={{ flexGrow: 1, flexBasis: 160, gap: spacing.xs }}>
            <MonoText style={styles.metricLabel}>PACE BAND</MonoText>
            <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>145</DisplayText>
            <MonoText style={{ color: palette.inkMuted }}>WPM</MonoText>
          </Panel>
        </View>

        <Panel tone="ink" style={{ gap: spacing.sm }}>
          <MonoText style={{ color: "#F4DFD6", letterSpacing: 2 }}>NEXT MODULE UNLOCKED</MonoText>
          <DisplayText style={{ fontSize: 22, lineHeight: 26, color: palette.paper, textTransform: "uppercase" }}>
            Advanced Rhetoric
          </DisplayText>
          <BodyText style={{ color: "#F4DFD6" }}>
            Master persuasive pacing and “Strategic Silence” to command any room.
          </BodyText>
          <PrimaryButton label="CONTINUE TO FINAL STEP" onPress={onNext} inverted />
        </Panel>
      </View>
    );
  }

  if (sessionNumber === 16) {
    return (
      <View style={styles.stepBody}>
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SEE PHASE</MonoText>
        <DisplayText style={{ fontSize: 40, lineHeight: 46 }}>Stacked Constraints{"\n"}Analysis</DisplayText>
        <BodyText style={{ color: palette.inkMuted }}>
          Evaluation of your ability to maintain BLUF, structure, and timing under cognitive load.
        </BodyText>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { paddingVertical: spacing.xl, alignItems: "center", marginTop: spacing.lg }]}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>COMPOSITE SCORE</MonoText>
          <DisplayText style={{ fontSize: 84, lineHeight: 84 }}>82%</DisplayText>
          <View style={{ marginTop: spacing.sm, borderRadius: 0, paddingHorizontal: spacing.lg, paddingVertical: 6, backgroundColor: "rgba(151,194,151,0.25)", borderWidth: 1, borderColor: "#A7C6A7" }}>
            <MonoText style={{ color: palette.inkMuted }}>↗ +4% from last session</MonoText>
          </View>
        </View>

        {[
          { kicker: "BLUF", main: "Pass", sub: "Established in 4s", icon: "✓" },
          { kicker: "STRUCTURE", main: "2/3", sub: "Point 3 merged into conclusion", icon: "⚠" },
          { kicker: "TIMING", main: "58s", sub: "Target: < 60s", icon: "✓" },
        ].map((card) => (
          <View key={card.kicker} style={[styles.brutalistPanel, styles.brutalistShadowInk, { backgroundColor: "#fff8f5", marginTop: spacing.md }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>{card.kicker}</MonoText>
              <MonoText style={{ color: palette.inkMuted }}>{card.icon}</MonoText>
            </View>
            <DisplayText style={{ fontSize: 30, lineHeight: 34, fontFamily: type.mono }}>{card.main}</DisplayText>
            <BodyText style={{ color: palette.inkMuted }}>{card.sub}</BodyText>
          </View>
        ))}

        <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md, marginTop: spacing.lg, backgroundColor: "rgba(239,223,216,0.35)", paddingVertical: spacing.md }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>FORENSIC ANALYSIS</MonoText>
          <BodyText style={{ fontStyle: "italic", lineHeight: 28, marginTop: spacing.sm }}>
            “Strong initial framing. The BLUF constraint held perfectly under pressure. However, cognitive load caused structural slippage around the 45-second mark, causing the final point to collapse into the conclusion. Timing discipline remains excellent.”
          </BodyText>
        </View>

        <PrimaryButton label="CONTINUE TO STEP 5" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 13) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 13 · ANALYSIS</MonoText>
          </View>
          <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>Time to Conclusion</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>
            BLUF measured. The question is whether the conclusion landed before the listener started guessing.
          </BodyText>
        </Panel>

        <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
          <Panel tone="soft" style={{ flexGrow: 1, flexBasis: 160, gap: spacing.xs }}>
            <MonoText style={styles.metricLabel}>TIME TO CLARITY</MonoText>
            <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>15s</DisplayText>
          </Panel>
          <Panel tone="soft" style={{ flexGrow: 1, flexBasis: 160, gap: spacing.xs }}>
            <MonoText style={styles.metricLabel}>BLUF LIMIT</MonoText>
            <DisplayText style={{ fontSize: 32, lineHeight: 36, color: "#B91C1C" }}>08s</DisplayText>
          </Panel>
        </View>

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <MonoText style={styles.metricLabel}>COACH COMMENTARY</MonoText>
          <BodyText>{content.commentary}</BodyText>
        </Panel>

        <PrimaryButton label="REPLAY SEGMENT" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 14) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 14 · ANALYSIS</MonoText>
          </View>
          <DisplayText style={{ fontSize: 44, lineHeight: 50, textTransform: "uppercase" }}>Analysis</DisplayText>
        </Panel>

        <Panel style={{ gap: spacing.sm }}>
          <MonoText style={styles.metricLabel}>BREVITY SCORE</MonoText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <DisplayText style={{ fontSize: 52, lineHeight: 56 }}>78%</DisplayText>
            <BodyText style={{ color: palette.inkMuted }}>Good triads, tighter endings.</BodyText>
          </View>
        </Panel>

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <MonoText style={styles.metricLabel}>TRANSCRIPT INSIGHT</MonoText>
          <BodyText style={{ color: palette.inkMuted }}>
            The listener stayed oriented when you used three clear markers. Keep the third point as short as the first.
          </BodyText>
        </Panel>

        <PrimaryButton label="CONTINUE TO COMMIT" onPress={onNext} />
      </View>
    );
  }

  if (sessionNumber === 15) {
    return (
      <View style={styles.stepBody}>
        <Panel style={{ gap: spacing.md }}>
          <View style={styles.outlineBadge}>
            <MonoText style={styles.outlineBadgeText}>SESSION 15 · ANALYSIS</MonoText>
          </View>
          <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>Signposting check</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>
            When you say “First / Second / Finally”, the listener relaxes. You’re guiding them through the structure.
          </BodyText>
        </Panel>

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <MonoText style={styles.metricLabel}>DETECTED SIGNPOSTS</MonoText>
          <DisplayText style={{ fontSize: 32, lineHeight: 36 }}>1 / 3</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>
            Aim for three markers. The third is where most speakers drift.
          </BodyText>
        </Panel>

        <PrimaryButton label="CONTINUE TO COMMIT" onPress={onNext} />
      </View>
    );
  }

  const metrics = (liveSee.metrics.length ? liveSee.metrics : content.metrics ?? []).slice(0, 3);
  const displayMetrics =
    metrics.length > 0
      ? metrics
      : [
          { label: "FILLERS", value: "—", description: content.commentary },
          { label: "PACE", value: "—", description: content.environmentCopy, bar: 50 },
          { label: "CLARITY", value: "—", description: content.commentary },
        ];

  return (
    <View style={styles.stepBody}>
      <SessionAnalysisStatusBanner isProcessing={liveSee.isProcessing} error={liveSee.error} />
      <View style={styles.feedbackMetrics}>
        {displayMetrics.map((metric) => (
          <MetricInsight
            key={metric.label}
            title={metric.label}
            copy={metric.description ?? metric.foot ?? content.commentary}
            value={metric.value}
            foot={metric.unit ?? metric.delta ?? ""}
            filled={Boolean(metric.bar && metric.bar > 50)}
            wide={metric.label.toLowerCase().includes("pace")}
            narrow={metric.label.toLowerCase().includes("uptalk") || metric.label.toLowerCase().includes("filler")}
          />
        ))}
      </View>

      <Panel tone="soft" style={styles.quoteBox}>
        <MonoText style={styles.metricLabel}>EXPERT COMMENTARY</MonoText>
        <BodyText style={styles.commentaryQuote}>{liveSee.coachNote ?? content.commentary}</BodyText>
      </Panel>

      <View style={styles.feedbackActions}>
        <PrimaryButton label={overlayOn ? "HIDE OVERLAY" : "REPLAY WITH OVERLAY"} onPress={onReplay} />
        <PrimaryButton label="NEXT STEP" onPress={onNext} inverted />
      </View>

      <View style={styles.environmentRow}>
        <Panel padded={false} style={styles.environmentFigure}>
          <View style={[styles.figureArt, overlayOn && styles.figureArtOverlay]} />
          <View style={styles.environmentBadge}>
            <MonoText style={styles.figureLabel}>{content.environment}</MonoText>
          </View>
        </Panel>
        <BodyText style={styles.environmentCopy}>
          {content.environmentCopy}
        </BodyText>
      </View>
    </View>
  );
}
