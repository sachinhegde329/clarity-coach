import type { CoachingMetric } from "../types/production";
import type { CommentaryVars } from "../data/commentaryEngine";
import type { SessionAnalysisSnapshot } from "./sessions";

const FILLER_PATTERN = /\b(um+|uh+|er+|ah+|like|you know|sort of|kind of|basically|actually|literally|right\?)\b/gi;

function clampInt(value: number, min: number, max: number) {
  const v = Math.round(value);
  return Math.max(min, Math.min(max, v));
}

function normalizeKey(label: string) {
  return label
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function canonicalizeLabel(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("average pause")) return "AVERAGE PAUSE LENGTH";
  if (lower.includes("pause hold")) return "PAUSE HOLD TIME";
  if (lower.includes("time to conclusion")) return "TIME TO CONCLUSION";
  if (lower.includes("pace")) return "PACE";
  if (lower.includes("mean wpm")) return "PACE";
  if (lower.includes("filler")) return "FILLERS";
  if (lower.includes("uptalk")) return "UPTALK";
  if (lower.includes("pause")) return "PAUSES";
  if (lower.includes("inflection")) return "INFLECTION RATE";
  if (lower.includes("brevity")) return "BREVITY SCORE";
  if (lower.includes("composite") && lower.includes("clarity")) return "COMPOSITE CLARITY SCORE";
  if (lower.includes("composite score")) return "COMPOSITE CLARITY SCORE";
  if (lower.includes("clarity score")) return "COMPOSITE CLARITY SCORE";
  if (lower.includes("words") || lower.includes("word count")) return "WORD COUNT";
  if (lower.includes("time used") || lower.includes("time to finish")) return "TIME USED";
  if (lower.includes("time on target")) return "TIME ON TARGET";
  if (lower.includes("time in zone")) return "TIME IN ZONE";
  return label.toUpperCase();
}

function metricNumber(metric?: CoachingMetric | null) {
  if (!metric) return null;
  if (typeof metric.value === "number") return metric.value;
  const match = String(metric.value).match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function getMetricByCanonical(metrics: CoachingMetric[], label: string) {
  const canonical = canonicalizeLabel(label).toLowerCase();
  return metrics.find((metric) => canonicalizeLabel(metric.label).toLowerCase() === canonical);
}

function getMetricValue(metrics: CoachingMetric[], label: string) {
  return metricNumber(getMetricByCanonical(metrics, label));
}

function average(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]) {
  if (values.length < 2) return 0;
  const mean = average(values) ?? 0;
  const variance = average(values.map((value) => Math.pow(value - mean, 2))) ?? 0;
  return Math.sqrt(variance);
}

function percentDelta(current: number, baseline: number) {
  if (!Number.isFinite(current) || !Number.isFinite(baseline) || baseline === 0) return 0;
  return clampInt(((current - baseline) / Math.abs(baseline)) * 100, -999, 999);
}

function countMatches(text: string, pattern: RegExp) {
  return text.match(pattern)?.length ?? 0;
}

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

/**
 * Deterministic, cheap metrics used to keep Sprint 06 See screens functional without AI scoring.
 * These are best-effort heuristics based on transcript + duration.
 */
