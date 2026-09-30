import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useTranslation } from '@/hooks/use-translation';

export function TermsScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <ThemedText selectable variant="body">
        {t('legal.termsBody')}
      </ThemedText>
    </Screen>
  );
}
