import { Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { spacing } from '@/theme';

type SwitchRowProps = {
  title: string;
  body?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function SwitchRow({ title, body, value, onValueChange }: SwitchRowProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm }}>
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText variant="headline">{title}</ThemedText>
        {body ? <ThemedText variant="caption">{body}</ThemedText> : null}
      </View>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.gold }}
        thumbColor={colors.textInverse}
      />
    </View>
  );
}
