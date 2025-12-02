import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';
import './global.css';

import { RootNavigator } from './src/navigation/RootNavigator';
import { requestNotificationPermissions } from './src/utils/notifications';
import { useIsDarkMode } from './src/styles/colors';

export default function App() {
  const isDarkMode = useIsDarkMode();

  // Initialize app state
  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermissions().catch((error) => {
      console.error('Failed to request notification permissions:', error);
    });

    // Load persisted state (handled by Zustand persist middleware)
    // The store will automatically hydrate from AsyncStorage
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

