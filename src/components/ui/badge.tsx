import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

type BadgeProps = {
  label: string;
  tone?: 'gold' | 'success' | 'navy' | 'neutral' | 'danger';
  icon?: IconName;
};

export function Badge({ label, tone = 'gold', icon }: BadgeProps) {
  const { colors } = useTheme();
  const palette = {
    gold: { backgroundColor: colors.goldSoft, color: colors.gold },
    success: { backgroundColor: colors.successSoft, color: colors.success },
    navy: { backgroundColor: colors.navySoft, color: colors.primary },
    neutral: { backgroundColor: colors.chip, color: colors.textSecondary },
    danger: { backgroundColor: colors.dangerSoft, color: colors.error },
  }[tone];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        backgroundColor: palette.backgroundColor,
        borderRadius: radius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
      }}>
      {icon ? <Icon name={icon} size={12} color={palette.color} /> : null}
      <ThemedText variant="caption" style={{ color: palette.color }}>
        {label}
      </ThemedText>
    </View>
  );
}
