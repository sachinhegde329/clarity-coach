import type { SeeData } from "./mockData";
import { getSessionCopy } from "./sessionCopy";

export type CommentaryVars = Record<string, string | number>;

/** Deterministic demo metrics used until live analysis is wired. */
export function getMockMetricsForSession(sessionNumber: number): CommentaryVars {
  const base: CommentaryVars = {
    n: 2 + (sessionNumber % 5),
    pct: 55 + (sessionNumber % 40),
    delta: 8 + (sessionNumber % 12),
    wpm: 128 + (sessionNumber % 24),
    pts: 6 + (sessionNumber % 8),
    Metric: "Pace",
    n_now: 72 + (sessionNumber % 15),
    n_then: 58,
    list: "reciprocity, social proof",
    quote: "The lesson is what they walk out with.",
    threshold: 12,
  };

  const bySession: Record<number, Partial<CommentaryVars>> = {
    1: { n: 12, wpm: 172, pct: 67 },
    2: { wpm: 138, n: 6 },
    3: { n: 3, wpm: 142 },
    4: { n: 8, wpm: 145, pct: 84 },
    5: { pct: 62, wpm: 142 },
    6: { delta: 12, pct: 72 },
    7: { n: 2, pct: 94 },
    8: { pct: 88, wpm: 142 },
    9: { n: 3, wpm: 132 },
    10: { pct: 84, delta: 14 },
    11: { n: 72, wpm: 148 },
    12: { n: 68, delta: 16 },
    13: { n: 6, pct: 72 },
    14: { n: 74, pct: 68 },
    15: { n: 3, pct: 72 },
    16: { n: 64, pct: 70 },
    17: { pct: 72, n: 68 },
    18: { n: 4, pct: 78 },
    19: { n: 3, pct: 82 },
    20: { n: 3, pct: 88 },
    21: { n: 3, pct: 76 },
    22: { n: 4, pct: 82 },
    23: { n: 3, pct: 90 },
    24: { n: 4, pts: 8, pct: 74 },
    25: { n: 2, pct: 68 },
    26: { n: 2, pct: 72 },
    27: { pct: 68, threshold: 15 },
    28: { n: 1, pct: 84 },
    29: { n: 68, pct: 72 },
    30: { Metric: "Pace", n: 141, delta: -6 },
    31: { n: 2, pct: 72 },
    32: { n: 72, pct: 68 },
    33: { pct: 78, list: "reciprocity, social proof, liking" },
    34: { n: 72, quote: "This is the change we have to make, and we have to make it now." },
    35: { pct: 72, n: 8 },
    36: { n_now: 81, n_then: 58, delta: 23 },
  };

  return { ...base, ...(bySession[sessionNumber] ?? {}) } as CommentaryVars;
}

function formatTemplate(template: string, vars: CommentaryVars): string {
  return template.replace(/\{([^}]+)\}/g, (_, key: string) => {
    const value = vars[key.trim()];
    return value !== undefined ? String(value) : `{${key}}`;
  });
}

/** Pick template keys for a session's See stage based on available templates and demo metrics. */
export function selectCommentaryKeys(
  sessionNumber: number,
  templates: Record<string, string>,
): string[] {
  const keys = Object.keys(templates);
  if (keys.length === 0) return [];

  const rules: Record<number, string[]> = {
    1: ["med_filler", "pace_fast", "uptalk_high"],
    2: ["pace_zone", "delta_slower"],
    3: ["pauses_mid", "context_line"],
    4: ["energy_mid", "fillers_under_pressure"],
    5: ["uptalk_mid"],
    6: ["trend_clear_improvement"],
    7: ["fillers_one_two", "time_on_target"],
    8: ["in_zone_mid", "variance_low"],
    9: ["pauses_hit", "quality_strong"],
    10: ["inflection_mid", "delta_better"],
    11: ["brevity_mid", "fast_speech"],
    12: ["score_mixed"],
    13: ["ttc_mid"],
    14: ["three_clean", "structure_strong"],
    15: ["signposts_three"],
    16: ["composite_mid"],
    17: ["similarity_mid"],
    18: ["recovery_mid", "composure", "structural"],
    19: ["quality_strong", "latency_quick"],
    20: ["both_right"],
    21: ["credibility_strong", "ai_disclaimer"],
    22: ["recovery_fast", "structural_held"],
    23: ["hold_full", "label_fit"],
    24: ["delta_better", "adaptive_trigger"],
    25: ["two_of_three"],
    26: ["two_axes", "ai_disclaimer"],
    27: ["intentional_mid"],
    28: ["hypothesis_crisp", "support_strong"],
    29: ["three_of_four"],
    30: ["single_metric", "history_line"],
    31: ["arc_prompted", "ai_disclaimer"],
    32: ["authority_mid"],
    33: ["softened_yes"],
    34: ["close_mid", "close_highlighted"],
    35: ["signature_mid"],
    36: ["composite_mid", "montage_line", "finished_line"],
  };

  const preferred = rules[sessionNumber] ?? [keys[0]!];
  return preferred.filter((k): k is string => Boolean(k && templates[k])).slice(0, 3);
}

export function resolveSessionCommentary(
  sessionNumber: number,
  record: SeeData,
  liveVars?: CommentaryVars,
): { headline: string; lines: string[]; keys: string[] } {
  const copy = getSessionCopy(sessionNumber);
  const templates = record.commentaryTemplates ?? copy?.stages.see?.commentaryTemplates ?? {};
  const vars = liveVars ?? getMockMetricsForSession(sessionNumber);
  const keys = selectCommentaryKeys(sessionNumber, templates);
  const lines = keys.map((key) => formatTemplate(templates[key]!, vars));

  return {
    headline: record.headerMeta ?? copy?.stages.see?.headlineLine ?? record.commentary,
    lines: lines.length ? lines : record.coachInsights ?? [record.commentary],
    keys,
  };
}
