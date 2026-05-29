import type { SessionDefinition, SessionStage } from "./mockData";

export type StageGuidance = {
  psychological?: string;
  scientific?: string;
  motivation?: string;
  affirmation?: string;
};

export function resolveStageGuidance(session: SessionDefinition, stage: SessionStage): StageGuidance {
  switch (stage) {
    case "breathe":
      return {
        psychological: "Settle the body before asking the voice to perform.",
        scientific: session.stages.breathe.underOrbMeta ?? "Breath pacing lowers vocal tension and steadies phrase length.",
        motivation: session.summary,
        affirmation: session.stages.breathe.quote,
      };
    case "lesson":
      return {
        psychological: "Listen for the pattern without trying to correct it yet.",
        scientific: session.stages.lesson.description,
        motivation: session.stages.lesson.insightQuote?.replace(/^"|"$/g, ""),
        affirmation: "Understanding the pattern is practice.",
      };
    case "feedback":
      return {
        psychological: "Treat the mic as a mirror, not a judge.",
        scientific: "One uninterrupted take gives cleaner behavioral data than a corrected performance.",
        motivation: session.stages.feedback.constraint ?? session.stages.feedback.promptBody,
        affirmation: "An imperfect recording still teaches something true.",
      };
    case "record":
      return {
        psychological: "Read the numbers as behavior from this take, not as identity.",
        scientific: session.stages.record.environmentCopy,
        motivation: session.stages.record.commentary,
        affirmation: "The useful signal is the next adjustment.",
      };
    case "reflect":
      return {
        psychological: "Name the next cue while the session is still fresh.",
        scientific: session.stages.reflect.scienceNote ?? "Speaking a plan aloud strengthens recall when the cue appears later.",
        motivation: session.stages.reflect.suggestedOpener,
        affirmation: session.stages.reflect.metaLine ?? "One clear sentence is enough.",
      };
    default:
      return {
        motivation: session.summary,
      };
  }
}
