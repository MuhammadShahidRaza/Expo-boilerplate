import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

type CheckboxProps = {
  checked: boolean;
  onPress: () => void;
  label: React.ReactNode;
  error?: string;
};

export function Checkbox({ checked, onPress, label, error }: CheckboxProps) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: spacing.xs }}>
      <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={onPress} hitSlop={8}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: radius.sm,
              borderWidth: 1.5,
              borderColor: checked ? colors.primary : colors.inputBorder,
              backgroundColor: checked ? colors.primary : colors.card,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 2,
            }}>
            {checked ? <Icon name="check" size={14} color={colors.textInverse} /> : null}
          </View>
        </Pressable>
        <View style={{ flex: 1 }}>{typeof label === 'string' ? <ThemedText variant="subhead">{label}</ThemedText> : label}</View>
      </View>
      {error ? (
        <ThemedText variant="caption" themeColor="error">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}
