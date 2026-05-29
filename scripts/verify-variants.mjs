/**
 * Data integrity verification for context variants.
 * Reads source files directly to validate structure without TS compilation.
 * Run: node scripts/verify-variants.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const VARIANTS_FILE = path.join(root, "src/data/sessionVariants.ts");
const COPY_FILE = path.join(root, "src/data/sessionCopy.ts");
const BUILD_FILE = path.join(root, "src/data/buildSessionDefinitions.ts");

const GOALS = ["Interview prep", "New manager", "Client-facing", "Promotion-ready", "General"];
const ALL_SESSIONS = Array.from({ length: 36 }, (_, i) => i + 1);
const EXPECTED_VARIANT_SESSIONS = [2, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35];
const UNIVERSAL_SESSIONS = [1, 3, 4, 6, 12, 24, 30, 36];
const VALID_FIELDS = ["promptTitle", "promptBody", "constraint", "preRecordMeta", "closingLine", "badge", "headerMeta"];

let passed = 0;
let failed = 0;

function check(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

const variantsContent = fs.readFileSync(VARIANTS_FILE, "utf-8");
const copyContent = fs.readFileSync(COPY_FILE, "utf-8");
const buildContent = fs.readFileSync(BUILD_FILE, "utf-8");

// Helper: extract session numbers from the variants data
function extractSessionNumbers() {
  const nums = [];
  const re = /\/\*\* Session (\d+) /g;
  let m;
  while ((m = re.exec(variantsContent)) !== null) {
    nums.push(parseInt(m[1]));
  }
  return nums.sort((a, b) => a - b);
}

function countKey(key) {
  const re = new RegExp(`"${key}":`, "g");
  return (variantsContent.match(re) || []).length;
}

function countUnquotedKey(key) {
  // Goal keys like `General:` (unquoted) on their own line
  const re = new RegExp(`^\\s{4}${key}:\\s*{`, "gm");
  return (variantsContent.match(re) || []).length;
}

function countSessionDefs() {
  const re = /"sessionNumber":\s*(\d+)/g;
  const nums = [];
  let m;
  while ((m = re.exec(copyContent)) !== null) {
    nums.push(parseInt(m[1]));
  }
  return nums;
}

// ─── Test 1: Session copy has all 36 sessions ────────────────────────
console.log("\n1. Session copy coverage:");
const copyNums = countSessionDefs();
check(copyNums.length === 36, `Expected 36 session entries in sessionCopy, got ${copyNums.length}`);
check(copyNums[0] === 1 && copyNums[copyNums.length - 1] === 36,
  `Session numbers should cover 1-36, got ${copyNums[0]}-${copyNums[copyNums.length - 1]}`);

// ─── Test 2: 28 variant sessions ─────────────────────────────────────
console.log("\n2. Variant session count:");
const variantNums = extractSessionNumbers();
check(variantNums.length === 28, `Expected 28 variant sessions, got ${variantNums.length}`);
for (const s of EXPECTED_VARIANT_SESSIONS) {
  check(variantNums.includes(s), `Expected variant for session ${s}`);
}

// ─── Test 3: Universal sessions have no variants ─────────────────────
console.log("\n3. Universal sessions have no variants:");
for (const s of UNIVERSAL_SESSIONS) {
  check(!variantNums.includes(s), `Session ${s} should be universal (no variant)`);
}

// ─── Test 4: All 5 goals present 28 times each ───────────────────────
console.log("\n4. Goal coverage:");
for (const goal of GOALS) {
  let count;
  if (goal === "General") {
    count = countUnquotedKey(goal);
  } else {
    // Quoted keys like "Interview prep": { appear with 6-space indent
    // Quoted keys like "Interview prep": { appear at 4-space indent
    const escaped = goal.replace(/[-\/]/g, "\\$&");
    const re = new RegExp(`^\\s{4}"${escaped}"\\s*:\\s*{`, "gm");
    count = (variantsContent.match(re) || []).length;
  }
  check(count === 28, `Goal "${goal}": expected 28 entries, got ${count}`);
}

// ─── Test 5: Each variant has at least one override field ────────────
console.log("\n5. Variant override fields (sampling):");
// Extract the total number of written override fields (promptTitle, promptBody, etc.)
let totalOverrideFields = 0;
for (const field of VALID_FIELDS) {
  // Count occurrences inside the variant data (not in type definitions)
  const re = new RegExp(`^\\s{6}${field}:`, "gm");
  const count = (variantsContent.match(re) || []).length;
  totalOverrideFields += count;
}
check(totalOverrideFields >= 140, `Expected at least 140 override field assignments, got ${totalOverrideFields}`);

// ─── Test 6: All fields are valid DoData fields ──────────────────────
console.log("\n6. Field name validity:");
const fieldRe = /^\s{6}(\w+):/gm;
let fieldMatch;
const foundFields = new Set();
while ((fieldMatch = fieldRe.exec(variantsContent)) !== null) {
  foundFields.add(fieldMatch[1]);
}
// Remove the `undefined` sentinel used for session 26 general
foundFields.delete("undefined");
for (const f of foundFields) {
  check(VALID_FIELDS.includes(f), `Invalid field name "${f}" in variants data`);
}

// ─── Test 7: buildSessionDefinitions imports sessionVariants ─────────
console.log("\n7. Build pipeline wiring:");
check(buildContent.includes('import { sessionVariants } from "./sessionVariants"'),
  "buildSessionDefinitions should import sessionVariants");
check(buildContent.includes("contextVariants: sessionVariants["),
  "buildSessionDefinitions should embed contextVariants");

// ─── Test 8: useSessionVariant hook exists ───────────────────────────
console.log("\n8. Variant resolution wiring:");
const hookPath = path.join(root, "src/screens/session/hooks/useSessionVariant.ts");
check(fs.existsSync(hookPath), "useSessionVariant hook should exist");

// ─── Test 9: SessionFlowScreen uses the hook ─────────────────────────
const flowContent = fs.readFileSync(path.join(root, "src/screens/session/SessionFlowScreen.tsx"), "utf-8");
check(flowContent.includes('useSessionVariant'), "SessionFlowScreen should call useSessionVariant");

// ─── Test 10: userProfileStore has the right shape ───────────────────
console.log("\n9. User profile store:");
const storePath = path.join(root, "src/stores/userProfileStore.ts");
check(fs.existsSync(storePath), "userProfileStore should exist");
const storeContent = fs.readFileSync(storePath, "utf-8");
check(storeContent.includes("saveOnboardingData"), "Store should have saveOnboardingData");
check(storeContent.includes("syncToSupabase"), "Store should have syncToSupabase");
check(storeContent.includes("trainingGoal"), "Store should track trainingGoal");

// ─── Test 10: Onboarding has training goal field ─────────────────────
console.log("\n10. Onboarding field:");
const onboardingContent = fs.readFileSync(path.join(root, "src/screens/OnboardingFlowScreen.tsx"), "utf-8");
check(onboardingContent.includes("trainingGoal"), "Onboarding should have trainingGoal state");
check(onboardingContent.includes("OnboardingData"), "Onboarding should export OnboardingData type");
check(onboardingContent.includes("Interview prep"), "Onboarding should list interview prep option");
check(onboardingContent.includes("New manager"), "Onboarding should list new manager option");

// ─── Summary ─────────────────────────────────────────────────────────
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${passed + failed} checks`);
if (failed > 0) {
  console.log("Some checks failed. Review the errors above.");
  process.exit(1);
} else {
  console.log("All checks passed ✓");
}
