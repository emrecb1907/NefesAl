import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/colors';
import Svg, { Circle, Path } from 'react-native-svg';

interface QuickStartCardProps {
  onPress: () => void;
  title: string;
  description: string;
  duration?: string;
}

export const QuickStartCard: React.FC<QuickStartCardProps> = ({
  onPress,
  title,
  description,
  duration,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.container}
    >
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Svg width={60} height={60} viewBox="0 0 60 60">
              <Circle cx="30" cy="30" r="25" fill="rgba(255,255,255,0.2)" />
              <Path
                d="M15 25 Q25 20 30 25 T45 25"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M15 30 Q25 25 30 30 T45 30"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M15 35 Q25 30 30 35 T45 35"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            {duration && (
              <View style={styles.durationContainer}>
                <Text style={styles.duration}>{duration}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  gradient: {
    padding: 24,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  durationContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  duration: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
});

