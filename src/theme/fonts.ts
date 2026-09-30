import { Platform } from 'react-native';

/** Poppins files loaded with expo-font. Weight is the family name, not fontWeight. */
export const fontFamily = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  mono: Platform.select({
    ios: 'ui-monospace',
    web: 'ui-monospace',
    default: 'monospace',
  }),
} as const;
