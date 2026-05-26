import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import vm from "node:vm";
import { parse } from "node-html-parser";

const sourceRoot =
  process.argv[2] ??
  "/Users/sachin.hegde/Downloads/stitch_clarity_coach_product_design 3";

// Design-time output only — not bundled with the Expo app.
const outDir = join(process.cwd(), "design-reference", "stitch-generated");
mkdirSync(outDir, { recursive: true });

const STAGES = [
  { key: "centre", prefix: "01", name: "Centre" },
  { key: "listen", prefix: "02", name: "Listen" },
  { key: "do", prefix: "03", name: "Do" },
  { key: "see", prefix: "04", name: "See" },
  { key: "commit", prefix: "05", name: "Commit" },
];

const preferredSuffixBySession = new Map([
  [10, "architectural_coherence"],
  [12, "master_coherence"],
  [13, "master_match"],
  [15, "signposting"],
  [36, "capstone"],
]);

function parseDirName(dirName) {
  const match = dirName.match(/^(\d{2})_(centre|listen|do|see|commit)_session_(\d+)(?:_(.+))?$/);
  if (!match) return null;
  const [, prefix, stageKey, sessionStr, suffixRaw] = match;
  const sessionNumber = Number.parseInt(sessionStr, 10);
  return { prefix, stageKey, sessionNumber, suffix: suffixRaw ?? null };
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

function pickBestCandidate(candidates, sessionNumber) {
  const scored = candidates
    .map((candidate) => ({ candidate, score: scoreCandidate({ suffix: candidate.suffix, sessionNumber }) }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.candidate ?? null;
}

function readTailwindConfig(html) {
  const doc = parse(html, { script: true, style: false, pre: false, comment: false });
  const script = doc.querySelector("#tailwind-config");
  if (!script) return null;
  const code = script.text;
  const context = { tailwind: { config: null } };
  vm.createContext(context);
  vm.runInContext(code, context, { timeout: 1000 });
  return context.tailwind.config;
}

function toCamel(input) {
  return input.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseSize(value) {
  if (typeof value !== "string") return null;
  const pxMatch = value.match(/^(-?\d+(?:\.\d+)?)px$/);
  if (pxMatch) return Number(pxMatch[1]);
  const remMatch = value.match(/^(-?\d+(?:\.\d+)?)rem$/);
  if (remMatch) return Number(remMatch[1]) * 16;
  return null;
}

function buildTokenMaps(twConfig) {
  const colors = twConfig?.theme?.extend?.colors ?? {};
  const spacing = twConfig?.theme?.extend?.spacing ?? {};
  const fontFamily = twConfig?.theme?.extend?.fontFamily ?? {};
  const fontSize = twConfig?.theme?.extend?.fontSize ?? {};
  const lineHeight = twConfig?.theme?.extend?.lineHeight ?? {};
  const letterSpacing = twConfig?.theme?.extend?.letterSpacing ?? {};
  const borderRadius = twConfig?.theme?.extend?.borderRadius ?? {};

  const out = {
    colors,
    spacing,
    fontFamily,
    fontSize,
    lineHeight,
    letterSpacing,
    borderRadius,
  };
  return out;
}

function styleFromTailwindClass(cls, tokens) {
  // Returns a partial RN style object (or null if unsupported).
  // We intentionally support a limited-but-common Tailwind subset used in Stitch exports.
  if (!cls) return null;

  // Layout
  if (cls === "flex") return { display: "flex" };
  if (cls === "flex-col") return { flexDirection: "column" };
  if (cls === "flex-row") return { flexDirection: "row" };
  if (cls === "flex-grow") return { flexGrow: 1 };
  if (cls === "items-center") return { alignItems: "center" };
  if (cls === "items-start") return { alignItems: "flex-start" };
  if (cls === "items-end") return { alignItems: "flex-end" };
  if (cls === "justify-center") return { justifyContent: "center" };
  if (cls === "justify-between") return { justifyContent: "space-between" };
  if (cls === "justify-start") return { justifyContent: "flex-start" };
  if (cls === "justify-end") return { justifyContent: "flex-end" };
  if (cls === "w-full") return { alignSelf: "stretch" };

  // Spacing: gap-*, space-y-*, px-*, py-*, p-*, mb-*, mt-*, pl-*, pr-*
  const gapMatch = cls.match(/^gap-(.+)$/);
  if (gapMatch) {
    const key = gapMatch[1];
    const raw = tokens.spacing[key] ?? (key === "4" ? "16px" : null);
    const px = parseSize(raw);
    if (px != null) return { gap: px };
  }

  const spaceYMatch = cls.match(/^space-y-(.+)$/);
  if (spaceYMatch) {
    const key = spaceYMatch[1];
    const raw = tokens.spacing[key] ?? (key === "4" ? "16px" : null);
    const px = parseSize(raw);
    if (px != null) return { rowGap: px };
  }

  const padMatch = cls.match(/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-(.+)$/);
  if (padMatch) {
    const [, kind, key] = padMatch;
    const raw = tokens.spacing[key] ?? (key === "4" ? "16px" : null);
    const px = parseSize(raw);
    if (px == null) return null;
    const map = {
      p: ["padding"],
      px: ["paddingHorizontal"],
      py: ["paddingVertical"],
      pt: ["paddingTop"],
      pb: ["paddingBottom"],
      pl: ["paddingLeft"],
      pr: ["paddingRight"],
      m: ["margin"],
      mx: ["marginHorizontal"],
      my: ["marginVertical"],
      mt: ["marginTop"],
      mb: ["marginBottom"],
      ml: ["marginLeft"],
      mr: ["marginRight"],
    };
    const props = map[kind];
    if (!props) return null;
    return Object.fromEntries(props.map((prop) => [prop, px]));
  }

  // Borders / colors
  const borderMatch = cls.match(/^border(?:-(\d+))?$/);
  if (borderMatch) {
    const width = borderMatch[1] ? Number(borderMatch[1]) : 1;
    return { borderWidth: width };
  }
  if (cls === "border-2") return { borderWidth: 2 };
  if (cls === "border-4") return { borderWidth: 4 };
  const borderColorMatch = cls.match(/^border-(.+)$/);
  if (borderColorMatch) {
    const key = borderColorMatch[1];
    const color = tokens.colors[key];
    if (typeof color === "string") return { borderColor: color };
  }

  const bgMatch = cls.match(/^bg-(.+)$/);
  if (bgMatch) {
    const key = bgMatch[1];
    const color = tokens.colors[key];
    if (typeof color === "string") return { backgroundColor: color };
  }

  const textColorMatch = cls.match(/^text-(.+)$/);
  if (textColorMatch) {
    const key = textColorMatch[1];
    const color = tokens.colors[key];
    if (typeof color === "string") return { color };
  }

  // Typography
  const fontFamMatch = cls.match(/^font-(.+)$/);
  if (fontFamMatch) {
    const key = fontFamMatch[1];
    const fam = tokens.fontFamily[key];
    // token entries are arrays in Tailwind config
    if (Array.isArray(fam) && fam.length > 0) return { fontFamily: fam[0] };
  }

  const sizeMatch = cls.match(/^text-(.+)$/);
  if (sizeMatch) {
    const key = sizeMatch[1];
    const raw = tokens.fontSize[key];
    // can be like "48px" or ["48px", { lineHeight: "56px" }]
    if (typeof raw === "string") {
      const px = parseSize(raw);
      if (px != null) return { fontSize: px };
    }
    if (Array.isArray(raw) && typeof raw[0] === "string") {
      const px = parseSize(raw[0]);
      if (px != null) return { fontSize: px };
    }
  }

  if (cls === "italic") return { fontStyle: "italic" };
  if (cls === "uppercase") return { textTransform: "uppercase" };

  // Border radius
  if (cls === "rounded") {
    const raw = tokens.borderRadius.DEFAULT ?? "0px";
    const px = parseSize(raw);
    if (px != null) return { borderRadius: px };
  }
  const roundedMatch = cls.match(/^rounded-(.+)$/);
  if (roundedMatch) {
    const key = roundedMatch[1];
    const raw = tokens.borderRadius[key];
    const px = parseSize(raw);
    if (px != null) return { borderRadius: px };
  }
  if (cls === "rounded-full") return { borderRadius: 9999 };

  // We ignore complex/interactive/hover/transition utilities in RN output.
  if (cls.startsWith("hover:") || cls.startsWith("active:") || cls.startsWith("transition") || cls.startsWith("animate-")) return null;
  if (cls.startsWith("lg:") || cls.startsWith("md:") || cls.startsWith("sm:")) return null;
  if (cls.startsWith("max-w") || cls.startsWith("grid") || cls.startsWith("col-span")) return null;

  return null;
}

function mergeStyles(styles) {
  const out = {};
  for (const style of styles) {
    if (!style) continue;
    for (const [k, v] of Object.entries(style)) out[k] = v;
  }
  return out;
}

function nodeToJsx(node, tokens, state, depth = 0) {
  if (node.nodeType === 3) {
    const text = node.rawText.replace(/\s+/g, " ").trim();
    if (!text) return null;
    return { kind: "TextNode", text };
  }

  if (node.nodeType !== 1) return null;

  const tag = node.tagName?.toLowerCase?.() ?? "div";
  const classAttr = node.getAttribute?.("class") ?? "";
  const classes = classAttr.split(/\s+/).filter(Boolean);
  const styleParts = classes.map((cls) => styleFromTailwindClass(cls, tokens)).filter(Boolean);
  const style = mergeStyles(styleParts);

  const children = (node.childNodes ?? [])
    .map((child) => nodeToJsx(child, tokens, state, depth + 1))
    .filter(Boolean);

  const isTextTag = ["p", "span", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tag);
  const isButton = tag === "button";

  const textOnlyKeys = new Set([
    "color",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "lineHeight",
    "letterSpacing",
    "textTransform",
  ]);
  const stripTextKeys = (obj) => {
    const out = { ...obj };
    for (const key of textOnlyKeys) delete out[key];
    return out;
  };

  if (isTextTag) return { kind: "Text", style, children };
  if (isButton) {
    const onPressProp = state.buttonCount === 0 ? "onPrimary" : state.buttonCount === 1 ? "onSecondary" : null;
    state.buttonCount += 1;
    return { kind: "Pressable", style: stripTextKeys(style), children, onPressProp };
  }
  return { kind: "View", style: stripTextKeys(style), children };
}

function renderJsxTree(node, styleKeyByStyleJson, indent = "  ") {
  const pad = (n) => indent.repeat(n);
  const styleToRef = (style) => {
    const json = Object.keys(style).length ? JSON.stringify(style) : "";
    if (!json) return "undefined";
    const key = styleKeyByStyleJson.get(json);
    return key ? `styles.${key}` : "undefined";
  };

  function render(node, level) {
    if (node.kind === "TextNode") {
      const text = node.text
        .replace(/\\/g, "\\\\")
        .replace(/\r?\n/g, " ")
        .trim();
      // Always emit as an expression so special characters don't break JSX parsing.
      return `{${JSON.stringify(text)}}`;
    }
    const component = node.kind === "Text" ? "Text" : node.kind === "Pressable" ? "Pressable" : "View";
    const styleStr = styleToRef(node.style ?? {});
    const onPress = node.kind === "Pressable" && node.onPressProp ? ` onPress={${node.onPressProp}}` : "";
    const children = node.children ?? [];
    const renderedChildren = children.map((c) => render(c, level + 1)).filter((c) => c !== null && c !== "");

    const hasOnlyText = renderedChildren.length === 1 && typeof renderedChildren[0] === "string";
    if (renderedChildren.length === 0) {
      return `${pad(level)}<${component}${onPress} style={${styleStr}} />`;
    }
    if (hasOnlyText) {
      return `${pad(level)}<${component}${onPress} style={${styleStr}}>${renderedChildren[0]}</${component}>`;
    }

    return [
      `${pad(level)}<${component}${onPress} style={${styleStr}}>`,
      ...renderedChildren.map((c) => (typeof c === "string" ? `${pad(level + 1)}${c}` : c)),
      `${pad(level)}</${component}>`,
    ].join("\n");
  }

  const rendered = render(node, 2);
  return rendered;
}

function componentName(stagePrefix, sessionNumber) {
  return `Stitch_${stagePrefix}_Session_${String(sessionNumber).padStart(2, "0")}`;
}

function writeComponent({ stagePrefix, sessionNumber, html }) {
  const twConfig = readTailwindConfig(html);
  const tokens = buildTokenMaps(twConfig);
  const doc = parse(html, { script: false, style: false, pre: false, comment: false });
  const body = doc.querySelector("body");
  if (!body) return null;

  const state = { buttonCount: 0 };
  const tree = nodeToJsx(body, tokens, state);
  if (!tree) return null;

  const name = componentName(stagePrefix, sessionNumber);
  const filePath = join(outDir, `${name}.tsx`);

  // Pool repeated style objects into StyleSheet entries for better RN performance.
  const styleKeyByStyleJson = new Map();
  const styleJsonByKey = [];
  const enqueueStyle = (style) => {
    const json = Object.keys(style).length ? JSON.stringify(style) : "";
    if (!json) return;
    if (styleKeyByStyleJson.has(json)) return;
    const key = `s${styleJsonByKey.length}`;
    styleKeyByStyleJson.set(json, key);
    styleJsonByKey.push({ key, json });
  };
  (function walk(n) {
    if (!n || typeof n !== "object") return;
    if (n.style) enqueueStyle(n.style);
    if (Array.isArray(n.children)) n.children.forEach(walk);
  })(tree);

  const jsx = renderJsxTree(tree, styleKeyByStyleJson);
  const stylesBlock = styleJsonByKey.length
    ? `const styles = StyleSheet.create({\n${styleJsonByKey.map(({ key, json }) => `  ${key}: ${json},`).join("\n")}\n});\n`
    : `const styles = StyleSheet.create({});\n`;

  const contents = `import React from \"react\";\nimport { Pressable, StyleSheet, Text, View } from \"react-native\";\n\ntype Props = {\n  onPrimary?: () => void;\n  onSecondary?: () => void;\n};\n\nexport function ${name}({ onPrimary, onSecondary }: Props) {\n  return (\n${jsx}\n  );\n}\n\n${stylesBlock}`;

  writeFileSync(filePath, contents);
  return { name, filePath };
}

const entries = readdirSync(sourceRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

/** @type {Map<string, Map<number, Array<{dirName: string, suffix: string|null}>>>} */
const index = new Map();
for (const stage of STAGES) index.set(stage.key, new Map());

for (const dirName of entries) {
  const parsed = parseDirName(dirName);
  if (!parsed) continue;
  const htmlPath = join(sourceRoot, dirName, "code.html");
  if (!existsSync(htmlPath)) continue;
  const bySession = index.get(parsed.stageKey);
  const list = bySession.get(parsed.sessionNumber) ?? [];
  list.push({ dirName, suffix: parsed.suffix });
  bySession.set(parsed.sessionNumber, list);
}

let written = 0;
let missing = 0;

for (const stage of STAGES) {
  const bySession = index.get(stage.key);
  for (let sessionNumber = 1; sessionNumber <= 36; sessionNumber += 1) {
    const candidates = bySession.get(sessionNumber) ?? [];
    const chosen = pickBestCandidate(candidates, sessionNumber);
    if (!chosen) {
      missing += 1;
      continue;
    }
    const htmlPath = join(sourceRoot, chosen.dirName, "code.html");
    const html = readFileSync(htmlPath, "utf-8");
    const result = writeComponent({ stagePrefix: stage.prefix, sessionNumber, html });
    if (result) written += 1;
  }
}

console.log(`Generated ${written} canonical RN components into ${outDir}.`);
if (missing > 0) console.log(`Missing ${missing} canonical screens with code.html in source.`);
