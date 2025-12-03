import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/styles/colors';
import { useAppStore } from '../../src/state/store';
import { TechniqueCard } from '../../src/components';
import { breathingPatterns } from '../../src/constants/breathingPatterns';
import { useTranslation } from '../../src/hooks/useTranslation';

export default function SessionsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const isPremium = useAppStore((state) => state.isPremium);
  const setSelectedPattern = useAppStore((state) => state.setSelectedPattern);

  const handleTechniquePress = (patternId: string, patternName: string) => {
    setSelectedPattern(patternId);
    // Ana sayfaya yönlendir
    router.push('/(tabs)/');
  };

  const handleLockedPress = () => {
    router.push('/premium');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {t('sessions.title')}
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
            >
              {t('sessions.subtitle')}
            </Text>
          </View>
        </View>

        {/* Techniques List */}
        <View style={styles.techniquesList}>
          {breathingPatterns.map((pattern) => {
            const isLocked = pattern.isPremium && !isPremium;
            const patternName = t(`sessions.patterns.${pattern.id}.name`) || pattern.name;
            const patternDescription = t(`sessions.patterns.${pattern.id}.description`) || pattern.description;

            return (
              <TechniqueCard
                key={pattern.id}
                title={patternName}
                description={patternDescription}
                isLocked={isLocked}
                onPress={() => {
                  if (isLocked) {
                    handleLockedPress();
                  } else {
                    handleTechniquePress(pattern.id, patternName);
                  }
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  techniquesList: {
    paddingHorizontal: 20,
  },
});

