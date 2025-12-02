import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../styles/colors';
import { Card } from './Card';
import Svg, { Circle } from 'react-native-svg';

interface SessionCardProps {
  title: string;
  description: string;
  duration: string;
  onPress: () => void;
  color?: string;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  title,
  description,
  duration,
  onPress,
  color = '#6366f1',
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card} padding={16}>
        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}20` }]}>
            <Svg width={32} height={32} viewBox="0 0 32 32">
              <Circle cx="16" cy="16" r="12" fill={color} opacity={0.3} />
              <Circle cx="16" cy="16" r="6" fill={color} />
            </Svg>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {description}
            </Text>
          </View>
          <View style={styles.durationContainer}>
            <Text style={[styles.duration, { color: color }]}>{duration}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
  },
  durationContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  duration: {
    fontSize: 14,
    fontWeight: '600',
  },
});

