import { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { CodeBadge } from '@/components/ui/code-badge';
import { Logo } from '@/components/ui/logo';
import { SearchField } from '@/components/ui/search-field';
import { SelectRow } from '@/components/ui/select-row';
import { countries, regions, type Country } from '@/data/catalog';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch } from '@/store/hooks';
import { setCountry } from '@/store/slices/world';
import { spacing } from '@/theme';

function subtitleKey(subtitle: Country['subtitle']) {
  if (subtitle === 'live') return 'setup.live';
  if (subtitle === 'provinces') return 'setup.provinces';
  return 'setup.growing';
}

function goAfterCountry(code: string) {
  if (regions[code]) router.push('/state');
  else router.push('/pick-language');
}

export function CommunityScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);

  const featured = countries.find((country) => country.featured) ?? countries[0];
  const others = useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries
      .filter((country) => !country.featured)
      .filter((country) => !q || country.name.toLowerCase().includes(q) || country.code.toLowerCase().includes(q));
  }, [query]);

  function selectCountry(code: string) {
    dispatch(setCountry(code));
    goAfterCountry(code);
  }

  async function useLocation() {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(t('common.appName'), t('setup.locationFailed'));
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const places = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      const code = places[0]?.isoCountryCode?.toUpperCase();
      const match = code ? countries.find((country) => country.code === code) : null;
      if (!match) {
        Alert.alert(t('common.appName'), t('setup.locationFailed'));
        return;
      }
      selectCountry(match.code);
    } catch {
      Alert.alert(t('common.appName'), t('setup.locationFailed'));
    } finally {
      setLocating(false);
    }
  }

  return (
    <Screen>
      <Logo showTagline />
      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="title" themeColor="text">
          {t('setup.chooseCommunity')}
        </ThemedText>
        <ThemedText variant="body">{t('setup.chooseCommunityBody')}</ThemedText>
      </View>

      <Button
        title={t('setup.useLocation')}
        variant="outline"
        icon="pin"
        loading={locating}
        onPress={() => void useLocation()}
      />

      <SelectRow
        title={featured.name}
        subtitle={t(subtitleKey(featured.subtitle))}
        selected
        leading={<CodeBadge code={featured.code} active />}
        onPress={() => selectCountry(featured.code)}
      />

      <SearchField value={query} onChangeText={setQuery} placeholder={t('setup.searchCountry')} />

      <View style={{ gap: spacing.sm }}>
        {others.map((country) => (
          <SelectRow
            key={country.code}
            title={country.name}
            subtitle={t(subtitleKey(country.subtitle))}
            leading={<CodeBadge code={country.code} />}
            onPress={() => selectCountry(country.code)}
          />
        ))}
      </View>
    </Screen>
  );
}
