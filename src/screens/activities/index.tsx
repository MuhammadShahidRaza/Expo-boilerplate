import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { useTranslation } from '@/hooks/use-translation';

export function ActivitiesScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <EmptyState title={t('empty.activities')} hint={t('empty.activitiesHint')} />
    </Screen>
  );
}
