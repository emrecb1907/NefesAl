import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppState {
  // Premium status
  isPremium: boolean;
  setPremium: (premium: boolean) => void;

  // Onboarding
  onboardingCompleted: boolean;
  completeOnboarding: () => void;

  // Stats
  streak: number;
  totalSessions: number;
  totalMinutes: number;
  incrementStreak: () => void;
  resetStreak: () => void;
  addSession: (minutes: number) => void;

  // Preferences
  defaultAmbiance: string;
  setDefaultAmbiance: (ambiance: string) => void;
  selectedTheme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  dailyReminder: boolean;
  setDailyReminder: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Premium
      isPremium: false,
      setPremium: (premium) => set({ isPremium: premium }),

      // Onboarding
      onboardingCompleted: false,
      completeOnboarding: () => set({ onboardingCompleted: true }),

      // Stats
      streak: 0,
      totalSessions: 0,
      totalMinutes: 0,
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      resetStreak: () => set({ streak: 0 }),
      addSession: (minutes) =>
        set((state) => ({
          totalSessions: state.totalSessions + 1,
          totalMinutes: state.totalMinutes + minutes,
        })),

      // Preferences
      defaultAmbiance: 'ocean',
      setDefaultAmbiance: (ambiance) => set({ defaultAmbiance: ambiance }),
      selectedTheme: 'system',
      setTheme: (theme) => set({ selectedTheme: theme }),
      dailyReminder: true,
      setDailyReminder: (enabled) => set({ dailyReminder: enabled }),
    }),
    {
      name: 'nefesal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

