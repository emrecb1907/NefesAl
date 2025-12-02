import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { useAppStore } from '../state/store';

export const useAmbientSound = (ambianceId: string) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const defaultAmbiance = useAppStore((state) => state.defaultAmbiance);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadSound = async (soundUri?: string) => {
    if (!soundUri) {
      // In a real app, you'd load the actual sound file
      // For now, we'll just create a silent sound
      return;
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { isLooping: true, volume: 0.5 }
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  const play = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stop = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    play,
    pause,
    stop,
    loadSound,
  };
};

