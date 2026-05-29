import React, { createContext, useContext, useEffect, useRef } from "react";
import { useColorScheme } from "react-native";
import { palette } from "./theme";
import { lightPalette, darkPalette, type PaletteTokens } from "./palettes";
import { useThemeStore } from "../stores/themeStore";

type ThemeContextValue = {
  resolvedTheme: "light" | "dark";
  colors: PaletteTokens;
};

const ThemeContext = createContext<ThemeContextValue>({
  resolvedTheme: "light",
  colors: lightPalette,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);
  const prevTheme = useRef<"light" | "dark">("light");

  const resolvedTheme: "light" | "dark" =
    mode === "system" ? (systemColorScheme === "dark" ? "dark" : "light") : mode;

  const colors = resolvedTheme === "dark" ? darkPalette : lightPalette;

  useEffect(() => {
    if (prevTheme.current === resolvedTheme) return;
    prevTheme.current = resolvedTheme;

    const target = resolvedTheme === "dark" ? darkPalette : lightPalette;
    const keys = Object.keys(target) as (keyof PaletteTokens)[];
    for (const key of keys) {
      (palette as Record<string, string>)[key] = target[key];
    }
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ resolvedTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeColors(): PaletteTokens {
  return useContext(ThemeContext).colors;
}

export function useResolvedTheme(): "light" | "dark" {
  return useContext(ThemeContext).resolvedTheme;
}
