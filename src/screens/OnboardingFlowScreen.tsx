import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { AppHeader, BodyText, DisplayText, MonoText, Panel, PrimaryButton, Wordmark } from "../design-system/primitives";
import { Icon } from "../design-system/icons";
import { palette, spacing, type } from "../design-system/theme";
import { FloatingOrb, InteractivePressable, PulseDots, Reveal } from "../design-system/motion";

const industries = ["Sales", "Finance", "Consulting", "Product", "Engineering", "Marketing", "Legal", "Healthcare", "Education", "Operations", "Other"];
const roles = ["Individual contributor", "Team lead", "Manager", "Senior manager", "Director", "VP / Head of", "C-level", "Founder", "Consultant", "Other"];
const horizons = [
  "Better at client meetings",
  "More confident presenting",
  "Stronger in job interviews",
  "Promotion-ready",
  "Just curious about my voice",
];
const frictions = [
  "I ramble",
  "I talk too fast",
  "I use too many fillers",
  "I freeze under pressure",
  "I sound uncertain",
  "I lose people in long answers",
];
const trainingGoals = [
  "Interview prep",
  "New manager",
  "Client-facing",
  "Promotion-ready",
  "General",
];
const durations = [
  { label: "5 minutes", detail: "one session" },
  { label: "10 minutes", detail: "one session + replay" },
  { label: "15 minutes", detail: "one session + library" },
];
const onboardingPrompt = "Tell me about a recent project you worked on. What was the goal, what happened, and what would you do differently?";

export type OnboardingData = {
  industry: string;
  role: string;
  trainingGoal: string;
  selectedHorizons: string[];
  selectedFrictions: string[];
  duration: string;
  practiceTime: string;
};

