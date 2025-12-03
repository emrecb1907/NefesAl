import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/colors';
import { useAppStore } from '../state/store';
import { Card, SafeScreen } from '../components';
import { SettingsRow } from '../components/SettingsRow';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { Button } from '../components';
import { formatDuration } from '../utils/formatTime';
import { ambiances } from '../constants/ambiances';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { hapticFeedback } from '../utils/haptics';
import Svg, { Circle, Path } from 'react-native-svg';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const ProfileAvatar = () => (
  <View style={styles.avatarContainer}>
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="40" r="38" stroke="#818cf8" strokeWidth="2" />
      <Circle cx="40" cy="32" r="12" fill="#1e40af" />
      <Path
        d="M20 60 Q20 50 30 50 L50 50 Q60 50 60 60 L60 70 L20 70 Z"
        fill="#1e40af"
      />
    </Svg>
  </View>
);

export default function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const {
    totalSessions,
    totalMinutes,
    streak,
    isPremium,
    selectedTheme,
    defaultAmbiance,
    dailyReminder,
    setTheme,
    setDefaultAmbiance,
    setDailyReminder,
  } = useAppStore();

  const bestStreak = streak; // In a real app, this would track max streak

  const getThemeDisplay = () => {
    if (selectedTheme === 'system') return 'System';
    return selectedTheme === 'light' ? 'Light' : 'Dark';
  };

  const getAmbianceDisplay = () => {
    const ambiance = ambiances.find((a) => a.id === defaultAmbiance);
    return ambiance?.name || 'Ocean Waves';
  };

  const handleThemePress = () => {
    hapticFeedback.light();
    // Cycle through themes
    if (selectedTheme === 'light') {
      setTheme('dark');
    } else if (selectedTheme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const handleAmbiancePress = () => {
    hapticFeedback.light();
    // Navigate to Sounds screen
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('Sounds');
    }
  };

  const handleUpgradePress = () => {
    hapticFeedback.medium();
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate('Premium');
    }
  };

  const handlePrivacyPress = () => {
    hapticFeedback.light();
    // In a real app, open privacy policy
    console.log('Privacy Policy');
  };

  const handleTermsPress = () => {
    hapticFeedback.light();
    // In a real app, open terms of use
    console.log('Terms of Use');
  };

  const handleDone = () => {
    hapticFeedback.light();
    navigation.goBack();
  };

  return (
    <SafeScreen edges={['top', 'bottom']} backgroundColor={theme.colors.background}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ProfileAvatar />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Your Profile
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Personal calming insights
          </Text>
        </View>

        {/* Statistics Card */}
        <Card style={styles.card} padding={20}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {totalSessions}
              </Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.textSecondary }]}
              >
                Sessions
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {formatDuration(totalMinutes)}
              </Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.textSecondary }]}
              >
                Minutes
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {bestStreak}
              </Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.textSecondary }]}
              >
                Best Streak
              </Text>
            </View>
          </View>
        </Card>

        {/* Preferences Card */}
        <Card style={styles.card} padding={20}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Preferences
          </Text>
          <View style={styles.divider} />
          <SettingsRow
            label="Theme"
            value={`${getThemeDisplay()}${isPremium ? ' / Premium' : ''}`}
            onPress={handleThemePress}
          />
          <View style={styles.divider} />
          <SettingsRow
            label="Default Ambiance"
            value={getAmbianceDisplay()}
            onPress={handleAmbiancePress}
          />
          <View style={styles.divider} />
          <SettingsRow
            label="Daily Reminder"
            rightComponent={
              <ToggleSwitch
                value={dailyReminder}
                onValueChange={setDailyReminder}
              />
            }
            showChevron={false}
          />
        </Card>

        {/* Premium Status Card */}
        <Card style={styles.card} padding={20}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Premium Status
          </Text>
          <View style={styles.premiumContent}>
            <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
              <Circle cx="16" cy="16" r="14" fill="#818cf8" opacity={0.2} />
              <Path
                d="M16 10 C13.79 10 12 11.79 12 14 L12 16 L10 16 C9.45 16 9 16.45 9 17 L9 24 C9 24.55 9.45 25 10 25 L22 25 C22.55 25 23 24.55 23 24 L23 17 C23 16.45 22.55 16 22 16 L20 16 L20 14 C20 11.79 18.21 10 16 10 Z M16 12 C17.1 12 18 12.9 18 14 L18 16 L14 16 L14 14 C14 12.9 14.9 12 16 12 Z"
                fill="#818cf8"
              />
            </Svg>
            <Text style={[styles.premiumStatus, { color: theme.colors.text }]}>
              {isPremium ? 'Premium Active' : 'Premium not active'}
            </Text>
            {!isPremium && (
              <Text
                style={[
                  styles.premiumDescription,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Unlock full access for deeper insights.
              </Text>
            )}
            {!isPremium && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgradePress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#818cf8', '#bfdbfe']}
                  style={styles.upgradeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.upgradeText}>Upgrade</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* App Information Card */}
        <Card style={styles.card} padding={20}>
          <SettingsRow label="App Version" value="v1.0.0" showChevron={false} />
          <View style={styles.divider} />
          <SettingsRow label="Privacy Policy" onPress={handlePrivacyPress} />
          <View style={styles.divider} />
          <SettingsRow label="Terms of Use" onPress={handleTermsPress} />
        </Card>

        {/* Done Button */}
        <View style={styles.buttonContainer}>
          <Button title="Done" onPress={handleDone} fullWidth />
        </View>
      </ScrollView>
    </SafeScreen>
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
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  premiumContent: {
    alignItems: 'center',
    marginTop: 8,
  },
  premiumStatus: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  upgradeGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
});
