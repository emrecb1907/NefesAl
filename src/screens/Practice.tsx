import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../styles/colors';
import { useAppStore } from '../state/store';
import { BreathingCircle } from '../components/BreathingCircle';
import { SessionCompleteModal } from '../components/SessionCompleteModal';
import { Button } from '../components';
import { breathingPatterns } from '../constants/breathingPatterns';
import { formatTime } from '../utils/formatTime';
import { hapticFeedback } from '../utils/haptics';
import { RootStackParamList } from '../navigation/types';
import Svg, { Path } from 'react-native-svg';

type PracticeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Practice'
>;

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';

export default function PracticeScreen() {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation<PracticeScreenNavigationProp>();
  const params = route.params as {
    patternId?: string;
    patternName?: string;
  } | undefined;

  const { addSession, incrementStreak } = useAppStore();

  const patternId = params?.patternId || 'box';
  const patternName = params?.patternName || 'Relax Breathing';
  const pattern = breathingPatterns.find((p) => p.id === patternId) || breathingPatterns[0];

  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes default
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Session tracking
  const [cycles, setCycles] = useState(0);
  const [phaseTimes, setPhaseTimes] = useState({
    inhale: 0,
    hold: 0,
    exhale: 0,
    holdAfterExhale: 0,
  });
  const [totalTime, setTotalTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartTimeRef = useRef<number>(Date.now());
  const sessionStartTimeRef = useRef<number>(Date.now());

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

  useEffect(() => {
    if (!isActive) return;

    const phaseDuration = getPhaseDuration(currentPhase);
    if (phaseDuration === 0) {
      // Skip phases with 0 duration
      setTimeout(() => moveToNextPhase(), 0);
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

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

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
        // Complete cycle
        setCycles((prev) => prev + 1);
        setCurrentPhase('inhale');
      }
    } else if (currentPhase === 'holdAfterExhale') {
      // Complete cycle
      setCycles((prev) => prev + 1);
      setCurrentPhase('inhale');
    }
  };

  const handleStart = () => {
    setIsActive(true);
    sessionStartTimeRef.current = Date.now();
    phaseStartTimeRef.current = Date.now();
    hapticFeedback.medium();
  };

  const handlePause = () => {
    setIsActive(false);
    hapticFeedback.light();
  };

  const handleComplete = () => {
    setIsActive(false);
    const sessionDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
    const minutes = Math.floor(sessionDuration / 60);

    // Update store
    addSession(minutes);
    incrementStreak();

    setTotalTime(sessionDuration);
    setShowCompleteModal(true);
    hapticFeedback.success();
  };

  const handleDone = () => {
    setShowCompleteModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background || '#F8FAFC' },
      ]}
      edges={['top', 'bottom']}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (isActive) {
              handlePause();
            }
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18 L9 12 L15 6"
              stroke={theme.colors.text}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.headerLabel, { color: theme.colors.textSecondary }]}>
            Breath Practice
          </Text>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {patternName}
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      {/* Breathing Circle */}
      <View style={styles.circleContainer}>
        <BreathingCircle phase={currentPhase} isActive={isActive} />
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={[styles.timer, { color: theme.colors.text }]}>
          {formatTime(timeRemaining)}
        </Text>
      </View>

      {/* Control Button */}
      <View style={styles.buttonContainer}>
        {!isActive ? (
          <Button
            title={timeRemaining === 5 * 60 ? 'Start' : 'Resume'}
            onPress={handleStart}
            fullWidth
          />
        ) : (
          <Button
            title="Pause"
            onPress={handlePause}
            variant="outline"
            fullWidth
          />
        )}
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

