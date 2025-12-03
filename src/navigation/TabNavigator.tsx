import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, Wind, ChartLineUp, User } from 'phosphor-react-native';
import { MainTabParamList } from './types';
import HomeScreen from '../screens/Home';
import SessionsScreen from '../screens/Sessions';
import StatsScreen from '../screens/Stats';
import ProfileScreen from '../screens/Profile';

const Tab = createBottomTabNavigator<MainTabParamList>();

// iOS 16+ için SF Symbols kullanımı
// React Navigation'ın bottom tabs'ı iOS'ta zaten native tab bar kullanıyor
// SF Symbols için Platform kontrolü yapıyoruz
const isIOS16Plus = Platform.OS === 'ios' && parseInt(Platform.Version as string) >= 16;

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#6b7280',
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 10,
          paddingTop: 12,
          height: 70,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginTop: -4 }}>
              <House size={focused ? 30 : 28} color={color} weight={focused ? 'fill' : 'regular'} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Sessions"
        component={SessionsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginTop: -4 }}>
              <Wind size={focused ? 30 : 28} color={color} weight={focused ? 'fill' : 'regular'} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginTop: -4 }}>
              <ChartLineUp size={focused ? 30 : 28} color={color} weight={focused ? 'fill' : 'regular'} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginTop: -4 }}>
              <User size={focused ? 30 : 28} color={color} weight={focused ? 'fill' : 'regular'} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

