import { useCallback, useEffect, useRef, useState } from "react";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

type RecordingResult = {
  uri: string | null;
  durationMs: number;
};

export function useSessionRecording() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [lastResult, setLastResult] = useState<RecordingResult | null>(null);
  const preparedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const permission = await requestRecordingPermissionsAsync();
      if (cancelled) return;
      setPermissionGranted(permission.granted);

      if (permission.granted) {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const ensurePrepared = useCallback(async () => {
    if (preparedRef.current) return true;
    if (!permissionGranted) {
      const permission = await requestRecordingPermissionsAsync();
      setPermissionGranted(permission.granted);
      if (!permission.granted) return false;
    }

    await recorder.prepareToRecordAsync();
    preparedRef.current = true;
    return true;
  }, [permissionGranted, recorder]);

  const start = useCallback(async () => {
    const ready = await ensurePrepared();
    if (!ready) return false;

    setLastResult(null);
    recorder.record();
    return true;
  }, [ensurePrepared, recorder]);

  const stop = useCallback(async () => {
    if (!recorderState.isRecording && recorderState.durationMillis <= 0) {
      return lastResult;
    }

    await recorder.stop();
    preparedRef.current = false;

    const uri = recorder.uri ?? null;
    const durationMs = Math.max(recorderState.durationMillis, 0);
    const result = { uri, durationMs };
    setLastResult(result);
    return result;
  }, [lastResult, recorder, recorderState.durationMillis, recorderState.isRecording]);

  const reset = useCallback(async () => {
    if (recorderState.isRecording) {
      await recorder.stop();
    }
    preparedRef.current = false;
    setLastResult(null);
  }, [recorder, recorderState.isRecording]);

  return {
    permissionGranted,
    isRecording: recorderState.isRecording,
    durationMs: recorderState.durationMillis,
    durationSeconds: Math.floor(recorderState.durationMillis / 1000),
    lastResult,
    start,
    stop,
    reset,
  };
}
