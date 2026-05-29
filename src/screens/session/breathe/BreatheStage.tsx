/** @deprecated Unused — centre routing lives in SessionFlowScreen + CentreStep. Kept as design reference for sessions 6–11. */
import React from "react";
import { View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel, PrimaryButton } from "../../../design-system/primitives";
import { palette, spacing, type } from "../../../design-system/theme";
import { BreathPulse } from "../../../design-system/motion";
import { sessionDefinitions, type SessionStage } from "../../../data/mockData";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";
import { DottedStageBackground } from "../components/DottedStageBackground";
import { SessionFlowShell } from "../components/SessionFlowShell";
import { EditorialWaveform } from "../components/EditorialWaveform";

export type BreatheStageProps = {
  sessionNumber: number;
  stage: SessionStage;
  stepIndex: number;
  sessionContent: (typeof sessionDefinitions)[number];
  breathElapsed: number;
  isBreathRunning: boolean;
  onJumpToStep?: (stepIndex: number) => void;
  onBack: () => void;
  onExit: () => void;
  onNext: () => void;
  setIsBreathRunning: (running: boolean) => void;
};

type BreatheStageBodyProps = Pick<
  BreatheStageProps,
  "sessionNumber" | "sessionContent" | "breathElapsed" | "isBreathRunning" | "onNext" | "setIsBreathRunning"
>;

