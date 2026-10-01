import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { radius } from '@/theme';

type CodeBadgeProps = {
  code: string;
  active?: boolean;
};

export function CodeBadge({ code, active = false }: CodeBadgeProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: radius.md,
        backgroundColor: active ? colors.primary : colors.chip,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ThemedText variant="label" style={{ color: active ? colors.textInverse : colors.textSecondary }}>
        {code}
      </ThemedText>
    </View>
  );
}
