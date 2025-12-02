import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
  Settings: undefined;
  Premium: undefined;
  Practice: { patternId: string; patternName: string };
  SessionComplete: { 
    totalTime: number; 
    cycles: number; 
    inhaleTime: number; 
    holdTime: number; 
    exhaleTime: number;
  };
  Sounds: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Sessions: undefined;
  Stats: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

