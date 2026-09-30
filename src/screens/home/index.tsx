import { router } from 'expo-router';

import { GroupedList, GroupedRow } from '@/components/grouped-list';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/context/session-context';
import { useTranslation } from '@/hooks/use-translation';

export function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useSession();

  return (
    <Screen>
      <ThemedText variant="title">{t('home.greeting', { name: user?.fullName ?? '' })}</ThemedText>
      <ThemedText variant="body">{t('home.subtitle')}</ThemedText>
      <GroupedList>
        <GroupedRow title={t('common.theme')} onPress={() => router.push('/theme')} />
        <GroupedRow title={t('common.language')} onPress={() => router.push('/language')} />
        <GroupedRow title={t('common.settings')} onPress={() => router.push('/settings')} />
      </GroupedList>
    </Screen>
  );
}
