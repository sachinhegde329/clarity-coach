export type CoachingMetric = {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  delta?: string;
};

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
