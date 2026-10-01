import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: 'neutral' | 'gold' | 'navy' | 'success' | 'soft';
};

export function Chip({ label, selected = false, onPress, tone = 'neutral' }: ChipProps) {
  const { colors } = useTheme();
  const active = selected || tone === 'navy' || tone === 'gold';
  const backgroundColor =
    tone === 'gold' ? colors.gold : tone === 'success' ? colors.successSoft : selected ? colors.primary : colors.chip;
  const color =
    tone === 'gold' || selected ? colors.textInverse : tone === 'success' ? colors.success : colors.text;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected }}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        alignSelf: 'flex-start',
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        minHeight: 36,
        justifyContent: 'center',
        opacity: pressed ? 0.8 : 1,
      })}>
      <ThemedText variant="label" style={{ color }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}
