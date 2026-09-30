import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

const sizes = {
  sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  md: { paddingVertical: spacing.sm + spacing.xs, paddingHorizontal: spacing.md },
} as const;

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: keyof typeof sizes;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const inactive = disabled || loading;

  const palette = {
    primary: { backgroundColor: colors.primary, color: colors.textInverse },
    secondary: { backgroundColor: colors.backgroundElement, color: colors.text },
    ghost: { backgroundColor: 'transparent', color: colors.primary },
    destructive: { backgroundColor: colors.error, color: '#FFFFFF' },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: palette.backgroundColor,
          borderRadius: radius.full,
          borderCurve: 'continuous',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'stretch',
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
          ...sizes[size],
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.color} />
      ) : (
        <ThemedText variant="button" style={{ color: palette.color }}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}
