import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/styles/colors';
import { useAppStore } from '../../src/state/store';
import { StatCard, WeeklyChart } from '../../src/components';
import { Button } from '../../src/components';
import { formatDuration } from '../../src/utils/formatTime';
import { useTranslation } from '../../src/hooks/useTranslation';
import Svg, { Circle, Path, Line } from 'react-native-svg';

// Mock weekly data - in a real app, this would come from the store
const getWeeklyData = (): number[] => {
  // Generate sample data for the last 7 days
  // In a real app, this would be calculated from actual session history
  return [15, 20, 25, 18, 22, 5, 18]; // Minutes for each day
};

const SessionsIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" />
    <Path
      d="M9 12 L11 14 L15 10"
      stroke="#6366f1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TotalTimeIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" />
    <Line
      x1="12"
      y1="12"
      x2="12"
      y2="7"
      stroke="#6366f1"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="12"
      y1="12"
      x2="16"
      y2="16"
      stroke="#6366f1"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const StreakIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2 L13.5 8.5 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 8.5 Z"
      fill="#f59e0b"
    />
  </Svg>
);

export default function StatsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { totalSessions, totalMinutes, streak } = useAppStore();
  
  // Calculate best streak (for now, use current streak)
  // In a real app, this would track the maximum streak achieved
  const bestStreak = streak;

  const weeklyData = useMemo(() => getWeeklyData(), []);

  const handleViewHistory = () => {
    // Navigate to full history screen (if implemented)
    // For now, just log
    console.log('View Full History');
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
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('stats.title')}
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            {t('stats.subtitle')}
          </Text>
        </View>

        {/* Summary Statistics */}
        <View style={styles.statsRow}>
          <StatCard
            label={t('stats.sessions')}
            value={totalSessions}
            icon={<SessionsIcon />}
          />
          <View style={styles.statSpacer} />
          <StatCard
            label={t('stats.totalMinutes')}
            value={formatDuration(totalMinutes)}
            icon={<TotalTimeIcon />}
          />
          <View style={styles.statSpacer} />
          <StatCard
            label={t('stats.bestStreak')}
            value={`${bestStreak} ${bestStreak === 1 ? t('stats.day') : t('stats.days')}`}
            icon={<StreakIcon />}
          />
        </View>

        {/* Weekly Progress Chart */}
        <View style={styles.chartContainer}>
          <WeeklyChart data={weeklyData} />
        </View>

        {/* View Full History Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={t('stats.weeklyProgress')}
            onPress={handleViewHistory}
            fullWidth
          />
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statSpacer: {
    width: 12,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
});

