import { useTheme } from '../context/ThemeContext';

export const useThemeColors = () => {
  const { isDark } = useTheme();
  return {
    bg: isDark ? '#0a0f16' : '#fcf9f8',
    surface: isDark ? '#101823' : '#ffffff',
    surface2: isDark ? '#0d141d' : '#f6f3f2',
    border: isDark ? '#2d3748' : 'rgba(196,198,206,0.5)',
    text: isDark ? '#e5e2e1' : '#1c1b1b',
    subtext: isDark ? '#a0a4ab' : '#44474d',
    heading: isDark ? '#f3f0ef' : '#001125',
    isDark,
  };
};
