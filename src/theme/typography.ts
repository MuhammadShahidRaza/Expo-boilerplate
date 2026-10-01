import { TextStyle } from 'react-native';

import { fontFamily } from '@/theme/fonts';

export const type = {
  largeTitle: { fontSize: 28, fontFamily: fontFamily.bold, fontWeight: '700' },
  display: { fontSize: 22, fontFamily: fontFamily.bold, fontWeight: '700' },
  title: { fontSize: 20, fontFamily: fontFamily.bold, fontWeight: '700' },
  section: { fontSize: 16, fontFamily: fontFamily.bold, fontWeight: '700' },
  headline: { fontSize: 15, fontFamily: fontFamily.semibold, fontWeight: '600' },
  body: { fontSize: 14, fontFamily: fontFamily.regular, fontWeight: '400' },
  subhead: { fontSize: 13, fontFamily: fontFamily.regular, fontWeight: '400' },
  label: { fontSize: 13, fontFamily: fontFamily.medium, fontWeight: '500' },
  caption: { fontSize: 11, fontFamily: fontFamily.medium, fontWeight: '500' },
  button: { fontSize: 15, fontFamily: fontFamily.semibold, fontWeight: '600' },
} as const satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;
