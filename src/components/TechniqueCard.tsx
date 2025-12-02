import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../styles/colors';
import { Card } from './Card';
import Svg, { Circle, Path } from 'react-native-svg';

interface TechniqueCardProps {
  title: string;
  description: string;
  onPress: () => void;
  isLocked?: boolean;
}

export const TechniqueCard: React.FC<TechniqueCardProps> = ({
  title,
  description,
  onPress,
  isLocked = false,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={isLocked ? undefined : onPress}
      activeOpacity={isLocked ? 1 : 0.7}
      disabled={isLocked}
    >
      <Card
        style={[
          styles.card,
          isLocked && { opacity: 0.6 },
        ]}
        padding={16}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {title}
              </Text>
              {isLocked && (
                <View style={styles.lockContainer}>
                  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <Path
                      d="M12 7H11V5C11 2.79 9.21 1 7 1C4.79 1 3 2.79 3 5V7H2C1.45 7 1 7.45 1 8V13C1 13.55 1.45 14 2 14H12C12.55 14 13 13.55 13 13V8C13 7.45 12.55 7 12 7ZM7 11C6.45 11 6 10.55 6 10C6 9.45 6.45 9 7 9C7.55 9 8 9.45 8 10C8 10.55 7.55 11 7 11ZM9 7H5V5C5 3.9 5.9 3 7 3C8.1 3 9 3.9 9 5V7Z"
                      fill={theme.colors.textSecondary}
                    />
                  </Svg>
                  <Text
                    style={[
                      styles.lockText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    lock
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[styles.description, { color: theme.colors.textSecondary }]}
            >
              {description}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Circle
                cx="12"
                cy="12"
                r="10"
                fill={isLocked ? theme.colors.border : theme.colors.surface}
                stroke={isLocked ? theme.colors.border : theme.colors.border}
                strokeWidth="1"
              />
              <Circle
                cx="12"
                cy="12"
                r="4"
                fill={isLocked ? theme.colors.border : theme.colors.textSecondary}
              />
            </Svg>
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
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  lockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

