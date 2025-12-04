import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { useTheme } from '../src/styles/colors';
import { useAppStore } from '../src/state/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SoundCard } from '../src/components';
import { ambiances } from '../src/constants/ambiances';
import { useTranslation } from '../src/hooks/useTranslation';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';

export default function SoundsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const isPremium = useAppStore((state) => state.isPremium);
  const defaultAmbiance = useAppStore((state) => state.defaultAmbiance);
  const setDefaultAmbiance = useAppStore((state) => state.setDefaultAmbiance);

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [player, setPlayer] = useState<AudioPlayer | null>(null);

  // Preload mini images immediately when component mounts (should already be cached from home screen)
  useEffect(() => {
    const preloadMiniImages = async () => {
      // Preload all mini images immediately
      const imagePromises = ambiances
        .filter(ambiance => ambiance.miniImageFile)
        .map(ambiance => {
          // Force immediate load
          return Asset.loadAsync(ambiance.miniImageFile!)
            .catch((error) => {
              console.warn(`Failed to preload mini image for ${ambiance.id}:`, error);
            });
        });

      // Don't wait, just start loading
      Promise.all(imagePromises).catch(() => {
        // Ignore errors, images will load when rendered
      });
    };

    preloadMiniImages();
  }, []);

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
      router.push('/premium');
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
      const ambiance = ambiances.find(a => a.id === ambianceId);
      let audioSource: string | number | null;
      
      if (ambiance?.soundFile) {
        // Use local asset file - require() returns a number (asset ID)
        audioSource = ambiance.soundFile;
      } else {
        // Fallback to URL for other sounds
        audioSource = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      }
      
      const newPlayer = createAudioPlayer(audioSource);
      newPlayer.loop = true;
      newPlayer.volume = 0.5;
      
      newPlayer.play();
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('sounds.title')}
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            {t('sounds.subtitle')}
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
                miniImageFile={ambiance.miniImageFile}
                isPlaying={isPlaying}
                isLocked={isLocked}
                onPress={() => handleSoundPress(ambiance.id, isLocked)}
              />
            );
          })}
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

