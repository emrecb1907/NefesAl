import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { requestNotificationPermissions } from '../src/utils/notifications';
import { useIsDarkMode } from '../src/styles/colors';
import { useAppStore } from '../src/state/store';

export default function RootLayout() {
  const isDarkMode = useIsDarkMode();
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const [isNavigatorReady, setIsNavigatorReady] = useState(false);

  // TEST MODE: Reset onboarding on every app start
  useEffect(() => {
    // Reset onboarding completed status for testing - always show onboarding on app start
    useAppStore.setState({ onboardingCompleted: false });
  }, []);

  useEffect(() => {
    requestNotificationPermissions().catch((error) => {
      console.error('Failed to request notification permissions:', error);
    });
  }, []);

  // Mark navigator as ready when segments are available
  useEffect(() => {
    if (segments.length > 0) {
      setIsNavigatorReady(true);
    }
  }, [segments]);

  // Handle onboarding redirect
  // TEST MODE: Always show onboarding on app start (unless already completed)
  useEffect(() => {
    if (!isNavigatorReady) return;

    // Temporarily modified for testing - show onboarding on app start, but allow navigation after completion
    if (onboardingCompleted && segments[0] === 'onboarding') {
      // If onboarding is completed but user is still on onboarding screen, go to tabs
      router.replace('/(tabs)');
    } else if (!onboardingCompleted && pathname !== '/onboarding' && segments[0] !== 'onboarding') {
      // If onboarding is not completed and user is not on onboarding, redirect to onboarding
      router.replace('/onboarding');
    }
    // Original code (commented for testing):
    // if (onboardingCompleted && segments[0] === 'onboarding') {
    //   router.replace('/(tabs)');
    // } else if (!onboardingCompleted && segments[0] !== 'onboarding') {
    //   router.replace('/onboarding');
    // }
  }, [isNavigatorReady, pathname, segments, router, onboardingCompleted]);

  // Only show StatusBar when NOT on onboarding screen
  const showStatusBar = pathname !== '/onboarding' && segments[0] !== 'onboarding';

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        {showStatusBar && <StatusBar style={isDarkMode ? 'light' : 'dark'} />}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="practice"
            options={{
              animation: 'none', // No animation for instant transition
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="premium"
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="sounds"
            options={{ presentation: 'modal' }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