export function OnboardingFlowScreen({ onFinish }: { onFinish: (data: OnboardingData) => void }) {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [selectedHorizons, setSelectedHorizons] = useState<string[]>([]);
  const [selectedFrictions, setSelectedFrictions] = useState<string[]>([]);
  const [trainingGoal, setTrainingGoal] = useState("General");
  const [duration, setDuration] = useState("");
  const [practiceTime, setPracticeTime] = useState("08:00 AM");
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordElapsed, setRecordElapsed] = useState(0);
  const [analysisTicks, setAnalysisTicks] = useState(0);
  const [baselineTouched, setBaselineTouched] = useState(false);
  const prevStepRef = useRef(step);
  const stepAnim = useRef(new Animated.Value(0)).current;
  const [stepDirection, setStepDirection] = useState<"forward" | "backward" | "none">("none");

  useEffect(() => {
    const prev = prevStepRef.current;
    if (prev !== step) {
      const dir = step > prev ? "forward" : "backward";
      setStepDirection(dir);
      prevStepRef.current = step;
      stepAnim.setValue(dir === "forward" ? 1 : -1);
      Animated.timing(stepAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setStepDirection("none"));
    }
  }, [step, stepAnim]);

  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => {
      setRecordElapsed((current) => {
        if (current >= 89) {
          setRecording(false);
          setStep(6);
          return 90;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    if (step !== 6) return;
    const timer = setInterval(() => setAnalysisTicks((current) => current + 1), 500);
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step === 6 && analysisTicks >= 4) {
      setStep(7);
    }
  }, [analysisTicks, step]);

  const progressLabel = useMemo(() => {
    if (step < 1 || step > 5) return null;
    return `Step ${step} of 5`;
  }, [step]);

  const dots = ".".repeat((analysisTicks % 3) + 1);

  const canContinue = () => {
    switch (step) {
      case 1:
        return Boolean(industry && role);
      case 2:
        return selectedHorizons.length > 0;
      case 3:
        return selectedFrictions.length > 0;
      case 4:
        return Boolean(duration && practiceTime);
      default:
        return true;
    }
  };

  const canSubmitBaseline = recordElapsed >= 90;
  const baselineSecondsRemaining = Math.max(0, 90 - recordElapsed);

  const header = (
    <AppHeader
      left={
        step === 0 ? (
          <Wordmark />
        ) : (
          <View style={styles.headerLeft}>
            <Pressable onPress={() => setStep((current) => Math.max(0, current - 1))} style={styles.smallIconButton}>
              <Icon name="back" size={16} />
            </Pressable>
            <MonoText>{progressLabel ?? "Baseline"}</MonoText>
          </View>
        )
      }
      right={
        <View style={styles.headerRight}>
          {step >= 1 && step <= 5 ? (
            <InteractivePressable onPress={() => onFinish({ industry, role, trainingGoal, selectedHorizons, selectedFrictions, duration, practiceTime })}>
              <View style={styles.skipPill}>
                <MonoText style={styles.skipText}>SKIP</MonoText>
              </View>
            </InteractivePressable>
          ) : null}
          <View style={styles.langRow}>
            <Icon name="globe" size={18} />
            <MonoText>EN</MonoText>
          </View>
        </View>
      }
    />
  );

  return (
    <View style={styles.screen}>
      <FloatingOrb size={220} top={90} right={-40} color={palette.blush} opacity={0.6} />
      <FloatingOrb size={120} bottom={120} left={-10} color={palette.apricot} opacity={0.3} duration={6200} />
      <>
      {header}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View
          key={`onboarding-step-${step}`}
          style={[
            step === 0 || step === 6 ? { flex: 1 } : undefined,
            {
              opacity: stepAnim.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0.3, 1, 0.3],
              }),
              transform: [
                {
                  translateX: stepAnim.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [60, 0, -60],
                  }),
                },
              ],
            },
          ]}
        >
          {step === 0 ? (
            <Reveal style={styles.centered}>
              <View style={styles.heroCard}>
                <Icon name="spark" size={38} color={palette.paper} />
                <View style={styles.heroCardPulse} />
              </View>
              <DisplayText style={styles.heroTitle}>Five minutes a day.{"\n"}A calmer, clearer voice.</DisplayText>
              <BodyText style={styles.heroSubtitle}>
                We’ll tailor the sessions to your goals, then take a quick baseline so you can hear your progress.
              </BodyText>
              <PrimaryButton label="LET'S BEGIN" onPress={() => setStep(1)} />
              <MonoText style={styles.secondaryLink}>ALREADY HAVE AN ACCOUNT? SIGN IN</MonoText>
            </Reveal>
          ) : null}

          {step === 1 ? (
            <View style={styles.section}>
              <DisplayText style={styles.stepTitle}>What do you do?</DisplayText>
              <Field label="Industry" value={industry} onChange={setIndustry} placeholder="Choose your industry" suggestions={industries} />
              <Field label="Role" value={role} onChange={setRole} placeholder="Choose your role" suggestions={roles} />
              <View style={styles.fieldBlock}>
                <MonoText style={styles.fieldLabel}>What are you training for?</MonoText>
                <View style={styles.chipWrap}>
                  {trainingGoals.map((goal) => (
                    <InteractivePressable key={goal} onPress={() => setTrainingGoal(goal)}>
                      <View style={[styles.chip, trainingGoal === goal && styles.chipActive]}>
                        <MonoText style={[styles.chipText, trainingGoal === goal && styles.chipTextActive]}>
                          {goal}
                        </MonoText>
                      </View>
                    </InteractivePressable>
                  ))}
                </View>
              </View>
              <PrimaryButton label="CONTINUE" onPress={() => canContinue() && setStep(2)} inverted={!canContinue()} />
            </View>
          ) : null}

          {step === 2 ? (
            <View style={styles.section}>
              <DisplayText style={styles.stepTitle}>Where are you headed?</DisplayText>
              <BodyText>Choose all that apply.</BodyText>
              <View style={styles.stack}>
                {horizons.map((item) => (
                  <SelectableRow
                    key={item}
                    label={item}
                    selected={selectedHorizons.includes(item)}
                    onPress={() =>
                      setSelectedHorizons((current) =>
                        current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item],
                      )
                    }
                    type="checkbox"
                  />
                ))}
              </View>
              <PrimaryButton label="CONTINUE" onPress={() => canContinue() && setStep(3)} inverted={!canContinue()} />
            </View>
          ) : null}

          {step === 3 ? (
            <View style={styles.section}>
              <DisplayText style={styles.stepTitle}>What gets in your way?</DisplayText>
              <BodyText>Choose all that apply.</BodyText>
              <View style={styles.stack}>
                {frictions.map((item) => {
                  const selected = selectedFrictions.includes(item);
                  return (
                    <SelectableRow
                      key={item}
                      label={item}
                      selected={selected}
                      onPress={() =>
                        setSelectedFrictions((current) =>
                          selected ? current.filter((entry) => entry !== item) : [...current, item],
                        )
                      }
                      type="checkbox"
                    />
                  );
                })}
              </View>
              <PrimaryButton label="CONTINUE" onPress={() => canContinue() && setStep(4)} inverted={!canContinue()} />
            </View>
          ) : null}

          {step === 4 ? (
            <View style={styles.section}>
              <DisplayText style={styles.stepTitle}>How long, each day?</DisplayText>
              <View style={styles.stack}>
                {durations.map((item) => (
                  <SelectableRow
                    key={item.label}
                    label={`${item.label} — ${item.detail}`}
                    selected={duration === item.label}
                    onPress={() => setDuration(item.label)}
                    type="radio"
                  />
                ))}
              </View>
              <View style={styles.fieldBlock}>
                <MonoText style={styles.fieldLabel}>When do you want to practise?</MonoText>
                <InteractivePressable onPress={() => setTimePickerOpen(true)}>
                  <View style={styles.pickerField}>
                    <BodyText style={styles.pickerValue}>{practiceTime}</BodyText>
                    <MonoText style={styles.pickerHint}>CHANGE</MonoText>
                  </View>
                </InteractivePressable>
              </View>
              <PrimaryButton label="CONTINUE" onPress={() => canContinue() && setStep(5)} inverted={!canContinue()} />
            </View>
          ) : null}

          {step === 5 ? (
            <View style={styles.section}>
              <DisplayText style={styles.stepTitle}>Baseline check-in</DisplayText>
              <BodyText style={styles.supportCopy}>
                Speak naturally for <MonoText style={styles.inlineStrong}>90 seconds</MonoText>. This is just a starting point — not a test.
              </BodyText>
              <Panel style={styles.promptCard}>
                <BodyText style={styles.promptText}>{onboardingPrompt}</BodyText>
              </Panel>
              <View style={styles.recordWrap}>
                <Pressable
                  onPress={() => {
                    setBaselineTouched(true);
                    if (recordElapsed >= 90) setRecordElapsed(0);
                    setRecording(true);
                  }}
                  style={[styles.micButton, recording && styles.micButtonActive]}
                >
                  <Icon name="mic" size={40} color={palette.paper} />
                </Pressable>
                <MonoText style={styles.recordLabel}>{recording ? formatTime(recordElapsed) : baselineTouched ? "Tap to continue" : "Tap to start"}</MonoText>
                {!canSubmitBaseline ? (
                  <BodyText style={styles.helperNote}>{baselineSecondsRemaining}s remaining</BodyText>
                ) : (
                  <BodyText style={styles.helperNote}>Nice. You’re ready to submit.</BodyText>
                )}
              </View>
              <BodyText style={styles.centerText}>We’ll show your first readout in a moment.</BodyText>
              <PrimaryButton
                label={recording ? "RECORDING…" : canSubmitBaseline ? "SUBMIT BASELINE" : "START BASELINE"}
                onPress={() => {
                  if (recording) return;
                  if (canSubmitBaseline) {
                    setStep(6);
                    return;
                  }
                  setRecording(true);
                }}
                inverted={!canSubmitBaseline && baselineTouched}
              />
            </View>
          ) : null}

          {step === 6 ? (
            <Reveal style={styles.loadingState}>
              <DisplayText style={styles.stepTitle}>Processing{dots}</DisplayText>
              <PulseDots />
              <View style={styles.processingList}>
                {[
                  "Finding filler patterns",
                  "Estimating pace and rhythm",
                  "Spotting sentence endings",
                ].map((item, index) => {
                  const done = analysisTicks > index;
                  return (
                    <View key={item} style={styles.processingRow}>
                      <View style={[styles.processingDot, done && styles.processingDotDone]} />
                      <BodyText style={styles.processingText}>{item}</BodyText>
                    </View>
                  );
                })}
              </View>
              <BodyText style={styles.centerText}>
                You can relax your jaw and drop your shoulders while we do the math.
              </BodyText>
            </Reveal>
          ) : null}

          {step === 7 ? (
            <View style={styles.section}>
              <DisplayText style={styles.stepTitle}>Your baseline snapshot</DisplayText>
              <Panel style={styles.metricsPanel}>
                {[
                  ["12", "fillers", "in 90s"],
                  ["178", "pace", "rushing"],
                  ["8/12", "sentences", "uptalk"],
                ].map(([value, label, detail]) => (
                  <View key={label} style={styles.metricCell}>
                    <DisplayText style={styles.metricValue}>{value}</DisplayText>
                    <MonoText>{label}</MonoText>
                    <MonoText style={styles.metricDetail}>{detail}</MonoText>
                  </View>
                ))}
              </Panel>
              <BodyText>You said "um" 12 times. Pace ran high at 178 WPM. Most of your sentences ended on a rising note.</BodyText>
              <BodyText style={styles.roastNote}>None of this is a verdict. It is the starting line.</BodyText>
              <PrimaryButton label="BEGIN SESSION 1" onPress={() => onFinish({ industry, role, trainingGoal, selectedHorizons, selectedFrictions, duration, practiceTime })} />
              <BodyText style={styles.centerText}>Next up: a short reset exercise to settle your breath.</BodyText>
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>
      {timePickerOpen ? (
        <TimePicker
          value={practiceTime}
          onClose={() => setTimePickerOpen(false)}
          onSelect={(value) => {
            setPracticeTime(value);
            setTimePickerOpen(false);
          }}
        />
      ) : null}
      </>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  suggestions,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions?: string[];
}) {
  return (
    <View style={styles.fieldBlock}>
      <MonoText style={styles.fieldLabel}>{label}</MonoText>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={palette.lineSoft} style={styles.input} />
      {suggestions ? (
        <View style={styles.chipWrap}>
          {suggestions.map((item) => (
            <InteractivePressable key={item} onPress={() => onChange(item)}>
              <View style={styles.chip}>
                <MonoText style={styles.chipText}>{item}</MonoText>
              </View>
            </InteractivePressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function SelectableRow({
  label,
  selected,
  onPress,
  type,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  type: "radio" | "checkbox";
}) {
  return (
    <InteractivePressable onPress={onPress}>
      <View style={[styles.selectRow, selected && styles.selectRowActive]}>
        <View style={[styles.choiceMark, selected && styles.choiceMarkActive, type === "radio" && styles.choiceRadio]} />
        <BodyText style={[styles.selectLabel, selected && { color: palette.ink }]}>{label}</BodyText>
      </View>
    </InteractivePressable>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function TimePicker({
  value,
  onSelect,
  onClose,
}: {
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const times = [
    "06:30 AM",
    "07:00 AM",
    "07:30 AM",
    "08:00 AM",
    "08:30 AM",
    "12:30 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
  ];

  return (
    <View style={styles.pickerOverlay}>
      <Pressable style={styles.pickerBackdrop} onPress={onClose} />
      <Panel style={styles.pickerSheet}>
        <View style={styles.pickerHeader}>
          <MonoText style={styles.pickerTitle}>Pick a time</MonoText>
          <InteractivePressable onPress={onClose}>
            <View style={styles.pickerClose}>
              <Icon name="close" size={14} />
            </View>
          </InteractivePressable>
        </View>
        <View style={styles.pickerGrid}>
          {times.map((time) => {
            const selected = time === value;
            return (
              <InteractivePressable key={time} onPress={() => onSelect(time)}>
                <View style={[styles.pickerChip, selected && styles.pickerChipActive]}>
                  <MonoText style={[styles.pickerChipText, selected && styles.pickerChipTextActive]}>{time}</MonoText>
                </View>
              </InteractivePressable>
            );
          })}
        </View>
      </Panel>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  scroll: {
    flexGrow: 1,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  skipPill: {
    borderWidth: 2,
    borderRadius: 999,
    borderColor: palette.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.paper,
  },
  skipText: {
    fontSize: 11,
    color: palette.inkMuted,
  },
  smallIconButton: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderRadius: 18,
    borderColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.paper,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xl,
    paddingVertical: 28,
  },
  heroCard: {
    width: 132,
    height: 132,
    borderWidth: 2,
    borderRadius: 36,
    borderColor: palette.line,
    backgroundColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroCardPulse: {
    position: "absolute",
    width: 176,
    height: 176,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#DDB7A4",
    opacity: 0.45,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 40,
    textAlign: "center",
  },
  heroSubtitle: {
    textAlign: "center",
    maxWidth: 320,
  },
  secondaryLink: {
    textAlign: "center",
  },
  section: {
    gap: spacing.lg,
  },
  stepTitle: {
    fontSize: 34,
    lineHeight: 38,
  },
  supportCopy: {
    color: palette.inkMuted,
  },
  inlineStrong: {
    color: palette.ink,
  },
  fieldBlock: {
    gap: spacing.sm,
  },
  fieldLabel: {
    color: palette.ink,
  },
  input: {
    borderWidth: 2,
    borderRadius: 18,
    borderColor: palette.line,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: type.body,
    color: palette.ink,
    fontSize: 16,
    backgroundColor: palette.paper,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    borderColor: palette.lineSoft,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: palette.surfaceContainerLow,
  },
  chipText: {
    fontSize: 11,
  },
  chipActive: {
    borderColor: palette.line,
    backgroundColor: palette.panel,
  },
  chipTextActive: {
    color: palette.ink,
  },
  stack: {
    gap: spacing.sm,
  },
  selectRow: {
    borderWidth: 2,
    borderRadius: 22,
    borderColor: palette.line,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: palette.paper,
  },
  selectRowActive: {
    backgroundColor: palette.panel,
  },
  choiceMark: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: palette.line,
    backgroundColor: palette.paper,
  },
  choiceRadio: {
    borderRadius: 99,
  },
  choiceMarkActive: {
    backgroundColor: palette.line,
  },
  selectLabel: {
    flex: 1,
  },
  promptCard: {
    backgroundColor: palette.paper,
    borderRadius: 24,
  },
  promptText: {
    fontSize: 18,
    lineHeight: 30,
    color: palette.ink,
  },
  recordWrap: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: 24,
  },
  micButton: {
    width: 108,
    height: 108,
    borderRadius: 999,
    backgroundColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#EAD8CC",
  },
  micButtonActive: {
    transform: [{ scale: 1.03 }],
  },
  recordLabel: {
    fontSize: 15,
  },
  helperNote: {
    textAlign: "center",
    color: palette.inkMuted,
  },
  centerText: {
    textAlign: "center",
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: 120,
  },
  processingList: {
    width: "100%",
    maxWidth: 360,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  processingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  processingDot: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: palette.lineSoft,
    backgroundColor: palette.paper,
  },
  processingDotDone: {
    borderColor: palette.line,
    backgroundColor: palette.line,
  },
  processingText: {
    color: palette.inkMuted,
  },
  metricsPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  metricCell: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  metricValue: {
    fontSize: 38,
    lineHeight: 42,
  },
  metricDetail: {
    color: palette.inkMuted,
    fontSize: 11,
  },
  roastNote: {
    color: palette.ink,
  },
  softUpsell: {
    gap: spacing.sm,
  },
  pickerField: {
    borderWidth: 2,
    borderRadius: 18,
    borderColor: palette.line,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: palette.paper,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerValue: {
    color: palette.ink,
  },
  pickerHint: {
    color: palette.inkMuted,
    fontSize: 11,
  },
  pickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(44, 20, 13, 0.4)",
  },
  pickerSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  pickerTitle: {
    color: palette.ink,
  },
  pickerClose: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderRadius: 18,
    borderColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.paper,
  },
  pickerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  pickerChip: {
    borderWidth: 2,
    borderRadius: 999,
    borderColor: palette.lineSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: palette.paper,
  },
  pickerChipActive: {
    borderColor: palette.line,
    backgroundColor: palette.panel,
  },
  pickerChipText: {
    color: palette.inkMuted,
    fontSize: 11,
  },
  pickerChipTextActive: {
    color: palette.ink,
  },
});
