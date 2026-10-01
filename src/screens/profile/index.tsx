import { useState } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostCard } from '@/components/feed/post-card';
import { PollCard } from '@/components/feed/poll-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { useSession } from '@/context/session-context';
import { chapters } from '@/data/catalog';
import { photos, resolvePhoto } from '@/data/images';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppSelector } from '@/store/hooks';
import { radius, spacing } from '@/theme';
import { money } from '@/utils/time';

type ProfileTab = 'posts' | 'listings' | 'events';

export function ProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, updateProfile } = useSession();
  const { pickImage } = useImagePicker();
  const world = useAppSelector((state) => state.world);
  const [tab, setTab] = useState<ProfileTab>('posts');
  const insets = useSafeAreaInsets();

  async function onPickAvatar() {
    if (!user) return;
    const result = await pickImage();
    if (result.status !== 'ok') return;
    await updateProfile({ ...user, avatarUri: result.uri });
  }

  const bioLines = world.bio.split('\n');
  const primaryBio = bioLines[0] ?? '';
  const caption = bioLines.slice(1).join('\n') || 'Little Haiti proud';
  const postsCount = world.posts.length;

  return (
    <Screen tab padded={false} safeTop={false} contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 0, gap: 0 }}>
      <View>
        <Image source={photos.interior} style={{ width: '100%', height: 180 }} contentFit="cover" />
        <View style={{ position: 'absolute', top: insets.top + 8, right: spacing.md }}>
          <IconButton
            icon="settings"
            variant="light"
            accessibilityLabel={t('common.settings')}
            onPress={() => router.push('/settings')}
          />
        </View>
        <View style={{ paddingHorizontal: spacing.md, marginTop: -40 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('common.choosePhoto')} onPress={() => void onPickAvatar()}>
            <Avatar source={user?.avatarUri || 'portrait'} size={88} ring badgeIcon="camera" />
          </Pressable>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.md, gap: spacing.md, paddingTop: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <ThemedText variant="title" style={{ flex: 1 }}>
            {user?.fullName}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('profile.edit')}
            onPress={() => router.push('/edit-profile')}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
              opacity: pressed ? 0.8 : 1,
            })}>
            <Icon name="edit" size={14} color={colors.text} />
            <ThemedText variant="label">{t('profile.edit')}</ThemedText>
          </Pressable>
        </View>

        <View style={{ gap: spacing.xs }}>
          {primaryBio ? <ThemedText variant="body">{primaryBio}</ThemedText> : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <ThemedText variant="caption">{caption}</ThemedText>
            <Badge label={t('profile.proud')} tone="gold" />
          </View>
        </View>

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
          <Chip label="+1" />
        </ScrollView>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {[
            { value: String(postsCount), label: t('profile.posts') },
            { value: '1.2K', label: t('profile.followers') },
            { value: '384', label: t('profile.following') },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                backgroundColor: colors.tabBar,
                borderRadius: radius.lg,
                paddingVertical: spacing.sm + 2,
                alignItems: 'center',
                gap: 2,
              }}>
              <ThemedText variant="headline" themeColor="textInverse">
                {item.value}
              </ThemedText>
              <ThemedText variant="caption" themeColor="textInverse">
                {item.label}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          {(
            [
              { key: 'posts' as const, label: t('profile.myPosts') },
              { key: 'listings' as const, label: t('profile.myListings') },
              { key: 'events' as const, label: t('profile.myEvents') },
            ] as const
          ).map((item) => {
            const active = tab === item.key;
            return (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setTab(item.key)}
                style={{
                  paddingBottom: spacing.sm,
                  borderBottomWidth: 3,
                  borderBottomColor: active ? colors.primary : 'transparent',
                }}>
                <ThemedText variant="headline" themeColor={active ? 'text' : 'textSecondary'}>
                  {item.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {tab === 'posts' ? (
          <View style={{ gap: spacing.md }}>
            {world.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {world.polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </View>
        ) : null}

        {tab === 'listings' ? (
          <View style={{ gap: spacing.sm }}>
            {world.listings.map((listing) => (
              <Card key={listing.id} onPress={() => router.push(`/listing/${listing.id}`)}>
                <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
                  <Image
                    source={resolvePhoto(listing.image)}
                    style={{ width: 72, height: 72, borderRadius: radius.md }}
                    contentFit="cover"
                  />
                  <View style={{ flex: 1, gap: 4 }}>
                    <ThemedText variant="headline">{listing.title}</ThemedText>
                    <ThemedText variant="headline" themeColor="link">
                      {money(listing.price)}
                    </ThemedText>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : null}

        {tab === 'events' ? (
          <View style={{ gap: spacing.sm }}>
            {world.events.map((event) => (
              <Card key={event.id} onPress={() => router.push(`/event/${event.id}`)}>
                <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: radius.md,
                      backgroundColor: colors.goldSoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ThemedText variant="headline" themeColor="gold">
                      {event.day}
                    </ThemedText>
                    <ThemedText variant="caption" themeColor="gold">
                      {event.month}
                    </ThemedText>
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <ThemedText variant="headline">{event.title}</ThemedText>
                    <ThemedText variant="caption">
                      {event.place} · {event.time}
                    </ThemedText>
                  </View>
                  <Icon name="chevronRight" size={18} color={colors.textDisabled} />
                </View>
              </Card>
            ))}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
