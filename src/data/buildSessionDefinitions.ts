import type { SessionDefinition } from "./mockData";
import { sessionCopyEntries, type SessionCopyEntry } from "./sessionCopy";
import { sessionVariants } from "./sessionVariants";

function parseTimeLimit(time?: string): number {
  if (!time) return 60;
  const seconds = time.match(/(\d+)\s*seconds?/i);
  if (seconds) return Number(seconds[1]);
  const minutes = time.match(/(\d+)\s*minutes?/i);
  if (minutes) return Number(minutes[1]) * 60;
  if (/variable/i.test(time)) return 90;
  if (/≈3–4|3-4/i.test(time)) return 240;
  if (/≈2|2 minutes/i.test(time)) return 120;
  if (/≈3|3 minutes/i.test(time)) return 180;
  if (/75 seconds/i.test(time)) return 75;
  if (/90 seconds total/i.test(time)) return 90;
  return 60;
}

function mapChallengeType(challengeType?: string) {
  const ct = (challengeType ?? "Constraint").toLowerCase();
  const open = ct.includes("open");
  return {
    challengeType: challengeType ?? "Constraint",
    uiVariant: open ? ("open_prompt" as const) : ("default" as const),
    listenOnly: ct.includes("side-by-side"),
    replayMode: ct.includes("replay") && !ct.includes("side-by-side"),
    adversarial: ct.includes("adversarial"),
    reactive: ct.includes("reactive"),
    metricSelection: ct.includes("lens-driven"),
    comparative: ct.includes("comparative"),
    skipCentre: ct.includes("capstone") || ct.includes("no centre"),
  };
}

