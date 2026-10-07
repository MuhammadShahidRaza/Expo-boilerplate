import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { PostCard } from '@/components/feed/post-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { chapters } from '@/data/catalog';
import { resolvePhoto } from '@/data/images';
import { useSession } from '@/context/session-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFollow, unblockAuthor } from '@/store/slices/world';
import { confirmAction } from '@/utils/confirm';
import { visiblePosts } from '@/utils/feed';
import { radius, spacing } from '@/theme';

const tabs = ['myPosts', 'myListings', 'myEvents'] as const;

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function MemberProfileScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routeId = typeof id === 'string' ? id : '';
  const memberId = safeDecode(routeId);
  const world = useAppSelector((state) => state.world);
  const following = world.following.includes(routeId);
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<(typeof tabs)[number]>('myPosts');

  const matchedListing = world.listings.find(
    (listing) => listing.sellerName === memberId || listing.sellerName === routeId,
  );
  const matchedThread = world.threads.find(
    (thread) =>
      thread.id === routeId || thread.id === memberId || thread.name === memberId || thread.name === routeId,
  );
  const loggedInName = user?.fullName;
  const isMe =
    routeId === 'me' ||
    memberId === 'me' ||
    (Boolean(loggedInName) && (memberId === loggedInName || routeId === loggedInName));
  const known = isMe || Boolean(matchedListing) || Boolean(matchedThread);
  const displayName = isMe
    ? (user?.fullName ?? 'Marcus Williams')
    : (matchedThread?.name ?? matchedListing?.sellerName ?? memberId);

  const bio = isMe ? world.bio : 'Community advocate & local food lover.';
  const sellerListings = world.listings.filter((listing) =>
    isMe ? listing.mine || listing.sellerName === displayName : listing.sellerName === displayName || listing.sellerName === memberId,
  );
  const memberEvents = world.events.filter((event) => (isMe ? event.mine || event.host === displayName : event.host === displayName));

  const blocked = !isMe && (world.blockedAuthors ?? []).includes(displayName);
  const posts = useMemo(() => {
    if (!known) return [];
    const visible = visiblePosts(world.posts, world.blockedAuthors, world.reportedPostIds);
    if (isMe) return visible.filter((post) => post.mine || post.authorName === user?.fullName);
    return visible.filter((post) => post.authorName === displayName);
  }, [displayName, isMe, known, user?.fullName, world.blockedAuthors, world.posts, world.reportedPostIds]);

  if (!known) {
    return (
      <Screen>
        <IconButton
          icon="back"
          accessibilityLabel={t('common.back')}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/marketplace'))}
        />
        <ThemedText variant="body">{t('directory.empty')}</ThemedText>
      </Screen>
    );
  }

  return (
    <Screen padded={false} safeTop={false}>
      <View>
        <Image
          source={resolvePhoto('interior')}
          style={{ width: '100%', height: 180, borderBottomLeftRadius: radius.xxl, borderBottomRightRadius: radius.xxl }}
          contentFit="cover"
        />
        <View style={{ position: 'absolute', top: insets.top + 8, left: spacing.md }}>
          <IconButton
            icon="back"
            variant="light"
            accessibilityLabel={t('common.back')}
            onPress={() => router.back()}
          />
        </View>
        <View style={{ position: 'absolute', left: spacing.md, bottom: -36 }}>
          <Avatar
            source={isMe ? user?.avatarUri ?? 'portraitM' : 'portrait'}
            initials={initials(displayName)}
            size={84}
            ring
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.xxl, gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ThemedText variant="title">{displayName}</ThemedText>
            {isMe && user?.verified ? <Icon name="verified" size={20} color={colors.info} /> : null}
          </View>
          <Button
            title={blocked ? t('post.unblock') : following ? t('common.following') : t('common.follow')}
            variant={following || blocked ? 'outline' : 'secondary'}
            onPress={() => {
              if (blocked) {
                confirmAction({
                  title: t('post.unblockTitle', { name: displayName }),
                  message: t('post.unblockBody'),
                  confirmLabel: t('post.unblock'),
                  cancelLabel: t('common.cancel'),
                  onConfirm: () => dispatch(unblockAuthor(displayName)),
                });
                return;
              }
              confirmAction({
                title: following ? t('common.unfollowTitle', { name: displayName }) : t('common.followTitle', { name: displayName }),
                confirmLabel: following ? t('common.following') : t('common.follow'),
                cancelLabel: t('common.cancel'),
                onConfirm: () => dispatch(toggleFollow(routeId)),
              });
            }}
            style={{ alignSelf: 'auto', minHeight: 40, paddingHorizontal: spacing.md }}
          />
        </View>

        <ThemedText variant="body">{bio}</ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: spacing.sm, alignItems: 'center' }}>
          {chapters.map((chapter) => (
            <View
              key={chapter}
              style={{
                backgroundColor: colors.goldSoft,
                borderRadius: radius.full,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              }}>
              <ThemedText variant="label" themeColor="gold">
                {chapter}
              </ThemedText>
            </View>
          ))}
        </ScrollView>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {[
            { value: '47', label: t('profile.posts') },
            { value: '1.2K', label: t('profile.followers') },
            { value: '384', label: t('profile.following') },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: colors.tabBar,
                borderRadius: radius.lg,
                paddingVertical: spacing.md,
                alignItems: 'center',
                gap: 2,
              }}>
              <ThemedText variant="headline" themeColor="textInverse">
                {stat.value}
              </ThemedText>
              <ThemedText variant="caption" themeColor="textInverse">
                {stat.label}
              </ThemedText>
            </View>
          ))}
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
                  {t(`profile.${item}`)}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {tab === 'myPosts'
          ? posts.map((post) => <PostCard key={post.id} post={post} />)
          : null}
        {tab === 'myListings' ? (
          sellerListings.length === 0 ? (
            <ThemedText variant="body">{t('business.emptyListings')}</ThemedText>
          ) : (
            sellerListings.map((listing) => (
              <Pressable
                key={listing.id}
                accessibilityRole="button"
                onPress={() => router.push(`/listing/${listing.id}`)}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: spacing.md,
                }}>
                <ThemedText variant="headline">{listing.title}</ThemedText>
                <ThemedText variant="caption">{listing.sellerName}</ThemedText>
              </Pressable>
            ))
          )
        ) : null}
        {tab === 'myEvents' ? (
          memberEvents.length === 0 ? (
            <ThemedText variant="body">{t('business.emptyEvents')}</ThemedText>
          ) : (
            memberEvents.map((event) => (
              <Pressable
                key={event.id}
                accessibilityRole="button"
                onPress={() => router.push(`/event/${event.id}`)}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: spacing.md,
                  gap: 4,
                }}>
                <ThemedText variant="headline">{event.title}</ThemedText>
                <ThemedText variant="caption">
                  {event.dateLabel} · {event.place}
                </ThemedText>
              </Pressable>
            ))
          )
        ) : null}
      </View>
    </Screen>
  );
}
