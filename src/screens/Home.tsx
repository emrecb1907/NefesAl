import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme, useIsDarkMode } from '../styles/colors';
import { useAppStore } from '../state/store';
import { SafeScreen } from '../components';
import { breathingPatterns } from '../constants/breathingPatterns';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;


export default function HomeScreen() {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { streak } = useAppStore();
  const defaultPattern = breathingPatterns[0]; // Relax Breathing pattern

  // Theme-aware colors
  const backgroundColor = isDarkMode ? '#0F172A' : '#F5F9FC';
  const streakBadgeBg = isDarkMode ? '#1E293B' : '#F3F4F6';
  const streakTextColor = isDarkMode ? '#CBD5E1' : '#374151';
  const todayPracticeCardBg = isDarkMode ? '#1E3A5F' : '#E8F4F8';
  const quickAccessCardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const circleStrokeColor = isDarkMode ? '#475569' : '#D1D5DB';

  const handleStartPractice = () => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('Practice', {
        patternId: defaultPattern.id,
        patternName: defaultPattern.name,
      });
    }
  };

  const handleCardPress = (screen: 'Sessions' | 'Sounds' | 'Stats') => {
    if (screen === 'Sessions') {
      navigation.navigate('Sessions');
    } else if (screen === 'Sounds') {
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.navigate('Sounds');
      }
    } else if (screen === 'Stats') {
      navigation.navigate('Stats');
    }
  };

  return (
    <SafeScreen edges={['top']} backgroundColor={backgroundColor}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak Badge */}
        <View style={styles.streakBadgeContainer}>
          <View style={[styles.streakBadge, { backgroundColor: streakBadgeBg }]}>
            <Text style={[styles.streakText, { color: streakTextColor }]}>{streak}-day streak</Text>
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.mainTitle, { color: theme.colors.text }]}>Breathe & Relax</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Welcome Back</Text>
        </View>

        {/* Today's Practice Card */}
        <View style={[styles.todayPracticeCard, { backgroundColor: todayPracticeCardBg }]}>
          <View style={styles.todayPracticeContent}>
            <View style={styles.todayPracticeText}>
              <Text style={[styles.todayPracticeLabel, { color: theme.colors.textSecondary }]}>Today's Practice</Text>
              <Text style={[styles.todayPracticeTitle, { color: theme.colors.text }]}>Relax Breathing</Text>
              <Text style={[styles.todayPracticeDetails, { color: theme.colors.textSecondary }]}>
                {defaultPattern.inhale}-{defaultPattern.hold}-{defaultPattern.exhale}-{defaultPattern.holdAfterExhale} rhythm · 5 minutes
              </Text>
            </View>
            <View style={styles.circlePlaceholder}>
              <Svg width={80} height={80} viewBox="0 0 80 80">
                <Circle cx="40" cy="40" r="38" stroke={circleStrokeColor} strokeWidth="2" fill="none" />
              </Svg>
            </View>
          </View>
        </View>

        {/* Start Practice Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartPractice}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isDarkMode ? ['#475569', '#334155'] : ['#93C5FD', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>Start Practice</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Access Cards */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: quickAccessCardBg }]}
            onPress={() => handleCardPress('Sessions')}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickAccessText, { color: theme.colors.text }]}>Techniques</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: quickAccessCardBg }]}
            onPress={() => handleCardPress('Sounds')}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickAccessText, { color: theme.colors.text }]}>Sounds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: quickAccessCardBg }]}
            onPress={() => handleCardPress('Stats')}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickAccessText, { color: theme.colors.text }]}>Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  streakBadgeContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  streakBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  todayPracticeCard: {
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  todayPracticeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayPracticeText: {
    flex: 1,
  },
  todayPracticeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  todayPracticeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  todayPracticeDetails: {
    fontSize: 14,
    fontWeight: '400',
  },
  circlePlaceholder: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 28,
    overflow: 'hidden',
  },
  startButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickAccessRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickAccessCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  quickAccessText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});
