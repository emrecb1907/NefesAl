import React, { useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAppStore } from '../src/state/store';
import { Button } from '../src/components';
import { OnboardingIllustration } from '../src/components/OnboardingIllustration';
import { FeatureItem } from '../src/components/FeatureItem';
import { useTranslation } from '../src/hooks/useTranslation';
import { useTheme, useIsDarkMode } from '../src/styles/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// onboardingSteps will be created dynamically based on language

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const setUserNameStore = useAppStore((state) => state.setUserName);
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const opacity = useSharedValue(1);
  const insets = useSafeAreaInsets();
  
  // Modal animations
  const overlayOpacity = useSharedValue(0);
  const modalTranslateY = useSharedValue(500);
  
  // Extra padding for Dynamic Island on iOS
  const topPadding = Platform.OS === 'ios' ? Math.max(insets.top, 44) + 10 : insets.top;

  const onboardingSteps = useMemo(() => [
    {
      title: t('onboarding.step1.title'),
      description: t('onboarding.step1.description'),
      illustrationStep: 0,
    },
    {
      title: t('onboarding.step2.title'),
      description: t('onboarding.step2.description'),
      illustrationStep: 1,
    },
    {
      title: t('onboarding.step3.title'),
      description: t('onboarding.step3.description'),
      illustrationStep: 2,
    },
    {
      title: t('onboarding.step4.title'),
      description: t('onboarding.step4.description'),
      illustrationStep: 3,
      features: [
        {
          icon: 'breathing' as const,
          title: t('onboarding.step4.features.breathing.title'),
          description: t('onboarding.step4.features.breathing.description'),
        },
        {
          icon: 'sounds' as const,
          title: t('onboarding.step4.features.sounds.title'),
          description: t('onboarding.step4.features.sounds.description'),
        },
        {
          icon: 'tracking' as const,
          title: t('onboarding.step4.features.tracking.title'),
          description: t('onboarding.step4.features.tracking.description'),
        },
        {
          icon: 'summaries' as const,
          title: t('onboarding.step4.features.summaries.title'),
          description: t('onboarding.step4.features.summaries.description'),
        },
      ],
    },
  ], [t]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(setCurrentStep)(currentStep + 1);
        opacity.value = 0;
        opacity.value = withTiming(1, { duration: 200 });
      });
    } else {
      // Son adımda isim modalını göster
      setShowNameModal(true);
      // Overlay hızlı animasyon (200ms)
      overlayOpacity.value = withTiming(1, { duration: 200 });
      // Modal içeriği yavaş animasyon (400ms)
      modalTranslateY.value = withTiming(0, { duration: 400 });
    }
  };

  // Modal kapatıldığında animasyonları sıfırla
  useEffect(() => {
    if (!showNameModal) {
      overlayOpacity.value = 0;
      modalTranslateY.value = 500;
    }
  }, [showNameModal]);

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setUserNameStore(userName.trim());
      completeOnboarding();
      setShowNameModal(false);
      router.replace('/(tabs)');
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
    // Jump to last step (step 4, index 3)
    const lastStepIndex = onboardingSteps.length - 1;
    opacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(setCurrentStep)(lastStepIndex);
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 200 });
    });
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
                runOnJS(router.replace)('/(tabs)');
              });
            }
          } else {
            // Reset if swipe wasn't strong enough
            opacity.value = withTiming(1, { duration: 150 });
          }
        },
      }),
    [currentStep, onboardingSteps.length, completeOnboarding, router]
  );

  // Reset animation when step changes (from button press)
  useEffect(() => {
    opacity.value = 1;
  }, [currentStep]);

  // Force statusbar to dark content in light mode - use useLayoutEffect to set it before render
  useLayoutEffect(() => {
    const barStyle = isDarkMode ? 'light-content' : 'dark-content';
    StatusBar.setBarStyle(barStyle, true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(isDarkMode ? '#000000' : '#E8F4F8', true);
    }
  }, [isDarkMode]);

  // Set statusbar when screen is focused (expo-router)
  useFocusEffect(
    useCallback(() => {
      const barStyle = isDarkMode ? 'light-content' : 'dark-content';
      StatusBar.setBarStyle(barStyle, true);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(isDarkMode ? '#000000' : '#E8F4F8', true);
      }
    }, [isDarkMode])
  );

  // Also set it in useEffect to ensure it stays correct after hot reload and on every render
  useEffect(() => {
    const barStyle = isDarkMode ? 'light-content' : 'dark-content';
    StatusBar.setBarStyle(barStyle, true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(isDarkMode ? '#000000' : '#E8F4F8', true);
    }
    
    // Set again after a short delay to override any other StatusBar changes
    const timeout = setTimeout(() => {
      StatusBar.setBarStyle(barStyle, true);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(isDarkMode ? '#000000' : '#E8F4F8', true);
      }
    }, 50);
    
    return () => clearTimeout(timeout);
  });

  // Modal animated styles
  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: modalTranslateY.value }],
    };
  });

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  // Gradient colors - light theme: light blue, dark theme: black
  const gradientColors = isDarkMode ? ['#000000', '#000000'] as const : ['#E8F4F8', '#D0E8F2'] as const;

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        translucent={false}
        backgroundColor={isDarkMode ? '#000000' : '#E8F4F8'}
      />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
      {/* Skip button */}
      {!isLastStep && (
        <TouchableOpacity
          style={[styles.skipButton, { top: topPadding + 10 }]}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={[styles.skipText, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>{t('common.skip')}</Text>
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
            <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#1F2937' }]}>
              {currentStepData.title}
            </Text>
            <Text style={[styles.description, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              {currentStepData.description}
            </Text>

            {/* Features list for last step */}
            {isLastStep && currentStepData.features && (
              <View style={[styles.featuresContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#ffffff' }]}>
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
                    backgroundColor: index === currentStep 
                      ? (isDarkMode ? '#FFFFFF' : '#1F2937') 
                      : (isDarkMode ? '#4B5563' : '#D1D5DB'),
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
          title={isLastStep ? t('common.start') : t('common.next')}
          onPress={handleNext}
          fullWidth
        />
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Name Input Modal */}
      <Modal
        visible={showNameModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => {
          overlayOpacity.value = withTiming(0, { duration: 200 });
          modalTranslateY.value = withTiming(500, { duration: 400 }, () => {
            runOnJS(setShowNameModal)(false);
          });
        }}
      >
        <Animated.View
          style={[styles.modalOverlay, overlayAnimatedStyle]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => {
              overlayOpacity.value = withTiming(0, { duration: 200 });
              modalTranslateY.value = withTiming(500, { duration: 400 }, () => {
                runOnJS(setShowNameModal)(false);
              });
            }}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={styles.modalKeyboardContainer}
          >
            <Animated.View
              style={[
                styles.modalContent,
                { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' },
                modalAnimatedStyle,
              ]}
            >
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#1F2937' }]}>
                {t('onboarding.nameModal.title')}
              </Text>
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                    color: isDarkMode ? '#FFFFFF' : '#1F2937',
                    borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                  },
                ]}
                placeholder={t('onboarding.nameModal.placeholder')}
                placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                value={userName}
                onChangeText={setUserName}
                autoFocus={true}
                onSubmitEditing={handleNameSubmit}
              />
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: userName.trim() ? theme.colors.primary : '#9CA3AF',
                  },
                ]}
                onPress={handleNameSubmit}
                disabled={!userName.trim()}
              >
                <Text style={styles.modalButtonText}>{t('onboarding.nameModal.continue')}</Text>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalKeyboardContainer: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    marginBottom: 0,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  nameInput: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  modalButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

