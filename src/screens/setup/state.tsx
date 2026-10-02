import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SearchField } from '@/components/ui/search-field';
import { countryByCode, regions } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setStateName, skipState } from '@/store/slices/world';
import { radius, spacing } from '@/theme';

export function StateScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const countryCode = useAppSelector((state) => state.world.countryCode);
  const country = countryByCode(countryCode);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const list = useMemo(() => {
    const states = (countryCode && regions[countryCode]) || [];
    const q = query.trim().toLowerCase();
    return states.filter((name) => !q || name.toLowerCase().includes(q));
  }, [countryCode, query]);

  function onContinue() {
    if (!selected) return;
    dispatch(setStateName(selected));
    router.push('/pick-language');
  }

  function onSkip() {
    dispatch(skipState());
    router.push('/pick-language');
  }

  return (
    <Screen
      footer={
        <>
          <Button title={t('common.continue')} disabled={!selected} onPress={onContinue} />
          <Pressable accessibilityRole="button" onPress={onSkip} style={{ alignItems: 'center', paddingVertical: spacing.xs }}>
            <ThemedText variant="subhead">{t('setup.skipForNow')}</ThemedText>
          </Pressable>
        </>
      }>
      <ScreenHeader
        onBack={() => router.replace('/community')}
        right={
          <ThemedText variant="headline" themeColor="text">
            {countryCode ?? ''}
          </ThemedText>
        }
      />
      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="title" themeColor="text">
          {t('setup.whichState')}
        </ThemedText>
        <ThemedText variant="body">{t('setup.stateBody', { place: country?.name ?? '' })}</ThemedText>
      </View>

      <SearchField value={query} onChangeText={setQuery} placeholder={t('setup.searchState')} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.sm }}>
        {list.map((name) => {
          const active = selected === name;
          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setSelected(name)}
              style={{
                width: '48%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.xs,
                backgroundColor: colors.card,
                borderRadius: radius.xl,
                borderWidth: 1.5,
                borderColor: active ? colors.primary : colors.border,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                minHeight: 56,
              }}>
              <ThemedText variant="headline" themeColor="text" style={{ flex: 1 }}>
                {name}
              </ThemedText>
              {active ? <Icon name="check" size={18} color={colors.primary} /> : null}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
