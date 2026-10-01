import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Logo } from '@/components/ui/logo';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SelectRow } from '@/components/ui/select-row';
import { originCommunities } from '@/data/catalog';
import { useSession } from '@/context/session-context';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPrimaryOrigin } from '@/store/slices/world';
import { spacing } from '@/theme';

export function PrimaryScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { completeSignIn } = useSession();
  const originIds = useAppSelector((state) => state.world.originIds);
  const primaryOriginId = useAppSelector((state) => state.world.primaryOriginId);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const items = originCommunities.filter((item) => originIds.includes(item.id));

  async function onContinue() {
    if (!primaryOriginId) {
      setError(t('validation.primaryRequired'));
      return;
    }
    setLoading(true);
    await completeSignIn();
    setLoading(false);
    router.replace('/home');
  }

  return (
    <Screen
      footer={
        <>
          {error ? (
            <ThemedText variant="caption" themeColor="error">
              {error}
            </ThemedText>
          ) : null}
          <Button title={t('common.continue')} loading={loading} onPress={() => void onContinue()} />
        </>
      }>
      <ScreenHeader />
      <Logo showTagline />
      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="title" themeColor="text">
          {t('auth.primaryTitle')}
        </ThemedText>
        <ThemedText variant="body">{t('setup.chooseCommunityBody')}</ThemedText>
        <ThemedText variant="headline" themeColor="text">
          {t('auth.primaryHint')}
        </ThemedText>
      </View>

      <View style={{ gap: spacing.sm }}>
        {items.map((item) => {
          const selected = primaryOriginId === item.id;
          return (
            <SelectRow
              key={item.id}
              title={t(item.key)}
              icon="users"
              selected={selected}
              trailing="check"
              onPress={() => {
                setError('');
                dispatch(setPrimaryOrigin(item.id));
              }}
            />
          );
        })}
      </View>
    </Screen>
  );
}
