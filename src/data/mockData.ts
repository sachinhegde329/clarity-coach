import { buildAllSessionDefinitions } from "./buildSessionDefinitions";

export type AppTab = "today" | "journey" | "library" | "stats";

export type SessionStage = "breathe" | "lesson" | "feedback" | "record" | "reflect";

// ─── Centre (Breathe) stage data ─────────────────────────────────────────────
export type CentreData = {
  title: string;
  subtitle?: string;
  prompt: string;
  statusLabel: string;
  quote: string;
  underOrbMeta?: string;
  onScreenLines?: string[];
  breathPattern?: { inhale?: number; hold?: number; exhale?: number };
  levels?: { label: string; description: string }[];
  boxSteps?: string[];
  pulseLabel?: string;
  exerciseLabel?: string;
};

// ─── Listen (Lesson) stage data ───────────────────────────────────────────────
export type ListenData = {
  title: string;
  subtitle?: string;
  description: string;
  audioTitle?: string;
  audioDuration?: string;
  waveformMeta?: string;
  insightTitle: string;
  insightQuote: string;
  transcriptHighlight: string;
  transcriptMeta: string;
  transcriptLines?: { time: string; text: string; highlighted?: boolean }[];
  emphasisCards?: { title: string; meta: string }[];
  coachingPassages?: { text: string; tone?: "default" | "muted" }[];
  keyConcept?: { title: string; body: string };
  anatomy?: { label: string; body: string; muted?: boolean }[];
  quote?: string;
  metrics?: { label: string; value: string }[];
  comparisonAudio?: { label: string; tag: string; description: string }[];
};

// ─── Do (Feedback/Record) stage data ─────────────────────────────────────────
export type ChallengeType =
  | "Open prompt"
  | "Constraint"
  | "Side-by-side replay"
  | "Replay"
  | "Reactive"
  | "Adversarial"
  | "Comparative"
  | "Pressure Replay"
  | "Open"
  | string;

export type DoData = {
  promptTitle: string;
  promptBody: string;
  badge?: string;
  constraint?: string;
  constraintDetail?: string;
  preRecordMeta?: string;
  hidePreRecordMetaOnRecord?: boolean;
  uiVariant?: "default" | "open_prompt";
  challengeType?: ChallengeType;
  listenOnly?: boolean;
  replayMode?: boolean;
  adversarial?: boolean;
  reactive?: boolean;
  metricSelection?: boolean;
  comparative?: boolean;
  closingLine?: string;
  tips?: string;
  targets?: string[];
  paceTarget?: { label: string; min: number; max: number; target: number };
  timeLimit?: number; // seconds
  nouns?: string[];
  energyCheck?: boolean;
};

// ─── See (Record/Feedback) stage data ─────────────────────────────────────────
export type PremiumUpsell = {
  headline?: string;
  body?: string;
  primaryCta?: string;
  secondary?: string;
};

export type SeeData = {
  badge: string;
  title: string;
  commentary: string;
  environment: string;
  environmentCopy: string;
  headerMeta?: string;
  subline?: string;
  commentaryTemplates?: Record<string, string>;
  premiumUpsell?: PremiumUpsell;
  reveal?: { durationMs?: number; staggerMs?: number; sequential?: boolean };
  metrics?: {
    label: string;
    value: string;
    unit?: string;
    delta?: string;
    deltaDir?: "up" | "down" | "flat";
    description?: string;
    foot?: string;
    bar?: number; // 0-100
  }[];
  coachInsights?: string[];
  waveformLabel?: string;
  pauseCategories?: string[];
};

// ─── Commit (Reflect) stage data ──────────────────────────────────────────────
export type CommitData = {
  promptTitle: string;
  promptKicker?: string;
  suggestedOpener: string;
  metaLine?: string;
  micActiveMeta?: string;
  bodyText?: string;
  scienceNote?: string;
  nextStep?: string;
  freeResponse?: boolean;
};

export type SessionDefinition = {
  sessionNumber: number;
  sprintLabel: string;
  sessionLabel: string;
  arcTitle: string;
  focusLine: string;
  practiceTitle: string;
  summary: string;
  skipCentre?: boolean;
  stages: {
    breathe: CentreData;
    lesson: ListenData;
    feedback: DoData;
    record: SeeData;
    reflect: CommitData;
  };
};

export const sessionDefinitions: SessionDefinition[] = buildAllSessionDefinitions();

export type SprintCard = {
  id: string;
  number: string;
  title: string;
  theme: string;
  description: string;
  locked: boolean;
  state: "completed" | "current" | "locked";
  progress: number;
};

