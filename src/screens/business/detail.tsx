import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { PostCard } from '@/components/feed/post-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { resolvePhoto } from '@/data/images';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { businessById, ensureThread } from '@/store/slices/world';
import { radius, spacing } from '@/theme';

const tabs = ['listings', 'ratings', 'events', 'posts'] as const;

export function BusinessDetailScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const world = useAppSelector((state) => state.world);
  const business = businessById(typeof id === 'string' ? id : '');
  const [tab, setTab] = useState<(typeof tabs)[number]>('listings');
  const insets = useSafeAreaInsets();

  if (!business) {
    return (
      <Screen>
        <IconButton icon="back" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
        <ThemedText variant="body">{t('directory.empty')}</ThemedText>
      </Screen>
    );
  }

  return (
    <Screen padded={false} safeTop={false}>
      <View>
        <Image
          source={resolvePhoto(business.image)}
          style={{ width: '100%', height: 220, borderBottomLeftRadius: radius.xxl, borderBottomRightRadius: radius.xxl }}
          contentFit="cover"
        />
        <View
          style={{
            position: 'absolute',
            top: insets.top + 8,
            left: spacing.md,
            right: spacing.md,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <IconButton icon="back" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
          <View
            style={{
              backgroundColor: colors.tabBar,
              borderRadius: radius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            }}>
            <ThemedText variant="caption" themeColor="textInverse">
              {t('business.views', { count: business.views })}
            </ThemedText>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            left: spacing.md,
            bottom: -22,
            width: 56,
            height: 56,
            borderRadius: radius.md,
            backgroundColor: colors.tabBar,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: colors.card,
          }}>
          <ThemedText variant="headline" themeColor="gold">
            {business.initials}
          </ThemedText>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.xl, gap: spacing.md }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginLeft: 68 }}>
          {business.verified ? (
            <Badge label={t('business.verified')} tone="success" icon="verified" />
          ) : null}
          <Badge label={t('business.excellence')} tone="gold" icon="star" />
        </View>

        <ThemedText variant="title">{business.name}</ThemedText>
        <ThemedText variant="caption">
          {business.category}
          {business.rating != null ? ` · ★ ${business.rating} (${business.ratings})` : ''}
          {` · ${t('business.followers', { count: business.followers })}`}
        </ThemedText>
        <ThemedText variant="body">{business.blurb}</ThemedText>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Icon name="pin" size={16} color={colors.info} />
          <ThemedText variant="subhead" themeColor="text">
            {business.address}
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Icon name="clock" size={16} color={colors.info} />
          <ThemedText variant="subhead" themeColor="text">
            {business.hours} ·{' '}
            <ThemedText variant="subhead" themeColor={business.open ? 'success' : 'error'}>
              {business.open ? t('common.openNow') : t('common.closed')}
            </ThemedText>
          </ThemedText>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1.35, minWidth: 0 }}>
            <Button
              title={t('common.directions')}
              variant="primary"
              icon="directions"
              style={{ paddingHorizontal: spacing.sm }}
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`,
                )
              }
            />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Button
              title={t('common.call')}
              variant="outline"
              icon="phone"
              style={{ paddingHorizontal: spacing.sm }}
              onPress={() => Linking.openURL(`tel:${business.phone}`)}
            />
          </View>
          <View style={{ flex: 1.15, minWidth: 0 }}>
            <Button
              title={t('common.message')}
              variant="outline"
              icon="chat"
              style={{ paddingHorizontal: spacing.sm }}
              onPress={() => {
                dispatch(
                  ensureThread({
                    id: business.id,
                    name: business.name,
                    avatar: business.image,
                    kind: 'business',
                  }),
                );
                router.push(`/conversation/${business.id}`);
              }}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.divider }}>
          {tabs.map((item) => {
            const active = tab === item;
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                onPress={() => setTab(item)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: spacing.sm,
                  borderBottomWidth: 2,
                  borderBottomColor: active ? colors.primary : 'transparent',
                }}>
                <ThemedText variant="label" themeColor={active ? 'text' : 'textSecondary'}>
                  {t(`business.${item}`)}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {tab === 'listings' ? (
          <View style={{ gap: spacing.md }}>
            {business.menu.length === 0 ? (
              <ThemedText variant="body">{t('business.emptyListings')}</ThemedText>
            ) : (
              <>
                <Image
                  source={resolvePhoto(business.image)}
                  style={{ width: '100%', height: 160, borderRadius: radius.xl }}
                  contentFit="cover"
                />
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  {business.menu.map((item) => (
                    <Card key={item.id} style={{ flex: 1 }} padded={false}>
                      <Image
                        source={resolvePhoto(item.image)}
                        style={{ width: '100%', height: 90, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl }}
                        contentFit="cover"
                      />
                      <View style={{ padding: spacing.sm, gap: 2 }}>
                        <ThemedText variant="headline">{item.name}</ThemedText>
                        <ThemedText variant="label" themeColor="gold">
                          {item.price}
                        </ThemedText>
                      </View>
                    </Card>
                  ))}
                </View>
              </>
            )}
            {business.review ? (
              <Card>
                <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
                  <Avatar initials={business.review.initials} size={40} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <ThemedText variant="headline">{business.review.name}</ThemedText>
                      <View style={{ flexDirection: 'row', gap: 2 }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Icon key={index} name="star" size={12} color={colors.gold} />
                        ))}
                      </View>
                    </View>
                    <ThemedText variant="caption">{business.review.text}</ThemedText>
                  </View>
                </View>
              </Card>
            ) : null}
          </View>
        ) : null}

        {tab === 'ratings' ? (
          business.review ? (
            <Card>
              <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
                <Avatar initials={business.review.initials} size={40} />
                <View style={{ flex: 1, gap: 4 }}>
                  <ThemedText variant="headline">{business.review.name}</ThemedText>
                  <ThemedText variant="caption">{business.review.text}</ThemedText>
                </View>
              </View>
            </Card>
          ) : (
            <ThemedText variant="body">{t('business.emptyRatings')}</ThemedText>
          )
        ) : null}

        {tab === 'events' ? (
          world.events.length === 0 ? (
            <ThemedText variant="body">{t('business.emptyEvents')}</ThemedText>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {world.events.map((event) => (
                <Card key={event.id} onPress={() => router.push(`/event/${event.id}`)}>
                  <ThemedText variant="headline">{event.title}</ThemedText>
                  <ThemedText variant="caption">
                    {event.dateLabel} · {event.place}
                  </ThemedText>
                </Card>
              ))}
            </View>
          )
        ) : null}

        {tab === 'posts' ? (
          (() => {
            const posts = world.posts.filter((post) => !post.official);
            if (posts.length === 0) {
              return <ThemedText variant="body">{t('business.emptyPosts')}</ThemedText>;
            }
            return posts.map((post) => <PostCard key={post.id} post={post} />);
          })()
        ) : null}
      </View>
    </Screen>
  );
}
