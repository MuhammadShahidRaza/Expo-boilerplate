import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Share, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { resolvePhoto } from '@/data/images';
import type { Post } from '@/data/content';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch } from '@/store/hooks';
import { toggleLike, toggleSave } from '@/store/slices/world';
import { radius, spacing } from '@/theme';
import { formatAgo } from '@/utils/time';

export function PostCard({ post }: { post: Post }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  const long = post.body.length > 120;
  const body = expanded || !long ? post.body : `${post.body.slice(0, 120).trim()}...`;

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Avatar source={post.avatar} size={44} online={post.official} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ThemedText variant="headline">{post.authorName}</ThemedText>
            {post.official ? <Icon name="verified" size={16} color={colors.info} /> : null}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Badge label={post.chapter} tone="navy" />
            <ThemedText variant="caption">{formatAgo(post.createdAt, t)}</ThemedText>
          </View>
        </View>
        {post.official ? <Icon name="more" size={18} color={colors.icon} /> : null}
      </View>
      {post.official ? (
        <View style={{ marginTop: spacing.md }}>
          <Badge label={t('home.official')} tone="navy" icon="verified" />
        </View>
      ) : null}
      <ThemedText variant="body" themeColor="text" style={{ marginTop: spacing.md }}>
        {post.official && post.officialTitle ? `${post.officialTitle}: ` : ''}
        {body}{' '}
        {long ? (
          <ThemedText variant="body" themeColor="link" onPress={() => setExpanded((value) => !value)}>
            {expanded ? t('home.seeLess') : t('home.seeMore')}
          </ThemedText>
        ) : null}
      </ThemedText>
      {post.image ? (
        <Image
          source={resolvePhoto(post.image)}
          style={{ width: '100%', height: 190, borderRadius: radius.lg, marginTop: spacing.md }}
          contentFit="cover"
        />
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.md }}>
        <Pressable accessibilityRole="button" onPress={() => dispatch(toggleLike(post.id))} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name={post.liked ? 'heartFill' : 'heart'} size={18} color={post.liked ? colors.error : colors.icon} />
          <ThemedText variant="caption" themeColor="textSecondary">
            {post.likes}
          </ThemedText>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push(`/comments/${post.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="comment" size={18} color={colors.icon} />
          <ThemedText variant="caption">{post.comments.length}</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => Share.share({ message: post.body })}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="share" size={18} color={colors.icon} />
          <ThemedText variant="caption">{post.shares}</ThemedText>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable accessibilityRole="button" accessibilityLabel={t('home.save')} onPress={() => dispatch(toggleSave(post.id))}>
          <Icon name={post.saved ? 'bookmarkFill' : 'bookmark'} size={18} color={post.saved ? colors.error : colors.icon} />
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.push(`/comments/${post.id}`)}>
        <ThemedText variant="caption" style={{ marginTop: spacing.sm }}>
          {t('home.viewComments', { count: post.comments.length })}
        </ThemedText>
      </Pressable>
    </Card>
  );
}
