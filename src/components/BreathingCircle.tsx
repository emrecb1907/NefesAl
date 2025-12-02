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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_WIDTH * 0.7;

interface BreathingCircleProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';
  isActive: boolean;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  phase,
  isActive,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (!isActive) {
      scale.value = 1;
      opacity.value = 0.3;
      return;
    }

    if (phase === 'inhale') {
      scale.value = withTiming(1.3, {
        duration: 4000,
        easing: Easing.out(Easing.ease),
      });
      opacity.value = withTiming(0.5, { duration: 4000 });
    } else if (phase === 'exhale') {
      scale.value = withTiming(1, {
        duration: 4000,
        easing: Easing.in(Easing.ease),
      });
      opacity.value = withTiming(0.3, { duration: 4000 });
    } else {
      // Hold phases - maintain current state
      scale.value = withTiming(scale.value, { duration: 100 });
      opacity.value = withTiming(opacity.value, { duration: 100 });
    }
  }, [phase, isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      case 'holdAfterExhale':
        return 'Hold';
      default:
        return 'Ready';
    }
  };

  return (
    <View style={styles.container}>
      {/* Outer glow circle */}
      <Animated.View
        style={[
          styles.outerCircle,
          {
            backgroundColor: theme.colors.primary + '20',
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
          },
          animatedStyle,
        ]}
      />
      {/* Main circle */}
      <View
        style={[
          styles.mainCircle,
          {
            backgroundColor: '#ffffff',
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            shadowColor: theme.colors.primary,
          },
        ]}
      >
        <Text style={[styles.phaseText, { color: theme.colors.text }]}>
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

