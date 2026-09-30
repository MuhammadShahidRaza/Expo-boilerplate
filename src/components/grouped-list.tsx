import { Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

export function GroupedList({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        alignSelf: 'stretch',
        backgroundColor: colors.backgroundElement,
        borderRadius: radius.lg,
        borderCurve: 'continuous',
        overflow: 'hidden',
      }}>
      {children}
    </View>
  );
}

export function GroupedRow({
  title,
  onPress,
  selected = false,
}: {
  title: string;
  onPress?: () => void;
  selected?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: spacing.sm + spacing.xs,
        paddingHorizontal: spacing.md,
        backgroundColor: pressed ? colors.backgroundSelected : colors.backgroundElement,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
      })}>
      <ThemedText variant="body" style={{ flex: 1 }}>
        {title}
      </ThemedText>
      {selected ? (
        <SymbolView
          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
          size={16}
          tintColor={colors.primary}
        />
      ) : null}
    </Pressable>
  );
}
