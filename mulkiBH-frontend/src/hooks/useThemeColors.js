import { useTheme } from '../context/ThemeContext';

export const useThemeColors = () => {
  const { isDark } = useTheme();
  return {
    bg: isDark ? '#0f1923' : '#f8f9fa',
    surface: isDark ? '#1a2535' : '#ffffff',
    surface2: isDark ? '#0d1c2b' : '#f8f9fa',
    border: isDark ? '#2d3748' : '#e2e8f0',
    text: isDark ? '#e2e8f0' : '#2d3748',
    subtext: isDark ? '#a0aec0' : '#718096',
    heading: isDark ? '#f7fafc' : '#1a3c5e',
    isDark,
  };
};
