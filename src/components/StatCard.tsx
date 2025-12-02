import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../styles/colors';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} padding={16}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    minHeight: 100,
  },
  iconContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

