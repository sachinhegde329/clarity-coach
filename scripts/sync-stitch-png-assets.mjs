import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const sourceRoot =
  process.argv[2] ??
  "/Users/sachin.hegde/Downloads/stitch_clarity_coach_product_design 3";

const assetsDir = join(process.cwd(), "assets", "stitch");
const screensDir = join(assetsDir, "screens");
mkdirSync(screensDir, { recursive: true });

const preferredSuffixBySession = new Map([
  [10, "architectural_coherence"],
  [12, "master_coherence"],
  [13, "master_match"],
  [15, "signposting"],
  [36, "capstone"],
]);

const stageConfigs = [
  { key: "centre", prefix: "01", label: "centre" },
  { key: "listen", prefix: "02", label: "listen" },
  { key: "do", prefix: "03", label: "do" },
  { key: "see", prefix: "04", label: "see" },
  { key: "commit", prefix: "05", label: "commit" },
];

const singletonConfigs = [
  { key: "today", folder: "today_architectural_coherence" },
  { key: "journey", folder: "journey_dashboard_architectural_coherence" },
  { key: "stats", folder: "stats_trends_architectural_coherence" },
  { key: "welcome", folder: "welcome_architectural_coherence" },
];

function parseDirName(dirName) {
  const match = dirName.match(/^(\d{2})_(centre|listen|do|see|commit)_session_(\d+)(?:_(.+))?$/);
  if (!match) return null;
  const [, prefix, stageKey, sessionStr, suffixRaw] = match;
  return {
    prefix,
    stageKey,
    sessionNumber: Number.parseInt(sessionStr, 10),
    suffix: suffixRaw ?? null,
    dirName,
  };
}

function scoreCandidate({ suffix, sessionNumber }) {
  let score = 0;
  if (!suffix) score += 1000;
  const preferred = preferredSuffixBySession.get(sessionNumber);
  if (preferred && suffix === preferred) score += 2000;
  if (suffix && /^\d+$/.test(suffix)) score -= 100;
  if (suffix && /_?\d+$/.test(suffix)) score -= 25;
  if (suffix && /(architectural|master|capstone)/.test(suffix)) score += 50;
  return score;
}

function pickBest(candidates, sessionNumber) {
  return candidates
    .slice()
    .sort((left, right) => scoreCandidate(right, sessionNumber) - scoreCandidate(left, sessionNumber))[0] ?? null;
}

function copyFile(src, dst) {
  writeFileSync(dst, readFileSync(src));
}

const dirs = readdirSync(sourceRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);

const stageIndex = new Map();
for (const stage of stageConfigs) stageIndex.set(stage.key, new Map());

for (const dirName of dirs) {
  const parsed = parseDirName(dirName);
  if (!parsed) continue;
  const pngPath = join(sourceRoot, dirName, "screen.png");
  if (!existsSync(pngPath)) continue;
  const bySession = stageIndex.get(parsed.stageKey);
  const list = bySession.get(parsed.sessionNumber) ?? [];
  list.push(parsed);
  bySession.set(parsed.sessionNumber, list);
}

let copied = 0;

for (const stage of stageConfigs) {
  const bySession = stageIndex.get(stage.key);
  for (let sessionNumber = 1; sessionNumber <= 36; sessionNumber += 1) {
    const candidates = bySession.get(sessionNumber) ?? [];
    const chosen = pickBest(candidates, sessionNumber);
    if (!chosen) continue;
    const src = join(sourceRoot, chosen.dirName, "screen.png");
    const dst = join(screensDir, `session_${String(sessionNumber).padStart(2, "0")}_${stage.prefix}.png`);
    copyFile(src, dst);
    copied += 1;
  }
}

for (const item of singletonConfigs) {
  const src = join(sourceRoot, item.folder, "screen.png");
  if (!existsSync(src)) continue;
  copyFile(src, join(screensDir, `${item.key}.png`));
  copied += 1;
}

console.log(`Synced ${copied} Stitch PNG assets to ${screensDir}.`);
