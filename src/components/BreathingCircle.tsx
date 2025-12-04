import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../styles/colors';
import { useTranslation } from '../hooks/useTranslation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_WIDTH * 0.7;
// Maximum circle size should not exceed 90% of screen width or height (whichever is smaller)
const MAX_CIRCLE_SIZE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.9;

interface BreathingCircleProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale' | 'rest';
  isActive: boolean;
  phaseDuration?: number; // Duration in seconds for the current phase
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  phase,
  isActive,
  phaseDuration = 4, // Default to 4 seconds if not provided
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const expansion = useSharedValue(0); // 0 to 1 expansion factor
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!isActive || phase === 'rest') {
      expansion.value = withTiming(0, { duration: 1000 });
      opacity.value = 0;
      return;
    }

    // Convert seconds to milliseconds for animation duration
    const durationMs = phaseDuration * 1000;

    if (phase === 'inhale') {
      expansion.value = withTiming(1, {
        duration: durationMs,
        easing: Easing.out(Easing.ease),
      });
      opacity.value = withTiming(0.9, { duration: durationMs });
    } else if (phase === 'exhale') {
      expansion.value = withTiming(0, {
        duration: durationMs,
        easing: Easing.in(Easing.ease),
      });
      opacity.value = withTiming(0.6, { duration: durationMs });
    } else {
      // Hold phases - maintain current state
      expansion.value = withTiming(expansion.value, { duration: 100 });
      opacity.value = withTiming(opacity.value, { duration: 100 });
    }
  }, [phase, isActive, phaseDuration]);

  const animatedStyle = useAnimatedStyle(() => {
    // Math to keep inner hole constant while expanding outwards:
    // Width = CIRCLE_SIZE + 2 * Expansion
    // BorderWidth = Expansion
    // Hole = Width - 2 * BorderWidth = CIRCLE_SIZE (Constant!)

    // Calculate max expansion based on available space
    // Maximum total size should not exceed MAX_CIRCLE_SIZE
    const maxTotalSize = MAX_CIRCLE_SIZE;
    const maxExpansion = Math.max(0, (maxTotalSize - CIRCLE_SIZE) / 2);
    const currentExpansion = expansion.value * maxExpansion;

    // Ensure we don't exceed maximum size
    const totalSize = Math.min(CIRCLE_SIZE + (currentExpansion * 2), maxTotalSize);
    const actualExpansion = (totalSize - CIRCLE_SIZE) / 2;

    return {
      width: totalSize,
      height: totalSize,
      borderRadius: totalSize / 2,
      borderWidth: actualExpansion,
      opacity: opacity.value,
    };
  });

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return t('practice.inhale');
      case 'hold':
        return t('practice.hold');
      case 'exhale':
        return t('practice.exhale');
      case 'holdAfterExhale':
        return t('practice.hold');
      case 'rest':
        return t('practice.rest');
      default:
        return t('practice.ready');
    }
  };

  return (
    <View style={styles.container}>
      {/* Outer glow circle */}
      <Animated.View
        style={[
          styles.outerCircle,
          {
            backgroundColor: 'transparent',
            borderColor: theme.colors.primary,
            // Width/Height/BorderRadius/BorderWidth are handled by animatedStyle
          },
          animatedStyle,
        ]}
      />
      {/* Main circle */}
      <View
        style={[
          styles.mainCircle,
          {
            backgroundColor: 'transparent',
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            shadowColor: 'transparent',
            borderWidth: 0.8,
            borderColor: '#ffffff',
          },
        ]}
      >
        <Text style={[styles.phaseText, { color: '#FFFFFF' }]}>
          {getPhaseText()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  outerCircle: {
    position: 'absolute',
  },
  mainCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  phaseText: {
    fontSize: 32,
    fontWeight: '600',
  },
});

