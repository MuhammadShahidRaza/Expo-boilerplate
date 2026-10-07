import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Button } from '@/components/button';
import { PostCard } from '@/components/feed/post-card';
import { PollCard } from '@/components/feed/poll-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CodeBadge } from '@/components/ui/code-badge';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { SearchField } from '@/components/ui/search-field';
import { SectionHeader } from '@/components/ui/section-header';
import { SelectRow } from '@/components/ui/select-row';
import { Sheet } from '@/components/ui/sheet';
import { useSession } from '@/context/session-context';
import { countries } from '@/data/catalog';
import { businesses } from '@/data/content';
import { resolvePhoto } from '@/data/images';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addCommunity, removeCommunity, setActiveCommunity } from '@/store/slices/world';
import { radius, spacing } from '@/theme';
import { visiblePosts } from '@/utils/feed';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

const quickActions: {
  key: 'professional' | 'local' | 'jobs' | 'more';
  icon: IconName;
  bg: 'tintBlueSoft' | 'tintGoldSoft' | 'tintRedSoft' | 'chip';
  fg: 'tintBlue' | 'tintGold' | 'tintRed' | 'icon';
  href: '/directory' | '/jobs' | '/services';
}[] = [
  { key: 'professional', icon: 'wrench', bg: 'tintBlueSoft', fg: 'tintBlue', href: '/directory' },
  { key: 'local', icon: 'store', bg: 'tintGoldSoft', fg: 'tintGold', href: '/directory' },
  { key: 'jobs', icon: 'briefcase', bg: 'tintRedSoft', fg: 'tintRed', href: '/jobs' },
  { key: 'more', icon: 'grid', bg: 'chip', fg: 'icon', href: '/services' },
];

