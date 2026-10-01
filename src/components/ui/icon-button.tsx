import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { radius } from '@/theme';

type IconButtonProps = {
  icon: IconName;
  onPress?: () => void;
  variant?: 'gold' | 'navy' | 'soft' | 'ghost' | 'light';
  badge?: number;
  size?: number;
  accessibilityLabel: string;
};

export function IconButton({
  icon,
  onPress,
  variant = 'gold',
  badge,
  size = 44,
  accessibilityLabel,
}: IconButtonProps) {
  const { colors } = useTheme();
  const palette = {
    gold: { backgroundColor: colors.gold, color: colors.onGold },
    navy: { backgroundColor: colors.primary, color: colors.textInverse },
    soft: { backgroundColor: colors.chip, color: colors.text },
    ghost: { backgroundColor: 'transparent', color: colors.text },
    light: { backgroundColor: colors.card, color: colors.text },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.backgroundColor,
        opacity: pressed ? 0.75 : 1,
      })}>
      <Icon name={icon} size={20} color={palette.color} />
      {badge ? (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 18,
            height: 18,
            borderRadius: radius.full,
            backgroundColor: colors.error,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
          }}>
          <ThemedText variant="caption" themeColor="textInverse" style={{ fontSize: 10 }}>
            {badge}
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );
}
