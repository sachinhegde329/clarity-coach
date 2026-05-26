#!/usr/bin/env node
/**
 * Regenerate src/data/sessionCopy.ts from the Session Copy docx.
 * Usage: node scripts/generate-session-copy.mjs [path/to/ClarityCoach Session Copy.docx]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docx =
  process.argv[2] ??
  path.join(process.env.HOME ?? "", "Downloads/ClarityCoach Session Copy.docx");
const jsonOut = path.join(__dirname, "session-copy-parsed.json");
const tsOut = path.join(__dirname, "../src/data/sessionCopy.ts");

execSync(`python3 "${path.join(__dirname, "parse-session-copy.py")}" "${docx}" > "${jsonOut}"`, {
  stdio: "inherit",
});

const raw = JSON.parse(fs.readFileSync(jsonOut, "utf8"));
const out = `/* Auto-generated from ClarityCoach Session Copy.docx */
export type SessionCopyStage = {
  centre?: { stepLabel?: string; onScreenLines?: string[]; subLine?: string };
  listen?: { tidbitTitle?: string; transcript?: string; pullQuote?: string };
  do?: { constraint?: string; prompt?: string; time?: string; doMetaLine?: string; challengeType?: string; closingLine?: string };
  see?: { metricsShown?: string; headlineLine?: string; seeSubLine?: string; commentaryTemplates?: Record<string, string>; premiumUpsell?: { headline?: string; body?: string; primaryCta?: string; secondary?: string } };
  commit?: { opener?: string; commitMetaLine?: string; freeResponsePrompt?: string };
};
export type SessionCopyEntry = { sessionNumber: number; name: string; concept: string; sprintMeta: string; sprintNumber: string; sprintName: string; stages: SessionCopyStage };
export const sessionCopyEntries: SessionCopyEntry[] = ${JSON.stringify(raw, null, 2)} as SessionCopyEntry[];
export const sessionCopyByNumber = Object.fromEntries(sessionCopyEntries.map((e) => [e.sessionNumber, e])) as Record<number, SessionCopyEntry>;
export function getSessionCopy(n: number) { return sessionCopyByNumber[n]; }
`;

fs.writeFileSync(tsOut, out);
console.log(`Wrote ${tsOut} (${raw.length} sessions)`);
