import { Platform } from 'react-native';

import { darkColors, lightColors } from '@/theme/colors';

export {
  Spacing,
  bottomTabInset as BottomTabInset,
  maxContentWidth as MaxContentWidth,
} from '@/theme';

export const Colors = {
  light: {
    text: lightColors.text,
    background: lightColors.background,
    backgroundElement: lightColors.backgroundElement,
    backgroundSelected: lightColors.backgroundSelected,
    textSecondary: lightColors.textSecondary,
  },
  dark: {
    text: darkColors.text,
    background: darkColors.background,
    backgroundElement: darkColors.backgroundElement,
    backgroundSelected: darkColors.backgroundSelected,
    textSecondary: darkColors.textSecondary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});