export function deriveDeterministicSeeMetrics(input: {
  transcript: string;
  durationMs: number;
  baseMetrics: CoachingMetric[];
}): CoachingMetric[] {
  const { transcript, durationMs, baseMetrics } = input;
  const byKey = Object.fromEntries(baseMetrics.map((metric) => [metric.key, metric.value]));
  const wpm = Number(byKey.wpm ?? 0);
  const fillers = Number(byKey.fillers ?? 0);
  const uptalkPct = Number(byKey.uptalk ?? 0);
  const wordCount = Number(byKey.words ?? transcript.trim().split(/\s+/).filter(Boolean).length);
  const durationSec = Math.max(durationMs / 1000, 1);
  const pauses = Number(byKey.pauses ?? 0);

  // Brevity is higher when you're not overfilling the time window with words.
  const expectedWords = durationSec * (140 / 60); // ~140 WPM target baseline.
  const overRatio = expectedWords > 0 ? Math.max(0, (wordCount - expectedWords) / expectedWords) : 0;
  const brevityScore = clampInt(100 - overRatio * 100, 0, 100);

  // Simple pace score: best at ~140 WPM, down as you deviate.
  const paceDistance = Math.abs(wpm - 140);
  const paceScore = clampInt(100 - (paceDistance / 60) * 100, 0, 100);

  // Penalize fillers and high uptalk.
  const fillerPenalty = clampInt(fillers * 6, 0, 60);
  const uptalkPenalty = clampInt((uptalkPct / 100) * 20, 0, 20);

  const composite = clampInt((paceScore * 0.45 + brevityScore * 0.35 + (100 - fillerPenalty) * 0.15 + (100 - uptalkPenalty) * 0.05), 0, 100);

  // Inflection is approximated from uptalk % for now.
  const inflectionRate = clampInt(100 - uptalkPct, 0, 100);

  // Time used as mm:ss.
  const totalSeconds = Math.max(0, Math.round(durationSec));
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  const timeUsed = `${mm}:${ss}`;

  // “Time in zone” and “time on target” are approximations from WPM distance.
  const inZone = wpm >= 130 && wpm <= 150 ? 100 : clampInt(100 - (Math.abs(wpm - 140) / 40) * 100, 0, 100);
  const onTarget = wpm >= 135 && wpm <= 145 ? 100 : clampInt(100 - (Math.abs(wpm - 140) / 30) * 100, 0, 100);

  // Average pause length derived from estimated speaking time.
  const speechSec = wpm > 0 ? wordCount / (wpm / 60) : durationSec;
  const silenceSec = Math.max(0, durationSec - speechSec);
  const avgPauseMs = pauses > 0 ? Math.round((silenceSec / pauses) * 1000) : 0;

  return [
    { key: "brevity_score", label: "BREVITY SCORE", value: brevityScore, unit: "%" },
    { key: "inflection_rate", label: "INFLECTION RATE", value: inflectionRate, unit: "%" },
    { key: "clarity_score", label: "COMPOSITE CLARITY SCORE", value: composite, unit: "" },
    { key: "word_count", label: "WORD COUNT", value: wordCount, unit: "" },
    { key: "time_used", label: "TIME USED", value: timeUsed, unit: "" },
    { key: "time_in_zone", label: "TIME IN ZONE", value: inZone, unit: "%" },
    { key: "time_on_target", label: "TIME ON TARGET", value: onTarget, unit: "%" },
    { key: "avg_pause_ms", label: "AVERAGE PAUSE LENGTH", value: avgPauseMs, unit: "MS" },
  ];
}

