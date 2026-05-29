import { useEffect, useMemo, useRef } from "react";
import type { DoData, SessionDefinition } from "../../../data/mockData";
import { useUserProfileStore } from "../../../stores/userProfileStore";
import { trackEvent } from "../../../services/analytics";

/**
 * Resolves the training-goal variant for the feedback (Do) stage of a session.
 * Falls through to the base content when no variant matches the user's goal.
 */
export function useSessionVariant(
  session: SessionDefinition,
): { feedback: DoData } {
  const trainingGoal = useUserProfileStore((s) => s.trainingGoal);
  const trackedSessionRef = useRef<number | null>(null);

  const result = useMemo(() => {
    const base = session.stages.feedback;
    const variants = base.contextVariants;
    if (!variants) return { feedback: base, matched: false };

    const variant = variants[trainingGoal];
    if (!variant) return { feedback: base, matched: false };

    return {
      feedback: {
        ...base,
        ...(variant.promptTitle !== undefined && { promptTitle: variant.promptTitle }),
        ...(variant.promptBody !== undefined && { promptBody: variant.promptBody }),
        ...(variant.constraint !== undefined && { constraint: variant.constraint }),
        ...(variant.preRecordMeta !== undefined && { preRecordMeta: variant.preRecordMeta }),
        ...(variant.closingLine !== undefined && { closingLine: variant.closingLine }),
        ...(variant.badge !== undefined && { badge: variant.badge }),
        ...(variant.headerMeta !== undefined && { headerMeta: variant.headerMeta }),
      },
      matched: true,
    };
  }, [session, trainingGoal]);

  useEffect(() => {
    if (result.matched && trackedSessionRef.current !== session.sessionNumber) {
      trackedSessionRef.current = session.sessionNumber;
      trackEvent("variant_selected", {
        sessionNumber: session.sessionNumber,
        trainingGoal,
        sessionName: session.practiceTitle,
      });
    }
  }, [result.matched, session.sessionNumber, session.practiceTitle, trainingGoal]);

  return { feedback: result.feedback };
}
