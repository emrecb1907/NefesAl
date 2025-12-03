import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PanResponder,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../state/store';
import { Button, SafeScreen } from '../components';
import { OnboardingIllustration } from '../components/OnboardingIllustration';
import { FeatureItem } from '../components/FeatureItem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const onboardingSteps = [
  {
    title: 'Welcome to\nMindfulBreath',
    description: 'Discover tranquility and improve your\nfocus with guided breathing\nexercises.',
    illustrationStep: 0,
  },
  {
    title: 'Personalized Practices',
    description:
      'Tailor your meditation journey with customizable sessions and progress tracking.',
    illustrationStep: 1,
  },
  {
    title: 'Start Your Journey',
    description: "Ready to find your calm? Let's begin your path to mindfulness.",
    illustrationStep: 2,
  },
  {
    title: "You're Ready to Begin",
    description: "Here's what you'll find inside the app.",
    illustrationStep: 3,
    features: [
      {
        icon: 'breathing' as const,
        title: 'Guided Breathing Techniques',
        description: 'Relax, focus, and sleep rhythms included',
      },
      {
        icon: 'sounds' as const,
        title: 'Ambient Sounds',
        description: 'Wind, water, and calming tones',
      },
      {
        icon: 'tracking' as const,
        title: 'Daily Progress Tracking',
        description: 'Keep track of your calm streak',
      },
      {
        icon: 'summaries' as const,
        title: 'Session Summaries',
        description: 'Insights after every practice',
      },
    ],
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const opacity = useSharedValue(1);
  const insets = useSafeAreaInsets();
  
  // Extra padding for Dynamic Island on iOS
  const topPadding = Platform.OS === 'ios' ? Math.max(insets.top, 44) + 10 : insets.top;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(setCurrentStep)(currentStep + 1);
        opacity.value = 0;
        opacity.value = withTiming(1, { duration: 200 });
      });
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(setCurrentStep)(currentStep - 1);
        opacity.value = 0;
        opacity.value = withTiming(1, { duration: 200 });
      });
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  // Animated style for fade effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // PanResponder with currentStep dependency
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only respond to horizontal swipes
          return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
        },
        onPanResponderMove: (_, gestureState) => {
          // Update opacity during swipe for visual feedback
          const progress = Math.abs(gestureState.dx) / SCREEN_WIDTH;
          opacity.value = Math.max(0.3, 1 - progress * 0.7);
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dx, vx } = gestureState;
          const swipeThreshold = 50;
          const velocityThreshold = 0.5;

          // Swipe right (positive dx) = go to previous
          if (dx > swipeThreshold || vx > velocityThreshold) {
            if (currentStep > 0) {
              // Fade out, change step, then fade in
              opacity.value = withTiming(0, { duration: 150 }, () => {
                runOnJS(setCurrentStep)(currentStep - 1);
                opacity.value = 0;
                opacity.value = withTiming(1, { duration: 200 });
              });
            } else {
              // Reset if can't go back
              opacity.value = withTiming(1, { duration: 150 });
            }
          }
          // Swipe left (negative dx) = go to next
          else if (dx < -swipeThreshold || vx < -velocityThreshold) {
            if (currentStep < onboardingSteps.length - 1) {
              // Fade out, change step, then fade in
              opacity.value = withTiming(0, { duration: 150 }, () => {
                runOnJS(setCurrentStep)(currentStep + 1);
                opacity.value = 0;
                opacity.value = withTiming(1, { duration: 200 });
              });
            } else {
              // Complete onboarding
              opacity.value = withTiming(0, { duration: 150 }, () => {
                runOnJS(completeOnboarding)();
              });
            }
          } else {
            // Reset if swipe wasn't strong enough
            opacity.value = withTiming(1, { duration: 150 });
          }
        },
      }),
    [currentStep, completeOnboarding]
  );

  // Reset animation when step changes (from button press)
  useEffect(() => {
    opacity.value = 1;
  }, [currentStep]);

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  // Gradient colors for light blue background
  const gradientColors = ['#E8F4F8', '#D0E8F2'];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeScreen edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* Skip button */}
      {!isLastStep && (
        <TouchableOpacity
          style={[styles.skipButton, { top: topPadding + 10 }]}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <Animated.View 
        style={[
          styles.contentWrapper, 
          animatedStyle, 
          { paddingTop: topPadding }
        ]} 
        {...panResponder.panHandlers}
      >
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            {currentStep === 0 && (
              <View style={styles.illustrationWrapper}>
                <OnboardingIllustration step={0} width={SCREEN_WIDTH - 80} height={300} />
              </View>
            )}
            {currentStep === 1 && (
              <View style={styles.illustrationWrapper}>
                <OnboardingIllustration step={1} width={SCREEN_WIDTH - 80} height={300} />
              </View>
            )}
            {currentStep === 2 && (
              <View style={styles.illustrationWrapper}>
                <OnboardingIllustration step={2} width={SCREEN_WIDTH} height={300} />
              </View>
            )}
            {currentStep === 3 && (
              <View style={styles.waveCircleContainer}>
                <OnboardingIllustration step={3} width={200} height={200} />
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>
              {currentStepData.title}
            </Text>
            <Text style={styles.description}>
              {currentStepData.description}
            </Text>

            {/* Features list for last step */}
            {isLastStep && currentStepData.features && (
              <View style={styles.featuresContainer}>
                {currentStepData.features.map((feature, index) => (
                  <FeatureItem
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Pagination dots */}
          <View style={styles.pagination}>
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === currentStep ? '#1F2937' : '#D1D5DB',
                    opacity: index === currentStep ? 1 : 0.4,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isLastStep ? 'Get Started' : 'Next'}
          onPress={handleNext}
          fullWidth
        />
      </View>
      </SafeScreen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  contentWrapper: {
    flex: 1,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  illustrationWrapper: {
    paddingHorizontal: 20,
  },
  waveCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
    color: '#1F2937',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    color: '#6B7280',
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
  },
});
