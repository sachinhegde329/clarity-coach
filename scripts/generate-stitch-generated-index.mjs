import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "design-reference", "stitch-generated");
const out = join(dir, "index.ts");

const files = readdirSync(dir).filter((f) => f.endsWith(".tsx") && f !== "index.tsx");

const entries = files
  .map((file) => {
    const match = file.match(/^Stitch_(\d{2})_Session_(\d{2})\.tsx$/);
    if (!match) return null;
    const [, stagePrefix, sessionStr] = match;
    const sessionNumber = Number.parseInt(sessionStr, 10);
    return { file, stagePrefix, sessionNumber, name: file.replace(/\.tsx$/, "") };
  })
  .filter(Boolean)
  .sort((a, b) => (a.sessionNumber - b.sessionNumber) || a.stagePrefix.localeCompare(b.stagePrefix));

const imports = entries.map((e) => `import { ${e.name} } from "./${e.name}";`).join("\n");

const mapLines = entries
  .map((e) => `  "${e.stagePrefix}-${String(e.sessionNumber).padStart(2, "0")}": ${e.name},`)
  .join("\n");

const contents = `import type { ComponentType } from "react";\n\n${imports}\n\nexport const stitchGeneratedScreens: Record<string, ComponentType<any>> = {\n${mapLines}\n};\n\nexport function getStitchGeneratedScreen(stagePrefix: string, sessionNumber: number): ComponentType<any> | null {\n  const key = \`\${stagePrefix}-\${String(sessionNumber).padStart(2, \"0\")}\`;\n  return stitchGeneratedScreens[key] ?? null;\n}\n`;

writeFileSync(out, contents);
console.log(`Wrote ${out} with ${entries.length} entries.`);