export const sprintCards: SprintCard[] = [
  {
    id: "1",
    number: "01",
    title: "NOTICE / Awareness",
    theme: "Hear your own patterns",
    description:
      "Hear your own speech patterns for the first time. Fillers, pace, pauses, basic awareness — ending in the first side-by-side replay.",
    locked: false,
    state: "completed",
    progress: 1,
  },
  {
    id: "2",
    number: "02",
    title: "STEADY / Focus",
    theme: "Build the foundation",
    description:
      "Pace bands, power pauses, downward inflection, filler reduction under constraint. Session 12 is the first share moment.",
    locked: false,
    state: "completed",
    progress: 1,
  },
  {
    id: "3",
    number: "03",
    title: "LEAD / Structure",
    theme: "Take charge of structure",
    description: "BLUF, Rule of 3, signposting, stacked constraints, mimicry — ending in the first Hot Seat.",
    locked: false,
    state: "current",
    progress: 0.4,
  },
  {
    id: "4",
    number: "04",
    title: "HOLD / Pressure",
    theme: "Stay clear under pressure",
    description: "Calibrated questions, mirroring, accusation audit, the Aikido pivot, labelling — ending in a pressure replay.",
    locked: true,
    state: "locked",
    progress: 0,
  },
  {
    id: "5",
    number: "05",
    title: "COMPOSE / Intention",
    theme: "Combine tools with intention",
    description: "Audience-aware framing, data-to-story, energy calibration, hypothesis-driven thinking, full pyramid.",
    locked: true,
    state: "locked",
    progress: 0,
  },
  {
    id: "6",
    number: "06",
    title: "PERFORM / Embody",
    theme: "Embody the practice",
    description: "Hero's journey storytelling, executive presence, influence, memorable closes, brand voice, and the capstone.",
    locked: true,
    state: "locked",
    progress: 0,
  },
];

export const sessionProtocol = [
  { label: "CENTER", duration: "1m" },
  { label: "LISTEN", duration: "3m" },
  { label: "DO", duration: "5m" },
  { label: "SEE", duration: "2m" },
  { label: "COMMIT", duration: "1m" },
];

export const statsBars = [
  { label: "SPRINT 01: NOTICE", value: 0.92, accent: "dark" as const },
  { label: "SPRINT 02: STEADY", value: 0.64, accent: "soft" as const },
  { label: "SPRINT 03: LEAD", value: 0.12, accent: "muted" as const },
];

export const transcriptParagraphs = [
  "...so we look at the pause as a negative space, but in reality, that space is where the listener catches up with your logic.",
  "When we transition to the core concept of cognitive load, we find that the human brain requires markers to indicate it is still processing information.",
  "Fillers function as placeholders. They tell the audience: 'I'm not finished, hold the frame with me for one more second.'",
];

export const sessionStages: SessionStage[] = ["breathe", "lesson", "feedback", "record", "reflect"];

export const SESSIONS_PER_SPRINT = 6;

export type SprintGroup = {
  sprintNumber: number;
  title: string;
  theme: string;
  description: string;
  sessions: SessionDefinition[];
};

export function getSprintNumber(sessionNumber: number) {
  return Math.ceil(sessionNumber / SESSIONS_PER_SPRINT);
}

export function formatSessionMeta(sessionNumber: number) {
  const sprintNumber = getSprintNumber(sessionNumber);
  return {
    session: `Session ${sessionNumber}`,
    sprint: `Sprint ${String(sprintNumber).padStart(2, "0")}`,
    combined: `Session ${sessionNumber} · Sprint ${String(sprintNumber).padStart(2, "0")}`,
  };
}

export function getSprintGroups(): SprintGroup[] {
  const bySprint = new Map<number, SessionDefinition[]>();

  for (const session of sessionDefinitions) {
    const sprintNumber = getSprintNumber(session.sessionNumber);
    const bucket = bySprint.get(sprintNumber) ?? [];
    bucket.push(session);
    bySprint.set(sprintNumber, bucket);
  }

  return Array.from(bySprint.entries())
    .sort(([a], [b]) => a - b)
    .map(([sprintNumber, sessions]) => {
      const card = sprintCards[sprintNumber - 1];
      return {
        sprintNumber,
        title: card?.title ?? `SPRINT ${String(sprintNumber).padStart(2, "0")}`,
        theme: card?.theme ?? "",
        description: card?.description ?? "",
        sessions: sessions.sort((a, b) => a.sessionNumber - b.sessionNumber),
      };
    });
}

export const drills = [
  {
    id: "pace-reset",
    tag: "VOICE TRAINING",
    title: "Two-minute pace reset",
    duration: "2 MIN",
    difficulty: "EASY",
    description: "Bring your cadence back into a calm executive range before a call or presentation.",
    steps: ["Inhale for four", "Speak one sentence slowly", "Pause for two beats"],
  },
  {
    id: "clean-open",
    tag: "COMMUNICATION",
    title: "Clean opening answer",
    duration: "90 SEC",
    difficulty: "MEDIUM",
    description: "Practice landing the first sentence with clarity instead of circling into context.",
    steps: ["State the answer first", "Add one reason", "Stop before you over-explain"],
  },
  {
    id: "pressure-bridge",
    tag: "CONFIDENCE",
    title: "Pressure bridge",
    duration: "3 MIN",
    difficulty: "SHARP",
    description: "Rehearse how to acknowledge pushback and return to your point without sounding defensive.",
    steps: ["Acknowledge the concern", "Answer the real question", "Bridge back to the decision"],
  },
  {
    id: "resonance-warmup",
    tag: "VOICE TRAINING",
    title: "Resonance warmup",
    duration: "75 SEC",
    difficulty: "EASY",
    description: "Lower throat tension and build a fuller, steadier tone before speaking live.",
    steps: ["Hum on the exhale", "Drop the shoulders", "Repeat your first line once"],
  },
];
