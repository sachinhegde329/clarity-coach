import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const sourceRoot =
  process.argv[2] ??
  "/Users/sachin.hegde/Downloads/stitch_clarity_coach_product_design 3";

const outputDir = join(process.cwd(), "scripts", "downloaded_screens");
mkdirSync(outputDir, { recursive: true });

const STAGES = [
  { key: "centre", prefix: "01", name: "Centre" },
  { key: "listen", prefix: "02", name: "Listen" },
  { key: "do", prefix: "03", name: "Do" },
  { key: "see", prefix: "04", name: "See" },
  { key: "commit", prefix: "05", name: "Commit" },
];

const SESSION_COUNT = 36;

// Prefer the most "canonical" variant for each session when Stitch exported multiple.
// If a session isn't listed, we prefer the plain folder name (no suffix) first, then fall back.
const preferredSuffixBySession = new Map([
  [10, "architectural_coherence"],
  [12, "master_coherence"],
  [13, "master_match"],
  [15, "signposting"],
  [36, "capstone"],
]);

function outFileName(stage, sessionNumber) {
  return `${stage.prefix}_${stage.name}_-_Session_${sessionNumber}.html`;
}

function parseDirName(dirName) {
  // Examples:
  // 01_centre_session_12
  // 01_centre_session_10_architectural_coherence
  // 01_centre_session_1_1
  const match = dirName.match(/^(\d{2})_(centre|listen|do|see|commit)_session_(\d+)(?:_(.+))?$/);
  if (!match) return null;
  const [, prefix, stageKey, sessionStr, suffixRaw] = match;
  const sessionNumber = Number.parseInt(sessionStr, 10);
  if (!Number.isFinite(sessionNumber)) return null;
  return {
    prefix,
    stageKey,
    sessionNumber,
    suffix: suffixRaw ?? null,
  };
}

function scoreCandidate({ suffix, sessionNumber }) {
  // Higher is better.
  let score = 0;
  if (!suffix) score += 1000;
  // Prefer specific known variants for some sessions.
  const preferred = preferredSuffixBySession.get(sessionNumber);
  if (preferred && suffix === preferred) score += 2000;
  // Prefer "named" variants over numeric trial variants.
  if (suffix && /^\d+$/.test(suffix)) score -= 100;
  if (suffix && /_?\d+$/.test(suffix)) score -= 25;
  // Mild preference for "architectural"/"master" variants as usually most final.
  if (suffix && /(architectural|master|capstone)/.test(suffix)) score += 50;
  return score;
}

function pickBestCandidate(candidates, sessionNumber) {
  const scored = candidates
    .map((candidate) => ({ candidate, score: scoreCandidate({ suffix: candidate.suffix, sessionNumber }) }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.candidate ?? null;
}

if (!existsSync(sourceRoot)) {
  console.error(`Source folder not found: ${sourceRoot}`);
  process.exit(1);
}

const entries = readdirSync(sourceRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

/** @type {Map<string, Map<number, Array<{dirName: string, suffix: string|null}>>>} */
const index = new Map();
for (const stage of STAGES) {
  index.set(stage.key, new Map());
}

for (const dirName of entries) {
  const parsed = parseDirName(dirName);
  if (!parsed) continue;
  if (!index.has(parsed.stageKey)) continue;
  const bySession = index.get(parsed.stageKey);
  const list = bySession.get(parsed.sessionNumber) ?? [];
  list.push({ dirName, suffix: parsed.suffix });
  bySession.set(parsed.sessionNumber, list);
}

let imported = 0;
let missingSourceHtml = 0;
let fatalMissing = 0;

for (const stage of STAGES) {
  const bySession = index.get(stage.key);
  for (let sessionNumber = 1; sessionNumber <= SESSION_COUNT; sessionNumber += 1) {
    const candidates = bySession.get(sessionNumber) ?? [];
    const preferred = pickBestCandidate(candidates, sessionNumber);
    const candidatesWithHtml = candidates.filter((candidate) =>
      existsSync(join(sourceRoot, candidate.dirName, "code.html")),
    );
    const chosen =
      pickBestCandidate(candidatesWithHtml, sessionNumber) ??
      preferred;
    if (!chosen) {
      console.warn(`Missing source for ${stage.prefix} ${stage.name} Session ${sessionNumber}`);
      missingSourceHtml += 1;
      continue;
    }

    const srcHtmlPath = join(sourceRoot, chosen.dirName, "code.html");
    const dstPath = join(outputDir, outFileName(stage, sessionNumber));
    if (!existsSync(srcHtmlPath)) {
      // Some Stitch export folders include only a screenshot (screen.png) and omit code.html.
      // In that case, keep whatever is already in scripts/downloaded_screens, and only fail
      // if the destination file doesn't exist either.
      if (existsSync(dstPath)) {
        console.warn(`No code.html in ${chosen.dirName}; keeping existing ${outFileName(stage, sessionNumber)}`);
        missingSourceHtml += 1;
        continue;
      }
      console.error(`Missing code.html for ${chosen.dirName} and destination does not exist: ${dstPath}`);
      fatalMissing += 1;
      continue;
    }

    const html = readFileSync(srcHtmlPath, "utf-8");
    writeFileSync(dstPath, html);
    imported += 1;
  }
}

console.log(`Imported ${imported} Stitch HTML screens into ${outputDir}.`);
if (missingSourceHtml > 0) {
  console.log(`Skipped ${missingSourceHtml} screens due to missing source HTML (code.html).`);
}
if (fatalMissing > 0) {
  console.log(`Fatal missing screens: ${fatalMissing}`);
  process.exit(1);
}
