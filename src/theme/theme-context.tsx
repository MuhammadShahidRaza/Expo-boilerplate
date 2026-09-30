import { createContext, useCallback, useContext, useMemo } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAppThemeMode, type ThemeMode } from '@/store/slices/app';
import { darkColors, lightColors, type ThemeColors } from '@/theme/colors';

type ThemeContextValue = {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export type { ThemeMode };

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const systemScheme = useColorScheme();
  const themeMode = useAppSelector((state) => state.app.themeMode);
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const colors: ThemeColors = isDark ? darkColors : lightColors;

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      dispatch(setAppThemeMode(mode));
    },
    [dispatch],
  );

  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark');
  }, [isDark, setThemeMode]);

  const value = useMemo(
    () => ({ themeMode, isDark, colors, setThemeMode, toggleTheme }),
    [themeMode, isDark, colors, setThemeMode, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within AppThemeProvider');
  }
  return value;
}
