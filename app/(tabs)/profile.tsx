import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../src/styles/colors';
import { useAppStore } from '../../src/state/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components';
import { SettingsRow } from '../../src/components/SettingsRow';
import { ToggleSwitch } from '../../src/components/ToggleSwitch';
import { Button } from '../../src/components';
import { formatDuration } from '../../src/utils/formatTime';
import { ambiances } from '../../src/constants/ambiances';
import { hapticFeedback } from '../../src/utils/haptics';
import { useTranslation } from '../../src/hooks/useTranslation';
import Svg, { Circle, Path } from 'react-native-svg';

const ProfileAvatar: React.FC<{ imageUri: string | null; onPress: () => void }> = ({ imageUri, onPress }) => {
  const theme = useTheme();
  const userName = useAppStore((state) => state.userName);
  
  return (
    <TouchableOpacity style={styles.avatarContainer} onPress={onPress} activeOpacity={0.7}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.avatarImage} />
      ) : (
        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarPlaceholderText}>
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
      )}
      <View style={styles.editIcon}>
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <Circle cx="10" cy="10" r="9" fill="#FFFFFF" />
          <Path
            d="M10 6 L10 14 M6 10 L14 10"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    totalSessions,
    totalMinutes,
    streak,
    isPremium,
    selectedTheme,
    defaultAmbiance,
    dailyReminder,
    language,
    profileImageUri,
    setProfileImageUri,
    setTheme,
    setDefaultAmbiance,
    setDailyReminder,
    setLanguage,
  } = useAppStore();

  const bestStreak = streak; // In a real app, this would track max streak

  const getThemeDisplay = () => {
    if (selectedTheme === 'system') return t('profile.themeSystem');
    return selectedTheme === 'light' ? t('profile.themeLight') : t('profile.themeDark');
  };

  const getLanguageDisplay = () => {
    return language === 'tr' ? t('profile.languageTurkish') : t('profile.languageEnglish');
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

  const handleLanguagePress = () => {
    hapticFeedback.light();
    // Toggle between Turkish and English
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  const handleAmbiancePress = () => {
    hapticFeedback.light();
    router.push('/sounds');
  };

  const handleUpgradePress = () => {
    hapticFeedback.medium();
    router.push('/premium');
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

  const requestImagePickerPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('profile.imagePermissionTitle') || 'Permission Required',
          t('profile.imagePermissionMessage') || 'We need permission to access your photos to set a profile picture.'
        );
        return false;
      }
    }
    return true;
  };

  const handleImagePicker = async () => {
    hapticFeedback.light();
    const hasPermission = await requestImagePickerPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Setting profile image URI:', imageUri);
        setProfileImageUri(imageUri);
        hapticFeedback.success();
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        t('profile.imageErrorTitle') || 'Error',
        t('profile.imageErrorMessage') || 'Failed to pick image. Please try again.'
      );
    }
  };

  const handleDone = () => {
    hapticFeedback.light();
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ProfileAvatar imageUri={profileImageUri} onPress={handleImagePicker} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('profile.title')}
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            {t('profile.subtitle')}
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
                {t('profile.sessions')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {formatDuration(totalMinutes)}
              </Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.textSecondary }]}
              >
                {t('profile.minutes')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {bestStreak}
              </Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.textSecondary }]}
              >
                {t('profile.bestStreak')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Preferences Card */}
        <Card style={styles.card} padding={20}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            {t('profile.preferences')}
          </Text>
          <View style={styles.divider} />
          <SettingsRow
            label={t('profile.theme')}
            value={`${getThemeDisplay()}${isPremium ? ` / ${t('common.premium')}` : ''}`}
            onPress={handleThemePress}
          />
          <View style={styles.divider} />
          <SettingsRow
            label={t('profile.language')}
            value={getLanguageDisplay()}
            onPress={handleLanguagePress}
          />
          <View style={styles.divider} />
          <SettingsRow
            label={t('profile.defaultAmbiance')}
            value={getAmbianceDisplay()}
            onPress={handleAmbiancePress}
          />
          <View style={styles.divider} />
          <SettingsRow
            label={t('profile.dailyReminder')}
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
            {t('profile.premiumStatus')}
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
              {isPremium ? t('profile.premiumActive') : t('profile.premiumNotActive')}
            </Text>
            {!isPremium && (
              <Text
                style={[
                  styles.premiumDescription,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t('profile.premiumDescription')}
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
                  <Text style={styles.upgradeText}>{t('common.upgrade')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* App Information Card */}
        <Card style={styles.card} padding={20}>
          <SettingsRow label={t('profile.appVersion')} value="v1.0.0" showChevron={false} />
          <View style={styles.divider} />
          <SettingsRow label={t('profile.privacyPolicy')} onPress={handlePrivacyPress} />
          <View style={styles.divider} />
          <SettingsRow label={t('profile.termsOfUse')} onPress={handleTermsPress} />
        </Card>

        {/* Done Button */}
        <View style={styles.buttonContainer}>
          <Button title={t('common.done')} onPress={handleDone} fullWidth />
        </View>
      </ScrollView>
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
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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