export function deriveSessionSpecificMetrics(input: {
  sessionNumber: number;
  requestedLabels: string[];
  transcript: string;
  durationMs: number;
  currentMetrics: CoachingMetric[];
  analysisBySession: Record<number, SessionAnalysisSnapshot>;
  selectedMetricLabel?: string | null;
}): CoachingMetric[] {
  const { sessionNumber, requestedLabels, transcript, currentMetrics, analysisBySession, selectedMetricLabel } = input;
  const normalizedTranscript = transcript.trim();
  const sentences = normalizedTranscript.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  const words = normalizedTranscript.split(/\s+/).filter(Boolean);
  const firstSentenceWords = sentences[0]?.split(/\s+/).filter(Boolean).length ?? 0;
  const signpostCount = countMatches(normalizedTranscript, /\b(first|second|third|finally|next|lastly|to begin|in summary|bottom line)\b/gi);
  const becauseCount = countMatches(normalizedTranscript, /\b(because|so that|which means|therefore|therefore|so|as a result)\b/gi);
  const questionCount = countMatches(normalizedTranscript, /\?/g);
  const temporalMarkers = countMatches(normalizedTranscript, /\b(first|then|after|before|finally|eventually|suddenly|when|while|later)\b/gi);
  const emotionLabels = countMatches(normalizedTranscript, /\b(frustrated|concerned|stuck|worried|angry|upset|excited|confused|nervous|disappointed)\b/gi);
  const hedges = countMatches(normalizedTranscript, /\b(maybe|perhaps|i think|sort of|kind of|probably)\b/gi);

  const pace = getMetricValue(currentMetrics, "PACE") ?? 0;
  const fillers = getMetricValue(currentMetrics, "FILLERS") ?? 0;
  const uptalk = getMetricValue(currentMetrics, "UPTALK") ?? 0;
  const pauses = getMetricValue(currentMetrics, "PAUSES") ?? 0;
  const brevity = getMetricValue(currentMetrics, "BREVITY SCORE") ?? 0;
  const inflection = getMetricValue(currentMetrics, "INFLECTION RATE") ?? 0;
  const clarity = getMetricValue(currentMetrics, "COMPOSITE CLARITY SCORE") ?? 0;
  const timeInZone = getMetricValue(currentMetrics, "TIME IN ZONE") ?? 0;
  const avgPause = getMetricValue(currentMetrics, "AVERAGE PAUSE LENGTH") ?? 0;

  const structureScore = clampInt(35 + signpostCount * 12 + becauseCount * 7 + (firstSentenceWords <= 12 ? 14 : 4), 0, 100);
  const composureScore = clampInt((100 - Math.min(fillers * 8, 40)) * 0.3 + (100 - uptalk) * 0.25 + Math.min(timeInZone, 100) * 0.2 + Math.min(inflection, 100) * 0.25, 0, 100);
  const authorityScore = clampInt((100 - hedges * 10) * 0.25 + structureScore * 0.25 + composureScore * 0.25 + (firstSentenceWords <= 10 ? 100 : 70) * 0.25, 0, 100);
  const narrativeQuality = clampInt(30 + temporalMarkers * 14 + becauseCount * 8 + (sentences.length >= 3 ? 16 : 6), 0, 100);
  const arcCompleteness = clampInt(25 + temporalMarkers * 12 + (sentences.length >= 4 ? 24 : 8) + (becauseCount > 0 ? 10 : 0), 0, 100);
  const persuasionQuality = clampInt(25 + becauseCount * 15 + structureScore * 0.25 + authorityScore * 0.25, 0, 100);
  const principleUsage = clampInt(20 + countMatches(normalizedTranscript, /\b(principle|rule|framework|standard|heuristic|trade-off)\b/gi) * 18 + becauseCount * 6, 0, 100);
  const questionQuality = clampInt(20 + questionCount * 20 + (questionCount > 0 ? 20 : 0) + composureScore * 0.2, 0, 100);
  const responseLatency = clampInt(Math.max(1, Math.round(firstSentenceWords / Math.max(pace / 60, 1))), 0, 30);
  const mirrorAccuracy = clampInt(20 + countMatches(normalizedTranscript, /\b(you said|what i hear|it sounds like|what i’m hearing)\b/gi) * 25, 0, 100);
  const auditFluency = clampInt(20 + countMatches(normalizedTranscript, /\b(you may think|you could say|some might say|you might ask)\b/gi) * 20 + structureScore * 0.2, 0, 100);
  const preemptionCredibility = clampInt(25 + becauseCount * 10 + authorityScore * 0.3, 0, 100);
  const labelAppropriateness = clampInt(25 + emotionLabels * 20 + (avgPause > 1200 ? 15 : 5), 0, 100);
  const framingFluency = clampInt(25 + structureScore * 0.35 + authorityScore * 0.2, 0, 100);
  const structuralConsistency = clampInt(structureScore * 0.85 + composureScore * 0.15, 0, 100);
  const energyVariance = clampInt(standardDeviation(sentences.map((sentence) => sentence.split(/\s+/).filter(Boolean).length)) * 6, 0, 100);
  const energyIntentionality = clampInt(100 - Math.abs(energyVariance - 35), 0, 100);
  const hypothesisClarity = clampInt(20 + countMatches(normalizedTranscript, /\b(i think|my hypothesis|i believe|likely|probably|because)\b/gi) * 15, 0, 100);
  const supportQuality = clampInt(25 + becauseCount * 15 + signpostCount * 10, 0, 100);
  const bodyCloseCoherence = clampInt(25 + (sentences.length >= 3 ? 20 : 6) + becauseCount * 10 + (firstSentenceWords <= 12 ? 10 : 0), 0, 100);
  const closeStrength = clampInt(20 + countMatches(normalizedTranscript, /\b(so|therefore|that’s why|in short|bottom line|overall)\b/gi) * 18, 0, 100);
  const signatureConsistency = clampInt(30 + authorityScore * 0.35 + narrativeQuality * 0.2, 0, 100);
  const structuralSimilarity = clampInt((structureScore + narrativeQuality) / 2, 0, 100);
  const structuralIntegrity = clampInt(structureScore * 0.75 + composureScore * 0.25, 0, 100);
  const recoveryTime = clampInt(Math.max(1, Math.round((fillers + hedges + Math.max(firstSentenceWords - 10, 0) / 4))), 1, 20);
  const pivotRecoveryTime = clampInt(Math.max(1, Math.round(recoveryTime - signpostCount * 0.5)), 1, 20);
  const pauseHoldTime = clampInt(avgPause, 0, 6000);
  const structureQuality = clampInt((structureScore + supportQuality) / 2, 0, 100);
  const compositeScore = clampInt((structureScore * 0.35 + brevity * 0.2 + clarity * 0.25 + authorityScore * 0.2), 0, 100);
  const timeToConclusion = clampInt(Math.max(1, Math.round(firstSentenceWords / Math.max(pace / 60, 1))), 1, 30);

  const sessionNumbers = Object.keys(analysisBySession)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value < sessionNumber)
    .sort((a, b) => a - b);
  const currentSprintStart = Math.floor((sessionNumber - 1) / 6) * 6 + 1;
  const sprintHistory = sessionNumbers.filter((value) => value >= currentSprintStart);

  const priorMetricValues = (label: string, sourceSessions = sessionNumbers) =>
    sourceSessions
      .map((sessionId) => getMetricValue(analysisBySession[sessionId]?.metrics ?? [], label))
      .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  const fillerTrend = percentDelta(fillers, priorMetricValues("FILLERS", sprintHistory)[0] ?? fillers ?? 1);
  const paceTrend = percentDelta(pace, average(priorMetricValues("PACE", sprintHistory)) ?? pace ?? 1);
  const inflectionTrend = percentDelta(inflection, average(priorMetricValues("INFLECTION RATE", sprintHistory)) ?? inflection ?? 1);
  const brevityTrend = percentDelta(brevity, average(priorMetricValues("BREVITY SCORE", sprintHistory)) ?? brevity ?? 1);
  const paceStability = clampInt(100 - standardDeviation([...priorMetricValues("PACE", sprintHistory), pace]) * 2, 0, 100);
  const fillerTrajectory = percentDelta(fillers, priorMetricValues("FILLERS", sprintHistory)[0] ?? fillers ?? 1);
  const paceVariance = clampInt(standardDeviation([...priorMetricValues("PACE", sprintHistory), pace]), 0, 100);
  const recoveryDelta = clampInt(recoveryTime - (average(priorMetricValues("RECOVERY TIME", sprintHistory)) ?? recoveryTime), -50, 50);
  const composureDelta = clampInt(composureScore - (average(priorMetricValues("COMPOSURE SCORE", sprintHistory)) ?? composureScore), -50, 50);
  const structuralDelta = clampInt(structuralIntegrity - (average(priorMetricValues("STRUCTURAL INTEGRITY", sprintHistory)) ?? structuralIntegrity), -50, 50);

  const chosenCanonical = selectedMetricLabel ? canonicalizeLabel(selectedMetricLabel) : null;
  const chosenMetricValue =
    chosenCanonical === "PACE" ? pace :
    chosenCanonical === "FILLERS" ? fillers :
    chosenCanonical === "INFLECTION RATE" ? inflection :
    chosenCanonical === "COMPOSITE CLARITY SCORE" ? clarity :
    null;

  const metricMap: Record<string, CoachingMetric> = {
    "ENERGY SCORE": { key: "energy_score", label: "ENERGY SCORE", value: clampInt(100 - energyVariance * 0.7, 0, 100), unit: "%" },
    "FILLER TRAJECTORY": { key: "filler_trajectory", label: "FILLER TRAJECTORY", value: fillerTrend, unit: "%" },
    "PACE STABILITY": { key: "pace_stability", label: "PACE STABILITY", value: paceStability, unit: "%" },
    "INFLECTION TREND": { key: "inflection_trend", label: "INFLECTION TREND", value: inflectionTrend, unit: "%" },
    "PAUSE FREQUENCY": { key: "pause_frequency", label: "PAUSE FREQUENCY", value: pauses, unit: "" },
    "PAUSE COUNT": { key: "pause_count", label: "PAUSE COUNT", value: pauses, unit: "" },
    "MEAN WPM": { key: "mean_wpm", label: "MEAN WPM", value: pace, unit: "WPM" },
    "PACE VARIANCE": { key: "pace_variance", label: "PACE VARIANCE", value: paceVariance, unit: "" },
    "FILLER TREND": { key: "filler_trend", label: "FILLER TREND", value: fillerTrend, unit: "%" },
    "PACE TREND": { key: "pace_trend", label: "PACE TREND", value: paceTrend, unit: "%" },
    "BREVITY TREND": { key: "brevity_trend", label: "BREVITY TREND", value: brevityTrend, unit: "%" },
    "CLARITY SCORE": { key: "clarity_score_review", label: "CLARITY SCORE", value: clarity, unit: "%" },
    "TIME TO CONCLUSION": { key: "time_to_conclusion", label: "TIME TO CONCLUSION", value: timeToConclusion, unit: "S" },
    "STRUCTURE SCORE": { key: "structure_score", label: "STRUCTURE SCORE", value: structureScore, unit: "%" },
    "SIGNPOST COUNT": { key: "signpost_count", label: "SIGNPOST COUNT", value: signpostCount, unit: "" },
    "COMPOSITE SCORE": { key: "composite_score", label: "COMPOSITE SCORE", value: compositeScore, unit: "%" },
    "STRUCTURAL SIMILARITY": { key: "structural_similarity", label: "STRUCTURAL SIMILARITY", value: structuralSimilarity, unit: "%" },
    "RECOVERY TIME": { key: "recovery_time", label: "RECOVERY TIME", value: recoveryTime, unit: "S" },
    "QUESTION QUALITY": { key: "question_quality", label: "QUESTION QUALITY", value: questionQuality, unit: "%" },
    "RESPONSE LATENCY": { key: "response_latency", label: "RESPONSE LATENCY", value: responseLatency, unit: "S" },
    "MIRROR ACCURACY": { key: "mirror_accuracy", label: "MIRROR ACCURACY", value: mirrorAccuracy, unit: "%" },
    "TONE (DOWNWARD)": { key: "tone_downward", label: "TONE (DOWNWARD)", value: inflection, unit: "%" },
    "AUDIT FLUENCY": { key: "audit_fluency", label: "AUDIT FLUENCY", value: auditFluency, unit: "%" },
    "PRE-EMPTION CREDIBILITY": { key: "preemption_credibility", label: "PRE-EMPTION CREDIBILITY", value: preemptionCredibility, unit: "%" },
    "STRUCTURAL QUALITY": { key: "structural_quality", label: "STRUCTURAL QUALITY", value: structureQuality, unit: "%" },
    "PIVOT RECOVERY TIME": { key: "pivot_recovery_time", label: "PIVOT RECOVERY TIME", value: pivotRecoveryTime, unit: "S" },
    "STRUCTURAL INTEGRITY": { key: "structural_integrity", label: "STRUCTURAL INTEGRITY", value: structuralIntegrity, unit: "%" },
    "COMPOSURE SCORE": { key: "composure_score", label: "COMPOSURE SCORE", value: composureScore, unit: "%" },
    "PAUSE HOLD TIME": { key: "pause_hold_time", label: "PAUSE HOLD TIME", value: pauseHoldTime, unit: "MS" },
    "LABEL APPROPRIATENESS": { key: "label_appropriateness", label: "LABEL APPROPRIATENESS", value: labelAppropriateness, unit: "%" },
    "RECOVERY DELTA": { key: "recovery_delta", label: "RECOVERY DELTA", value: recoveryDelta, unit: "" },
    "COMPOSURE DELTA": { key: "composure_delta", label: "COMPOSURE DELTA", value: composureDelta, unit: "" },
    "STRUCTURAL DELTA": { key: "structural_delta", label: "STRUCTURAL DELTA", value: structuralDelta, unit: "" },
    "FRAMING FLUENCY": { key: "framing_fluency", label: "FRAMING FLUENCY", value: framingFluency, unit: "%" },
    "STRUCTURAL CONSISTENCY": { key: "structural_consistency", label: "STRUCTURAL CONSISTENCY", value: structuralConsistency, unit: "%" },
    "NARRATIVE QUALITY": { key: "narrative_quality", label: "NARRATIVE QUALITY", value: narrativeQuality, unit: "%" },
    "ENERGY VARIANCE": { key: "energy_variance", label: "ENERGY VARIANCE", value: energyVariance, unit: "%" },
    "ENERGY INTENTIONALITY": { key: "energy_intentionality", label: "ENERGY INTENTIONALITY", value: energyIntentionality, unit: "%" },
    "HYPOTHESIS CLARITY": { key: "hypothesis_clarity", label: "HYPOTHESIS CLARITY", value: hypothesisClarity, unit: "%" },
    "SUPPORT QUALITY": { key: "support_quality", label: "SUPPORT QUALITY", value: supportQuality, unit: "%" },
    "STRUCTURE QUALITY": { key: "structure_quality", label: "STRUCTURE QUALITY", value: structureQuality, unit: "%" },
    "ARC COMPLETENESS": { key: "arc_completeness", label: "ARC COMPLETENESS", value: arcCompleteness, unit: "%" },
    "AUTHORITY SCORE": { key: "authority_score", label: "AUTHORITY SCORE", value: authorityScore, unit: "%" },
    "COMPOSURE UNDER INTERJECTION": { key: "composure_under_interjection", label: "COMPOSURE UNDER INTERJECTION", value: composureScore, unit: "%" },
    "PERSUASION QUALITY": { key: "persuasion_quality", label: "PERSUASION QUALITY", value: persuasionQuality, unit: "%" },
    "PRINCIPLE USAGE": { key: "principle_usage", label: "PRINCIPLE USAGE", value: principleUsage, unit: "%" },
    "CLOSE STRENGTH": { key: "close_strength", label: "CLOSE STRENGTH", value: closeStrength, unit: "%" },
    "BODY-CLOSE COHERENCE": { key: "body_close_coherence", label: "BODY-CLOSE COHERENCE", value: bodyCloseCoherence, unit: "%" },
    "SIGNATURE CONSISTENCY": { key: "signature_consistency", label: "SIGNATURE CONSISTENCY", value: signatureConsistency, unit: "%" },
  };

  if (chosenCanonical && chosenMetricValue !== null) {
    metricMap[chosenCanonical] = {
      key: normalizeKey(chosenCanonical),
      label: selectedMetricLabel ?? chosenCanonical,
      value: chosenMetricValue,
      unit: chosenCanonical === "PACE" ? "WPM" : chosenCanonical.includes("RATE") || chosenCanonical.includes("SCORE") ? "%" : "",
    };
  }

  return requestedLabels
    .map((label) => metricMap[label.replace(/\s+/g, " ").trim().toUpperCase()])
    .filter((metric): metric is CoachingMetric => Boolean(metric));
}

