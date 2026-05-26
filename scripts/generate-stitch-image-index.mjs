import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const screensDir = join(process.cwd(), "assets", "stitch", "screens");
const outFile = join(process.cwd(), "src", "screens", "stitch", "imageIndex.ts");

const files = readdirSync(screensDir).filter((file) => file.endsWith(".png")).sort();

const imports = [];
const entries = [];

for (const file of files) {
  const varName = file.replace(/\.png$/, "").replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
  imports.push(`import ${varName} from "../../../assets/stitch/screens/${file}";`);
  if (file.startsWith("session_")) {
    const match = file.match(/^session_(\d{2})_(\d{2})\.png$/);
    if (!match) continue;
    const [, session, stage] = match;
    entries.push(`  "session-${session}-${stage}": ${varName},`);
  } else {
    const key = file.replace(/\.png$/, "");
    entries.push(`  "${key}": ${varName},`);
  }
}

const contents = `${imports.join("\n")}\n\nexport const stitchImageAssets: Record<string, any> = {\n${entries.join("\n")}\n};\n`;
writeFileSync(outFile, contents);
console.log(`Wrote ${outFile} with ${files.length} assets.`);
