import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../styles/colors';
import { Button, Card } from '../components';
import { useAppStore } from '../state/store';
import { formatTime } from '../utils/formatTime';
import Svg, { Path } from 'react-native-svg';

interface SessionCompleteModalProps {
  visible: boolean;
  totalTime: number; // in seconds
  cycles: number;
  inhaleTime: number; // in seconds
  holdTime: number; // in seconds
  exhaleTime: number; // in seconds
  onDone: () => void;
}

export const SessionCompleteModal: React.FC<SessionCompleteModalProps> = ({
  visible,
  totalTime,
  cycles,
  inhaleTime,
  holdTime,
  exhaleTime,
  onDone,
}) => {
  const theme = useTheme();
  const { streak, incrementStreak } = useAppStore();

  const minutes = Math.floor(totalTime / 60);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDone}
    >
      <BlurView intensity={20} style={styles.blurContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Session Complete
              </Text>
              <Text
                style={[styles.subtitle, { color: theme.colors.textSecondary }]}
              >
                Great work! Here's today's progress.
              </Text>
            </View>

            {/* Progress Card */}
            <Card style={styles.progressCard} padding={24}>
              {/* Top Row */}
              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <Text
                    style={[
                      styles.progressLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Time
                  </Text>
                  <Text style={[styles.progressValue, { color: theme.colors.text }]}>
                    {formatTime(totalTime)}
                  </Text>
                </View>
                <View style={styles.progressItem}>
                  <Text
                    style={[
                      styles.progressLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Breathing Cycles
                  </Text>
                  <Text style={[styles.progressValue, { color: theme.colors.text }]}>
                    {cycles} cycles
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View
                style={[styles.divider, { backgroundColor: theme.colors.border }]}
              />

              {/* Bottom Row */}
              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <Text
                    style={[
                      styles.progressLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Inhale
                  </Text>
                  <Text
                    style={[
                      styles.progressValueSmall,
                      { color: theme.colors.text },
                    ]}
                  >
                    {inhaleTime}s
                  </Text>
                </View>
                <View style={styles.progressItem}>
                  <Text
                    style={[
                      styles.progressLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Hold
                  </Text>
                  <Text
                    style={[
                      styles.progressValueSmall,
                      { color: theme.colors.text },
                    ]}
                  >
                    {holdTime}s
                  </Text>
                </View>
                <View style={styles.progressItem}>
                  <Text
                    style={[
                      styles.progressLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Exhale
                  </Text>
                  <Text
                    style={[
                      styles.progressValueSmall,
                      { color: theme.colors.text },
                    ]}
                  >
                    {exhaleTime}s
                  </Text>
                </View>
              </View>
            </Card>

            {/* RELAX Button */}
            <TouchableOpacity
              style={[
                styles.relaxButton,
                { backgroundColor: theme.colors.surface },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.relaxText, { color: theme.colors.text }]}>
                RELAX
              </Text>
            </TouchableOpacity>

            {/* Streak Card */}
            <Card style={styles.streakCard} padding={20}>
              <Text
                style={[styles.streakLabel, { color: theme.colors.textSecondary }]}
              >
                Daily Streak
              </Text>
              <Text style={[styles.streakValue, { color: theme.colors.text }]}>
                {streak} {streak === 1 ? 'day' : 'days'}
              </Text>
              <Text
                style={[
                  styles.streakMessage,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Keep going to build consistency!
              </Text>
            </Card>

            {/* Done Button */}
            <View style={styles.buttonContainer}>
              <Button title="Done" onPress={onDone} fullWidth />
            </View>
          </View>
        </ScrollView>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  progressCard: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  progressValueSmall: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  relaxButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  relaxText: {
    fontSize: 14,
    fontWeight: '600',
  },
  streakCard: {
    marginBottom: 24,
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  streakMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
});

