import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = "./scripts/downloaded_screens";
const files = readdirSync(dir).filter(f => f.endsWith(".html") && !f.includes("txt"));

const sessions = {};

// Helper to strip HTML tags
function stripTags(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// Clean quotes and HTML entities
function cleanText(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const file of files) {
  const filePath = join(dir, file);
  const html = readFileSync(filePath, "utf-8");

  // Parse filename e.g., "01_Centre_-_Session_1.html"
  const match = file.match(/^(\d+)_(.+?)_-_Session_(\d+)\.html$/);
  if (!match) continue;

  const [,, stageName, sessionNumStr] = match;
  const sessionNum = parseInt(sessionNumStr, 10);
  const stage = stageName.toLowerCase();

  if (!sessions[sessionNum]) {
    sessions[sessionNum] = { sessionNumber: sessionNum };
  }

  // Extract all h1, h2, h3, h4, p, span, button texts
  // We can extract specific elements depending on stage
  const headings = [];
  const paragraphs = [];
  const spans = [];

  const hRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  let hMatch;
  while ((hMatch = hRegex.exec(html)) !== null) {
    headings.push(cleanText(stripTags(hMatch[1])));
  }

  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(html)) !== null) {
    paragraphs.push(cleanText(stripTags(pMatch[1])));
  }

  const spanRegex = /<span[^>]*>([\s\S]*?)<\/span>/gi;
  let spanMatch;
  while ((spanMatch = spanRegex.exec(html)) !== null) {
    spans.push(cleanText(stripTags(spanMatch[1])));
  }

  sessions[sessionNum][stage] = {
    headings,
    paragraphs,
    spans,
    rawLength: html.length
  };
}

writeFileSync("scripts/dump_output.json", JSON.stringify(sessions, null, 2));
console.log("Dumped content to scripts/dump_output.json");
