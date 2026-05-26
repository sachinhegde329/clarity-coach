#!/usr/bin/env python3
"""Parse ClarityCoach Session Copy docx to JSON on stdout."""
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

path = sys.argv[1] if len(sys.argv) > 1 else "ClarityCoach Session Copy.docx"

with zipfile.ZipFile(path) as z:
    paragraphs = []
    for p in ET.fromstring(z.read("word/document.xml")).iter(
        "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"
    ):
        parts = []
        for t in p.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t"):
            if t.text:
                parts.append(t.text)
            if t.tail:
                parts.append(t.tail)
        text = "".join(parts).strip()
        if text:
            paragraphs.append(text)


def strip_quotes(s):
    s = s.strip()
    if s.startswith('"') and s.endswith('"'):
        return s[1:-1]
    return s


FIELD_KEYS = {
    "Step label (top of screen)": "stepLabel",
    "Sub-line (meta size, parchment)": "subLine",
    "Tidbit title": "tidbitTitle",
    "60-second tidbit transcript (audio script)": "transcript",
    "Pull quote (slightly larger in transcript scroll)": "pullQuote",
    "Constraint card": "constraint",
    "Prompt": "prompt",
    "Time": "time",
    "Meta line (above prompt, parchment)": "doMetaLine",
    "Challenge type": "challengeType",
    "Metrics shown": "metricsShown",
    "Headline line (above metrics, parchment)": "headlineLine",
    "Sub-line (below metrics)": "seeSubLine",
    "Opener": "opener",
    "Meta line (parchment, appears with mic)": "commitMetaLine",
    "Prompt (for free-response Commits)": "freeResponsePrompt",
    "Closing line (after the playback)": "closingLine",
}

SPRINT_NAMES = ["Notice", "Notice", "Notice", "Notice", "Notice", "Notice", "Steady", "Steady", "Steady", "Steady", "Steady", "Steady", "Lead", "Lead", "Lead", "Lead", "Lead", "Lead", "Hold", "Hold", "Hold", "Hold", "Hold", "Hold", "Compose", "Compose", "Compose", "Compose", "Compose", "Compose", "Perform", "Perform", "Perform", "Perform", "Perform", "Perform"]

sessions = {}
current = stage = field = None

for line in paragraphs:
    m = re.match(r"^Session (\d+) — (.+)$", line)
    if m:
        current = int(m.group(1))
        sessions[current] = {"sessionNumber": current, "name": m.group(2).strip(), "concept": "", "sprintMeta": "", "stages": {}}
        stage = field = None
        continue
    if current and "·" in line and line.startswith("Sprint "):
        sessions[current]["sprintMeta"] = line
        sessions[current]["concept"] = line.split("·")[-1].strip()
        continue
    sm = re.match(r"^0([1-5]) · (Centre|Listen|Do|See|Commit)$", line)
    if sm and current:
        stage = sm.group(2).lower()
        sessions[current]["stages"][stage] = {}
        field = None
        continue
    if line == "On-screen line(s) (large, centred)":
        field = "__onScreen__"
        continue
    if line == "Free-tier commentary templates":
        if current and stage:
            sessions[current]["stages"][stage].setdefault("commentaryTemplates", {})
        field = "__templates__"
        continue
    if line == "Premium upsell card (after See screen)":
        if current and stage:
            sessions[current]["stages"][stage]["premiumUpsell"] = {}
        field = "__upsell__"
        continue
    if line == "Design rationale (not on screen)":
        field = "__skip__"
        continue
    if not current or not stage:
        continue
    s = sessions[current]["stages"][stage]
    if field == "__skip__":
        continue
    if field == "__onScreen__":
        s.setdefault("onScreenLines", []).append(strip_quotes(line))
        continue
    if field == "__templates__":
        if ":" in line:
            k, v = line.split(":", 1)
            s["commentaryTemplates"][k.strip()] = strip_quotes(v)
        continue
    if field == "__upsell__":
        if line in ("Headline", "Body", "Primary CTA", "Secondary"):
            field = "__upsell_val__:" + {"Headline": "headline", "Body": "body", "Primary CTA": "primaryCta", "Secondary": "secondary"}[line]
            continue
        continue
    if field and field.startswith("__upsell_val__:"):
        s["premiumUpsell"][field.split(":")[1]] = strip_quotes(line)
        field = "__upsell__"
        continue
    if line in FIELD_KEYS:
        field = line
        continue
    if field and field in FIELD_KEYS:
        s[FIELD_KEYS[field]] = strip_quotes(line)
        field = None

for n, data in sessions.items():
    data["sprintNumber"] = f"{(n - 1) // 6 + 1:02d}"
    data["sprintName"] = SPRINT_NAMES[n - 1]

for data in sessions.values():
    c = data["stages"].get("centre")
    if not c:
        continue
    lines = c.get("onScreenLines", [])
    cleaned = []
    i = 0
    while i < len(lines):
        if lines[i] == "Sub-line (meta size, parchment)":
            if i + 1 < len(lines) and not c.get("subLine"):
                c["subLine"] = lines[i + 1]
            i += 2
            continue
        cleaned.append(lines[i])
        i += 1
    c["onScreenLines"] = cleaned
    listen = data["stages"].get("listen", {})
    if listen.get("pullQuote", "").startswith('"Once'):
        listen["pullQuote"] = "Once you can hear a filler as it leaves your mouth, you have three options: silence, a breath, or the next word."

json.dump(list(sessions.values()), sys.stdout, indent=2)
