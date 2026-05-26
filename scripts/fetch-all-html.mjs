import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const listPath =
  process.argv[2] ??
  "/Users/sachin.hegde/.gemini/antigravity-ide/brain/35d224c8-35d4-4463-8a78-8022ef078f78/.system_generated/steps/82/output.txt";
const raw = readFileSync(listPath, "utf-8");
const data = JSON.parse(raw);

const outputDir = "./scripts/downloaded_screens";
mkdirSync(outputDir, { recursive: true });

console.log(`Found ${data.screens.length} screens. Starting download...`);

for (const screen of data.screens) {
  const title = screen.title;
  const url = screen.htmlCode?.downloadUrl;
  if (!url) {
    console.log(`Skipping ${title} (no htmlCode downloadUrl)`);
    continue;
  }
  
  const fileName = title.replace(/[^a-zA-Z0-9 -]/g, "").replace(/\s+/g, "_").trim() + ".html";
  const filePath = join(outputDir, fileName);
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    writeFileSync(filePath, html);
    console.log(`Downloaded ${title} -> ${fileName}`);
  } catch (err) {
    console.error(`Failed to download ${title}:`, err);
  }
}
console.log("Done downloading all screens!");
