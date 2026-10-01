import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Logo } from '@/components/ui/logo';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SearchField } from '@/components/ui/search-field';
import { SelectRow } from '@/components/ui/select-row';
import { originCommunities } from '@/data/catalog';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleOrigin } from '@/store/slices/world';
import { spacing } from '@/theme';

export function OriginScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const originIds = useAppSelector((state) => state.world.originIds);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const selected = useMemo(
    () => originCommunities.filter((item) => originIds.includes(item.id)),
    [originIds],
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return originCommunities.filter((item) => {
      if (originIds.includes(item.id)) return false;
      if (!q) return true;
      return t(item.key).toLowerCase().includes(q);
    });
  }, [originIds, query, t]);

  function onToggle(id: string) {
    setError('');
    dispatch(toggleOrigin(id));
  }

  function onContinue() {
    if (originIds.length === 0) {
      setError(t('validation.originRequired'));
      return;
    }
    router.push('/primary');
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
          <Button title={t('common.continue')} disabled={originIds.length === 0} onPress={onContinue} />
        </>
      }>
      <ScreenHeader />
      <Logo showTagline />
      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="title" themeColor="text">
          {t('auth.originTitle')}
        </ThemedText>
        <ThemedText variant="body">{t('setup.chooseCommunityBody')}</ThemedText>
        <ThemedText variant="headline" themeColor="text">
          {t('auth.originQuestion')} {t('auth.originLimit')}
        </ThemedText>
      </View>

      <SearchField value={query} onChangeText={setQuery} placeholder={t('auth.originSearch')} />

      <View style={{ gap: spacing.sm }}>
        {selected.map((item) => (
          <SelectRow
            key={item.id}
            title={t(item.key)}
            icon="users"
            selected
            trailing="remove"
            removeLabel={t('common.remove')}
            onPress={() => onToggle(item.id)}
          />
        ))}
        {matches.map((item) => (
          <SelectRow
            key={item.id}
            title={t(item.key)}
            icon="users"
            trailing="none"
            onPress={() => onToggle(item.id)}
          />
        ))}
      </View>
    </Screen>
  );
}
