import { Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { type, type TypeVariant } from '@/theme/typography';

type LegacyType =
  | 'default'
  | 'title'
  | 'small'
  | 'smallBold'
  | 'subtitle'
  | 'link'
  | 'linkPrimary'
  | 'code';

const legacyVariant: Record<LegacyType, TypeVariant | 'code'> = {
  default: 'body',
  title: 'largeTitle',
  small: 'subhead',
  smallBold: 'headline',
  subtitle: 'title',
  link: 'subhead',
  linkPrimary: 'subhead',
  code: 'code',
};

export type ThemedTextProps = TextProps & {
  variant?: TypeVariant;
  type?: LegacyType;
  themeColor?:
    | 'text'
    | 'textSecondary'
    | 'textDisabled'
    | 'primary'
    | 'textInverse'
    | 'error'
    | 'secondary'
    | 'success'
    | 'link'
    | 'gold'
    | 'onGold'
    | 'tabBarInactive';
};

export function ThemedText({
  style,
  variant,
  type: legacyType = 'default',
  themeColor,
  ...rest
}: ThemedTextProps) {
  const { colors } = useTheme();
  const { isRTL } = useTranslation();
  const resolved = variant ?? legacyVariant[legacyType];

  const textStyle: TextStyle =
    resolved === 'code'
      ? { fontSize: 12, fontFamily: 'ui-monospace', fontWeight: '500' }
      : isRTL
        ? { fontSize: type[resolved].fontSize, fontWeight: type[resolved].fontWeight }
        : { fontSize: type[resolved].fontSize, fontFamily: type[resolved].fontFamily };

  const color =
    themeColor != null
      ? colors[themeColor]
      : legacyType === 'linkPrimary'
        ? colors.secondary
        : resolved === 'subhead' || resolved === 'caption'
          ? colors.textSecondary
          : colors.text;

  return (
    <Text
      style={[textStyle, { color, writingDirection: isRTL ? 'rtl' : 'ltr' }, style]}
      {...rest}
    />
  );
}
