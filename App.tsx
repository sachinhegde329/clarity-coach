import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StatusBar, StyleSheet, View } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Chivo_800ExtraBold } from "@expo-google-fonts/chivo";
import { JetBrainsMono_600SemiBold, JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono";
import { LibreFranklin_400Regular, LibreFranklin_500Medium, LibreFranklin_700Bold } from "@expo-google-fonts/libre-franklin";
import { SpaceMono_400Regular } from "@expo-google-fonts/space-mono";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BottomBar, LogoGlyph, MonoText } from "./src/design-system/primitives";
import { palette, spacing } from "./src/design-system/theme";
import { ThemeProvider, useResolvedTheme } from "./src/design-system/ThemeProvider";
import { sessionDefinitions, sessionStages, type AppTab } from "./src/data/mockData";
import { OnboardingFlowScreen } from "./src/screens/OnboardingFlowScreen";
import { TodayScreen } from "./src/screens/TodayScreen";
import { JourneyScreen } from "./src/screens/JourneyScreen";
import { LibraryScreen } from "./src/screens/LibraryScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { SessionFlowScreen } from "./src/screens/session/SessionFlowScreen";
import { UNLOCK_ALL_FOR_TESTING } from "./src/screens/session/constants";
import { CelebrationOverlay } from "./src/design-system/motion";
import { getOrCreateAnonymousUser } from "./src/services/supabase";
import { useSessionProgressStore } from "./src/stores/sessionProgressStore";
import { useUserProfileStore } from "./src/stores/userProfileStore";
import { hasSupabaseConfig } from "./src/config/env";
import { trackEvent } from "./src/services/analytics";
import type { OnboardingData } from "./src/screens/OnboardingFlowScreen";

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  const resolvedTheme = useResolvedTheme();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceMono_400Regular,
    Chivo_800ExtraBold,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
    LibreFranklin_400Regular,
    LibreFranklin_500Medium,
    LibreFranklin_700Bold,
  });
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>("today");
  const [sessionStepIndex, setSessionStepIndex] = useState<number | null>(null);
  const [activeSessionNumber, setActiveSessionNumber] = useState<number>(1);
  const [completionNotice, setCompletionNotice] = useState<null | { sessionNumber: number; message: string }>(null);
  const [celebration, setCelebration] = useState<null | { sessionNumber: number; title: string; subtitle: string }>(null);
  const [scrollOffsetsByTab, setScrollOffsetsByTab] = useState<Record<AppTab, number>>({
    today: 0,
    journey: 0,
    library: 0,
    stats: 0,
  });

  const prevTabRef = useRef(activeTab);
  const tabSlideAnim = useRef(new Animated.Value(0)).current;

  const handleTabChange = useCallback((tab: AppTab) => {
    if (tab === activeTab) return;
    const tabOrder: AppTab[] = ["today", "journey", "library", "stats"];
    const prevIdx = tabOrder.indexOf(activeTab);
    const currIdx = tabOrder.indexOf(tab);
    const dir = currIdx > prevIdx ? 1 : -1;
    tabSlideAnim.setValue(dir);
    setActiveTab(tab);
  }, [activeTab, tabSlideAnim]);

  useEffect(() => {
    if (prevTabRef.current === activeTab) return;
    Animated.timing(tabSlideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    prevTabRef.current = activeTab;
  }, [activeTab, tabSlideAnim]);

  const progressHydrated = useSessionProgressStore((state) => state.hydrated);
  const highestUnlockedSessionNumber = useSessionProgressStore((state) => state.highestUnlockedSessionNumber);
  const markSessionCompleted = useSessionProgressStore((state) => state.markSessionCompleted);
  const getResumeStepIndex = useSessionProgressStore((state) => state.getResumeStepIndex);
  const setUserId = useSessionProgressStore((state) => state.setUserId);

  useEffect(() => {
    if (!hasCompletedOnboarding) return;

    void (async () => {
      const { userId } = await getOrCreateAnonymousUser();
      if (userId) {
        setUserId(userId);
        const profileStore = useUserProfileStore.getState();
        if (hasSupabaseConfig()) {
          if (profileStore.syncStatus === "local" && profileStore.industry) {
            await profileStore.syncToSupabase(userId);
          } else if (profileStore.syncStatus === "synced") {
            await profileStore.loadFromSupabase(userId);
          }
        }
      }
    })();
  }, [hasCompletedOnboarding, setUserId]);

  const activeStage = useMemo(
    () => (sessionStepIndex === null ? null : sessionStages[sessionStepIndex]),
    [sessionStepIndex],
  );

  const sessionFadeAnim = useRef(new Animated.Value(0)).current;
  const mainFadeAnim = useRef(new Animated.Value(1)).current;
  const [sessionMounted, setSessionMounted] = useState(false);

  useEffect(() => {
    if (activeStage && !sessionMounted) {
      setSessionMounted(true);
      Animated.parallel([
        Animated.timing(sessionFadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(mainFadeAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
    if (!activeStage && sessionMounted) {
      Animated.parallel([
        Animated.timing(sessionFadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(mainFadeAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => setSessionMounted(false));
    }
  }, [activeStage, sessionMounted, sessionFadeAnim, mainFadeAnim]);

  if (!fontsLoaded || !progressHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.paper, justifyContent: "center", alignItems: "center", gap: spacing.md }}>
        <LogoGlyph />
        <MonoText style={{ color: palette.inkMuted, letterSpacing: 2 }}>LOADING</MonoText>
      </View>
    );
  }

  const statusBarStyle = resolvedTheme === "dark" ? "light" : "dark";

  const effectiveUnlockedSessionNumber = UNLOCK_ALL_FOR_TESTING
    ? sessionDefinitions.length
    : highestUnlockedSessionNumber;

  const renderMainScreen = () => {
    switch (activeTab) {
      case "today":
        return (
          <TodayScreen
            sessionNumber={effectiveUnlockedSessionNumber}
            onTab={handleTabChange}
            scrollOffset={scrollOffsetsByTab.today}
            onScrollOffsetChange={(offset) => setScrollOffsetsByTab((current) => ({ ...current, today: offset }))}
            onBegin={() => {
              setCompletionNotice(null);
              setActiveSessionNumber(effectiveUnlockedSessionNumber);
              setSessionStepIndex(getResumeStepIndex(effectiveUnlockedSessionNumber));
            }}
            onStartQuickDrill={() => {
              setCompletionNotice(null);
              setActiveSessionNumber(effectiveUnlockedSessionNumber);
              setSessionStepIndex(0);
            }}
            completionNotice={completionNotice}
            onClearCompletionNotice={() => setCompletionNotice(null)}
          />
        );
      case "journey":
        return (
          <JourneyScreen
            highestUnlockedSessionNumber={effectiveUnlockedSessionNumber}
            onTab={handleTabChange}
            scrollOffset={scrollOffsetsByTab.journey}
            onScrollOffsetChange={(offset) => setScrollOffsetsByTab((current) => ({ ...current, journey: offset }))}
            onOpenSession={(sessionNumber, stepIndex = 0) => {
              setActiveSessionNumber(sessionNumber);
              setSessionStepIndex(UNLOCK_ALL_FOR_TESTING ? stepIndex : getResumeStepIndex(sessionNumber) || stepIndex);
            }}
          />
        );
      case "library":
        return (
          <LibraryScreen
            onTab={handleTabChange}
            scrollOffset={scrollOffsetsByTab.library}
            onScrollOffsetChange={(offset) => setScrollOffsetsByTab((current) => ({ ...current, library: offset }))}
            onStartDrill={() => {
              setActiveSessionNumber(effectiveUnlockedSessionNumber);
              setSessionStepIndex(0);
            }}
          />
        );
      case "stats":
        return (
          <StatsScreen
            onTab={handleTabChange}
            scrollOffset={scrollOffsetsByTab.stats}
            onScrollOffsetChange={(offset) => setScrollOffsetsByTab((current) => ({ ...current, stats: offset }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.app}>
        <ExpoStatusBar style={activeStage === "breathe" ? "light" : statusBarStyle} />
        <StatusBar barStyle={activeStage === "breathe" ? "light-content" : statusBarStyle === "light" ? "light-content" : "dark-content"} />

        {!hasCompletedOnboarding ? (
          <OnboardingFlowScreen
            onFinish={(data: OnboardingData) => {
              trackEvent("onboarding_complete", {
                trainingGoal: data.trainingGoal,
                industry: data.industry,
                role: data.role,
              });
              useUserProfileStore.getState().saveOnboardingData(data);
              const userId = useSessionProgressStore.getState().userId;
              if (userId && hasSupabaseConfig()) {
                useUserProfileStore.getState().syncToSupabase(userId);
              }
              setHasCompletedOnboarding(true);
            }}
          />
        ) : (
          <View style={{ flex: 1 }}>
            {sessionMounted || activeStage ? (
              <Animated.View style={[StyleSheet.absoluteFill, { opacity: sessionFadeAnim, zIndex: 1 }]}>
                <SessionFlowScreen
                  sessionNumber={activeSessionNumber}
                  stage={activeStage ?? sessionStages[0]!}
                  stepIndex={sessionStepIndex ?? 0}
                  onJumpToStep={(targetIndex) => {
                    setSessionStepIndex(targetIndex);
                  }}
                  onBack={() => {
                    setSessionStepIndex((current) => {
                      if (current === null) return null;
                      return current <= 0 ? null : current - 1;
                    });
                  }}
                  onExit={() => setSessionStepIndex(null)}
                  onNext={() => {
                    setSessionStepIndex((current) => {
                      if (current === null) {
                        return null;
                      }
                      if (current >= sessionStages.length - 1) {
                        markSessionCompleted(activeSessionNumber);
                        setCelebration({
                          sessionNumber: activeSessionNumber,
                          title: "Session complete",
                          subtitle: "Nice work. Keep going.",
                        });
                        if (activeSessionNumber === 1) {
                          setCompletionNotice({
                            sessionNumber: 1,
                            message:
                              "Baseline recorded.\nYou've set your starting point.\n\nToday, just notice how you speak.\nThat is the practice.",
                          });
                          handleTabChange("today");
                        }
                        return null;
                      }
                      return current + 1;
                    });
                  }}
                />
              </Animated.View>
            ) : null}
            <Animated.View style={[styles.mainShell, { opacity: mainFadeAnim }]}>
              <Animated.View
                key={activeTab}
                style={[
                  styles.screenBody,
                  {
                    transform: [{ translateX: tabSlideAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: [60, 0, -60] }) }],
                  },
                ]}
              >
                {renderMainScreen()}
              </Animated.View>
              <BottomBar activeTab={activeTab} onTab={handleTabChange} />
            </Animated.View>
          </View>
        )}

        <CelebrationOverlay
          visible={Boolean(celebration)}
          title={celebration?.title}
          subtitle={celebration?.subtitle}
          onDone={() => setCelebration(null)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  mainShell: {
    flex: 1,
  },
  screenBody: {
    flex: 1,
  },
});
