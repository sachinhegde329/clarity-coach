export type SessionBucket = "open" | "constraint" | "comparative" | "reactive" | "adversarial" | "review";

export function getSessionBucket(challengeType?: string): SessionBucket {
  const ct = (challengeType ?? "").toLowerCase();
  if (ct.includes("adversarial")) return "adversarial";
  if (ct.includes("reactive")) return "reactive";
  if (ct.includes("comparative")) return "comparative";
  if (ct.includes("side-by-side") || ct.includes("replay") || ct.includes("review")) return "review";
  if (ct.includes("open")) return "open";
  return "constraint";
}
