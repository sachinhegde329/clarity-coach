import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const STAGES = [
  { prefix: "01", name: "Centre" },
  { prefix: "02", name: "Listen" },
  { prefix: "03", name: "Do" },
  { prefix: "04", name: "See" },
  { prefix: "05", name: "Commit" },
];

const SESSION_COUNT = 36;
const screenDir = join(process.cwd(), "scripts", "downloaded_screens");

function expectedFileName(stage, sessionNumber) {
  return `${stage.prefix}_${stage.name}_-_Session_${sessionNumber}.html`;
}

if (!existsSync(screenDir)) {
  console.error(`Missing Stitch screen directory: ${screenDir}`);
  process.exit(1);
}

const files = new Set(readdirSync(screenDir).filter((file) => file.endsWith(".html")));
const missing = [];

for (let sessionNumber = 1; sessionNumber <= SESSION_COUNT; sessionNumber += 1) {
  for (const stage of STAGES) {
    const expected = expectedFileName(stage, sessionNumber);
    if (!files.has(expected)) {
      missing.push(expected);
    }
  }
}

const expectedCount = SESSION_COUNT * STAGES.length;
const presentCount = expectedCount - missing.length;

console.log(`Stitch screen coverage: ${presentCount}/${expectedCount}`);

if (missing.length > 0) {
  console.log("Missing required Stitch screens:");
  for (const fileName of missing) {
    console.log(`- ${fileName}`);
  }
  process.exit(1);
}

console.log("All required Stitch screens are present.");
