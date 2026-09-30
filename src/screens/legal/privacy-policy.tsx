import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useTranslation } from '@/hooks/use-translation';

export function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <ThemedText selectable variant="body">
        {t('legal.privacyBody')}
      </ThemedText>
    </Screen>
  );
}
