import { TextStyle } from 'react-native';

import { fontFamily } from '@/theme/fonts';

export const type = {
  largeTitle: { fontSize: 34, fontFamily: fontFamily.bold, fontWeight: '700' },
  title: { fontSize: 22, fontFamily: fontFamily.semibold, fontWeight: '600' },
  headline: { fontSize: 17, fontFamily: fontFamily.semibold, fontWeight: '600' },
  body: { fontSize: 17, fontFamily: fontFamily.regular, fontWeight: '400' },
  subhead: { fontSize: 15, fontFamily: fontFamily.regular, fontWeight: '400' },
  caption: { fontSize: 12, fontFamily: fontFamily.regular, fontWeight: '400' },
  button: { fontSize: 17, fontFamily: fontFamily.semibold, fontWeight: '600' },
} as const satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;
