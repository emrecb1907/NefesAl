import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../styles/colors';
import { Card } from './Card';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

interface SoundCardProps {
  title: string;
  description: string;
  icon: 'rain' | 'forest' | 'ocean' | 'cosmic' | 'zen' | 'fire';
  isPlaying?: boolean;
  isLocked?: boolean;
  onPress: () => void;
}

const SoundIcon: React.FC<{ type: SoundCardProps['icon'] }> = ({ type }) => {
  if (type === 'rain') {
    return (
      <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
        <Circle cx="24" cy="24" r="20" fill="#ffffff" stroke="#818cf8" strokeWidth="2" />
        <Path
          d="M24 12 L24 20 M20 16 L24 20 L28 16"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx="18" cy="28" r="2" fill="#818cf8" />
        <Circle cx="24" cy="32" r="2" fill="#818cf8" />
        <Circle cx="30" cy="28" r="2" fill="#818cf8" />
      </Svg>
    );
  }

  if (type === 'forest') {
    return (
      <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
        <Circle cx="24" cy="24" r="20" fill="#ffffff" stroke="#818cf8" strokeWidth="2" />
        <Path
          d="M18 28 L18 36 M16 28 Q18 24 20 28 Q18 24 20 28"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M24 26 L24 36 M22 26 Q24 22 26 26 Q24 22 26 26"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M30 28 L30 36 M28 28 Q30 24 32 28 Q30 24 32 28"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    );
  }

  if (type === 'ocean') {
    return (
      <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
        <Circle cx="24" cy="24" r="20" fill="#ffffff" stroke="#818cf8" strokeWidth="2" />
        <Path
          d="M12 24 Q18 20 24 24 T36 24"
          stroke="#818cf8"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M12 28 Q18 24 24 28 T36 28"
          stroke="#818cf8"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M12 32 Q18 28 24 32 T36 32"
          stroke="#818cf8"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === 'cosmic') {
    return (
      <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
        <Circle cx="24" cy="24" r="20" fill="#ffffff" stroke="#818cf8" strokeWidth="2" />
        <Path
          d="M24 12 L26 18 L32 20 L26 22 L24 28 L22 22 L16 20 L22 18 Z"
          fill="#818cf8"
        />
        <Circle cx="24" cy="24" r="2" fill="#ffffff" />
      </Svg>
    );
  }

  if (type === 'zen') {
    return (
      <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
        <Circle cx="24" cy="24" r="20" fill="#ffffff" stroke="#818cf8" strokeWidth="2" />
        <Path
          d="M24 16 Q20 20 24 24 Q28 20 24 16"
          stroke="#818cf8"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M20 24 Q24 28 28 24"
          stroke="#818cf8"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M24 24 Q24 30 24 32"
          stroke="#818cf8"
          strokeWidth="2"
          fill="none"
        />
      </Svg>
    );
  }

  // fire
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="20" fill="#ffffff" stroke="#818cf8" strokeWidth="2" />
      <Path
        d="M24 32 Q20 28 20 24 Q20 20 24 20 Q24 16 26 18 Q28 16 28 20 Q32 20 32 24 Q32 28 28 32 Z"
        fill="#818cf8"
      />
    </Svg>
  );
};

export const SoundCard: React.FC<SoundCardProps> = ({
  title,
  description,
  icon,
  isPlaying = false,
  isLocked = false,
  onPress,
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
          {/* Icon */}
          <View style={styles.iconContainer}>
            <SoundIcon type={icon} />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {title}
            </Text>
            <Text
              style={[styles.description, { color: theme.colors.textSecondary }]}
            >
              {description}
            </Text>
          </View>

          {/* Play Button */}
          <View style={styles.playButtonContainer}>
            <TouchableOpacity
              onPress={isLocked ? undefined : onPress}
              disabled={isLocked}
              style={[
                styles.playButton,
                isPlaying && styles.playButtonActive,
                { backgroundColor: isLocked ? theme.colors.border : '#818cf8' },
              ]}
              activeOpacity={0.7}
            >
              {isLocked ? (
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <Path
                    d="M12 7H11V5C11 2.79 9.21 1 7 1C4.79 1 3 2.79 3 5V7H2C1.45 7 1 7.45 1 8V13C1 13.55 1.45 14 2 14H12C12.55 14 13 13.55 13 13V8C13 7.45 12.55 7 12 7ZM7 11C6.45 11 6 10.55 6 10C6 9.45 6.45 9 7 9C7.55 9 8 9.45 8 10C8 10.55 7.55 11 7 11ZM9 7H5V5C5 3.9 5.9 3 7 3C8.1 3 9 3.9 9 5V7Z"
                    fill={theme.colors.textSecondary}
                  />
                </Svg>
              ) : (
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  {isPlaying ? (
                    <>
                      <Rect x="5" y="4" width="2" height="8" fill="#ffffff" rx="1" />
                      <Rect x="9" y="4" width="2" height="8" fill="#ffffff" rx="1" />
                    </>
                  ) : (
                    <Polygon
                      points="6,4 6,12 12,8"
                      fill="#ffffff"
                    />
                  )}
                </Svg>
              )}
            </TouchableOpacity>
            {isLocked && (
              <View style={styles.lockBadge}>
                <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                  <Path
                    d="M7.5 4.5H7.25V3.25C7.25 1.96 6.29 1 5 1C3.71 1 2.75 1.96 2.75 3.25V4.5H2.5C2.22 4.5 2 4.72 2 5V8.5C2 8.78 2.22 9 2.5 9H7.5C7.78 9 8 8.78 8 8.5V5C8 4.72 7.78 4.5 7.5 4.5ZM5 7.25C4.59 7.25 4.25 6.91 4.25 6.5C4.25 6.09 4.59 5.75 5 5.75C5.41 5.75 5.75 6.09 5.75 6.5C5.75 6.91 5.41 7.25 5 7.25ZM6.5 4.5H3.5V3.25C3.5 2.56 4.06 2 4.75 2C5.44 2 6 2.56 6 3.25V4.5Z"
                    fill="#1F2937"
                  />
                </Svg>
              </View>
            )}
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
  playButtonContainer: {
    position: 'relative',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    opacity: 0.8,
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

