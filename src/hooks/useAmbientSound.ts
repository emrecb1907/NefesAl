import { useEffect, useState } from 'react';
import { AudioPlayer } from 'expo-audio';
import { useAppStore } from '../state/store';

export const useAmbientSound = (ambianceId: string) => {
  const [player, setPlayer] = useState<AudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const defaultAmbiance = useAppStore((state) => state.defaultAmbiance);

  useEffect(() => {
    return () => {
      if (player) {
        player.pause();
        player.remove();
      }
    };
  }, [player]);

  const loadSound = async (soundUri?: string) => {
    if (!soundUri) {
      // In a real app, you'd load the actual sound file
      // For now, we'll just create a silent sound
      return;
    }

    try {
      // Stop existing player if any
      if (player) {
        player.pause();
        player.remove();
      }

      const newPlayer = new AudioPlayer(soundUri, {
        isLooping: true,
        volume: 0.5,
      });
      setPlayer(newPlayer);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  const play = async () => {
    if (player) {
      await player.play();
      setIsPlaying(true);
    }
  };

  const pause = async () => {
    if (player) {
      player.pause();
      setIsPlaying(false);
    }
  };

  const stop = async () => {
    if (player) {
      player.pause();
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