export function BreatheStageBody({
  sessionNumber,
  sessionContent,
  breathElapsed,
  isBreathRunning,
  onNext,
  setIsBreathRunning,
}: BreatheStageBodyProps) {
  if (sessionNumber === 6) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.xs, marginTop: spacing.sm }}>
              <MonoText style={{ color: palette.line }}>01/05</MonoText>
              <DisplayText style={{ fontSize: 32, lineHeight: 36, textTransform: "uppercase" }}>01 RESET</DisplayText>
              <View style={{ borderBottomWidth: 2, borderColor: palette.line, paddingBottom: 4 }}>
                <BodyText style={{ fontSize: 18, color: palette.inkMuted }}>Session 6: Review</BodyText>
              </View>
            </View>

            <Panel style={{ gap: spacing.md }}>
              <MonoText style={{ color: palette.line, fontSize: 18 }}>✧✧</MonoText>
              <DisplayText style={{ fontSize: 28, lineHeight: 32 }}>The Observation</DisplayText>
              <BodyText style={{ fontSize: 18, lineHeight: 30, color: palette.inkMuted }}>
                “You have built something measurable. Today you see it.”
              </BodyText>
              <MonoText style={{ color: palette.inkMuted }}>SPRINT 1 • FINAL PHASE</MonoText>
            </Panel>

            <Panel tone="soft" style={{ alignItems: "center", paddingVertical: spacing.xl }}>
              <View style={{ width: 260, height: 260, alignItems: "center", justifyContent: "center" }}>
                <View style={{ position: "absolute", width: 260, height: 260, borderRadius: 999, borderWidth: 2, borderColor: "#E7D4C4" }} />
                <View style={{ position: "absolute", width: 198, height: 198, borderRadius: 999, borderWidth: 2, borderColor: "#DCC5B1" }} />
                <MonoText style={{ color: palette.line, fontSize: 24, letterSpacing: 3 }}>{breathElapsed >= 15 ? "READY" : "INHALE"}</MonoText>
                <View style={{ width: 96, height: 8, borderWidth: 2, borderColor: palette.line, marginTop: spacing.md }}>
                  <View style={{ width: `${Math.min(100, Math.round((breathElapsed / 15) * 100))}%`, height: "100%", backgroundColor: palette.line }} />
                </View>
              </View>
            </Panel>

            <Panel style={{ gap: spacing.md }}>
              <View style={{ borderBottomWidth: 1, borderColor: "#E2D8CE", paddingBottom: spacing.sm }}>
                <MonoText style={{ color: palette.line }}>PREPARATION</MonoText>
              </View>
              {sessionContent.stages.breathe.levels?.map((level, index) => (
                <View
                  key={level.label}
                  style={{
                    flexDirection: "row",
                    gap: spacing.md,
                    paddingTop: index === 0 ? 0 : spacing.md,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderColor: "#E2D8CE",
                  }}
                >
                  <MonoText style={{ color: palette.line, minWidth: 30 }}>{level.label}</MonoText>
                  <BodyText style={{ flex: 1, fontSize: 18, lineHeight: 30 }}>{level.description}</BodyText>
                </View>
              ))}
            </Panel>

            <PrimaryButton
              label={breathElapsed >= 15 ? "BEGIN" : isBreathRunning ? "BREATHING..." : "BEGIN"}
              onPress={breathElapsed >= 15 ? onNext : () => setIsBreathRunning(true)}
            />
      </>
    );
  }

  if (sessionNumber === 7) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.sm, marginTop: spacing.md }}>
              <MonoText style={{ color: palette.line }}>SESSION 7: CUTTING FILLERS</MonoText>
              <DisplayText style={{ fontSize: 34, lineHeight: 40, textAlign: "center" }}>STEP 01/05:{"\n"}RESET</DisplayText>
              <BodyText style={{ fontSize: 20, lineHeight: 32, textAlign: "center", color: palette.inkMuted }}>
                You are about to try something hard.{"\n"}Settle in.
              </BodyText>
            </View>

            <View style={{ borderWidth: 1, borderColor: "#EFE3D9", padding: spacing.sm }}>
              <View style={{ height: 430, borderWidth: 2, borderColor: "#EEE2D8", justifyContent: "center", alignItems: "center" }}>
                <View style={{ width: 250, height: 250, borderWidth: 4, borderColor: palette.ink, backgroundColor: "#8F3110", justifyContent: "center", alignItems: "center" }}>
                  <View style={{ position: "absolute", top: 14, right: 14, bottom: 14, left: 14, borderWidth: 1, borderColor: "#C96943" }} />
                  <MonoText style={{ color: "#F2B69A", fontSize: 18 }}>{breathElapsed >= 15 ? "READY" : "INHALE"}</MonoText>
                </View>
              </View>
            </View>

            <PrimaryButton
              label={breathElapsed >= 15 ? "I AM READY" : isBreathRunning ? "BREATHING..." : "I AM READY"}
              onPress={breathElapsed >= 15 ? onNext : () => setIsBreathRunning(true)}
              inverted
            />
      </>
    );
  }

  if (sessionNumber === 8) {
    return (
      <DottedStageBackground>
              <View style={{ padding: spacing.lg, gap: spacing.lg }}>
                <Panel style={{ gap: spacing.md }}>
                  <MonoText style={{ color: palette.line }}>SESSION 08: FINDING YOUR PACE</MonoText>
                  <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>STEP 01: RESET</DisplayText>
                  <View style={{ height: 2, backgroundColor: palette.line, width: "100%" }} />
                  <View style={{ borderWidth: 2, borderColor: palette.line, padding: spacing.lg, alignItems: "center" }}>
                    <View style={{ width: 250, height: 250, borderWidth: 1, borderColor: "#E4D7CA", justifyContent: "center", alignItems: "center" }}>
                      <View style={{ position: "absolute", width: 172, height: 172, borderRadius: 999, backgroundColor: "#E7D2C7", opacity: 0.95 }} />
                      <View style={{ position: "absolute", width: 230, height: 230, borderRadius: 999, borderWidth: 4, borderColor: palette.line }} />
                      <DisplayText style={{ fontSize: 24, lineHeight: 28 }}>{breathElapsed >= 15 ? "READY" : "INHALE"}</DisplayText>
                    </View>
                  </View>
                  <BodyText style={{ textAlign: "center", fontSize: 20, lineHeight: 34, fontStyle: "italic", color: palette.inkMuted }}>
                    “Three breaths at a deliberate tempo.”
                  </BodyText>
                  <View style={{ height: 2, backgroundColor: palette.line, width: "100%" }} />
                  <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.sm }}>
                    <MonoText style={{ color: palette.line }}>◷</MonoText>
                    <MonoText style={{ color: palette.line }}>{sessionContent.stages.breathe.pulseLabel}</MonoText>
                  </View>
                  <PrimaryButton
                    label={breathElapsed >= 15 ? "BEGIN EXERCISE" : isBreathRunning ? "BREATHING..." : "BEGIN EXERCISE"}
                    onPress={breathElapsed >= 15 ? onNext : () => setIsBreathRunning(true)}
                  />
                </Panel>
              </View>
            </DottedStageBackground>
    );
  }

  if (sessionNumber === 9) {
    return (
      <>
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
              <MonoText style={{ color: palette.line }}>SESSION 9: POWER PAUSES</MonoText>
              <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>Step 01/05: Reset</DisplayText>
            </View>

            <Panel style={{ gap: spacing.md }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <MonoText style={{ color: palette.line }}>◷</MonoText>
                <MonoText style={{ color: palette.line }}>BOX BREATHING TECHNIQUE</MonoText>
              </View>
              <BodyText style={{ fontSize: 18, lineHeight: 30 }}>
                Box breathing (4-4-4-4) to build tolerance for silence and CO2. This technique anchors your nervous system into the present moment.
              </BodyText>
              {sessionContent.stages.breathe.boxSteps?.map((step, index) => (
                <View key={step} style={{ flexDirection: "row", gap: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderColor: "#E3D9CE" }}>
                  <MonoText style={{ color: palette.line }}>{String(index + 1).padStart(2, "0")}.</MonoText>
                  <BodyText style={{ flex: 1 }}>{step.replace(/^\d+\.\s*/, "")}</BodyText>
                </View>
              ))}
            </Panel>

            <DottedStageBackground>
              <View style={{ padding: spacing.lg, alignItems: "center", gap: spacing.lg }}>
                <View style={{ width: 240, height: 240, borderRadius: 999, borderWidth: 2, borderColor: "#E5D6CA", alignItems: "center", justifyContent: "center" }}>
                  <View style={{ width: 150, height: 150, borderRadius: 999, backgroundColor: "#8F3412", borderWidth: 2, borderColor: palette.line }} />
                </View>
                <View style={{ flexDirection: "row", gap: spacing.sm }}>
                  {[0, 1, 2, 3].map((index) => (
                    <View key={index} style={{ width: 10, height: 10, borderWidth: 1, borderColor: palette.line, backgroundColor: index === Math.min(3, Math.floor(breathElapsed / 4)) ? palette.line : palette.paper }} />
                  ))}
                </View>
              </View>
            </DottedStageBackground>

            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <PrimaryButton
                label={breathElapsed >= 15 ? "START SESSION" : isBreathRunning ? "BREATHING..." : "START SESSION"}
                onPress={breathElapsed >= 15 ? onNext : () => setIsBreathRunning(true)}
              />
              <PrimaryButton label="SKIP INTRO" onPress={onNext} inverted />
            </View>

            <View style={{ alignItems: "center", gap: spacing.xs }}>
              <MonoText style={{ color: palette.line }}>TODAY'S FOCUS</MonoText>
              <BodyText>Building carbon dioxide tolerance</BodyText>
            </View>
      </>
    );
  }

  if (sessionNumber === 10) {
    return (
      <>
        <Panel style={{ gap: spacing.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <MonoText style={{ color: palette.line }}>SESSION 10: WARM-UP</MonoText>
                <View style={styles.outlineBadge}>
                  <MonoText style={styles.outlineBadgeText}>01/05</MonoText>
                </View>
              </View>
              <DisplayText style={{ fontSize: 34, lineHeight: 38 }}>Vocal warm-up:{"\n"}Humming a descending tone.</DisplayText>
              <BodyText style={{ fontSize: 18, lineHeight: 30 }}>
                Take three deep breaths while following the high-precision arc below.
              </BodyText>
            </Panel>

            <Panel style={{ paddingVertical: spacing.xl, gap: spacing.lg }}>
              <View style={{ height: 280, borderWidth: 1, borderColor: "#E9D7CC", backgroundColor: "#FCF8F4", overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <View key={`grid-v-${index}`} style={{ position: "absolute", left: `${(index + 1) * 14.5}%`, top: 0, bottom: 0, width: 1, backgroundColor: "#EFE2D8" }} />
                ))}
                {Array.from({ length: 4 }).map((_, index) => (
                  <View key={`grid-h-${index}`} style={{ position: "absolute", top: `${(index + 1) * 20}%`, left: 0, right: 0, height: 1, backgroundColor: "#EFE2D8" }} />
                ))}
                <View style={{ width: 230, height: 230, borderRadius: 999, borderWidth: 4, borderTopColor: palette.line, borderRightColor: palette.line, borderBottomColor: "transparent", borderLeftColor: "transparent", transform: [{ rotate: "-45deg" }] }} />
                <View style={{ position: "absolute", width: 18, height: 18, borderRadius: 99, backgroundColor: palette.line, top: 80 + Math.max(0, 40 - breathElapsed * 2), right: 100 - Math.min(48, breathElapsed * 3) }} />
                <View style={{ position: "absolute", bottom: 18, alignItems: "center", gap: 6 }}>
                  <DisplayText style={{ fontSize: 22, lineHeight: 26 }}>{breathElapsed >= 15 ? "READY" : "HUM"}</DisplayText>
                  <MonoText style={{ color: palette.line }}>T-MINUS 04:00 • INHALE... EXHALE... HUM</MonoText>
                </View>
              </View>
            </Panel>

            <PrimaryButton
              label={breathElapsed >= 15 ? "I AM READY" : isBreathRunning ? "WARMING UP..." : "I AM READY"}
              onPress={breathElapsed >= 15 ? onNext : () => setIsBreathRunning(true)}
            />
      </>
    );
  }

  if (sessionNumber === 11) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.sm, marginTop: spacing.sm }}>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>STEP 01: MENTAL BREVITY CALIBRATION</MonoText>
          <View style={{ width: 56, height: 2, backgroundColor: palette.line }} />
        </View>

        <View style={{ borderWidth: 2, borderColor: palette.black, backgroundColor: "#FDF6E3", padding: spacing.lg, gap: spacing.lg }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>DRAFT SENTENCE (CLUTTERED)</MonoText>
            <MonoText style={{ color: palette.line, opacity: 0.5 }}>◌</MonoText>
          </View>

          <View style={{ borderWidth: 1, borderColor: "#E2D1C4", backgroundColor: "#F6EAE5", padding: spacing.lg }}>
            <BodyText style={{ fontSize: 20, lineHeight: 30, fontStyle: "italic", color: palette.inkMuted }}>
              “Basically, I was just thinking that we should potentially look into moving the meeting to Tuesday if everyone is okay with that.”
            </BodyText>
          </View>

          <View style={{ alignItems: "center", gap: spacing.md }}>
            <View style={{ width: 150, height: 150, borderRadius: 999, borderWidth: 8, borderColor: "#D9C9BF", alignItems: "center", justifyContent: "center" }}>
              <View style={{ position: "absolute", width: 150, height: 150, borderRadius: 999, borderWidth: 8, borderColor: palette.line, borderTopColor: "transparent", borderLeftColor: "transparent", transform: [{ rotate: "-20deg" }], opacity: 0.9 }} />
              <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>80%</DisplayText>
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>RETAINED</MonoText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <View style={{ width: 44, height: 44, borderWidth: 1, borderColor: palette.lineSoft, alignItems: "center", justifyContent: "center" }}>
                <MonoText style={{ color: palette.line, fontSize: 18 }}>X</MonoText>
              </View>
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>STRIPPING UNNECESSARY FLUFF...</MonoText>
            </View>
          </View>

          <View style={{ gap: spacing.sm }}>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>CORE SENTENCE (REFINED)</MonoText>
            <View style={{ borderWidth: 2, borderColor: palette.line, borderStyle: "dashed", padding: spacing.lg }}>
              <DisplayText style={{ fontSize: 22, lineHeight: 28, textAlign: "center" }}>
                “Let&apos;s move the meeting to Tuesday.”
              </DisplayText>
            </View>
          </View>
        </View>

        <BodyText style={{ textAlign: "center", color: palette.inkMuted, marginTop: spacing.lg }}>
          Calibration complete. Now apply this 20% cut rule to your most important thought today.
        </BodyText>

        <PrimaryButton label="BEGIN EXERCISE" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 12) {
    return (
      <>
        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 12 : REVIEW</MonoText>
          <DisplayText style={{ fontSize: 44, lineHeight: 50, textTransform: "uppercase" }}>FIRST WIN</DisplayText>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>Trend lines and the first share moment</MonoText>
        </View>

        <View style={{ alignItems: "center", marginTop: spacing.lg, marginBottom: spacing.lg }}>
          <View style={{ width: 260, height: 260, borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "#FDF6E3", shadowColor: "#2E2E2E", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
            <MonoText style={{ position: "absolute", right: 10, bottom: 10, color: palette.inkMuted }}>n=11</MonoText>
          </View>
        </View>

        <BodyText style={{ textAlign: "center", fontStyle: "italic", fontSize: 22, lineHeight: 34 }}>
          “The numbers are about to speak for you.”
        </BodyText>
        <BodyText style={{ textAlign: "center", color: palette.inkMuted, marginTop: spacing.sm }}>
          Eleven recordings of data. The shape of the trend is the signal; any one session is noise.
        </BodyText>

        <PrimaryButton label="BEGIN" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 13) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.xs }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 13 · BLUF</MonoText>
          <DisplayText style={{ fontSize: 44, lineHeight: 50, textTransform: "uppercase" }}>CENTRE</DisplayText>
        </View>

        <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.xl }}>
          <View style={{ alignItems: "center", gap: spacing.sm }}>
            <View style={{ borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "#F6EAE5", paddingHorizontal: spacing.xl, paddingVertical: spacing.md, minWidth: 260 }}>
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, textAlign: "center" }}>SUPPORTING DETAIL</MonoText>
            </View>
            <View style={{ borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "#F6EAE5", paddingHorizontal: spacing.xl, paddingVertical: spacing.md, minWidth: 220 }}>
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 2, textAlign: "center" }}>SUPPORTING DETAIL</MonoText>
            </View>
            <View style={{ backgroundColor: palette.line, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, minWidth: 200, shadowColor: "#2E2E2E", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <MonoText style={{ color: palette.paper, letterSpacing: 2 }}>THE BOTTOM{"\n"}LINE</MonoText>
            </View>
            <View style={{ width: 4, height: 22, backgroundColor: palette.line, borderRadius: 4 }} />
          </View>
        </View>

        <DisplayText style={{ fontSize: 28, lineHeight: 34, textAlign: "center" }}>
          One sentence. The conclusion.
        </DisplayText>
        <BodyText style={{ textAlign: "center", color: palette.inkMuted, marginTop: spacing.xs }}>
          The rest of the answer is supporting the one you pick.
        </BodyText>

        <PrimaryButton label="BEGIN" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 14) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 14 · RULE OF 3</MonoText>
          <DisplayText style={{ fontSize: 44, lineHeight: 50, textTransform: "uppercase" }}>WORKING MEMORY{"\n"}MATRIX</DisplayText>
          <BodyText style={{ textAlign: "center", color: palette.inkMuted }}>
            Three things you want to say today. Pick now.
          </BodyText>
        </View>

        <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.xl }}>
          <MonoText style={{ color: palette.line, fontSize: 24 }}>↑</MonoText>
          {["01", "02", "03"].map((label) => (
            <View key={label} style={{ width: "100%", maxWidth: 360, backgroundColor: palette.line, paddingVertical: spacing.lg, borderRadius: 10, alignItems: "center" }}>
              <MonoText style={{ color: palette.paper, fontSize: 34, letterSpacing: 4 }}>{label}</MonoText>
            </View>
          ))}
          <MonoText style={{ color: palette.line, fontSize: 24 }}>↑</MonoText>
          <View style={{ width: "100%", maxWidth: 360, borderWidth: 2, borderColor: palette.lineSoft, borderStyle: "dashed", paddingVertical: spacing.lg, borderRadius: 10, alignItems: "center", opacity: 0.55 }}>
            <MonoText style={{ color: palette.inkMuted, fontSize: 34, letterSpacing: 4 }}>04</MonoText>
          </View>
        </View>

        <BodyText style={{ textAlign: "center", color: palette.inkMuted, fontStyle: "italic" }}>
          “Three discrete items sit in working memory.{"\n"}The fourth displaces the first.”
        </BodyText>

        <PrimaryButton label="BEGIN" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 15) {
    return (
      <>
        <View style={{ gap: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 15 · SIGNPOSTING</MonoText>
          <DisplayText style={{ fontSize: 30, lineHeight: 34, textTransform: "uppercase" }}>THE ROADMAP FOR THE LISTENER</DisplayText>
        </View>

        <View style={{ borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "#FDF6E3", padding: spacing.lg, gap: spacing.lg }}>
          <View style={{ height: 320, borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "#FDF6E3", shadowColor: "#2E2E2E", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
            <View style={{ position: "absolute", left: "50%", top: 20, bottom: 20, width: 3, backgroundColor: palette.line, marginLeft: -2 }} />

            <View style={{ position: "absolute", left: 16, top: 42, width: 130, borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "#fff8f5", padding: spacing.md, shadowColor: "#2E2E2E", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <MonoText style={{ color: palette.inkMuted, textAlign: "right" }}>01</MonoText>
              <DisplayText style={{ fontSize: 24, lineHeight: 28, textTransform: "uppercase" }}>FIRST</DisplayText>
            </View>

            <View style={{ position: "absolute", right: 16, top: 128, width: 160, borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "#fff8f5", padding: spacing.md, shadowColor: "#2E2E2E", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <MonoText style={{ color: palette.inkMuted }}>02</MonoText>
              <DisplayText style={{ fontSize: 24, lineHeight: 28, textTransform: "uppercase" }}>SECOND</DisplayText>
            </View>

            <View style={{ position: "absolute", left: 16, bottom: 42, width: 170, borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "#fff8f5", padding: spacing.md, shadowColor: "#2E2E2E", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <MonoText style={{ color: palette.inkMuted, textAlign: "right" }}>03</MonoText>
              <DisplayText style={{ fontSize: 24, lineHeight: 28, textTransform: "uppercase" }}>FINALLY</DisplayText>
            </View>
          </View>
        </View>

        <BodyText style={{ textAlign: "center", color: palette.line, fontStyle: "italic", marginTop: spacing.md }}>
          “When did you last lose the thread of a meeting?”
        </BodyText>
        <BodyText style={{ textAlign: "center", color: palette.inkMuted, marginTop: spacing.xs }}>
          Signposts are written for the listener, not the speaker.
        </BodyText>

        <PrimaryButton label="BEGIN" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 16) {
    return (
      <>
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 16 · CENTRE</MonoText>
          <DisplayText style={{ fontSize: 46, lineHeight: 52, textTransform: "uppercase" }}>CONSTRAINT{"\n"}CALIBRATION</DisplayText>
        </View>

        <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
          <BodyText style={{ fontSize: 22, lineHeight: 34, fontStyle: "italic", color: palette.inkMuted }}>
            “Five seconds of silent structure beats ten seconds of warm-up filler.”
          </BodyText>
        </View>

        <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
          {[
            ["1", "BOTTOM LINE UP FRONT", "BLUF IN 8S"],
            ["2", "SUPPORTING ARCHITECTURE", "EXACTLY 3 POINTS"],
            ["3", "TOTAL DELIVERY TIME", "UNDER 50 SECS"],
          ].map(([n, kicker, label]) => (
            <View
              key={n}
              style={[
                styles.brutalistPanelInk,
                styles.brutalistShadowInk,
                { padding: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F6EAE5" },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: palette.line, alignItems: "center", justifyContent: "center" }}>
                  <MonoText style={{ color: palette.paper, fontSize: 18 }}>{n}</MonoText>
                </View>
                <View style={{ gap: 4 }}>
                  <MonoText style={{ color: "#E2B8A8", letterSpacing: 2 }}>{kicker}</MonoText>
                  <DisplayText style={{ fontSize: 28, lineHeight: 32, color: "#fff", textTransform: "uppercase" }}>{label}</DisplayText>
                </View>
              </View>
              <MonoText style={{ color: "#fff", fontSize: 20 }}>✓</MonoText>
            </View>
          ))}
        </View>

        <View style={{ alignItems: "center", marginTop: spacing.lg }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>⟲ ALIGNING CONSTRAINTS...</MonoText>
        </View>

        <Panel tone="soft" style={{ marginTop: spacing.lg, paddingVertical: spacing.lg }}>
          <BodyText style={{ fontSize: 20, lineHeight: 30 }}>
            BLUF in 8. Three points. Under 50 seconds.{"\n"}
            <BodyText style={{ color: palette.line, fontFamily: type.bodyMedium }}>Together.</BodyText>
          </BodyText>
        </Panel>

        <PrimaryButton label="BEGIN" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 17) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.sm, marginTop: spacing.sm }}>
          <DisplayText style={{ fontSize: 46, lineHeight: 52 }}>Centre</DisplayText>
          <DisplayText style={{ fontSize: 26, lineHeight: 32, color: palette.line }}>Close your eyes. Listen first.</DisplayText>
        </View>

        <BodyText style={{ textAlign: "center", color: palette.inkMuted, marginTop: spacing.md }}>
          What you are about to mimic is a structure,{"\n"}not a script.
        </BodyText>

        <View style={{ marginTop: spacing.xl, gap: spacing.lg }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={{ color: palette.black, letterSpacing: 3 }}>MASTER</MonoText>
            <MonoText style={{ color: palette.inkMuted }}>0:45</MonoText>
          </View>
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { padding: 0, overflow: "hidden" }]}>
            <View style={{ height: 120, padding: spacing.md, flexDirection: "row", alignItems: "flex-end", gap: spacing.sm }}>
              {[0.35, 0.75, 0.95, 0.8, 0.55].map((h, i) => (
                <View key={i} style={{ flex: 1, height: `${Math.round(h * 100)}%`, backgroundColor: palette.line }} />
              ))}
              <View style={{ position: "absolute", top: 8, left: 0, right: 0, flexDirection: "row", justifyContent: "space-around" }}>
                {["P1", "P2", "P3"].map((p) => (
                  <MonoText key={p} style={{ color: palette.inkMuted }}>{p}</MonoText>
                ))}
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 3 }}>YOU</MonoText>
            <MonoText style={{ color: palette.inkMuted }}>--:--</MonoText>
          </View>
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { borderStyle: "dashed", backgroundColor: "transparent" }]}>
            <View style={{ height: 120, flexDirection: "row", alignItems: "flex-end", gap: spacing.sm }}>
              {[0.25, 0.6, 0.78, 0.6, 0.42].map((h, i) => (
                <View key={i} style={{ flex: 1, height: `${Math.round(h * 100)}%`, borderWidth: 1, borderColor: palette.lineSoft, backgroundColor: "transparent" }} />
              ))}
            </View>
          </View>
        </View>

        <PrimaryButton label="LISTEN" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 18) {
    return (
      <>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.sm }}>
          <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { width: 46, height: 46, padding: 0, alignItems: "center", justifyContent: "center", backgroundColor: palette.line }]}>
            <MonoText style={{ color: palette.paper, fontSize: 18 }}>1</MonoText>
          </View>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>CENTRE PHASE</MonoText>
        </View>

        <DisplayText style={{ fontSize: 44, lineHeight: 50, color: palette.line, marginTop: spacing.sm }}>Composure Anchor</DisplayText>

        <View style={{ alignItems: "center", paddingVertical: spacing.xl }}>
          <View style={{ width: 260, height: 260, alignItems: "center", justifyContent: "center" }}>
            <View style={{ position: "absolute", width: 260, height: 260, borderRadius: 999, borderWidth: 1, borderColor: "#E7D4C4" }} />
            <View style={{ position: "absolute", width: 200, height: 200, borderRadius: 999, borderWidth: 1, borderColor: "#E7D4C4" }} />
            <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { width: 140, height: 140, padding: 0, alignItems: "center", justifyContent: "center" }]}>
              <View style={{ width: 42, height: 42, backgroundColor: palette.black }} />
            </View>
            <MonoText style={{ position: "absolute", left: 20, top: 56, color: palette.line, transform: [{ rotate: "-35deg" }] }}>AI 01</MonoText>
            <MonoText style={{ position: "absolute", right: 20, top: 56, color: palette.line, transform: [{ rotate: "35deg" }] }}>AI 02</MonoText>
            <MonoText style={{ position: "absolute", bottom: 12, color: palette.line }}>AI 03</MonoText>
          </View>
        </View>

        <Panel tone="soft" style={{ paddingVertical: spacing.lg }}>
          <BodyText style={{ fontSize: 20, lineHeight: 30 }}>
            <BodyText style={{ color: palette.line, fontFamily: type.bodyMedium }}>First Hot Seat.</BodyText>{" "}
            An AI partner pushes back three times. Maintain your anchor point.
          </BodyText>
        </Panel>

        <View style={{ borderLeftWidth: 4, borderLeftColor: palette.line, paddingLeft: spacing.md }}>
          <BodyText style={{ fontSize: 24, lineHeight: 34, fontStyle: "italic", color: palette.inkMuted }}>
            “Pressure surfaces existing patterns. It does not create new ones.”
          </BodyText>
        </View>

        <PrimaryButton label="BEGIN" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 19) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.sm, marginTop: spacing.sm }}>
          <DisplayText style={{ fontSize: 40, lineHeight: 46 }}>Step 1: Centre</DisplayText>
          <BodyText style={{ fontSize: 22, lineHeight: 32, fontStyle: "italic", color: palette.inkMuted, textAlign: "center" }}>
            “The next push is information,{"\n"}not a threat.”
          </BodyText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden", marginTop: spacing.lg }]}>
          <View style={{ height: 320, borderWidth: 0, justifyContent: "center", alignItems: "center" }}>
            <View style={{ position: "absolute", top: 28, borderWidth: 2, borderColor: "#B91C1C", paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, backgroundColor: "#F6D1C2" }}>
              <DisplayText style={{ fontSize: 24, lineHeight: 28, color: "#B91C1C", textTransform: "uppercase" }}>WHY</DisplayText>
            </View>
            <View style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: palette.lineSoft, alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 58, height: 58, borderRadius: 29, borderWidth: 2, borderColor: palette.line }} />
            </View>
            <View style={{ position: "absolute", bottom: 24, left: 22, right: 22, flexDirection: "row", gap: spacing.md }}>
              {["HOW", "WHAT"].map((label) => (
                <View key={label} style={{ flex: 1, borderWidth: 2, borderColor: "#A5B6A2", paddingVertical: spacing.md, alignItems: "center", backgroundColor: "#EEF4EA" }}>
                  <DisplayText style={{ fontSize: 24, lineHeight: 28, color: "#7E8D79", textTransform: "uppercase" }}>{label}</DisplayText>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Panel style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          <BodyText style={{ fontSize: 18, lineHeight: 28 }}>
            Pushback carries information about what the other side needs. Calibrated questions turn defense into exploration.
          </BodyText>
        </Panel>

        <PrimaryButton label="BEGIN LISTEN" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 20) {
    return (
      <>
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <MonoText style={{ color: palette.line, letterSpacing: 2 }}>STEP 1 CENTRE</MonoText>
          <DisplayText style={{ fontSize: 44, lineHeight: 50 }}>Mirror Loop</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>Tactical Empathy Protocol</BodyText>
        </View>

        <View style={{ height: 2, backgroundColor: palette.lineSoft, marginVertical: spacing.lg }} />

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, gap: spacing.md }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>○ INPUT</MonoText>
            <MonoText style={{ color: palette.line, letterSpacing: 2 }}>MIRROR ●</MonoText>
          </View>
          <View style={{ height: 180, borderWidth: 2, borderColor: palette.lineSoft, backgroundColor: "#fff8f5", justifyContent: "center", alignItems: "center" }}>
            <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { width: "86%", transform: [{ rotate: "-2deg" }] }]}>
              <MonoText style={{ color: palette.line, letterSpacing: 2, textAlign: "center" }}>FOCUS TARGET</MonoText>
              <DisplayText style={{ fontSize: 34, lineHeight: 40, textAlign: "center", fontFamily: type.mono }}>
                “…last three{"\n"}significant{"\n"}words”
              </DisplayText>
            </View>
          </View>
        </View>

        <Panel tone="soft" style={{ gap: spacing.sm }}>
          <DisplayText style={{ fontSize: 18, lineHeight: 24 }}>Listen to the clip twice before you mirror.</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>
            The next sentence opens once the speaker feels heard. Do not rush the silence.
          </BodyText>
        </Panel>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md }}>
          <MonoText style={{ color: palette.black, letterSpacing: 2 }}>TARGET AUDIO</MonoText>
          <MonoText style={{ color: palette.inkMuted }}>0:00 / 0:14</MonoText>
        </View>
        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.md, gap: spacing.sm }]}>
          <EditorialWaveform bars={[30, 42, 26, 56, 40, 68, 44, 62, 34, 52, 28, 70, 46, 58, 32, 50, 22, 44, 36, 30]} height={80} light />
        </View>

        <PrimaryButton label="BEGIN LOOP" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 21) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.sm, marginTop: spacing.sm }}>
          <View style={[styles.outlineBadge, { borderColor: palette.lineSoft }]}>
            <MonoText style={styles.outlineBadgeText}>ACCUSATION AUDIT</MonoText>
          </View>
          <DisplayText style={{ fontSize: 44, lineHeight: 50 }}>Session 21</DisplayText>
          <DisplayText style={{ fontSize: 34, lineHeight: 40, fontFamily: type.mono }}>Step 1: Centre</DisplayText>
        </View>

        <View style={{ borderLeftWidth: 4, borderLeftColor: palette.black, paddingLeft: spacing.md, marginTop: spacing.md }}>
          <BodyText style={{ fontSize: 22, lineHeight: 34, fontStyle: "italic", color: palette.inkMuted }}>
            “What you fear they will say is the thing you say first.”
          </BodyText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden", marginTop: spacing.lg }]}>
          <View style={{ height: 320, borderWidth: 0, justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: 220, height: 220, borderRadius: 999, borderWidth: 2, borderColor: "#E7D4C4", alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 140, height: 140, borderRadius: 999, borderWidth: 4, borderColor: palette.line, alignItems: "center", justifyContent: "center", backgroundColor: "#fff8f5" }}>
                <View style={{ width: 52, height: 80, borderWidth: 2, borderColor: palette.black, alignItems: "center", justifyContent: "center" }}>
                  <MonoText style={{ fontSize: 22 }}>⟲</MonoText>
                </View>
              </View>
            </View>
            <View style={{ position: "absolute", bottom: 110, borderWidth: 1, borderColor: palette.black, backgroundColor: "#fff8f5", paddingHorizontal: spacing.lg, paddingVertical: 2 }}>
              <MonoText style={{ letterSpacing: 2 }}>T TOO RISKY E</MonoText>
            </View>
          </View>
        </View>

        <BodyText style={{ textAlign: "center", color: palette.inkMuted, marginTop: spacing.md }}>
          Imagine the room&apos;s biggest objection to what you are about to say. Tap the center to map it.
        </BodyText>

        <PrimaryButton label="BEGIN PROTOCOL" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 22) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.sm, marginTop: spacing.sm }}>
          <DisplayText style={{ fontSize: 44, lineHeight: 50 }}>Session 22</DisplayText>
          <DisplayText style={{ fontSize: 46, lineHeight: 52 }}>The Aikido Pivot</DisplayText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.lg, marginTop: spacing.lg }]}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>Step 1: Centre</MonoText>
          <View style={{ gap: spacing.lg, marginTop: spacing.lg }}>
            {[
              ["1", "Acknowledge", palette.black],
              ["2", "Pivot", "#C7A08A"],
              ["3", "Continue", "#8B8B8B"],
            ].map(([n, label, color]) => (
              <View key={n} style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: color as string, alignItems: "center", justifyContent: "center" }}>
                  <MonoText style={{ color: color as string }}>{n}</MonoText>
                </View>
                <View style={{ flex: 1, height: 2, backgroundColor: color as string, opacity: n === "2" ? 0.15 : 0.5 }} />
                <MonoText style={{ color: color as string, flex: 1 }}>{label}</MonoText>
              </View>
            ))}
          </View>
        </View>

        <DisplayText style={{ fontSize: 30, lineHeight: 36, textAlign: "center", marginTop: spacing.lg }}>
          Acknowledge. Pivot. Continue.
        </DisplayText>
        <BodyText style={{ textAlign: "center", color: palette.inkMuted }}>
          You will be interrupted once between 12{"\n"}and 28 seconds in.
        </BodyText>

        <PrimaryButton label="BEGIN" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 23) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.sm, marginTop: spacing.sm }}>
          <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>SESSION 23</MonoText>
          <DisplayText style={{ fontSize: 46, lineHeight: 52, color: palette.line }}>Label &amp; Pause</DisplayText>
          <BodyText style={{ color: palette.inkMuted }}>Naming. Then silence.</BodyText>
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden", marginTop: spacing.lg }]}>
          <View style={{ height: 320, borderWidth: 0, backgroundColor: "#fff8f5" }}>
            {[
              ["FRUSTRATED", "#F6EAE5"],
              ["ANXIOUS", "#F1ECE4"],
              ["EAGER", "#EEF4EA"],
              ["DEFENSIVE", "#E7F0F5"],
              ["", "#fff8f5"],
              ["ENGAGED", "#E7F0F5"],
              ["DISCONNECTED", "#F1ECE4"],
              ["HESITANT", "#F6EAE5"],
              ["CONTENT", "#F1ECE4"],
            ].map(([label, bg], idx) => (
              <View
                key={`${label}-${idx}`}
                style={{
                  position: "absolute",
                  left: `${(idx % 3) * 33.333}%`,
                  top: `${Math.floor(idx / 3) * 33.333}%`,
                  width: "33.333%",
                  height: "33.333%",
                  borderWidth: 1,
                  borderColor: "#E2D1C4",
                  backgroundColor: bg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {label ? <MonoText style={{ color: palette.inkMuted }}>{label}</MonoText> : null}
              </View>
            ))}
            <View style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -36, marginTop: -36, width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: palette.line, alignItems: "center", justifyContent: "center", backgroundColor: "#FDF6E3" }}>
              <MonoText style={{ fontSize: 20, letterSpacing: 2 }}>II</MonoText>
            </View>
          </View>
        </View>

        <Panel tone="soft" style={{ marginTop: spacing.lg, paddingVertical: spacing.lg }}>
          <BodyText style={{ fontSize: 20, lineHeight: 30, textAlign: "center" }}>
            “You are about to acknowledge someone&apos;s emotion. Then stop talking for three seconds.”
          </BodyText>
          <MonoText style={{ color: palette.line, textAlign: "center", marginTop: spacing.sm }}>◷ 03.00s</MonoText>
        </Panel>

        <PrimaryButton label="BEGIN EXERCISE" onPress={onNext} />
      </>
    );
  }

  if (sessionNumber === 24) {
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.sm, marginTop: spacing.sm }}>
          <DisplayText style={{ fontSize: 44, lineHeight: 50 }}>Centre</DisplayText>
          <DisplayText style={{ fontSize: 26, lineHeight: 32 }}>Same scenario. Different you.</DisplayText>
          <BodyText style={{ color: palette.inkMuted, textAlign: "center" }}>
            Re-record the Sprint 4 session where the metrics{"\n"}were weakest.
          </BodyText>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginTop: spacing.md }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <View key={i} style={{ width: 46, height: 10, borderWidth: 1, borderColor: palette.lineSoft, backgroundColor: i === 0 ? palette.line : "transparent" }} />
          ))}
        </View>

        <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: 0, overflow: "hidden", marginTop: spacing.lg }]}>
          <View style={{ height: 260, backgroundColor: "#F6EAE5", borderWidth: 0 }}>
            <View style={{ position: "absolute", left: 0, right: 0, top: 12, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.lg }}>
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>DELTA CALIBRATION</MonoText>
              <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>PEAK COMPARISON</MonoText>
            </View>
            <View style={{ position: "absolute", left: 0, top: 52, bottom: 0, width: "33%", alignItems: "center", justifyContent: "flex-end", paddingBottom: spacing.lg }}>
              <DisplayText style={{ fontSize: 44, lineHeight: 48, color: "#8B8B8B" }}>42</DisplayText>
              <View style={{ width: 8, height: 96, backgroundColor: "#8B8B8B", marginTop: spacing.sm }} />
              <MonoText style={{ color: palette.inkMuted, marginTop: spacing.sm }}>SPRINT 4{"\n"}WEAK</MonoText>
            </View>
            <View style={{ position: "absolute", left: "33%", top: 52, bottom: 0, width: "34%", alignItems: "center", justifyContent: "center" }}>
              <View style={[styles.brutalistPanelInk, styles.brutalistShadowInk, { padding: spacing.md, backgroundColor: "#fff8f5" }]}>
                <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>TARGET SCORE</MonoText>
                <DisplayText style={{ fontSize: 34, lineHeight: 38, color: palette.line }}>75+</DisplayText>
              </View>
              <View style={{ marginTop: spacing.sm, borderWidth: 1, borderColor: palette.line, paddingHorizontal: spacing.lg, paddingVertical: 4 }}>
                <MonoText style={{ color: palette.line, letterSpacing: 2 }}>NEW PATH</MonoText>
              </View>
            </View>
            <View style={{ position: "absolute", right: 0, top: 52, bottom: 0, width: "33%", alignItems: "center", justifyContent: "flex-end", paddingBottom: spacing.lg }}>
              <DisplayText style={{ fontSize: 44, lineHeight: 48, color: "#8B8B8B" }}>68</DisplayText>
              <View style={{ width: 8, height: 148, backgroundColor: "#8B8B8B", marginTop: spacing.sm }} />
              <MonoText style={{ color: palette.inkMuted, marginTop: spacing.sm }}>RECENT{"\n"}BEST</MonoText>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { flex: 1, height: 120, justifyContent: "flex-end" }]}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>CLARITY</MonoText>
            <DisplayText style={{ fontSize: 28, lineHeight: 32, color: palette.line, fontFamily: type.mono }}>Delta △</DisplayText>
          </View>
          <View style={[styles.brutalistPanel, styles.brutalistShadowInk, { flex: 1, height: 120, justifyContent: "flex-end" }]}>
            <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>PACING</MonoText>
            <DisplayText style={{ fontSize: 28, lineHeight: 32, color: palette.line, textAlign: "right" }}>120 <MonoText>WPM</MonoText></DisplayText>
          </View>
        </View>

        <PrimaryButton label="BEGIN RECORD" onPress={onNext} />
      </>
    );
  }

  return (
    <>
      <View style={styles.breatheCenterZone}>
        <View style={styles.breatheVisualWrap}>
          <View style={styles.breatheGuideFrame} />
          <View style={styles.breatheCrosshairHorizontal} />
          <View style={styles.breatheCrosshairVertical} />
          <BreathPulse active={isBreathRunning} size={220}>
            <View style={[styles.breatheInnerRing, isBreathRunning && styles.breatheInnerRingActive]}>
              <MonoText style={styles.windGlyph}>{breathElapsed >= 15 ? "DONE" : "IN"}</MonoText>
            </View>
          </BreathPulse>
        </View>

        <View style={styles.breatheCopy}>
          <MonoText style={styles.breatheCountLabel}>RESET TIMER</MonoText>
          <DisplayText style={styles.breatheCountValue}>{formatTime(breathElapsed)}</DisplayText>
          <BodyText style={styles.centerQuote}>{sessionContent.stages.breathe.quote}</BodyText>
        </View>

        <View style={styles.breatheActionArea}>
          <PrimaryButton
            label={breathElapsed >= 15 ? "Continue" : isBreathRunning ? "Breathing…" : "Begin"}
            onPress={breathElapsed >= 15 ? onNext : () => setIsBreathRunning(true)}
            inverted
          />
        </View>
      </View>
    </>
  );
}

export function BreatheStage({
  sessionNumber,
  stage,
  stepIndex,
  sessionContent,
  breathElapsed,
  isBreathRunning,
  onJumpToStep,
  onBack,
  onExit,
  onNext,
  setIsBreathRunning,
}: BreatheStageProps) {
  const useStepBody = sessionNumber >= 6 && sessionNumber <= 11;

  return (
    <SessionFlowShell
      variant="breathe"
      sessionNumber={sessionNumber}
      session={sessionContent}
      stage={stage}
      stepIndex={stepIndex}
      breathElapsed={breathElapsed}
      isBreathRunning={isBreathRunning}
      onBack={onBack}
      onExit={onExit}
      onJumpToStep={(targetIndex) => (onJumpToStep ? onJumpToStep(targetIndex) : undefined)}
      scrollContentStyle={useStepBody ? styles.stepBody : undefined}
    >
      <BreatheStageBody
        sessionNumber={sessionNumber}
        sessionContent={sessionContent}
        breathElapsed={breathElapsed}
        isBreathRunning={isBreathRunning}
        onNext={onNext}
        setIsBreathRunning={setIsBreathRunning}
      />
    </SessionFlowShell>
  );
}
