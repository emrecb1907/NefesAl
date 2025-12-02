import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../styles/colors';
import { Card } from './Card';
import Svg, { Path, Circle, Line, Polygon } from 'react-native-svg';

interface PremiumFeatureCardProps {
  icon: 'techniques' | 'sounds' | 'stats' | 'themes';
  title: string;
  description: string;
}

const FeatureIcon: React.FC<{ type: PremiumFeatureCardProps['icon'] }> = ({ type }) => {
  if (type === 'techniques') {
    // Infinity symbol
    return (
      <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
        <Path
          d="M8 16 C8 12 10 10 12 10 C14 10 16 12 16 16 C16 20 18 22 20 22 C22 22 24 20 24 16 M24 16 C24 12 22 10 20 10 C18 10 16 12 16 16 C16 20 14 22 12 22 C10 22 8 20 8 16"
          stroke="#818cf8"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === 'sounds') {
    // Sound waves
    return (
      <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
        <Path
          d="M8 20 Q12 16 16 20 T24 20"
          stroke="#818cf8"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M8 24 Q12 20 16 24 T24 24"
          stroke="#818cf8"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M8 16 Q12 12 16 16 T24 16"
          stroke="#818cf8"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === 'stats') {
    // Bar chart with trend line
    return (
      <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
        <Line x1="6" y1="24" x2="6" y2="20" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
        <Line x1="12" y1="24" x2="12" y2="16" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
        <Line x1="18" y1="24" x2="18" y2="12" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
        <Line x1="24" y1="24" x2="24" y2="8" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
        <Path
          d="M6 20 L12 16 L18 12 L24 8"
          stroke="#818cf8"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  // themes - paint palette
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 6 C10 6 6 10 6 16 C6 22 10 26 16 26 C18 26 20 25 21 24 L26 28 C26.5 28.5 27.5 28.5 28 28 L28 23 C29 22 30 20 30 16 C30 10 26 6 20 6 Z"
        stroke="#818cf8"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="14" r="2" fill="#818cf8" />
      <Circle cx="18" cy="12" r="2" fill="#818cf8" />
      <Circle cx="20" cy="18" r="2" fill="#818cf8" />
      <Circle cx="24" cy="22" r="2" fill="#818cf8" />
    </Svg>
  );
};

export const PremiumFeatureCard: React.FC<PremiumFeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} padding={16}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FeatureIcon type={icon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {description}
          </Text>
        </View>
      </View>
    </Card>
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
  iconContainer: {
    marginRight: 16,
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
    fontSize: 14,
  },
});

