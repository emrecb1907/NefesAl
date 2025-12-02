import { useColorScheme } from 'react-native';
import { useAppStore } from '../state/store';
import { lightTheme, darkTheme } from './themes';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const selectedTheme = useAppStore((state) => state.selectedTheme);

  const getTheme = () => {
    if (selectedTheme === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return selectedTheme === 'dark' ? darkTheme : lightTheme;
  };

  return getTheme();
};

export const useIsDarkMode = () => {
  const systemColorScheme = useColorScheme();
  const selectedTheme = useAppStore((state) => state.selectedTheme);

  if (selectedTheme === 'system') {
    return systemColorScheme === 'dark';
  }
  return selectedTheme === 'dark';
};

