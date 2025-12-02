import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../styles/colors';
import { useAppStore } from '../state/store';
import { StatCard, QuickStartCard, SessionCard } from '../components';
import { breathingPatterns } from '../constants/breathingPatterns';
import { formatDuration } from '../utils/formatTime';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle } from 'react-native-svg';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const StatIcon = ({ type }: { type: 'streak' | 'sessions' | 'minutes' }) => {
  if (type === 'streak') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z"
          fill="#f59e0b"
        />
      </Svg>
    );
  }
  if (type === 'sessions') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" />
        <Path
          d="M12 6 L12 12 L16 14"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    );
  }
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2 C6.48 2 2 6.48 2 12 C2 17.52 6.48 22 12 22 C17.52 22 22 17.52 22 12 C22 6.48 17.52 2 12 2 Z"
        fill="#10b981"
      />
      <Path
        d="M12 6 L12 12 L16 14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { streak, totalSessions, totalMinutes } = useAppStore();
  const defaultPattern = breathingPatterns[0];

  const handleQuickStart = () => {
    // Navigate to Practice screen
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('Practice', {
        patternId: defaultPattern.id,
        patternName: defaultPattern.name,
      });
    }
  };

  const handleSessionPress = (patternId: string) => {
    // Navigate to Practice screen with selected pattern
    const pattern = breathingPatterns.find((p) => p.id === patternId) || defaultPattern;
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('Practice', {
        patternId: pattern.id,
        patternName: pattern.name,
      });
    }
  };

  const featuredSessions = breathingPatterns.slice(0, 3);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Ready to breathe?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              // Navigate to Settings modal
              const rootNavigation = navigation.getParent();
              if (rootNavigation) {
                rootNavigation.navigate('Settings');
              }
            }}
            style={styles.settingsButton}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="3" stroke={theme.colors.textSecondary} strokeWidth="2" />
              <Path
                d="M12 1 L12 5 M12 19 L12 23 M1 12 L5 12 M19 12 L23 12"
                stroke={theme.colors.textSecondary}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            label="Day Streak"
            value={streak}
            icon={<StatIcon type="streak" />}
          />
          <View style={styles.statSpacer} />
          <StatCard
            label="Sessions"
            value={totalSessions}
            icon={<StatIcon type="sessions" />}
          />
          <View style={styles.statSpacer} />
          <StatCard
            label="Minutes"
            value={formatDuration(totalMinutes)}
            icon={<StatIcon type="minutes" />}
          />
        </View>

        {/* Quick Start Card */}
        <QuickStartCard
          title="Quick Start"
          description="Begin a breathing session now"
          duration={`${defaultPattern.inhale + defaultPattern.exhale + defaultPattern.hold + defaultPattern.holdAfterExhale} min`}
          onPress={handleQuickStart}
        />

        {/* Featured Sessions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Featured Sessions
          </Text>
          {featuredSessions.map((pattern) => (
            <SessionCard
              key={pattern.id}
              title={pattern.name}
              description={pattern.description}
              duration={`${pattern.inhale}-${pattern.hold}-${pattern.exhale}-${pattern.holdAfterExhale}`}
              onPress={() => handleSessionPress(pattern.id)}
              color={theme.colors.primary}
            />
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  settingsButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statSpacer: {
    width: 12,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});
