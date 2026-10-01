import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { radius, shadows, spacing } from '@/theme';

type SelectRowProps = {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  trailing?: 'chevron' | 'check' | 'remove' | 'none';
  removeLabel?: string;
  icon?: IconName;
};

export function SelectRow({
  title,
  subtitle,
  leading,
  selected = false,
  onPress,
  trailing = 'chevron',
  removeLabel,
  icon,
}: SelectRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: selected ? colors.goldSoft : colors.card,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        padding: spacing.sm + 4,
        boxShadow: shadows.card,
        opacity: pressed ? 0.86 : 1,
      })}>
      {leading ??
        (icon ? (
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: radius.md,
              backgroundColor: colors.chip,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name={icon} size={18} color={colors.textSecondary} />
          </View>
        ) : null)}
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText variant="headline" themeColor="text">
          {title}
        </ThemedText>
        {subtitle ? <ThemedText variant="caption">{subtitle}</ThemedText> : null}
      </View>
      {trailing === 'chevron' ? <Icon name="chevronRight" size={18} color={colors.textDisabled} /> : null}
      {trailing === 'check' && selected ? <Icon name="check" size={18} color={colors.success} /> : null}
      {trailing === 'remove' ? (
        <ThemedText variant="label" themeColor="error">
          {removeLabel}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}
