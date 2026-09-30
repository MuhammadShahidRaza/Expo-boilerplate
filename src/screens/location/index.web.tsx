import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useTranslation } from '@/hooks/use-translation';

export function LocationScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <ThemedText variant="body">{t('services.locationHint')}</ThemedText>
      <ThemedText variant="subhead" themeColor="textSecondary">
        {t('services.mapWeb')}
      </ThemedText>
    </Screen>
  );
}
