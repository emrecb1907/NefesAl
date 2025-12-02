import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../styles/colors';
import Svg, { Path } from 'react-native-svg';

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showChevron?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  value,
  onPress,
  rightComponent,
  showChevron = true,
}) => {
  const theme = useTheme();

  const content = (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <View style={styles.rightContainer}>
        {rightComponent ? (
          rightComponent
        ) : (
          <>
            {value && (
              <Text style={[styles.value, { color: theme.colors.textSecondary }]}>
                {value}
              </Text>
            )}
            {showChevron && (
              <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={styles.chevron}>
                <Path
                  d="M7.5 5 L12.5 10 L7.5 15"
                  stroke={theme.colors.textSecondary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
          </>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
});

