import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { useTranslation } from '@/hooks/use-translation';

export function MessagesScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <EmptyState title={t('empty.messages')} hint={t('empty.messagesHint')} />
    </Screen>
  );
}
