import type { CoachingMetric } from "../types/production";
import type { CommentaryVars } from "../data/commentaryEngine";

const FILLER_PATTERN = /\b(um+|uh+|er+|ah+|like|you know|sort of|kind of|basically|actually|literally|right\?)\b/gi;

export function computeSpeechMetrics(transcript: string, durationMs: number): CoachingMetric[] {
  const text = transcript.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const durationSec = Math.max(durationMs / 1000, 1);
  const wpm = Math.round((wordCount / durationSec) * 60);
  const fillers = (text.match(FILLER_PATTERN) ?? []).length;
  const sentences = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  const uptalkCount = sentences.filter((sentence) => /\?\s*$/.test(sentence)).length;
  const uptalkPct = sentences.length > 0 ? Math.round((uptalkCount / sentences.length) * 100) : 0;
  const pauseEstimate = Math.max(0, Math.round(durationSec / Math.max(wordCount, 1) * 10) - 3);

  return [
    { key: "wpm", label: "PACE", value: wpm, unit: "WPM" },
    { key: "fillers", label: "FILLERS", value: fillers },
    { key: "uptalk", label: "UPTALK", value: uptalkPct, unit: "%" },
    { key: "pauses", label: "PAUSES", value: pauseEstimate },
    { key: "words", label: "WORDS", value: wordCount },
  ];
}

export function metricsToCommentaryVars(metrics: CoachingMetric[]): CommentaryVars {
  const byKey = Object.fromEntries(metrics.map((metric) => [metric.key, metric.value]));
  const wpm = Number(byKey.wpm ?? 140);
  const fillers = Number(byKey.fillers ?? 2);
  const uptalk = Number(byKey.uptalk ?? 50);

  return {
    n: fillers,
    pct: uptalk,
    delta: Math.max(4, Math.round(wpm / 12)),
    wpm,
    pts: Math.max(4, 10 - fillers),
    Metric: "Pace",
    n_now: wpm,
    n_then: Math.max(100, wpm - 14),
    list: "clarity, pace, structure",
    quote: "The lesson is what they walk out with.",
    threshold: 12,
  };
}

export function metricsToSeeDisplay(metrics: CoachingMetric[]) {
  return metrics.slice(0, 3).map((metric) => ({
    label: metric.label,
    value: String(metric.value),
    unit: metric.unit,
    delta: metric.delta,
    description: metric.label,
    foot: metric.unit ?? metric.delta,
    bar: typeof metric.value === "number" ? Math.min(100, Math.max(0, metric.value)) : undefined,
  }));
}
