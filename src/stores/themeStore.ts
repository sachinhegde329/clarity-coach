import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STORAGE_KEY = "clarity-coach-theme-v2";

export type ThemeMode = "light" | "dark" | "system";

export type ThemeState = {
  hydrated: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      hydrated: false,
      mode: "light" as ThemeMode,

      setMode: (mode) => set({ mode }),

      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        mode: state.mode,
      }),
    },
  ),
);
