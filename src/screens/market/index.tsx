import { useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { SearchField } from '@/components/ui/search-field';
import type { Listing } from '@/data/content';
import { resolvePhoto } from '@/data/images';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppSelector } from '@/store/hooks';
import { radius, spacing } from '@/theme';
import { money } from '@/utils/time';

type CategoryFilter = 'all' | Listing['category'];

const categories: CategoryFilter[] = ['all', 'electronics', 'clothing', 'furniture', 'food'];

export function MarketplaceScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const listings = useAppSelector((state) => state.world.listings);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return listings.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!needle) return true;
      return item.title.toLowerCase().includes(needle) || item.sellerName.toLowerCase().includes(needle);
    });
  }, [listings, query, category]);

  function categoryLabel(value: CategoryFilter) {
    if (value === 'all') return t('common.all');
    return t(`market.${value}`);
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <IconButton icon="back" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
        <ThemedText variant="headline" style={{ flex: 1 }}>
          {t('market.title')}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('market.listItem')}
          onPress={() => router.push('/create-listing')}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: colors.gold,
            borderRadius: radius.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            opacity: pressed ? 0.85 : 1,
          })}>
          <Icon name="plus" size={14} color={colors.onGold} />
          <ThemedText variant="label" themeColor="onGold">
            {t('market.listItem')}
          </ThemedText>
        </Pressable>
      </View>

      <SearchField value={query} onChangeText={setQuery} placeholder={t('market.search')} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {categories.map((item) => (
          <Chip
            key={item}
            label={categoryLabel(item)}
            selected={category === item}
            tone={category === item ? 'gold' : 'neutral'}
            onPress={() => setCategory(item)}
          />
        ))}
      </View>

      {filtered.length === 0 ? (
        <ThemedText variant="body">{t('market.empty')}</ThemedText>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {filtered.map((listing) => (
            <Pressable
              key={listing.id}
              accessibilityRole="button"
              accessibilityLabel={listing.title}
              onPress={() => router.push(`/listing/${listing.id}`)}
              style={({ pressed }) => ({
                width: '47%',
                flexGrow: 1,
                maxWidth: '48%',
                gap: spacing.sm,
                opacity: pressed ? 0.86 : 1,
              })}>
              <View>
                <Image
                  source={resolvePhoto(listing.image)}
                  style={{ width: '100%', aspectRatio: 1, borderRadius: radius.xl }}
                  contentFit="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    top: spacing.sm,
                    left: spacing.sm,
                    backgroundColor: colors.card,
                    borderRadius: radius.full,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 4,
                  }}>
                  <ThemedText variant="caption">{categoryLabel(listing.category)}</ThemedText>
                </View>
              </View>
              <ThemedText variant="headline" numberOfLines={2}>
                {listing.title}
              </ThemedText>
              <ThemedText variant="headline" themeColor="link">
                {money(listing.price)}
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Avatar source={listing.sellerAvatar} size={24} />
                <ThemedText variant="caption">{listing.sellerName}</ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
