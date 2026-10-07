import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/chip';
import { SearchField } from '@/components/ui/search-field';
import type { Thread } from '@/data/content';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { markThreadRead } from '@/store/slices/world';
import { radius, spacing } from '@/theme';
import { stableList } from '@/utils/feed';
import { formatAgo } from '@/utils/time';

type Filter = 'all' | Thread['kind'];

export function ChatScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const threads = useAppSelector((state) => state.world.threads);
  const blockedAuthors = useAppSelector((state) => stableList(state.world.blockedAuthors));
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t('common.all') },
    { id: 'user', label: t('chat.users') },
    { id: 'business', label: t('chat.businesses') },
    { id: 'organization', label: t('chat.organization') },
  ];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return threads.filter((thread) => {
      if (blockedAuthors.includes(thread.name)) return false;
      if (filter !== 'all' && thread.kind !== filter) return false;
      if (!q) return true;
      const latest = thread.messages[thread.messages.length - 1];
      const last = latest?.post?.body ?? latest?.text ?? '';
      return thread.name.toLowerCase().includes(q) || last.toLowerCase().includes(q);
    });
  }, [blockedAuthors, filter, query, threads]);

  return (
    <Screen tab scroll={false} padded={false}>
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: spacing.md, flex: 1 }}>
        <View style={{ alignItems: 'center', minHeight: 44, justifyContent: 'center' }}>
          <ThemedText variant="headline">{t('chat.title')}</ThemedText>
        </View>

        <SearchField value={query} onChangeText={setQuery} placeholder={t('chat.search')} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: spacing.sm, alignItems: 'center' }}>
          {filters.map((item) => (
            <Chip
              key={item.id}
              label={item.label}
              selected={filter === item.id}
              tone={filter === item.id ? 'gold' : 'neutral'}
              onPress={() => setFilter(item.id)}
            />
          ))}
        </ScrollView>

        {visible.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingBottom: 80 }}>
            <ThemedText variant="headline">{t('chat.empty')}</ThemedText>
            <ThemedText variant="body" themeColor="textSecondary" style={{ textAlign: 'center' }}>
              {t('chat.emptyHint')}
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={visible}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 160 }}
            renderItem={({ item }) => {
              const last = item.messages[item.messages.length - 1];
              return (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    dispatch(markThreadRead(item.id));
                    router.push(`/conversation/${item.id}`);
                  }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.md,
                    paddingVertical: spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.divider,
                    opacity: pressed ? 0.75 : 1,
                  })}>
                  <Avatar source={item.avatar} size={52} online={item.online} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <ThemedText variant="headline" numberOfLines={1}>
                      {item.name}
                    </ThemedText>
                    <ThemedText variant="subhead" themeColor="textSecondary" numberOfLines={1}>
                      {last?.post?.body || (last?.audioUri && !last.text ? t('chat.voice') : (last?.text ?? ''))}
                    </ThemedText>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 8, minWidth: 36 }}>
                    <ThemedText variant="caption">{last ? formatAgo(last.createdAt, t) : ''}</ThemedText>
                    {item.unread > 0 ? (
                      <View
                        style={{
                          minWidth: 22,
                          height: 22,
                          borderRadius: radius.full,
                          backgroundColor: colors.gold,
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingHorizontal: 6,
                        }}>
                        <ThemedText variant="caption" themeColor="onGold" style={{ fontSize: 11 }}>
                          {item.unread}
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </Screen>
  );
}
