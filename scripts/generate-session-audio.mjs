import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const sessionSeeds = [
  ["Baseline", "What fillers really are", "Raw numbers"],
  ["First Notice", "Why pace matters", "Filler count"],
  ["The Pause You Miss", "The pause you do not take", "Pause frequency"],
  ["Energy Read", "Vocal energy basics", "Energy score"],
  ["Where You Trail Off", "Sentence endings matter", "Inflection rate"],
  ["Review: Hear Yourself", "Replay baseline alongside session 5", "Sprint 1 trend"],
  ["Cutting Fillers", "Filler reduction in practice", "Filler count"],
  ["Finding Your Pace", "The 130-150 WPM band", "WPM accuracy"],
  ["Power Pauses", "Strategic silence", "Pause count"],
  ["Downward Inflection", "The certainty sound", "Inflection rate"],
  ["Brevity", "Cutting unnecessary words", "Brevity score"],
  ["Review: First Win", "Weekly trend line debut", "Sprints 1-2 trend"],
  ["BLUF", "Bottom line up front", "Time to conclusion"],
  ["Rule of 3", "Three points, no more", "Structure score"],
  ["Signposting", "First, second, finally", "Signpost count"],
  ["Stacked Constraints", "Combining clarity tools", "Composite score"],
  ["Master Answer", "Mimic and refine", "Similarity score"],
  ["Review: Hot Seat Preview", "Adversarial: three AI follow-ups", "Recovery time"],
  ["Calibrated Questions", "Premium pressure briefing", "Composure"],
  ["Tactical Empathy", "Premium pressure briefing", "Composure"],
  ["Accusation Audit", "Premium pressure briefing", "Composure"],
  ["The Aikido Pivot", "Premium pressure briefing", "Composure"],
  ["Label and Pause", "Premium pressure briefing", "Composure"],
  ["Review: Pressure Replay", "Premium pressure briefing", "Composure"],
  ["Audience-Aware Framing", "Premium composition briefing", "Synthesis"],
  ["Data to Story", "Premium composition briefing", "Synthesis"],
  ["Energy Calibration", "Premium composition briefing", "Synthesis"],
  ["Hypothesis-Driven", "Premium composition briefing", "Synthesis"],
  ["Full Pyramid", "Premium composition briefing", "Synthesis"],
  ["Review: Free Choice", "Premium composition briefing", "Synthesis"],
  ["Hero's Journey", "Premium performance briefing", "Authority"],
  ["Executive Presence", "Premium performance briefing", "Authority"],
  ["Influence Without Authority", "Premium performance briefing", "Authority"],
  ["Memorable Closes", "Premium performance briefing", "Authority"],
  ["Brand Voice", "Premium performance briefing", "Authority"],
  ["Review: The Capstone", "Same prompt as session 1", "Full transformation"],
];

const audioDir = join(process.cwd(), "assets", "audio");
mkdirSync(audioDir, { recursive: true });

function writeWav(path, frequency, durationSeconds) {
  const sampleRate = 22050;
  const sampleCount = Math.floor(sampleRate * durationSeconds);
  const dataSize = sampleCount * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < sampleCount; index += 1) {
    const seconds = index / sampleRate;
    const envelope = Math.min(1, index / 1200, (sampleCount - index) / 1200);
    const pauseGate = Math.sin(seconds * Math.PI * 1.6) > -0.72 ? 1 : 0.18;
    const carrier = Math.sin(2 * Math.PI * frequency * seconds);
    const overtone = 0.4 * Math.sin(2 * Math.PI * (frequency * 1.5) * seconds);
    const sample = Math.round((carrier + overtone) * 8200 * envelope * pauseGate);
    buffer.writeInt16LE(sample, 44 + index * 2);
  }

  writeFileSync(path, buffer);
}

sessionSeeds.forEach(([, , focus], index) => {
  const id = index + 1;
  const name = `session-${String(id).padStart(2, "0")}.wav`;
  const frequency = 176 + (id % 12) * 18 + (focus.length % 6) * 9;
  const duration = 5 + (id % 4);
  const wavPath = join(audioDir, name);
  writeWav(wavPath, frequency, duration);
  console.log(`Generated ${wavPath}`);
});
