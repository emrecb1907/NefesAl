import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../styles/colors';
import { useAppStore } from '../state/store';
import { TechniqueCard, SafeScreen } from '../components';
import { breathingPatterns } from '../constants/breathingPatterns';
import { RootStackParamList, MainTabParamList } from '../navigation/types';

type SessionsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Sessions'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function SessionsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<SessionsScreenNavigationProp>();
  const isPremium = useAppStore((state) => state.isPremium);

  const handleTechniquePress = (patternId: string, patternName: string) => {
    // Navigate to Practice screen through root navigator
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('Practice', {
        patternId,
        patternName,
      });
    }
  };

  const handleLockedPress = () => {
    // Navigate to Premium screen through root navigator
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('Premium');
    }
  };

  return (
    <SafeScreen edges={['top']} backgroundColor={theme.colors.background}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Breathing Techniques
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
            >
              Choose a technique to begin
            </Text>
          </View>
        </View>

        {/* Techniques List */}
        <View style={styles.techniquesList}>
          {breathingPatterns.map((pattern) => {
            const isLocked = pattern.isPremium && !isPremium;

            return (
              <TechniqueCard
                key={pattern.id}
                title={pattern.name}
                description={pattern.description}
                isLocked={isLocked}
                onPress={() => {
                  if (isLocked) {
                    handleLockedPress();
                  } else {
                    handleTechniquePress(pattern.id, pattern.name);
                  }
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeScreen>
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
