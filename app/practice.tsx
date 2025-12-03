import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme, useIsDarkMode } from '../src/styles/colors';
import { useAppStore } from '../src/state/store';
import { BreathingCircle } from '../src/components/BreathingCircle';
import { SessionCompleteModal } from '../src/components/SessionCompleteModal';
import { Button } from '../src/components';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { breathingPatterns } from '../src/constants/breathingPatterns';
import { ambiances } from '../src/constants/ambiances';
import { formatTime } from '../src/utils/formatTime';
import { hapticFeedback } from '../src/utils/haptics';
import { useTranslation } from '../src/hooks/useTranslation';
import Svg, { Path } from 'react-native-svg';
import { Pause } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale' | 'rest';

export default function PracticeScreen() {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    patternId?: string;
    patternName?: string;
  }>();

  const { addSession, incrementStreak, practiceDuration, defaultAmbiance } = useAppStore();

  // Get selected ambiance for background image
  const selectedAmbiance = ambiances.find(a => a.id === defaultAmbiance);

  // Remove debug logs to avoid unnecessary renders

  const patternId = params?.patternId || 'box';
  const pattern = breathingPatterns.find((p) => p.id === patternId) || breathingPatterns[0];
  // Çevrilmiş pattern ismi - params'dan gelen veya çeviri dosyasından
  const patternName = params?.patternName || t(`sessions.patterns.${pattern.id}.name`) || pattern.name;

  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(practiceDuration * 60); // Use selected duration from store
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Update timeRemaining when practiceDuration changes
  useEffect(() => {
    const newTime = practiceDuration * 60;
    setTimeRemaining(newTime);
    timeRemainingRef.current = newTime;
  }, [practiceDuration]);

  // Keep ref in sync with state
  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  // Session tracking
  const [cycles, setCycles] = useState(0);
  const [phaseTimes, setPhaseTimes] = useState({
    inhale: 0,
    hold: 0,
    exhale: 0,
    holdAfterExhale: 0,
    rest: 0,
  });
  const [totalTime, setTotalTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartTimeRef = useRef<number>(Date.now());
  const sessionStartTimeRef = useRef<number>(Date.now());
  const timeRemainingRef = useRef(timeRemaining);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);
  const audioPlayer2Ref = useRef<AudioPlayer | null>(null); // Second player for seamless looping
  const activePlayerRef = useRef<'player1' | 'player2'>('player1');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isActive) {
        handlePause();
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  // Cleanup audio players only on component unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        const subscription1 = (audioPlayerRef.current as any)?._statusSubscription;
        if (subscription1 && typeof subscription1.remove === 'function') {
          subscription1.remove();
        }
        audioPlayerRef.current.pause();
        audioPlayerRef.current.remove();
        audioPlayerRef.current = null;
      }
      if (audioPlayer2Ref.current) {
        const subscription2 = (audioPlayer2Ref.current as any)?._statusSubscription;
        if (subscription2 && typeof subscription2.remove === 'function') {
          subscription2.remove();
        }
        audioPlayer2Ref.current.pause();
        audioPlayer2Ref.current.remove();
        audioPlayer2Ref.current = null;
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  useEffect(() => {
    if (!isActive) return;

    const phaseDuration = getPhaseDuration(currentPhase);
    if (phaseDuration === 0) {
      // Skip phases with 0 duration
      setTimeout(() => moveToNextPhase(), 0);
      return;
    }

    // For rest phase, don't track time and let timeRemaining handle it
    if (currentPhase === 'rest') {
      // Rest phase will complete when timeRemaining reaches 0
      return;
    }

    const timer = setTimeout(() => {
      // Phase complete, move to next phase
      trackPhaseTime(currentPhase, phaseDuration);
      moveToNextPhase();
    }, phaseDuration * 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, currentPhase, pattern]);


  // Preload audio players when component mounts or defaultAmbiance changes
  useEffect(() => {
    const ambiance = ambiances.find(a => a.id === defaultAmbiance);

    if (ambiance?.soundFile && !audioPlayerRef.current && !audioPlayer2Ref.current) {
      // Preload players in background
      const player1 = createAudioPlayer(ambiance.soundFile);
      player1.loop = false;
      player1.volume = 0;
      player1.muted = true; // Keep muted until start
      audioPlayerRef.current = player1;

      const player2 = createAudioPlayer(ambiance.soundFile);
      player2.loop = false;
      player2.volume = 0;
      player2.muted = true;
      audioPlayer2Ref.current = player2;
      activePlayerRef.current = 'player1';

      // Preload by seeking to 0 (this triggers loading)
      player1.seekTo(0).catch(() => { });
      player2.seekTo(0).catch(() => { });
    }

    return () => {
      // Don't cleanup on unmount here, let the cleanup useEffect handle it
    };
  }, [defaultAmbiance]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1;
        timeRemainingRef.current = newTime;
        return newTime;
      });

      // Ensure audio players are still playing if they should be
      if (audioPlayerRef.current && !audioPlayerRef.current.playing && audioPlayerRef.current.isLoaded && activePlayerRef.current === 'player1') {
        audioPlayerRef.current.play();
      }
      if (audioPlayer2Ref.current && !audioPlayer2Ref.current.playing && audioPlayer2Ref.current.isLoaded && activePlayerRef.current === 'player2') {
        audioPlayer2Ref.current.play();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const handleComplete = useCallback(() => {
    setIsActive(false);
    const sessionDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
    const minutes = Math.floor(sessionDuration / 60);

    // Stop ambient sounds
    if (audioPlayerRef.current) {
      const subscription1 = (audioPlayerRef.current as any)?._statusSubscription;
      if (subscription1 && typeof subscription1.remove === 'function') {
        subscription1.remove();
      }
      audioPlayerRef.current.pause();
      audioPlayerRef.current.remove();
      audioPlayerRef.current = null;
    }
    if (audioPlayer2Ref.current) {
      const subscription2 = (audioPlayer2Ref.current as any)?._statusSubscription;
      if (subscription2 && typeof subscription2.remove === 'function') {
        subscription2.remove();
      }
      audioPlayer2Ref.current.pause();
      audioPlayer2Ref.current.remove();
      audioPlayer2Ref.current = null;
    }

    // Update store
    addSession(minutes);
    incrementStreak();

    setTotalTime(sessionDuration);
    setShowCompleteModal(true);
    hapticFeedback.success();
  }, [addSession, incrementStreak]);

  // Handle completion when time reaches 0
  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      if (currentPhase === 'rest') {
        handleComplete();
      } else {
        // If not in rest phase, go to rest first
        setCurrentPhase('rest');
      }
    }
  }, [timeRemaining, isActive, handleComplete, currentPhase]);

  const getCycleDuration = (): number => {
    return pattern.inhale + pattern.hold + pattern.exhale + pattern.holdAfterExhale;
  };

  const getPhaseDuration = (phase: Phase): number => {
    switch (phase) {
      case 'inhale':
        return pattern.inhale;
      case 'hold':
        return pattern.hold;
      case 'exhale':
        return pattern.exhale;
      case 'holdAfterExhale':
        return pattern.holdAfterExhale;
      case 'rest':
        // Rest period uses remaining time
        return timeRemaining;
      default:
        return 0;
    }
  };

  const trackPhaseTime = (phase: Phase, duration: number) => {
    setPhaseTimes((prev) => ({
      ...prev,
      [phase]: prev[phase] + duration,
    }));
  };

  const moveToNextPhase = () => {
    hapticFeedback.light();

    if (currentPhase === 'inhale') {
      if (pattern.hold > 0) {
        setCurrentPhase('hold');
      } else {
        setCurrentPhase('exhale');
      }
    } else if (currentPhase === 'hold') {
      setCurrentPhase('exhale');
    } else if (currentPhase === 'exhale') {
      if (pattern.holdAfterExhale > 0) {
        setCurrentPhase('holdAfterExhale');
      } else {
        // Complete cycle - check if enough time for another cycle
        setCycles((prev) => prev + 1);
        const cycleDuration = getCycleDuration();
        // Use ref to get current timeRemaining value
        if (timeRemainingRef.current >= cycleDuration) {
          setCurrentPhase('inhale');
        } else {
          // Not enough time for another cycle, go to rest
          setCurrentPhase('rest');
        }
      }
    } else if (currentPhase === 'holdAfterExhale') {
      // Complete cycle - check if enough time for another cycle
      setCycles((prev) => prev + 1);
      const cycleDuration = getCycleDuration();
      // Use ref to get current timeRemaining value
      if (timeRemainingRef.current >= cycleDuration) {
        setCurrentPhase('inhale');
      } else {
        // Not enough time for another cycle, go to rest
        setCurrentPhase('rest');
      }
    } else if (currentPhase === 'rest') {
      // Rest period complete, finish session
      handleComplete();
    }
  };

  const handleStart = async () => {
    setIsActive(true);
    sessionStartTimeRef.current = Date.now();
    phaseStartTimeRef.current = Date.now();
    hapticFeedback.medium();

    // Start playing ambient sound with seamless looping using dual players
    try {
      const ambiance = ambiances.find(a => a.id === defaultAmbiance);

      if (ambiance?.soundFile) {
        let player1 = audioPlayerRef.current;
        let player2 = audioPlayer2Ref.current;

        // If players don't exist or are for different ambiance, create new ones
        if (!player1 || !player2) {
          // Clean up existing players if any
          if (audioPlayerRef.current) {
            const subscription1 = (audioPlayerRef.current as any)?._statusSubscription;
            if (subscription1 && typeof subscription1.remove === 'function') {
              subscription1.remove();
            }
            audioPlayerRef.current.pause();
            audioPlayerRef.current.remove();
          }
          if (audioPlayer2Ref.current) {
            const subscription2 = (audioPlayer2Ref.current as any)?._statusSubscription;
            if (subscription2 && typeof subscription2.remove === 'function') {
              subscription2.remove();
            }
            audioPlayer2Ref.current.pause();
            audioPlayer2Ref.current.remove();
          }

          // Create new players
          player1 = createAudioPlayer(ambiance.soundFile);
          player1.loop = false;
          player1.volume = 0.5;
          audioPlayerRef.current = player1;

          player2 = createAudioPlayer(ambiance.soundFile);
          player2.loop = false;
          player2.volume = 0;
          audioPlayer2Ref.current = player2;
          activePlayerRef.current = 'player1';
        } else {
          // Use existing preloaded players
          // Remove existing subscriptions if any
          const subscription1 = (player1 as any)?._statusSubscription;
          if (subscription1 && typeof subscription1.remove === 'function') {
            subscription1.remove();
          }
          const subscription2 = (player2 as any)?._statusSubscription;
          if (subscription2 && typeof subscription2.remove === 'function') {
            subscription2.remove();
          }

          // Reset players
          player1.volume = 0.5;
          player1.muted = false;
          player1.seekTo(0).catch(() => { });

          player2.volume = 0;
          player2.muted = false;
          player2.seekTo(0).catch(() => { });

          activePlayerRef.current = 'player1';
        }

        // Setup seamless looping with crossfade
        const setupSeamlessLoop = (primaryPlayer: AudioPlayer, secondaryPlayer: AudioPlayer) => {
          const subscription = primaryPlayer.addListener('playbackStatusUpdate', (status) => {
            if (!status.isLoaded || !status.duration) return;

            const progress = status.currentTime / status.duration;
            const timeRemaining = status.duration - status.currentTime;

            // When primary player is at 80% progress, start fading in secondary player
            if (progress >= 0.80 && !secondaryPlayer.playing && secondaryPlayer.isLoaded) {
              secondaryPlayer.volume = 0;
              secondaryPlayer.play();

              // Fade in secondary player gradually
              let fadeStep = 0;
              const fadeInterval = setInterval(() => {
                fadeStep += 0.05;
                if (fadeStep <= 1) {
                  secondaryPlayer.volume = Math.min(fadeStep * 0.5, 0.5);
                  primaryPlayer.volume = Math.max(0.5 - (fadeStep * 0.5), 0);
                } else {
                  clearInterval(fadeInterval);
                  // Switch players
                  primaryPlayer.pause();
                  primaryPlayer.volume = 0;
                  secondaryPlayer.volume = 0.5;

                  // Remove old listener before setting up new one
                  subscription.remove();

                  // Swap references
                  if (activePlayerRef.current === 'player1') {
                    activePlayerRef.current = 'player2';
                    setupSeamlessLoop(player2, player1);
                  } else {
                    activePlayerRef.current = 'player1';
                    setupSeamlessLoop(player1, player2);
                  }
                }
              }, 50);
            }

            // If player finished, restart it silently for next cycle
            if (status.didJustFinish) {
              primaryPlayer.seekTo(0);
              primaryPlayer.volume = 0;
            }
          });

          // Store subscription for cleanup
          (primaryPlayer as any)._statusSubscription = subscription;
        };

        // Setup looping for both players
        setupSeamlessLoop(player1, player2);

        // Play immediately if loaded, otherwise wait
        if (player1.isLoaded) {
          player1.play();
        } else {
          // Wait for player to load, then play
          let attempts = 0;
          const maxAttempts = 50;

          const tryPlay = () => {
            attempts++;
            if (player1.isLoaded) {
              player1.play();
            } else if (attempts < maxAttempts) {
              // Check again after a short delay
              setTimeout(tryPlay, 50); // Reduced delay for faster response
            } else {
              // If player didn't load after max attempts, try playing anyway
              console.warn('Player did not load after max attempts, trying to play anyway');
              player1.play();
            }
          };

          // Start checking immediately
          tryPlay();
        }
      }
    } catch (error) {
      console.error('Error playing ambient sound:', error);
    }
  };

  const handlePause = () => {
    setIsActive(false);
    hapticFeedback.light();

    // Pause ambient sounds
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (audioPlayer2Ref.current) {
      audioPlayer2Ref.current.pause();
    }
  };

  const handleDone = () => {
    setShowCompleteModal(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Background Image - Render immediately, cached from home screen preload */}
      {selectedAmbiance?.imageFile ? (
        <Image
          source={selectedAmbiance.imageFile}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.containerBackground, { backgroundColor: selectedAmbiance?.color || theme.colors.background }]} />
      )}
      {/* Fallback background with ambiance color - shows while image loads */}
      <View style={[styles.containerBackground, { backgroundColor: selectedAmbiance?.color || theme.colors.background, zIndex: -1 }]} />
      {/* Overlay - Always visible but changes opacity based on active state */}
      {selectedAmbiance?.imageFile && (
        <View
          style={[
            styles.overlay,
            { backgroundColor: isActive ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)' }
          ]}
        />
      )}
      {/* Header - Safe area dışında */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => {
            if (isActive) {
              handlePause();
            }
            router.back();
          }}
          style={styles.backButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18 L9 12 L15 6"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.headerLabel, { color: '#FFFFFF' }]}>
            Breath Practice
          </Text>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            {patternName}
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      {/* Breathing Circle - Absolute positioned at center of entire screen */}
      <View style={styles.circleContainer}>
        <BreathingCircle phase={currentPhase} isActive={isActive} />
      </View>

      {/* Content - Safe area içinde */}
      <SafeAreaView style={styles.safeContent} edges={['bottom']}>
        {/* Timer and Button Container - Absolute positioned at bottom */}
        <View style={styles.timerButtonWrapper}>
          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={[styles.timer, { color: '#FFFFFF' }]}>
              {formatTime(timeRemaining)}
            </Text>
          </View>

          {/* Control Button */}
          <View style={styles.buttonContainer}>
            {!isActive ? (
              <Button
                title={timeRemaining === practiceDuration * 60 ? t('practice.start') : t('practice.resume')}
                onPress={handleStart}
                fullWidth
              />
            ) : (
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={handlePause}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isDarkMode
                    ? ['#475569', '#64748B'] // Dark mode: açık gri tonları
                    : ['#E0E7FF', '#C7D2FE'] // Light mode: açık mavi tonları
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.pauseButtonGradient}
                >
                  <View style={styles.pauseButtonContent}>
                    <Pause size={20} color={isDarkMode ? '#FFFFFF' : '#6366F1'} weight="fill" />
                    <Text style={[styles.pauseButtonText, { color: isDarkMode ? '#FFFFFF' : '#6366F1' }]}>
                      {t('practice.pause')}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Session Complete Modal */}
      <SessionCompleteModal
        visible={showCompleteModal}
        totalTime={totalTime}
        cycles={cycles}
        inhaleTime={phaseTimes.inhale}
        holdTime={phaseTimes.hold}
        exhaleTime={phaseTimes.exhale}
        onDone={handleDone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  containerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 0,
  },
  backgroundImageVisible: {
    opacity: 1,
  },
  backgroundImageHidden: {
    opacity: 0, // Hide when practice is active
    pointerEvents: 'none',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Default overlay
    zIndex: 1,
  },
  safeContent: {
    flex: 1,
    position: 'relative',
    zIndex: 2,
  },
  header: {
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44, // Minimum touch target size
    minHeight: 44,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  circleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: -10,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  pauseButton: {
    borderRadius: 28,
    overflow: 'hidden',
    width: '100%',
  },
  pauseButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pauseButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

