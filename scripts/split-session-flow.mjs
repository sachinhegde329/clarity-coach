/**
 * One-time splitter for SessionFlowScreen.tsx — run from repo root:
 *   node scripts/split-session-flow.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "src", "screens", "session");
const src = readFileSync(join(root, "SessionFlowScreen.tsx"), "utf8");
const lines = src.split("\n");

function slice(start, end) {
  return lines.slice(start - 1, end).join("\n");
}

mkdirSync(join(root, "hooks"), { recursive: true });
mkdirSync(join(root, "components"), { recursive: true });
mkdirSync(join(root, "steps"), { recursive: true });
mkdirSync(join(root, "breathe"), { recursive: true });

const styleBlock = slice(2711, 3669).replace(
  "const styles = StyleSheet.create({",
  "export const styles = StyleSheet.create({",
);

writeFileSync(
  join(root, "sessionFlowStyles.ts"),
  `import { StyleSheet } from "react-native";\nimport { palette, spacing, type } from "../../design-system/theme";\n\n${styleBlock}\n`,
);

writeFileSync(
  join(root, "constants.ts"),
  `export const LISTEN_DURATION = 105;\nexport const RECORD_DURATION = 90;\nexport const REFLECT_DURATION = 15;\n`,
);

writeFileSync(
  join(root, "formatTime.ts"),
  `${slice(2705, 2709)}\n`,
);

const hookBody = `import { useEffect, useState } from "react";
import type { SessionStage } from "../../data/mockData";
import { RECORD_DURATION, REFLECT_DURATION } from "../constants";

export function useSessionTimers(stage: SessionStage) {
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [breathElapsed, setBreathElapsed] = useState(0);
  const [isBreathRunning, setIsBreathRunning] = useState(false);
  const [listenProgress, setListenProgress] = useState(32);
  const [listenPlaying, setListenPlaying] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordElapsed, setRecordElapsed] = useState(0);
  const [overlayOn, setOverlayOn] = useState(false);
  const [reflectRecording, setReflectRecording] = useState(false);
  const [reflectElapsed, setReflectElapsed] = useState(0);
  const [reflectionDone, setReflectionDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionElapsed((current) => current + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setBreathElapsed(0);
    setIsBreathRunning(false);
    setListenPlaying(stage === "lesson");
    setListenProgress(32);
    setRecording(false);
    setRecordElapsed(0);
    setOverlayOn(false);
    setReflectRecording(false);
    setReflectElapsed(0);
    setReflectionDone(false);
  }, [stage]);

  useEffect(() => {
    if (!isBreathRunning) {
      return;
    }
    const timer = setInterval(() => {
      setBreathElapsed((current) => {
        if (current >= 14) {
          setIsBreathRunning(false);
          return 15;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isBreathRunning]);

  useEffect(() => {
    if (!listenPlaying) {
      return;
    }
    const timer = setInterval(() => {
      setListenProgress((current) => {
        if (current >= 100) {
          return 100;
        }
        return Math.min(100, current + 1);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [listenPlaying]);

  useEffect(() => {
    if (!recording) {
      return;
    }
    const timer = setInterval(() => {
      setRecordElapsed((current) => {
        if (current >= RECORD_DURATION - 1) {
          setRecording(false);
          return RECORD_DURATION;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    if (!reflectRecording) {
      return;
    }
    const timer = setInterval(() => {
      setReflectElapsed((current) => {
        if (current >= REFLECT_DURATION - 1) {
          setReflectRecording(false);
          setReflectionDone(true);
          return REFLECT_DURATION;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [reflectRecording]);

  return {
    sessionElapsed,
    breathElapsed,
    isBreathRunning,
    setIsBreathRunning,
    listenProgress,
    listenPlaying,
    setListenPlaying,
    recording,
    setRecording,
    recordElapsed,
    setRecordElapsed,
    overlayOn,
    setOverlayOn,
    reflectRecording,
    setReflectRecording,
    reflectElapsed,
    setReflectElapsed,
    reflectionDone,
    setReflectionDone,
  };
}
`;

writeFileSync(join(root, "hooks", "useSessionTimers.ts"), hookBody);

const sharedImports = `import React from "react";
import { View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel } from "../../design-system/primitives";
import { palette, spacing } from "../../design-system/theme";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";
`;

function wrapComponent(name, body, extraImports = "") {
  return `${sharedImports}${extraImports}\n${body.replace(/^function ${name}/, `export function ${name}`)}\n`;
}

writeFileSync(
  join(root, "components", "MetricTile.tsx"),
  wrapComponent("MetricTile", slice(881, 888)),
);
writeFileSync(
  join(root, "components", "HeaderWordmark.tsx"),
  wrapComponent("HeaderWordmark", slice(890, 908)),
);
writeFileSync(
  join(root, "components", "SessionProgressStrip.tsx"),
  wrapComponent("SessionProgressStrip", slice(910, 944)),
);
writeFileSync(
  join(root, "components", "StepMeta.tsx"),
  wrapComponent("StepMeta", slice(946, 953)),
);
writeFileSync(
  join(root, "components", "TextHighlight.tsx"),
  wrapComponent("TextHighlight", slice(955, 957)),
);
writeFileSync(
  join(root, "components", "EditorialWaveform.tsx"),
  wrapComponent("EditorialWaveform", slice(959, 994)),
);
writeFileSync(
  join(root, "components", "DottedStageBackground.tsx"),
  wrapComponent("DottedStageBackground", slice(996, 1035)),
);
writeFileSync(
  join(root, "components", "PhotoPlaceholder.tsx"),
  wrapComponent("PhotoPlaceholder", slice(1037, 1075)),
);
writeFileSync(
  join(root, "components", "MetricInsight.tsx"),
  wrapComponent("MetricInsight", slice(2676, 2703)),
);

const stepImports = `import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { BodyText, DisplayText, MonoText, Panel, PrimaryButton } from "../../design-system/primitives";
import { Icon } from "../../design-system/icons";
import { palette, spacing, type } from "../../design-system/theme";
import { InteractivePressable } from "../../design-system/motion";
import { sessionDefinitions } from "../../data/mockData";
import { RECORD_DURATION, REFLECT_DURATION } from "../constants";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";
import { DottedStageBackground } from "../components/DottedStageBackground";
import { EditorialWaveform } from "../components/EditorialWaveform";
import { PhotoPlaceholder } from "../components/PhotoPlaceholder";
import { SessionProgressStrip } from "../components/SessionProgressStrip";
import { StepMeta } from "../components/StepMeta";
import { TextHighlight } from "../components/TextHighlight";
import { MetricInsight } from "../components/MetricInsight";
`;

writeFileSync(
  join(root, "steps", "StitchSessionStep.tsx"),
  `${stepImports}
import { sessionDefinitions as allSessions } from "../../data/mockData";

${slice(673, 879).replace(/^function StitchSessionStep/, "export function StitchSessionStep")}
`,
);

writeFileSync(
  join(root, "steps", "ListenStep.tsx"),
  `${stepImports}\n${slice(1077, 1407).replace(/^function ListenStep/, "export function ListenStep")}\n`,
);

writeFileSync(
  join(root, "steps", "DoStep.tsx"),
  `${stepImports}\n${slice(1408, 1823).replace(/^function DoStep/, "export function DoStep")}\n`,
);

writeFileSync(
  join(root, "steps", "SeeStep.tsx"),
  `${stepImports}\n${slice(1824, 2304).replace(/^function SeeStep/, "export function SeeStep")}\n`,
);

writeFileSync(
  join(root, "steps", "CommitStep.tsx"),
  `${stepImports}\n${slice(2305, 2674).replace(/^function CommitStep/, "export function CommitStep")}\n`,
);

const breatheImports = `import React from "react";
import { ScrollView, View } from "react-native";
import { AppHeader, BodyText, DisplayText, MonoText, Panel, PrimaryButton } from "../../design-system/primitives";
import { Icon } from "../../design-system/icons";
import { palette, spacing, type } from "../../design-system/theme";
import { InteractivePressable } from "../../design-system/motion";
import type { sessionDefinitions } from "../../data/mockData";
import { formatTime } from "../formatTime";
import { styles } from "../sessionFlowStyles";
import { DottedStageBackground } from "../components/DottedStageBackground";
import { SessionProgressStrip } from "../components/SessionProgressStrip";
`;

const breatheFn = slice(201, 595);
writeFileSync(
  join(root, "breathe", "BreatheStage.tsx"),
  `${breatheImports}
import type { ReactNode } from "react";

export type BreatheStageProps = {
  sessionNumber: number;
  sessionContent: (typeof sessionDefinitions)[number];
  headerLeft: ReactNode;
  headerRight: ReactNode;
  breathElapsed: number;
  isBreathRunning: boolean;
  onBack: () => void;
  onExit: () => void;
  onNext: () => void;
  setIsBreathRunning: (running: boolean) => void;
};

export function BreatheStage({
  sessionNumber,
  sessionContent,
  headerLeft,
  headerRight,
  breathElapsed,
  isBreathRunning,
  onBack,
  onExit,
  onNext,
  setIsBreathRunning,
}: BreatheStageProps) {
${breatheFn.replace(/^  if \(stage === "breathe"\) \{\n/, "").replace(/\n  \}\n\n  return \($/s, "\n  return (")}
`,
);

console.log("Split complete. Review breathe/BreatheStage.tsx and write SessionFlowScreen.tsx manually.");
