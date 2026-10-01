import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'gold' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'softDanger';
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  trailing?: IconName;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  trailing,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const inactive = disabled || loading;
  const palette = {
    primary: { backgroundColor: colors.primary, color: colors.textInverse, borderColor: colors.primary },
    gold: { backgroundColor: colors.gold, color: colors.onGold, borderColor: colors.gold },
    secondary: { backgroundColor: colors.backgroundElement, color: colors.text, borderColor: colors.border },
    outline: { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
    ghost: { backgroundColor: 'transparent', color: colors.primary, borderColor: 'transparent' },
    destructive: { backgroundColor: colors.error, color: colors.textInverse, borderColor: colors.error },
    softDanger: { backgroundColor: colors.dangerSoft, color: colors.error, borderColor: colors.dangerSoft },
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
          borderWidth: 1,
          borderColor: palette.borderColor,
          minHeight: 52,
          paddingHorizontal: spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'stretch',
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.color} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          {icon ? <Icon name={icon} size={18} color={palette.color} /> : null}
          <ThemedText variant="button" numberOfLines={1} style={{ color: palette.color, flexShrink: 1 }}>
            {title}
          </ThemedText>
          {trailing ? <Icon name={trailing} size={18} color={palette.color} /> : null}
        </View>
      )}
    </Pressable>
  );
}
