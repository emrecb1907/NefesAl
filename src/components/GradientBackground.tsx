import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'background';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'background',
}) => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={
        variant === 'primary'
          ? theme.gradients.primary
          : variant === 'secondary'
          ? theme.gradients.secondary
          : theme.gradients.background
      }
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

