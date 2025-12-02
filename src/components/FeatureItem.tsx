import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G, Line } from 'react-native-svg';

interface FeatureItemProps {
  icon: 'breathing' | 'sounds' | 'tracking' | 'summaries';
  title: string;
  description: string;
}

const IconComponent: React.FC<{ type: FeatureItemProps['icon'] }> = ({ type }) => {
  if (type === 'breathing') {
    return (
      <Svg width={48} height={48} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="20" fill="#E5E7EB" />
        <Path
          d="M12 20 Q18 16 24 20 T36 20"
          stroke="#6B7280"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M12 24 Q18 20 24 24 T36 24"
          stroke="#6B7280"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M12 28 Q18 24 24 28 T36 28"
          stroke="#6B7280"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M24 20 L20 16 L24 12"
          stroke="#6B7280"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === 'sounds') {
    return (
      <Svg width={48} height={48} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="20" fill="#E5E7EB" />
        <Path
          d="M12 18 Q18 14 24 18 T36 18"
          stroke="#6B7280"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M12 24 Q18 20 24 24 T36 24"
          stroke="#6B7280"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M12 30 Q18 26 24 30 T36 30"
          stroke="#6B7280"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === 'tracking') {
    return (
      <Svg width={48} height={48} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="20" fill="#E5E7EB" />
        <G transform="translate(12, 20)">
          <Line x1="0" y1="12" x2="4" y2="8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          <Line x1="4" y1="8" x2="8" y2="4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          <Line x1="8" y1="4" x2="12" y2="0" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
        </G>
      </Svg>
    );
  }

  // summaries
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="20" fill="#E5E7EB" />
      <G transform="translate(14, 16)">
        <Line x1="0" y1="12" x2="0" y2="16" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
        <Line x1="5" y1="8" x2="5" y2="16" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
        <Line x1="10" y1="4" x2="10" y2="16" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
      </G>
    </Svg>
  );
};

export const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconComponent type={icon} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1F2937',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
});

