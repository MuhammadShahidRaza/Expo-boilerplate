import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';

import { GroupedList, GroupedRow } from '@/components/grouped-list';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useTranslation } from '@/hooks/use-translation';
import { spacing } from '@/theme';

export function SettingsScreen() {
  const { t } = useTranslation();
  const { token, enable } = usePushNotifications();
  const [notice, setNotice] = useState('');

  async function onNotifications() {
    setNotice('');
    const result = await enable();
    if (result.status === 'denied') setNotice(t('common.permissionDenied'));
    if (result.status === 'unavailable') setNotice(t('services.notificationsHint'));
  }

  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <ThemedText variant="headline">{t('common.account')}</ThemedText>
        <GroupedList>
          <GroupedRow title={t('common.editProfile')} onPress={() => router.push('/edit-profile')} />
          <GroupedRow title={t('common.changePassword')} onPress={() => router.push('/change-password')} />
        </GroupedList>
      </View>
      <View style={{ gap: spacing.sm }}>
        <ThemedText variant="headline">{t('common.appearance')}</ThemedText>
        <GroupedList>
          <GroupedRow title={t('common.theme')} onPress={() => router.push('/theme')} />
          <GroupedRow title={t('common.language')} onPress={() => router.push('/language')} />
        </GroupedList>
      </View>
      <View style={{ gap: spacing.sm }}>
        <ThemedText variant="headline">{t('common.services')}</ThemedText>
        <GroupedList>
          <GroupedRow
            title={token ? t('common.notificationsOn') : t('common.enableNotifications')}
            onPress={() => void onNotifications()}
          />
          <GroupedRow title={t('common.location')} onPress={() => router.push('/location')} />
        </GroupedList>
        {notice ? (
          <ThemedText variant="caption" themeColor="textSecondary">
            {notice}
          </ThemedText>
        ) : null}
      </View>
      <View style={{ gap: spacing.sm }}>
        <ThemedText variant="headline">{t('common.legal')}</ThemedText>
        <GroupedList>
          <GroupedRow title={t('common.privacy')} onPress={() => router.push('/privacy-policy')} />
          <GroupedRow title={t('common.terms')} onPress={() => router.push('/terms')} />
        </GroupedList>
      </View>
    </Screen>
  );
}
