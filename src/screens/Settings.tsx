import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../styles/colors';
import { SafeScreen } from '../components';

export default function SettingsScreen() {
  const theme = useTheme();

  return (
    <SafeScreen edges={['top', 'bottom']} backgroundColor={theme.colors.background}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Settings Screen
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Configure your app preferences
        </Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});

