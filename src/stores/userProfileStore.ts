import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { upsertProfile, fetchProfile } from "../services/profile";
import { trackEvent } from "../services/analytics";
import type { OnboardingData } from "../screens/OnboardingFlowScreen";

const STORAGE_KEY = "clarity-coach-user-profile-v1";

export type SyncStatus = "local" | "synced" | "dirty";

export type UserProfileState = {
  hydrated: boolean;
  industry: string;
  role: string;
  trainingGoal: string;
  selectedHorizons: string[];
  selectedFrictions: string[];
  duration: string;
  practiceTime: string;
  onboardedAt: string | null;
  lastSyncedAt: string | null;
  syncStatus: SyncStatus;
  setHydrated: (hydrated: boolean) => void;
  setProfile: (fields: Partial<Pick<UserProfileState, "industry" | "role" | "trainingGoal" | "selectedHorizons" | "selectedFrictions" | "duration" | "practiceTime">>) => void;
  saveOnboardingData: (data: OnboardingData) => void;
  syncToSupabase: (userId: string) => Promise<void>;
  loadFromSupabase: (userId: string) => Promise<void>;
  resetProfile: () => void;
};

const initialProfile = {
  industry: "",
  role: "",
  trainingGoal: "General",
  selectedHorizons: [] as string[],
  selectedFrictions: [] as string[],
  duration: "",
  practiceTime: "",
  onboardedAt: null as string | null,
  lastSyncedAt: null as string | null,
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      ...initialProfile,
      syncStatus: "local" as SyncStatus,

      setHydrated: (hydrated) => set({ hydrated }),

      setProfile: (fields) =>
        set((state) => ({
          ...state,
          ...fields,
          syncStatus: "dirty",
        })),

      saveOnboardingData: (data) =>
        set({
          industry: data.industry,
          role: data.role,
          trainingGoal: data.trainingGoal,
          selectedHorizons: data.selectedHorizons,
          selectedFrictions: data.selectedFrictions,
          duration: data.duration,
          practiceTime: data.practiceTime,
          onboardedAt: new Date().toISOString(),
          syncStatus: "dirty",
        }),

      syncToSupabase: async (userId) => {
        const state = get();
        const { error } = await upsertProfile(userId, {
          industry: state.industry,
          role: state.role,
          training_goal: state.trainingGoal,
          horizons: state.selectedHorizons,
          frictions: state.selectedFrictions,
          duration: state.duration,
          practice_time: state.practiceTime,
        });
        if (!error) {
          trackEvent("profile_synced", { trainingGoal: state.trainingGoal });
          set({ lastSyncedAt: new Date().toISOString(), syncStatus: "synced" });
        }
      },

      loadFromSupabase: async (userId) => {
        const { profile, error } = await fetchProfile(userId);
        if (error || !profile) return;
        set({
          industry: profile.industry ?? "",
          role: profile.role ?? "",
          trainingGoal: profile.training_goal ?? "General",
          selectedHorizons: profile.horizons ?? [],
          selectedFrictions: profile.frictions ?? [],
          duration: profile.duration ?? "",
          practiceTime: profile.practice_time ?? "",
          onboardedAt: profile.created_at,
          lastSyncedAt: new Date().toISOString(),
          syncStatus: "synced",
        });
      },

      resetProfile: () =>
        set({
          ...initialProfile,
          syncStatus: "dirty",
          onboardedAt: null,
          lastSyncedAt: null,
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        industry: state.industry,
        role: state.role,
        trainingGoal: state.trainingGoal,
        selectedHorizons: state.selectedHorizons,
        selectedFrictions: state.selectedFrictions,
        duration: state.duration,
        practiceTime: state.practiceTime,
        onboardedAt: state.onboardedAt,
        lastSyncedAt: state.lastSyncedAt,
      }),
    },
  ),
);
