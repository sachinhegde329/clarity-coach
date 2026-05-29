import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { hasSupabaseConfig } from "../config/env";
import { sessionDefinitions } from "../data/mockData";
import { fetchProgressFromServer, syncProgressToServer } from "../services/progress";
import type { SessionAnalysisSnapshot } from "../services/sessions";

const STORAGE_KEY = "clarity-coach-session-progress-v1";

export type SessionStepProgress = {
  stepIndex: number;
  updatedAt: string;
  completedAt?: string;
};

type SessionProgressState = {
  hydrated: boolean;
  userId: string | null;
  highestUnlockedSessionNumber: number;
  stepProgressBySession: Record<number, SessionStepProgress>;
  analysisBySession: Record<number, SessionAnalysisSnapshot>;
  selectedMetricBySession: Record<number, string>;
  setHydrated: (hydrated: boolean) => void;
  setUserId: (userId: string | null) => void;
  unlockSession: (sessionNumber: number) => void;
  saveStepProgress: (sessionNumber: number, stepIndex: number) => void;
  markSessionCompleted: (sessionNumber: number) => void;
  saveAnalysis: (sessionNumber: number, snapshot: SessionAnalysisSnapshot) => void;
  saveSelectedMetric: (sessionNumber: number, label: string) => void;
  getResumeStepIndex: (sessionNumber: number) => number;
};

export const useSessionProgressStore = create<SessionProgressState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      userId: null,
      highestUnlockedSessionNumber: 1,
      stepProgressBySession: {},
      analysisBySession: {},
      selectedMetricBySession: {},
      setHydrated: (hydrated) => set({ hydrated }),
      setUserId: (userId) => set({ userId }),
      unlockSession: (sessionNumber) => {
        set((state) => ({
          highestUnlockedSessionNumber: Math.min(
            Math.max(state.highestUnlockedSessionNumber, sessionNumber + 1),
            sessionDefinitions.length,
          ),
        }));
        scheduleSync(get());
      },
      saveStepProgress: (sessionNumber, stepIndex) => {
        set((state) => ({
          stepProgressBySession: {
            ...state.stepProgressBySession,
            [sessionNumber]: {
              stepIndex,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
        scheduleSync(get());
      },
      markSessionCompleted: (sessionNumber) => {
        set((state) => {
          const nextUnlock = Math.min(
            Math.max(state.highestUnlockedSessionNumber, sessionNumber + 1),
            sessionDefinitions.length,
          );
          return {
            highestUnlockedSessionNumber: nextUnlock,
            stepProgressBySession: {
              ...state.stepProgressBySession,
              [sessionNumber]: {
                stepIndex: 4,
                updatedAt: new Date().toISOString(),
                completedAt: new Date().toISOString(),
              },
            },
          };
        });
        scheduleSync(get());
      },
      saveAnalysis: (sessionNumber, snapshot) =>
        set((state) => ({
          analysisBySession: {
            ...state.analysisBySession,
            [sessionNumber]: snapshot,
          },
        })),
      saveSelectedMetric: (sessionNumber, label) => {
        set((state) => ({
          selectedMetricBySession: {
            ...state.selectedMetricBySession,
            [sessionNumber]: label,
          },
        }));
        scheduleSync(get());
      },
      getResumeStepIndex: (sessionNumber) => {
        const progress = get().stepProgressBySession[sessionNumber];
        if (!progress || progress.completedAt) return 0;
        return Math.max(0, Math.min(progress.stepIndex, 4));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        userId: state.userId,
        highestUnlockedSessionNumber: state.highestUnlockedSessionNumber,
        stepProgressBySession: state.stepProgressBySession,
        analysisBySession: state.analysisBySession,
        selectedMetricBySession: state.selectedMetricBySession,
      }),
    },
  ),
);

let syncTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSync(state: SessionProgressState) {
  if (!state.userId || !hasSupabaseConfig()) return;

  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    const current = useSessionProgressStore.getState();
    if (!current.userId) return;
    syncProgressToServer(current.userId, {
      highestUnlockedSessionNumber: current.highestUnlockedSessionNumber,
      stepProgressBySession: current.stepProgressBySession,
      selectedMetricBySession: current.selectedMetricBySession,
    }).catch(() => {});
  }, 2000);
}

export async function fetchAndMergeProgress(userId: string) {
  const { data, error } = await fetchProgressFromServer(userId);
  if (error || !data) return;

  const state = useSessionProgressStore.getState();

  const mergedHighest = Math.max(
    state.highestUnlockedSessionNumber,
    data.highestUnlockedSessionNumber,
  );

  const mergedStepProgress = {
    ...data.stepProgressBySession,
    ...state.stepProgressBySession,
  };

  const mergedSelectedMetric = {
    ...data.selectedMetricBySession,
    ...state.selectedMetricBySession,
  };

  useSessionProgressStore.setState({
    highestUnlockedSessionNumber: mergedHighest,
    stepProgressBySession: mergedStepProgress,
    selectedMetricBySession: mergedSelectedMetric,
  });
}
