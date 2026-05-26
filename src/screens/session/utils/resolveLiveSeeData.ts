import { resolveSessionCommentary } from "../../../data/commentaryEngine";
import type { SeeData } from "../../../data/mockData";
import { metricsToCommentaryVars, metricsToSeeDisplay } from "../../../services/speechMetrics";
import type { SessionAnalysisProps } from "../flow/types";

export function resolveLiveSeeData(input: {
  sessionNumber: number;
  record: SeeData;
  analysis?: SessionAnalysisProps;
}) {
  const { sessionNumber, record, analysis } = input;
  const liveVars = analysis?.metrics?.length ? metricsToCommentaryVars(analysis.metrics) : undefined;
  const commentary = resolveSessionCommentary(sessionNumber, record, liveVars);
  const metrics =
    analysis?.metrics?.length ? metricsToSeeDisplay(analysis.metrics) : (record.metrics ?? []);
  const lines = analysis?.commentaryLines?.length ? analysis.commentaryLines : commentary.lines;
  const isProcessing =
    analysis?.status === "uploading" ||
    analysis?.status === "transcribing" ||
    analysis?.status === "analysing";
  const coachNote = analysis?.critique?.critique ?? lines[0] ?? record.commentary;

  return {
    commentary: { ...commentary, lines },
    metrics,
    isProcessing,
    coachNote,
    recommendation: analysis?.critique?.recommendation ?? null,
    transcript: analysis?.transcript ?? "",
    recordingUri: analysis?.recordingUri ?? null,
    error: analysis?.error ?? null,
  };
}
