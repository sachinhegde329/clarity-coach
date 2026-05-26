import React, { useEffect, useMemo, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Chivo_800ExtraBold } from "@expo-google-fonts/chivo";
import { JetBrainsMono_600SemiBold, JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono";
import { LibreFranklin_400Regular, LibreFranklin_500Medium, LibreFranklin_700Bold } from "@expo-google-fonts/libre-franklin";
import { SpaceMono_400Regular } from "@expo-google-fonts/space-mono";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BottomBar } from "./src/design-system/primitives";
import { palette } from "./src/design-system/theme";
import { sessionDefinitions, sessionStages, type AppTab } from "./src/data/mockData";
import { OnboardingFlowScreen } from "./src/screens/OnboardingFlowScreen";
import { TodayScreen } from "./src/screens/TodayScreen";
import { JourneyScreen } from "./src/screens/JourneyScreen";
import { LibraryScreen } from "./src/screens/LibraryScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { SessionFlowScreen } from "./src/screens/session/SessionFlowScreen";
import { UNLOCK_ALL_FOR_TESTING } from "./src/screens/session/constants";
import { Reveal } from "./src/design-system/motion";
import { CelebrationOverlay } from "./src/design-system/motion";
import { getOrCreateAnonymousUser } from "./src/services/supabase";
import { useSessionProgressStore } from "./src/stores/sessionProgressStore";

export default function App() {
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
      }
    })();
  }, [hasCompletedOnboarding, setUserId]);

  const activeStage = useMemo(
    () => (sessionStepIndex === null ? null : sessionStages[sessionStepIndex]),
    [sessionStepIndex],
  );

  if (!fontsLoaded || !progressHydrated) {
    return null;
  }

  const effectiveUnlockedSessionNumber = UNLOCK_ALL_FOR_TESTING
    ? sessionDefinitions.length
    : highestUnlockedSessionNumber;

  const renderMainScreen = () => {
    switch (activeTab) {
      case "today":
        return (
          <TodayScreen
            sessionNumber={effectiveUnlockedSessionNumber}
            onTab={setActiveTab}
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
            onTab={setActiveTab}
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
            onTab={setActiveTab}
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
            onTab={setActiveTab}
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
        <ExpoStatusBar style={activeStage === "breathe" ? "light" : "dark"} />
        <StatusBar barStyle={activeStage === "breathe" ? "light-content" : "dark-content"} />

        {!hasCompletedOnboarding ? (
          <OnboardingFlowScreen onFinish={() => setHasCompletedOnboarding(true)} />
        ) : activeStage ? (
          <SessionFlowScreen
            sessionNumber={activeSessionNumber}
            stage={activeStage}
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
                        "Baseline recorded.\nYou’ve set your starting point.\n\nToday, just notice how you speak.\nThat is the practice.",
                    });
                    setActiveTab("today");
                  }
                  return null;
                }
                return current + 1;
              });
            }}
          />
        ) : (
          <View style={styles.mainShell}>
            <Reveal key={activeTab} style={styles.screenBody}>
              {renderMainScreen()}
            </Reveal>
            <BottomBar activeTab={activeTab} onTab={setActiveTab} />
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
