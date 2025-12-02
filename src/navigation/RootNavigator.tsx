import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { useAppStore } from '../state/store';
import OnboardingScreen from '../screens/Onboarding';
import SettingsScreen from '../screens/Settings';
import PremiumScreen from '../screens/Premium';
import PracticeScreen from '../screens/Practice';
import SoundsScreen from '../screens/Sounds';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!onboardingCompleted ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
          />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
              name="Practice"
              component={PracticeScreen}
              options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
              />
              <Stack.Screen
                name="Premium"
                component={PremiumScreen}
              />
              <Stack.Screen
                name="Sounds"
                component={SoundsScreen}
              />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

