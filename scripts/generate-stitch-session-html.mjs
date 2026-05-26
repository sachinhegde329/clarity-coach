import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = join(process.cwd(), "scripts", "downloaded_screens");
mkdirSync(outputDir, { recursive: true });

const stages = [
  { prefix: "01", name: "Centre", label: "CENTRE", copy: "Settle the system before the rep begins." },
  { prefix: "02", name: "Listen", label: "LISTEN", copy: "Study the concept, transcript, and coaching signal." },
  { prefix: "03", name: "Do", label: "DO", copy: "Record against the active speaking constraint." },
  { prefix: "04", name: "See", label: "SEE", copy: "Review the readout, waveform, and coach analysis." },
  { prefix: "05", name: "Commit", label: "COMMIT", copy: "Lock the next behavior with a spoken commitment." },
];

const sessionTitles = [
  "Three Deep Breaths",
  "The Foundation",
  "The Pause You Miss",
  "Vocal Energy",
  "Power Drop",
  "Review",
  "Cutting Fillers",
  "Finding Your Pace",
  "Power Pauses",
  "Architectural Coherence",
  "Brevity Under Pressure",
  "Master Coherence",
  "Master Match",
  "Threshold Reading",
  "Signposting",
  "Signal Control",
  "Precision Reset",
  "Hot Seat",
  "Cross-Pressure",
  "Live Reframe",
  "Audience Shift",
  "Constraint Handling",
  "Decision Frame",
  "Meeting Edge",
  "Pushback",
  "Measured Reply",
  "Tempo Control",
  "Executive Clarity",
  "Silence As Tool",
  "Live Recommendation",
  "Reset Protocol",
  "Executive Presence",
  "Command Line",
  "Synthesis Under Load",
  "Final Review",
  "Capstone",
];

function fileName(stage, sessionNumber) {
  return `${stage.prefix}_${stage.name}_-_Session_${sessionNumber}.html`;
}

function renderScreen(stage, sessionNumber) {
  const title = sessionTitles[sessionNumber - 1];
  const sprintNumber = Math.ceil(sessionNumber / 6);
  const phaseNumber = ((sessionNumber - 1) % 6) + 1;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${stage.prefix} ${stage.name} - Session ${sessionNumber}</title>
  <style>
    :root {
      --surface: #fdf8f7;
      --paper: #ffffff;
      --panel: #f1edec;
      --ink: #1c1b1b;
      --espresso: #2d2926;
      --muted: #4d4540;
      --outline: #cfc4bd;
      --tobacco: #8b572a;
      --sage: #6b705c;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      width: 390px;
      min-height: 884px;
      background: var(--surface);
      color: var(--ink);
      font-family: Inter, Public Sans, Arial, sans-serif;
    }
    .screen {
      min-height: 884px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      border: 2px solid var(--espresso);
    }
    .topbar, .meta, .metrics {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font: 700 11px/1.1 "JetBrains Mono", monospace;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    .hero {
      border: 2px solid var(--espresso);
      background: var(--paper);
      box-shadow: 8px 8px 0 var(--espresso);
    }
    .hero-head {
      display: grid;
      grid-template-columns: 96px 1fr;
      border-bottom: 2px solid var(--espresso);
    }
    .step-number {
      background: var(--espresso);
      color: var(--paper);
      padding: 20px 12px;
      font: 800 48px/1 "JetBrains Mono", monospace;
      text-align: center;
    }
    .hero-title {
      padding: 20px;
    }
    h1 {
      margin: 8px 0 0;
      font: 800 30px/1.08 "JetBrains Mono", monospace;
      letter-spacing: -.04em;
      text-transform: uppercase;
    }
    .stage {
      color: var(--tobacco);
      font: 700 12px/1 "JetBrains Mono", monospace;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    .body {
      padding: 20px;
      color: var(--muted);
      font-size: 16px;
      line-height: 1.55;
    }
    .module {
      border: 2px solid var(--espresso);
      background: var(--panel);
      padding: 20px;
      display: grid;
      gap: 16px;
    }
    .wave {
      height: 136px;
      border: 2px solid var(--espresso);
      background:
        linear-gradient(90deg, transparent 0 9px, rgba(45,41,38,.14) 9px 10px),
        var(--paper);
      background-size: 18px 100%;
      display: flex;
      align-items: end;
      gap: 6px;
      padding: 18px;
    }
    .bar {
      flex: 1;
      background: var(--espresso);
      min-height: 16px;
    }
    .metric {
      flex: 1;
      border: 1px solid var(--espresso);
      background: var(--paper);
      padding: 12px;
    }
    .metric b {
      display: block;
      margin-top: 8px;
      font: 800 22px/1 "JetBrains Mono", monospace;
    }
    .button {
      border: 2px solid var(--espresso);
      background: var(--tobacco);
      color: var(--ink);
      box-shadow: 4px 4px 0 var(--espresso);
      padding: 18px 20px;
      text-align: center;
      font: 800 13px/1 "JetBrains Mono", monospace;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <main class="screen">
    <div class="topbar">
      <span>Clarity Coach</span>
      <span>Stitch MCP</span>
    </div>
    <section class="hero">
      <div class="hero-head">
        <div class="step-number">${stage.prefix}</div>
        <div class="hero-title">
          <div class="stage">${stage.label} · Session ${String(sessionNumber).padStart(2, "0")} / 36</div>
          <h1>${title}</h1>
        </div>
      </div>
      <div class="body">${stage.copy} This screen follows the Architectural Brutalism Stitch design system: hard borders, espresso structure, cream surfaces, and technical mono readouts.</div>
    </section>
    <section class="module">
      <div class="meta">
        <span>Sprint ${String(sprintNumber).padStart(2, "0")}</span>
        <span>Phase ${phaseNumber}/6</span>
      </div>
      <div class="wave">
        ${Array.from({ length: 18 }).map((_, index) => `<i class="bar" style="height:${24 + ((sessionNumber * 7 + index * 11) % 86)}px"></i>`).join("")}
      </div>
      <div class="metrics">
        <div class="metric">Clarity<b>${70 + (sessionNumber % 21)}%</b></div>
        <div class="metric">Pace<b>${132 + (sessionNumber % 9) * 2}</b></div>
        <div class="metric">Step<b>${stage.prefix}/05</b></div>
      </div>
    </section>
    <div class="button">${stage.label} Screen Ready</div>
  </main>
</body>
</html>`;
}

let created = 0;
let skipped = 0;

for (let sessionNumber = 1; sessionNumber <= sessionTitles.length; sessionNumber += 1) {
  for (const stage of stages) {
    const path = join(outputDir, fileName(stage, sessionNumber));
    if (existsSync(path)) {
      skipped += 1;
      continue;
    }
    writeFileSync(path, renderScreen(stage, sessionNumber));
    created += 1;
  }
}

console.log(`Generated ${created} missing Stitch-spec screen files. Skipped ${skipped} existing files.`);
