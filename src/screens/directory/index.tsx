import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SearchField } from '@/components/ui/search-field';
import { businesses } from '@/data/content';
import { resolvePhoto } from '@/data/images';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { radius, spacing } from '@/theme';

const filters = ['all', 'restaurants', 'tax', 'barber', 'dealer'] as const;

export function DirectoryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ q?: string; filter?: string }>();
  const initialFilter = typeof params.filter === 'string' ? params.filter : 'all';
  const [query, setQuery] = useState(typeof params.q === 'string' ? params.q : '');
  const [filter, setFilter] = useState(initialFilter);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter((item) => {
      const matchesFilter = filter === 'all' || item.filter === filter;
      const matchesQuery =
        !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <Screen>
      <ScreenHeader
        title={t('directory.title')}
        right={
          <IconButton
            icon="sparkles"
            variant="navy"
            accessibilityLabel={t('tabs.assistant')}
            onPress={() => router.push('/assistant')}
          />
        }
      />
      <SearchField value={query} onChangeText={setQuery} placeholder={t('directory.search')} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ gap: spacing.sm, alignItems: 'center' }}>
        {filters.map((item) => (
          <Chip
            key={item}
            label={t(`directory.${item}`)}
            selected={filter === item}
            tone="navy"
            onPress={() => setFilter(item)}
          />
        ))}
      </ScrollView>
      {items.length === 0 ? (
        <ThemedText variant="body">{t('directory.empty')}</ThemedText>
      ) : (
        items.map((business) => (
          <Card
            key={business.id}
            onPress={() => router.push(`/business/${business.id}`)}
            style={
              business.tier === 'platinum'
                ? { borderColor: colors.gold, borderWidth: 1.5 }
                : undefined
            }>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Image
                source={resolvePhoto(business.image)}
                style={{ width: 72, height: 72, borderRadius: radius.lg }}
                contentFit="cover"
              />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
                  <Badge
                    label={business.tier[0].toUpperCase() + business.tier.slice(1)}
                    tone={business.tier === 'basic' ? 'neutral' : 'gold'}
                  />
                  {business.verified ? (
                    <Badge label={t('common.verified')} tone="success" icon="verified" />
                  ) : null}
                </View>
                <ThemedText variant="headline">{business.name}</ThemedText>
                <ThemedText variant="caption">
                  {business.category} · {business.distance}
                </ThemedText>
                {business.rating != null ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="star" size={14} color={colors.gold} />
                    <ThemedText variant="caption" themeColor="text">
                      {business.rating} · {t('directory.ratings', { count: business.ratings })}
                    </ThemedText>
                  </View>
                ) : (
                  <ThemedText variant="caption">{t('directory.noRatings')}</ThemedText>
                )}
              </View>
            </View>
          </Card>
        ))
      )}
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.tintPurpleSoft,
            borderRadius: radius.full,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            alignItems: 'center',
          }}>
          <ThemedText variant="caption" themeColor="text">
            {t('directory.hintDirectory')}
          </ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/marketplace')}
          style={{
            flex: 1,
            backgroundColor: colors.tintGreenSoft,
            borderRadius: radius.full,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            alignItems: 'center',
          }}>
          <ThemedText variant="caption" style={{ color: colors.tintGreen }}>
            {t('directory.hintMarket')}
          </ThemedText>
        </Pressable>
      </View>
    </Screen>
  );
}
