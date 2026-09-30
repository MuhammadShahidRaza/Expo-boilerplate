import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useTranslation } from '@/hooks/use-translation';
import { spacing } from '@/theme';

export function GetStartedScreen() {
  const { t } = useTranslation();

  return (
    <Screen contentContainerStyle={{ justifyContent: 'space-between' }}>
      <View style={{ gap: spacing.sm, paddingTop: spacing.xxl }}>
        <ThemedText variant="largeTitle">{t('common.appName')}</ThemedText>
        <ThemedText variant="body">{t('auth.getStartedBody')}</ThemedText>
      </View>
      <View style={{ gap: spacing.sm }}>
        <Button title={t('common.login')} onPress={() => router.push('/login')} />
        <Button title={t('common.signUp')} variant="secondary" onPress={() => router.push('/sign-up')} />
        <Button title={t('common.language')} variant="ghost" onPress={() => router.push('/language?flow=pick')} />
      </View>
    </Screen>
  );
}
