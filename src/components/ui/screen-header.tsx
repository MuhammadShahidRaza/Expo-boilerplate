import { router } from 'expo-router';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/icon-button';
import { useTranslation } from '@/hooks/use-translation';
import { spacing } from '@/theme';

type ScreenHeaderProps = {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  hideBack?: boolean;
};

export function ScreenHeader({ title, onBack, right, hideBack = false }: ScreenHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, gap: spacing.sm }}>
      {hideBack ? (
        <View style={{ width: 44 }} />
      ) : (
        <IconButton icon="back" accessibilityLabel={t('common.back')} onPress={onBack ?? (() => router.back())} />
      )}
      <View style={{ flex: 1, alignItems: 'center' }}>
        {title ? (
          <ThemedText variant="headline" themeColor="text">
            {title}
          </ThemedText>
        ) : null}
      </View>
      <View style={{ minWidth: 44, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}