function parseMetrics(metricsShown?: string) {
  if (!metricsShown) {
    return [
      { label: "CLARITY", value: "—", description: "Session readout" },
      { label: "PACE", value: "—", unit: "WPM" },
      { label: "STRUCTURE", value: "—" },
    ];
  }

  return metricsShown
    .split(/[·*]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((rawLabel) => {
      const label = rawLabel.replace(/\s+/g, " ").trim();
      const lower = label.toLowerCase();
      const unit =
        /\bwpm\b/.test(lower) ? "WPM" :
        /\b%|percent\b/.test(lower) ? "%" :
        undefined;

      // Default to placeholders; real values come from the analysis pipeline.
      return {
        label: label.toUpperCase(),
        value: "—",
        unit,
        description: label,
      };
    });
}

function transcriptPassages(transcript?: string) {
  if (!transcript) return undefined;
  const chunks = transcript.match(/[^.!?]+[.!?]+/g) ?? [transcript];
  return chunks.slice(0, 5).map((text, index) => ({
    text: text.trim(),
    tone: index % 2 === 1 ? ("muted" as const) : ("default" as const),
  }));
}

function buildFromCopy(entry: SessionCopyEntry): SessionDefinition {
  const { centre, listen, do: doStage, see, commit } = entry.stages;
  const sprintLabel = `SPRINT ${entry.sprintNumber}`;
  const sessionLabel = `SESSION ${entry.sessionNumber}`;
  const challenge = mapChallengeType(doStage?.challengeType);
  const timeLimit = parseTimeLimit(doStage?.time);

  const onScreen = centre?.onScreenLines ?? [];
  const breathePrompt = onScreen.join("\n") || centre?.stepLabel || entry.concept;

  return {
    sessionNumber: entry.sessionNumber,
    sprintLabel,
    sessionLabel,
    arcTitle: entry.name,
    focusLine: entry.concept,
    practiceTitle: entry.name.toUpperCase(),
    summary: entry.concept,
    skipCentre: entry.sessionNumber === 36 ? false : (centre?.stepLabel?.includes("No Centre") ?? false),
    stages: {
      breathe: {
        stepName: centre?.stepName,
        title: centre?.stepLabel ?? entry.name,
        subtitle: entry.sprintMeta,
        prompt: breathePrompt,
        statusLabel: entry.sprintName.toUpperCase(),
        quote: centre?.subLine ?? onScreen[0] ?? entry.concept,
        underOrbMeta: centre?.subLine,
        onScreenLines: onScreen,
        exerciseLabel: centre?.stepLabel,
        breathPattern:
          entry.sessionNumber === 2
            ? { inhale: 4, exhale: 6 }
            : entry.sessionNumber === 3 || entry.sessionNumber === 9
              ? { inhale: 4, hold: 4, exhale: 4 }
              : undefined,
        levels:
          entry.sessionNumber === 4
            ? [
                { label: "Quiet", description: "First pass — softer than feels natural." },
                { label: "Normal", description: "Your conversational baseline." },
                { label: "Loud", description: "Push past the volume that feels normal." },
              ]
            : entry.sessionNumber === 6
              ? [
                  { label: "01", description: "Today, no recording. Just listening." },
                  { label: "02", description: "Hear the baseline and Session 5 with the attention you would give a colleague." },
                ]
              : undefined,
      },
      lesson: {
        stepName: listen?.stepName,
        title: listen?.tidbitTitle ?? entry.name,
        subtitle: entry.sprintMeta,
        description: listen?.transcript?.split(".")[0] ?? entry.concept,
        audioTitle: listen?.tidbitTitle ?? entry.name,
        audioDuration: "1:00",
        insightTitle: listen?.tidbitTitle?.toUpperCase() ?? "LISTEN",
        insightQuote: listen?.pullQuote ? `"${listen.pullQuote}"` : `"${entry.concept}"`,
        transcriptHighlight: entry.name.toUpperCase(),
        transcriptMeta: `${sprintLabel} · ${entry.sprintName.toUpperCase()}`,
        coachingPassages: transcriptPassages(listen?.transcript),
        comparisonAudio:
          entry.sessionNumber === 6
            ? [
                { label: "RECORDING A", tag: "SESSION 1", description: "Your baseline" },
                { label: "RECORDING B", tag: "SESSION 5", description: "Five sessions later" },
              ]
            : undefined,
      },
      feedback: {
        stepName: doStage?.stepName,
        promptTitle: doStage?.prompt ?? entry.name,
        promptBody: challenge.listenOnly
          ? "Listen through both recordings, then continue."
          : challenge.replayMode
            ? "Replay your strongest recent take, then continue."
            : "Speak once, then review your readout.",
        badge: doStage?.constraint ?? sprintLabel,
        constraint: doStage?.constraint,
        preRecordMeta: doStage?.doMetaLine,
        hidePreRecordMetaOnRecord: entry.sessionNumber === 1,
        uiVariant: challenge.uiVariant,
        timeLimit,
        challengeType: challenge.challengeType,
        listenOnly: challenge.listenOnly,
        replayMode: challenge.replayMode,
        adversarial: challenge.adversarial,
        reactive: challenge.reactive,
        metricSelection: challenge.metricSelection,
        comparative: challenge.comparative,
        closingLine: doStage?.closingLine,
        paceTarget:
          entry.sessionNumber === 8
            ? { label: "130–150 WPM", min: 120, max: 170, target: 140 }
            : undefined,
        nouns: entry.sessionNumber === 4 ? ["Lighthouse", "Anchor", "Compass"] : undefined,
        contextVariants: sessionVariants[entry.sessionNumber],
      },
      record: {
        stepName: see?.stepName,
        badge: sessionLabel,
        title: entry.name.toUpperCase(),
        commentary: see?.headlineLine ?? entry.concept,
        environment: entry.sprintMeta,
        environmentCopy: see?.seeSubLine ?? entry.concept,
        headerMeta: see?.headlineLine,
        subline: see?.seeSubLine,
        reveal: entry.sessionNumber === 1 || entry.sessionNumber === 3 ? { durationMs: 700, staggerMs: 180, sequential: true } : undefined,
        metrics: parseMetrics(see?.metricsShown),
        commentaryTemplates: see?.commentaryTemplates,
        premiumUpsell: see?.premiumUpsell,
        coachInsights: see?.commentaryTemplates
          ? Object.values(see.commentaryTemplates).slice(0, 2)
          : undefined,
      },
      reflect: {
        stepName: commit?.stepName,
        promptTitle: commit?.freeResponsePrompt ?? commit?.opener ?? "Tomorrow I will…",
        promptKicker: `${sessionLabel} · COMMIT`,
        suggestedOpener: commit?.opener ?? commit?.freeResponsePrompt ?? "Complete the sentence out loud.",
        metaLine: commit?.commitMetaLine,
        micActiveMeta: commit?.commitMetaLine,
        bodyText: commit?.freeResponsePrompt,
        freeResponse: Boolean(commit?.freeResponsePrompt),
      },
    },
  };
}

export function buildAllSessionDefinitions(): SessionDefinition[] {
  return sessionCopyEntries.map(buildFromCopy);
}
