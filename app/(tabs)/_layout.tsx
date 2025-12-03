import React, { useEffect } from 'react';
import { Platform, Appearance } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Tabs } from 'expo-router';
import { House, Wind, ChartLineUp, User } from 'phosphor-react-native';
import { View } from 'react-native';
import { useIsDarkMode } from '../../src/styles/colors';
import { useTheme } from '../../src/styles/colors';
import { useTranslation } from '../../src/hooks/useTranslation';

// iOS 26+ kontrolü - NativeTabs sadece iOS 26 ve üzeri için çalışıyor
const isIOS26Plus = Platform.OS === 'ios' && parseInt(Platform.Version as string) >= 26;

export default function TabLayout() {
  const isDarkMode = useIsDarkMode();
  const theme = useTheme();
  const { t } = useTranslation();

  // NativeTabs sistem temasını kullanır, bu yüzden uygulama temasına göre sistem temasını override ediyoruz
  useEffect(() => {
    if (isIOS26Plus) {
      // Uygulama temasına göre sistem temasını geçici olarak ayarla
      const originalColorScheme = Appearance.getColorScheme();
      const targetColorScheme = isDarkMode ? 'dark' : 'light';
      
      // Sadece farklıysa değiştir
      if (originalColorScheme !== targetColorScheme) {
        Appearance.setColorScheme(targetColorScheme);
      }

      // Cleanup: Component unmount olduğunda orijinal temaya geri dön
      return () => {
        if (originalColorScheme) {
          Appearance.setColorScheme(originalColorScheme);
        }
      };
    }
  }, [isDarkMode, isIOS26Plus]);

  // iOS 26+ için native tabs kullan
  if (isIOS26Plus) {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Label>{t('tabs.home')}</Label>
          <Icon sf="house.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="sessions">
          <Icon sf="wind" />
          <Label>{t('tabs.sessions')}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="stats">
          <Icon sf="chart.line.uptrend.xyaxis" />
          <Label>{t('tabs.stats')}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" />
          <Label>{t('tabs.profile')}</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // iOS 26 altı ve Android için normal tabs
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.card,
          paddingBottom: 10,
          paddingTop: 12,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginTop: -4 }}>
              <House size={focused ? 30 : 28} color={color} weight={focused ? 'fill' : 'regular'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginTop: -4 }}>
              <Wind size={focused ? 30 : 28} color={color} weight={focused ? 'fill' : 'regular'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginTop: -4 }}>
              <ChartLineUp size={focused ? 30 : 28} color={color} weight={focused ? 'fill' : 'regular'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginTop: -4 }}>
              <User size={focused ? 30 : 28} color={color} weight={focused ? 'fill' : 'regular'} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

