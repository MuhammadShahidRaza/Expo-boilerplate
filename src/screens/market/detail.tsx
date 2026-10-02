import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { resolvePhoto } from '@/data/images';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ensureThread } from '@/store/slices/world';
import { radius, spacing } from '@/theme';
import { money } from '@/utils/time';

export function ListingDetailScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing = useAppSelector((state) => state.world.listings.find((item) => item.id === id));
  const insets = useSafeAreaInsets();

  if (!listing) {
    return (
      <Screen>
        <IconButton icon="back" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
        <ThemedText variant="body">{t('market.empty')}</ThemedText>
      </Screen>
    );
  }

  const item = listing;

  function onMessageSeller() {
    const threadId = `seller-${item.id}`;
    dispatch(
      ensureThread({
        id: threadId,
        name: item.sellerName,
        avatar: 'portrait',
        kind: 'user',
        text: undefined,
      }),
    );
    router.push(`/conversation/${threadId}`);
  }

  return (
    <Screen
      padded={false}
      safeTop={false}
      contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 0, gap: 0 }}
      footer={<Button title={t('market.messageSeller')} onPress={onMessageSeller} />}>
      <View>
        <Image
          source={resolvePhoto(listing.image)}
          style={{ width: '100%', height: 280, borderBottomLeftRadius: radius.xxl, borderBottomRightRadius: radius.xxl }}
          contentFit="cover"
        />
        <View style={{ position: 'absolute', top: insets.top + 8, left: spacing.md }}>
          <IconButton icon="back" variant="light" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
        </View>
        <View style={{ position: 'absolute', bottom: spacing.lg, alignSelf: 'center', flexDirection: 'row', gap: 6 }}>
          {[0, 1, 2].map((dot) => (
            <View
              key={dot}
              style={{
                width: 8,
                height: 8,
                borderRadius: radius.full,
                backgroundColor: dot === 0 ? colors.gold : colors.card,
              }}
            />
          ))}
        </View>
        <View
          style={{
            position: 'absolute',
            right: spacing.md,
            bottom: spacing.md,
            backgroundColor: colors.gold,
            borderRadius: radius.full,
            paddingHorizontal: spacing.md,
            paddingVertical: 6,
          }}>
          <ThemedText variant="label" themeColor="onGold">
            {listing.condition === 'used' ? t('market.used') : t('market.new')}
          </ThemedText>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md, gap: spacing.md }}>
        <Chip label={t(`market.${listing.category}`)} tone="gold" />
        <View style={{ gap: spacing.xs }}>
          <ThemedText variant="title">{listing.title}</ThemedText>
          <ThemedText variant="title" themeColor="primary">
            {money(listing.price)}
          </ThemedText>
        </View>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Avatar source={listing.sellerAvatar} size={48} />
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText variant="caption">{t('market.soldBy')}</ThemedText>
              <ThemedText variant="headline">{listing.sellerName}</ThemedText>
            </View>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={t('market.viewProfile')}
              onPress={() => router.push(`/member/${encodeURIComponent(listing.sellerName)}`)}
              hitSlop={8}>
              <ThemedText variant="label" themeColor="gold">
                {t('market.viewProfile')}
              </ThemedText>
            </Pressable>
          </View>
        </Card>

        <View style={{ gap: spacing.sm }}>
          <ThemedText variant="headline">{t('market.description')}</ThemedText>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.xl,
              padding: spacing.md,
            }}>
            <ThemedText variant="body">{listing.description}</ThemedText>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: spacing.sm,
            backgroundColor: colors.goldSoft,
            borderRadius: radius.xl,
            padding: spacing.md,
          }}>
          <Icon name="warning" size={18} color={colors.gold} />
          <ThemedText variant="subhead" themeColor="gold" style={{ flex: 1 }}>
            {t('market.safety')}
          </ThemedText>
        </View>
      </View>
    </Screen>
  );
}
