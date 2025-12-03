import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../styles/colors';
import { useAppStore } from '../state/store';
import { SoundCard, SafeScreen } from '../components';
import { ambiances } from '../constants/ambiances';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { AudioPlayer } from 'expo-audio';

type SoundsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function SoundsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<SoundsScreenNavigationProp>();
  const isPremium = useAppStore((state) => state.isPremium);
  const defaultAmbiance = useAppStore((state) => state.defaultAmbiance);
  const setDefaultAmbiance = useAppStore((state) => state.setDefaultAmbiance);

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [player, setPlayer] = useState<AudioPlayer | null>(null);

  useEffect(() => {
    return () => {
      if (player) {
        player.pause();
        player.remove();
      }
    };
  }, [player]);

  const handleSoundPress = async (ambianceId: string, isLocked: boolean) => {
    if (isLocked) {
      // Navigate to Premium screen
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.navigate('Premium');
      }
      return;
    }

    // If clicking the same sound, stop it
    if (currentlyPlaying === ambianceId) {
      if (player) {
        player.pause();
      }
      setCurrentlyPlaying(null);
      return;
    }

    // Stop current sound if playing
    if (player) {
      player.pause();
      player.remove();
      setPlayer(null);
    }

    // Play new sound
    try {
      // In a real app, you would load the actual sound file
      // For now, we'll simulate it
      const soundUri = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      const newPlayer = new AudioPlayer(soundUri, {
        isLooping: true,
        volume: 0.5,
      });
      
      await newPlayer.play();
      setPlayer(newPlayer);
      setCurrentlyPlaying(ambianceId);
      setDefaultAmbiance(ambianceId);
    } catch (error) {
      console.error('Error playing sound:', error);
      // For demo purposes, just set the state even if sound fails
      setCurrentlyPlaying(ambianceId);
      setDefaultAmbiance(ambianceId);
    }
  };

  return (
    <SafeScreen edges={['top']} backgroundColor={theme.colors.background}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Sound & Ambiance
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Choose a calming background sound
          </Text>
        </View>

        {/* Sounds List */}
        <View style={styles.soundsList}>
          {ambiances.map((ambiance) => {
            const isLocked = ambiance.isPremium && !isPremium;
            const isPlaying = currentlyPlaying === ambiance.id;

            return (
              <SoundCard
                key={ambiance.id}
                title={ambiance.name}
                description={ambiance.description}
                icon={ambiance.icon}
                isPlaying={isPlaying}
                isLocked={isLocked}
                onPress={() => handleSoundPress(ambiance.id, isLocked)}
              />
            );
          })}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
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
  soundsList: {
    paddingHorizontal: 20,
  },
});

