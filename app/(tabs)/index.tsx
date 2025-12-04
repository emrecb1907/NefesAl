import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme, useIsDarkMode } from '../../src/styles/colors';
import { useAppStore } from '../../src/state/store';
import { breathingPatterns } from '../../src/constants/breathingPatterns';
import { ambiances } from '../../src/constants/ambiances';
import { useTranslation } from '../../src/hooks/useTranslation';
import { Button } from '../../src/components';
import { Wind, MusicNote, Clock, Fire } from 'phosphor-react-native';
import Svg, { Circle } from 'react-native-svg';

export default function HomeScreen() {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const router = useRouter();
  const { t } = useTranslation();
  const { streak, selectedPatternId, userName, practiceDuration, setPracticeDuration, profileImageUri, defaultAmbiance } = useAppStore();

  // Debug: Log profileImageUri when it changes
  useEffect(() => {
    console.log('HomeScreen - profileImageUri:', profileImageUri);
  }, [profileImageUri]);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [isStartingPractice, setIsStartingPractice] = useState(false);
  const insets = useSafeAreaInsets();

  // Seçilen pattern varsa onu kullan, yoksa default pattern'i kullan
  const selectedPattern = selectedPatternId
    ? breathingPatterns.find(p => p.id === selectedPatternId) || breathingPatterns[0]
    : breathingPatterns[0];

  // Çevrilmiş pattern ismi ve açıklaması
  const selectedPatternName = t(`sessions.patterns.${selectedPattern.id}.name`) || selectedPattern.name;

  // Seçilen ses bilgisi
  const selectedAmbiance = ambiances.find(a => a.id === defaultAmbiance);
  const selectedSoundName = selectedAmbiance?.name || '';

  // Theme-aware colors
  const streakBadgeBg = isDarkMode ? '#1E293B' : '#F3F4F6';
  const streakTextColor = isDarkMode ? '#CBD5E1' : '#374151';
  const quickAccessCardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const circleStrokeColor = isDarkMode ? '#475569' : '#D1D5DB';

  // Gradient colors for Today's Practice Card (açık mavi tonları)
  const todayPracticeGradientColors: readonly [string, string] = isDarkMode
    ? ['#1E40AF', '#3B82F6'] // Dark mode: koyu mavi tonları
    : ['#DBEAFE', '#BFDBFE']; // Light mode: açık mavi tonları

  // Aggressively prefetch the background image on mount
  // Aggressively prefetch the background image on mount using expo-asset
  useEffect(() => {
    const ambiance = ambiances.find(a => a.id === defaultAmbiance);

    if (ambiance?.imageFile) {
      // Use Asset.loadAsync to ensure the asset is downloaded and cached
      Asset.loadAsync(ambiance.imageFile)
        .then(() => {
          console.log('Background image asset loaded successfully');
        })
        .catch((error: any) => {
          console.warn('Failed to load background image asset:', error);
        });
    }
  }, [defaultAmbiance]);

  // Preload mini images for sounds screen
  useEffect(() => {
    const preloadMiniImages = async () => {
      const imagePromises = ambiances
        .filter(ambiance => ambiance.miniImageFile)
        .map(ambiance => Asset.loadAsync(ambiance.miniImageFile!));

      try {
        await Promise.all(imagePromises);
      } catch (error) {
        console.warn('Failed to preload some mini images:', error);
      }
    };

    preloadMiniImages();
  }, []);

  const handleStartPractice = () => {
    // Set loading state for visual feedback
    setIsStartingPractice(true);

    // Small delay to ensure loading state is visible
    setTimeout(() => {
      router.push({
        pathname: '/practice',
        params: {
          patternId: selectedPattern.id,
          patternName: selectedPatternName,
        },
      });
      // Reset loading state after navigation
      setTimeout(() => setIsStartingPractice(false), 500);
    }, 50);
  };

  const handleCardPress = (screen: 'sessions' | 'sounds' | 'duration') => {
    if (screen === 'sessions') {
      router.push('/(tabs)/sessions');
    } else if (screen === 'sounds') {
      router.push('/sounds');
    } else if (screen === 'duration') {
      setShowDurationModal(true);
    }
  };

  const handleDurationSelect = (duration: number) => {
    setPracticeDuration(duration);
    setShowDurationModal(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header with Avatar */}
        <View style={styles.welcomeHeader}>
          {profileImageUri ? (
            <Image
              source={{ uri: profileImageUri }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          <View style={styles.welcomeTextContainer}>
            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
              {t('home.welcome')}, {userName || 'User'}
            </Text>
          </View>
        </View>

        {/* Streak Badge */}
        <View style={styles.streakBadgeContainer}>
          <View style={[styles.streakBadge, { backgroundColor: streakBadgeBg }]}>
            <View style={styles.streakContent}>
              <Text style={[styles.streakText, { color: streakTextColor }]}>
                {streak} {t('home.streak')}
              </Text>
              <Fire size={18} color="#FF6B35" weight="fill" />
            </View>
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.mainTitle, { color: theme.colors.text }]}>{t('home.title')}</Text>
        </View>

        {/* Today's Practice Card */}
        <TouchableOpacity style={styles.todayPracticeCard} activeOpacity={1}>
          <LinearGradient
            colors={todayPracticeGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.todayPracticeGradient}
          >
            <View style={styles.todayPracticeContent}>
              <View style={styles.todayPracticeText}>
                <Text style={[styles.todayPracticeLabel, { color: theme.colors.textSecondary }]}>{t('home.todaysPractice')}</Text>
                <Text style={[styles.todayPracticeTitle, { color: theme.colors.text }]}>{selectedPatternName}</Text>
                <Text style={[styles.todayPracticeDetails, { color: theme.colors.textSecondary }]}>
                  {[
                    selectedPattern.inhale,
                    selectedPattern.hold > 0 ? selectedPattern.hold : null,
                    selectedPattern.exhale,
                    selectedPattern.holdAfterExhale > 0 ? selectedPattern.holdAfterExhale : null,
                  ].filter((val) => val !== null).join('-')} {t('home.rhythm')} · {practiceDuration} {t('home.minutes')}
                </Text>
                {selectedSoundName ? (
                  <Text style={[styles.todayPracticeSound, { color: theme.colors.textSecondary }]}>
                    {selectedSoundName}
                  </Text>
                ) : null}
              </View>
              <View style={styles.circlePlaceholder}>
                {selectedAmbiance?.miniImageFile ? (
                  <View style={[styles.miniImageCircleContainer, { borderColor: circleStrokeColor, borderWidth: 2 }]}>
                    <Image
                      source={selectedAmbiance.miniImageFile}
                      style={styles.miniImageCircle}
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <Svg width={80} height={80} viewBox="0 0 80 80">
                    <Circle cx="40" cy="40" r="38" stroke={circleStrokeColor} strokeWidth="2" fill="none" />
                  </Svg>
                )}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Start Practice Button */}
        <View style={styles.startButtonContainer}>
          <Button
            title={isStartingPractice ? t('home.startingPractice') : t('home.startPractice')}
            onPress={handleStartPractice}
            disabled={isStartingPractice}
            fullWidth
          />
        </View>

        {/* Persistent hidden image - keeps image mounted and cached for instant practice screen display */}
        {selectedAmbiance?.imageFile && (
          <Image
            source={selectedAmbiance.imageFile}
            style={styles.persistentHiddenImage}
            resizeMode="cover"
          />
        )}

        {/* Quick Access Cards */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: quickAccessCardBg }]}
            onPress={() => handleCardPress('sessions')}
            activeOpacity={0.7}
          >
            <Wind size={20} color={theme.colors.primary} weight="regular" style={styles.icon} />
            <Text style={[styles.quickAccessText, { color: theme.colors.text }]}>{t('home.techniques')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: quickAccessCardBg }]}
            onPress={() => handleCardPress('sounds')}
            activeOpacity={0.7}
          >
            <MusicNote size={20} color={theme.colors.primary} weight="regular" style={styles.icon} />
            <Text style={[styles.quickAccessText, { color: theme.colors.text }]}>{t('home.sounds')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: quickAccessCardBg }]}
            onPress={() => handleCardPress('duration')}
            activeOpacity={0.7}
          >
            <Clock size={20} color={theme.colors.primary} weight="regular" style={styles.icon} />
            <Text style={[styles.quickAccessText, { color: theme.colors.text }]}>{t('home.duration')}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Duration Selection Modal */}
      <Modal
        visible={showDurationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDurationModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDurationModal(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={[
                styles.modalContent,
                {
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                },
              ]}
            >
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#1F2937' }]}>
                {t('home.durationModal.title')}
              </Text>

              {/* Duration Options */}
              <View style={styles.durationOptions}>
                {[1, 3, 5, 10, 15, 20].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationOption,
                      {
                        backgroundColor: practiceDuration === duration
                          ? theme.colors.primary
                          : isDarkMode ? '#374151' : '#F3F4F6',
                        borderColor: practiceDuration === duration
                          ? theme.colors.primary
                          : isDarkMode ? '#4B5563' : '#D1D5DB',
                      },
                    ]}
                    onPress={() => handleDurationSelect(duration)}
                  >
                    <Text
                      style={[
                        styles.durationOptionText,
                        {
                          color: practiceDuration === duration
                            ? '#FFFFFF'
                            : isDarkMode ? '#FFFFFF' : '#1F2937',
                        },
                      ]}
                    >
                      {duration} {t('home.minutes')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  streakBadgeContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  streakBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android shadow
    elevation: 3,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  todayPracticeCard: {
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android shadow
    elevation: 3,
  },
  todayPracticeGradient: {
    padding: 20,
  },
  todayPracticeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayPracticeText: {
    flex: 1,
  },
  todayPracticeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  todayPracticeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  todayPracticeDetails: {
    fontSize: 14,
    fontWeight: '400',
  },
  todayPracticeSound: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  circlePlaceholder: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniImageCircleContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    transform: [{ scale: 1.2 }],
  },
  miniImageCircle: {
    width: '100%',
    height: '100%',
  },
  startButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  startButton: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  startButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  shimmerContainer: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
  },
  shimmerGradient: {
    flex: 1,
    width: '100%',
  },
  hiddenImage: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    zIndex: -1,
  },
  fullWidth: {
    width: '100%',
  },
  quickAccessRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickAccessCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    // iOS shadow - Card component'inden alındı
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android shadow
    elevation: 3,
  },
  icon: {
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 15,
    fontWeight: '600',
  },
  persistentHiddenImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%', // Full width to force full decode
    height: '100%', // Full height to force full decode
    opacity: 0.01, // Almost invisible but technically "visible" to force render
    zIndex: -999,
  },
  bottomSpacing: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    width: '100%',
    minHeight: 350,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationOption: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

