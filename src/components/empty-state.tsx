import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { spacing } from '@/theme';

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.xxl }}>
      <ThemedText variant="headline">{title}</ThemedText>
      <ThemedText variant="body">{hint}</ThemedText>
    </View>
  );
}
