import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { spacing } from '@/theme';

export function OfflineBanner() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setOffline(state.isConnected === false);
    });
  }, []);

  if (!offline) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        paddingTop: insets.top + spacing.xs,
        paddingBottom: spacing.xs,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.error,
      }}>
      <ThemedText variant="caption" style={{ color: colors.textInverse, textAlign: 'center' }}>
        {t('common.offline')}
      </ThemedText>
    </View>
  );
}
