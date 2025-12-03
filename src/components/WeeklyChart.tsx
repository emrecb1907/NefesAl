import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../styles/colors';
import { useTranslation } from '../hooks/useTranslation';
import { Card } from './Card';
import Svg, { Rect, LinearGradient, Defs, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 200;
const BAR_WIDTH = (CHART_WIDTH - 48) / 7; // 7 bars with spacing
const MAX_BAR_HEIGHT = CHART_HEIGHT - 60; // Leave space for labels

interface WeeklyChartProps {
  data: number[]; // Array of 7 numbers representing minutes for each day
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const maxValue = Math.max(...data, 1); // Avoid division by zero

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getBarHeight = (value: number) => {
    return (value / maxValue) * MAX_BAR_HEIGHT;
  };

  return (
    <Card style={styles.card} padding={20}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('stats.thisWeek')}</Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.textSecondary }]}
        >
          {t('stats.minutesPracticed')}
        </Text>
      </View>

      <View style={styles.chartWrapper}>
        <View style={styles.chartContainer}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#818cf8" stopOpacity="1" />
                <Stop offset="100%" stopColor="#bfdbfe" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            {data.map((value, index) => {
              const barHeight = getBarHeight(value);
              const x = index * (BAR_WIDTH + 6) + 24;
              const y = CHART_HEIGHT - 40 - barHeight;

              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barHeight}
                  rx={4}
                  fill="url(#barGradient)"
                />
              );
            })}
          </Svg>
        </View>
        {/* Day labels positioned absolutely */}
        <View style={styles.dayLabels}>
          {days.map((day, index) => (
            <Text
              key={index}
              style={[
                styles.dayLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              {day}
            </Text>
          ))}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  chartWrapper: {
    position: 'relative',
    height: CHART_HEIGHT,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabels: {
    position: 'absolute',
    bottom: 0,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    width: BAR_WIDTH,
    textAlign: 'center',
  },
});
