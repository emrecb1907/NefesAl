import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../state/store';
import { Button } from '../components';
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

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  // Onboarding uses light background, so we need dark text and dark status bar
  const backgroundColor =
    currentStep === 0
      ? '#F0F4F8'
      : currentStep === 1
      ? '#F0F4F8'
      : currentStep === 2
      ? '#F0F4F8'
      : '#E0F2FE';

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={['top', 'bottom']}
    >
      <StatusBar style="dark" />
      {/* Skip button */}
      {!isLastStep && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
      </ScrollView>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isLastStep ? 'Get Started' : 'Next'}
          onPress={handleNext}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 20,
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
