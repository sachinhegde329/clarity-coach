import { useEffect, useState } from "react";
import type { SessionStage } from "../../../data/mockData";
import { LISTEN_DURATION, RECORD_DURATION, REFLECT_DURATION } from "../constants";

type SessionTimerLimits = {
  recordSeconds?: number;
  listenSeconds?: number;
};

export function useSessionTimers(stage: SessionStage, limits?: SessionTimerLimits) {
  const recordLimit = limits?.recordSeconds ?? RECORD_DURATION;
  const listenLimit = limits?.listenSeconds ?? LISTEN_DURATION;

  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [breathElapsed, setBreathElapsed] = useState(0);
  const [isBreathRunning, setIsBreathRunning] = useState(false);
  const [listenProgress, setListenProgress] = useState(0);
  const [listenPlaying, setListenPlaying] = useState(false);
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
    setListenProgress(0);
    setRecording(false);
    setRecordElapsed(0);
    setOverlayOn(false);
    setReflectRecording(false);
    setReflectElapsed(0);
    setReflectionDone(false);
  }, [stage]);

  useEffect(() => {
    if (!isBreathRunning) return;
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
    if (!listenPlaying) return;
    const timer = setInterval(() => {
      setListenProgress((current) => {
        const next = current + Math.round(100 / Math.max(listenLimit, 1));
        if (next >= 100) {
          setListenPlaying(false);
          return 100;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [listenPlaying, listenLimit]);

  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => {
      setRecordElapsed((current) => {
        if (current >= recordLimit - 1) {
          setRecording(false);
          return recordLimit;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [recording, recordLimit]);

  useEffect(() => {
    if (!reflectRecording) return;
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
    recordLimit,
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