export function mergeMetricsInLabelOrder(input: {
  requestedLabels: string[];
  placeholders?: CoachingMetric[];
  baseMetrics: CoachingMetric[];
  derivedMetrics?: CoachingMetric[];
  scoredMetrics?: CoachingMetric[];
}): CoachingMetric[] {
  const { requestedLabels, placeholders = [], baseMetrics, derivedMetrics = [], scoredMetrics = [] } = input;
  const normalizedRequested = requestedLabels.map((label) => label.trim()).filter(Boolean);
  const byCanonical = new Map<string, CoachingMetric>();

  const consider = (metric: CoachingMetric) => {
    const canonical = canonicalizeLabel(metric.label).toLowerCase();
    byCanonical.set(canonical, metric);
  };

  // Order of precedence: placeholders < base < derived < scored
  placeholders.forEach(consider);
  baseMetrics.forEach(consider);
  derivedMetrics.forEach(consider);
  scoredMetrics.forEach(consider);

  const ordered: CoachingMetric[] = [];
  const seen = new Set<string>();
  for (const label of normalizedRequested) {
    const canonical = canonicalizeLabel(label);
    const displayLabel = label.replace(/\s+/g, " ").trim().toUpperCase();
    const metric = byCanonical.get(canonical.toLowerCase());
    if (metric) {
      ordered.push({
        ...metric,
        key: metric.key || normalizeKey(displayLabel),
        label: displayLabel,
      });
      seen.add(canonical.toLowerCase());
      continue;
    }
    ordered.push({ key: normalizeKey(displayLabel), label: displayLabel, value: "—" });
    seen.add(canonical.toLowerCase());
  }

  // Append base/derived/scored metrics not explicitly requested (so you still see pace/fillers etc).
  const appendUnique = (metric: CoachingMetric) => {
    const k = canonicalizeLabel(metric.label).toLowerCase();
    if (seen.has(k)) return;
    ordered.push({ ...metric, key: metric.key || normalizeKey(metric.label), label: canonicalizeLabel(metric.label) });
    seen.add(k);
  };
  baseMetrics.forEach(appendUnique);
  derivedMetrics.forEach(appendUnique);
  scoredMetrics.forEach(appendUnique);

  return ordered;
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
  return metrics.map((metric) => ({
    label: metric.label,
    value: String(metric.value),
    unit: metric.unit,
    delta: metric.delta,
    description: metric.label,
    foot: metric.unit ?? metric.delta,
    bar: typeof metric.value === "number" ? Math.min(100, Math.max(0, metric.value)) : undefined,
  }));
}