export function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const world = useAppSelector((state) => state.world);
  const [query, setQuery] = useState('');
  const [communitiesOpen, setCommunitiesOpen] = useState(false);
  const [addQuery, setAddQuery] = useState('');

  const active = world.communities.find((item) => item.active);
  const unread = world.notices.filter((item) => item.unread).length;
  const place = active?.state ?? active?.name ?? world.stateName ?? 'United States';
  const featured = businesses.filter((item) => item.tier === 'platinum' || item.sponsored);
  const addable = useMemo(() => {
    const existing = new Set(world.communities.map((item) => item.code));
    const list = countries.filter((country) => !existing.has(country.code));
    const q = addQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (country) => country.name.toLowerCase().includes(q) || country.code.toLowerCase().includes(q),
    );
  }, [addQuery, world.communities]);

  const avatarSource = user?.avatarUri ?? null;
  const avatarInitials = initials(user?.fullName ?? 'MW');

  return (
    <Screen tab>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Avatar source={avatarSource} initials={avatarInitials} size={48} />
        <View style={{ flex: 1, gap: 2 }}>
          <ThemedText variant="caption" numberOfLines={1}>
            {t('home.yourCommunity')} · {place}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => setCommunitiesOpen(true)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <CodeBadge code={active?.code ?? 'US'} active />
            <ThemedText variant="headline" themeColor="text" numberOfLines={1} style={{ flex: 1 }}>
              {world.activeChapter}
            </ThemedText>
            <Icon name="chevronDown" size={16} color={colors.icon} />
          </Pressable>
        </View>
        <IconButton
          icon="bell"
          variant="gold"
          badge={unread || undefined}
          accessibilityLabel={t('common.notifications')}
          onPress={() => router.push('/notifications')}
        />
      </View>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={t('home.search')}
        returnKeyType="search"
        onSubmitEditing={() =>
          router.push({ pathname: '/directory', params: { q: query.trim() } })
        }
      />

      <View
        style={{
          backgroundColor: colors.tabBar,
          borderRadius: 22,
          padding: spacing.md,
          gap: spacing.md,
          overflow: 'hidden',
        }}>
        <ThemedText variant="caption" themeColor="gold" style={{ letterSpacing: 1 }}>
          {t('home.heroKicker')}
        </ThemedText>
        <ThemedText variant="title" themeColor="textInverse">
          {t('home.heroTitle')}
        </ThemedText>
        <Button title={t('home.explore')} variant="gold" onPress={() => router.push('/services')} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
        {quickActions.map((action) => (
          <Pressable
            key={action.key}
            accessibilityRole="button"
            onPress={() => router.push(action.href)}
            style={{ flex: 1, alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: radius.lg,
                backgroundColor: colors[action.bg],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name={action.icon} size={22} color={colors[action.fg]} />
            </View>
            <ThemedText variant="caption" themeColor="text" style={{ textAlign: 'center' }}>
              {t(`home.${action.key}`)}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Avatar source={avatarSource} initials={avatarInitials} size={40} />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/create-post')}
            style={{
              flex: 1,
              backgroundColor: colors.search,
              borderRadius: radius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm + 2,
            }}>
            <ThemedText variant="subhead">{t('home.composer')}</ThemedText>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: spacing.md,
            paddingTop: spacing.sm,
            borderTopWidth: 1,
            borderTopColor: colors.divider,
          }}>
          {(
            [
              { label: t('home.media'), href: '/create-post' as const },
              { label: t('home.poll'), href: '/create-poll' as const },
              { label: t('home.post'), href: '/create-post' as const },
            ] as const
          ).map((item) => (
            <Pressable key={item.label} accessibilityRole="button" onPress={() => router.push(item.href)}>
              <ThemedText variant="label" themeColor="text">
                {item.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </Card>

      <SectionHeader
        title={t('home.featured')}
        action={t('common.seeAll')}
        onAction={() => router.push('/directory')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ gap: spacing.sm, alignItems: 'center' }}>
        {featured.map((business) => (
          <Pressable
            key={business.id}
            accessibilityRole="button"
            onPress={() => router.push(`/business/${business.id}`)}
            style={{
              width: 180,
              backgroundColor: colors.card,
              borderRadius: radius.xl,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: 'hidden',
            }}>
            <Image
              source={resolvePhoto(business.image)}
              style={{ width: '100%', height: 110 }}
              contentFit="cover"
            />
            <View style={{ padding: spacing.sm, gap: 4 }}>
              <Badge label={business.sponsored ? 'Sponsored' : business.tier[0].toUpperCase() + business.tier.slice(1)} tone="gold" />
              <ThemedText variant="headline" numberOfLines={1}>
                {business.name}
              </ThemedText>
              <ThemedText variant="caption" numberOfLines={1}>
                {business.category}
                {business.rating != null ? ` · ${business.rating}` : ''}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeader
        title={t('home.upcoming')}
        action={t('common.seeAll')}
        onAction={() => router.push('/events')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ gap: spacing.sm, alignItems: 'center' }}>
        {world.events.map((event) => (
          <Pressable
            key={event.id}
            accessibilityRole="button"
            onPress={() => router.push(`/event/${event.id}`)}
            style={{
              width: 220,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              backgroundColor: colors.card,
              borderRadius: radius.xl,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.sm,
            }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: radius.md,
                backgroundColor: colors.gold,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ThemedText variant="headline" themeColor="onGold">
                {event.day}
              </ThemedText>
              <ThemedText variant="caption" themeColor="onGold">
                {event.month}
              </ThemedText>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText variant="headline" numberOfLines={2}>
                {event.title}
              </ThemedText>
              <ThemedText variant="caption" numberOfLines={1}>
                {event.place}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {visiblePosts(world.posts, world.blockedAuthors, world.reportedPostIds).map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {world.polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}

      <Sheet
        visible={communitiesOpen}
        title={t('home.communitiesTitle')}
        subtitle={t('home.communitiesBody')}
        onClose={() => setCommunitiesOpen(false)}>
        <View style={{ gap: spacing.sm }}>
          {world.communities.map((community) =>
            community.active ? (
              <SelectRow
                key={community.id}
                title={`${community.name}${community.state ? ` · ${community.state}` : ''}`}
                subtitle={t('home.viewing')}
                selected
                leading={<CodeBadge code={community.code} active />}
                trailing="check"
                onPress={() => dispatch(setActiveCommunity(community.id))}
              />
            ) : (
              <View
                key={community.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  backgroundColor: colors.card,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: spacing.sm + 4,
                }}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => dispatch(setActiveCommunity(community.id))}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <CodeBadge code={community.code} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText variant="headline" themeColor="text">
                      {`${community.name}${community.state ? ` · ${community.state}` : ''}`}
                    </ThemedText>
                    <ThemedText variant="caption">{t('setup.growing')}</ThemedText>
                  </View>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => dispatch(removeCommunity(community.id))}
                  hitSlop={8}>
                  <ThemedText variant="label" themeColor="error">
                    {t('common.remove')}
                  </ThemedText>
                </Pressable>
              </View>
            ),
          )}
        </View>
        <ThemedText variant="headline">{t('home.addCommunity')}</ThemedText>
        <SearchField value={addQuery} onChangeText={setAddQuery} placeholder={t('home.searchAdd')} />
        <View style={{ gap: spacing.sm, maxHeight: 220 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: spacing.sm }}>
              {addable.map((country) => (
                <SelectRow
                  key={country.code}
                  title={country.name}
                  leading={<CodeBadge code={country.code} />}
                  trailing="none"
                  onPress={() => {
                    dispatch(addCommunity(country.code));
                    setAddQuery('');
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </View>
        <Pressable accessibilityRole="button" onPress={() => setAddQuery('')}>
          <ThemedText variant="headline" themeColor="text" style={{ textAlign: 'center' }}>
            {t('home.browseAll')}
          </ThemedText>
        </Pressable>
      </Sheet>
    </Screen>
  );
}
