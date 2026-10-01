import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type SectionHeaderProps = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <ThemedText variant="section">{title}</ThemedText>
      {action ? (
        <Pressable accessibilityRole="button" onPress={onAction}>
          <ThemedText variant="label" themeColor="link">
            {action}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}
