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
  lastStreakDate: string | null; // YYYY-MM-DD formatında son streak tarihi
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
  language: 'tr' | 'en';
  setLanguage: (language: 'tr' | 'en') => void;
  
  // Selected Pattern
  selectedPatternId: string | null;
  setSelectedPattern: (patternId: string) => void;
  
  // User Name
  userName: string | null;
  setUserName: (name: string) => void;
  
  // Profile Image
  profileImageUri: string | null;
  setProfileImageUri: (uri: string | null) => void;
  
  // Practice Duration (in minutes)
  practiceDuration: number;
  setPracticeDuration: (duration: number) => void;
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
      lastStreakDate: null,
      totalSessions: 0,
      totalMinutes: 0,
      incrementStreak: () => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD formatında bugünün tarihi
        set((state) => {
          // Eğer bugün streak artırılmamışsa artır
          if (state.lastStreakDate !== today) {
            return {
              streak: state.streak + 1,
              lastStreakDate: today,
            };
          }
          // Bugün zaten artırılmışsa hiçbir şey yapma
          return state;
        });
      },
      resetStreak: () => set({ streak: 0, lastStreakDate: null }),
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
      language: 'tr',
      setLanguage: (language) => set({ language }),
      
      // Selected Pattern
      selectedPatternId: null,
      setSelectedPattern: (patternId) => set({ selectedPatternId: patternId }),
      
      // User Name
      userName: null,
      setUserName: (name) => set({ userName: name }),
      
      // Profile Image
      profileImageUri: null,
      setProfileImageUri: (uri) => set({ profileImageUri: uri }),
      
      // Practice Duration (default 1 minute)
      practiceDuration: 1,
      setPracticeDuration: (duration) => set({ practiceDuration: duration }),
    }),
    {
      name: 'nefesal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

