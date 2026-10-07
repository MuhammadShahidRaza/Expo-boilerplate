import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { SearchField } from '@/components/ui/search-field';
import { Sheet } from '@/components/ui/sheet';
import { VideoPreview } from '@/components/ui/video-preview';
import { resolvePhoto } from '@/data/images';
import type { Post } from '@/data/content';
import { useSession } from '@/context/session-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { blockAuthor, deletePost, reportPost, sendMessage, sharePost, toggleLike, toggleSave } from '@/store/slices/world';
import { radius, spacing } from '@/theme';
import { confirmAction } from '@/utils/confirm';
import { stableList } from '@/utils/feed';
import { formatAgo } from '@/utils/time';

const reportReasons = ['reportSpam', 'reportHarassment', 'reportFalse', 'reportOther'] as const;

export function PostCard({ post }: { post: Post }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const threads = useAppSelector((state) => state.world.threads);
  const blockedAuthors = useAppSelector((state) => stableList(state.world.blockedAuthors));
  const [expanded, setExpanded] = useState(false);
  const [sheet, setSheet] = useState<'actions' | 'share' | 'report' | null>(null);
  const [shareQuery, setShareQuery] = useState('');
  const mine = Boolean(post.mine || (user?.fullName && post.authorName === user.fullName));
  const chats = useMemo(() => {
    const q = shareQuery.trim().toLowerCase();
    return threads.filter((thread) => !blockedAuthors.includes(thread.name) && (!q || thread.name.toLowerCase().includes(q)));
  }, [blockedAuthors, shareQuery, threads]);
  const long = post.body.length > 120;
  const body = expanded || !long ? post.body : `${post.body.slice(0, 120).trim()}...`;

  function sendTo(threadId: string) {
    dispatch(
      sendMessage({
        threadId,
        post: {
          authorName: post.authorName,
          avatar: post.avatar,
          chapter: post.chapter,
          body: post.body,
          image: post.image,
          video: post.video,
          place: post.place,
          postType: post.postType,
        },
      }),
    );
    dispatch(sharePost(post.id));
    setSheet(null);
    router.push(`/conversation/${threadId}`);
  }

  function askDelete() {
    setSheet(null);
    confirmAction({
      title: t('post.deleteTitle'),
      message: t('post.deleteBody'),
      confirmLabel: t('post.delete'),
      cancelLabel: t('common.cancel'),
      onConfirm: () => dispatch(deletePost(post.id)),
    });
  }

  function askBlock() {
    setSheet(null);
    confirmAction({
      title: t('post.blockTitle', { name: post.authorName }),
      message: t('post.blockBody'),
      confirmLabel: t('post.block', { name: post.authorName }),
      cancelLabel: t('common.cancel'),
      onConfirm: () => dispatch(blockAuthor(post.authorName)),
    });
  }

  function askReport(reason: (typeof reportReasons)[number]) {
    setSheet(null);
    confirmAction({
      title: t('post.report'),
      message: t('post.reportConfirm', { reason: t(`post.${reason}`) }),
      confirmLabel: t('post.report'),
      cancelLabel: t('common.cancel'),
      onConfirm: () =>
        dispatch(
          reportPost({
            postId: post.id,
            reason,
            authorName: post.authorName,
            body: post.body,
          }),
        ),
    });
  }

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Avatar source={post.avatar} size={44} online={post.official} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ThemedText variant="headline">{post.authorName}</ThemedText>
            {post.official || (mine && user?.verified) ? <Icon name="verified" size={16} color={colors.info} /> : null}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Badge label={post.chapter} tone="navy" />
            <ThemedText variant="caption">{formatAgo(post.createdAt, t)}</ThemedText>
          </View>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={t('post.more')} onPress={() => setSheet('actions')}>
          <Icon name="more" size={18} color={colors.icon} />
        </Pressable>
      </View>
      {post.official ? (
        <View style={{ marginTop: spacing.md }}>
          <Badge label={t('home.official')} tone="navy" icon="verified" />
        </View>
      ) : post.postType ? (
        <View style={{ marginTop: spacing.md }}>
          <Badge label={t(`create.types.${post.postType}`)} tone="navy" />
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
      {post.place ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm }}>
          <Icon name="pin" size={14} color={colors.info} />
          <ThemedText variant="caption" themeColor="text">
            {post.place}
          </ThemedText>
        </View>
      ) : null}
      {post.image ? (
        <Image
          source={resolvePhoto(post.image)}
          style={{ width: '100%', height: 190, borderRadius: radius.lg, marginTop: spacing.md }}
          contentFit="cover"
        />
      ) : null}
      {post.video ? (
        <View style={{ marginTop: spacing.md }}>
          <VideoPreview uri={post.video} />
        </View>
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
          accessibilityLabel={t('post.shareTitle')}
          onPress={() => setSheet('share')}
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
      <Sheet visible={sheet === 'actions'} title={t('post.more')} onClose={() => setSheet(null)}>
        {mine ? (
          <Pressable accessibilityRole="button" onPress={askDelete} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 }}>
            <Icon name="trash" size={18} color={colors.error} />
            <ThemedText variant="headline" themeColor="error">
              {t('post.delete')}
            </ThemedText>
          </Pressable>
        ) : (
          <View style={{ gap: spacing.sm }}>
            <Pressable accessibilityRole="button" onPress={() => setSheet('report')} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 }}>
              <Icon name="flag" size={18} color={colors.text} />
              <ThemedText variant="headline">{t('post.report')}</ThemedText>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={askBlock} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 }}>
              <Icon name="block" size={18} color={colors.error} />
              <ThemedText variant="headline" themeColor="error">
                {t('post.block', { name: post.authorName })}
              </ThemedText>
            </Pressable>
          </View>
        )}
      </Sheet>
      <Sheet visible={sheet === 'report'} title={t('post.reportTitle')} onClose={() => setSheet(null)}>
        <View style={{ gap: spacing.sm }}>
          {reportReasons.map((reason) => (
            <Pressable
              key={reason}
              accessibilityRole="button"
              onPress={() => askReport(reason)}
              style={{ minHeight: 44, justifyContent: 'center' }}>
              <ThemedText variant="headline">{t(`post.${reason}`)}</ThemedText>
            </Pressable>
          ))}
        </View>
      </Sheet>
      <Sheet visible={sheet === 'share'} title={t('post.shareTitle')} onClose={() => setSheet(null)}>
        <SearchField value={shareQuery} onChangeText={setShareQuery} placeholder={t('post.shareSearch')} />
        {chats.length === 0 ? (
          <ThemedText variant="body">{t('post.shareEmpty')}</ThemedText>
        ) : (
          chats.map((thread) => (
            <Pressable
              key={thread.id}
              accessibilityRole="button"
              onPress={() => sendTo(thread.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 48 }}>
              <Avatar source={thread.avatar} size={36} />
              <ThemedText variant="headline" style={{ flex: 1 }}>
                {thread.name}
              </ThemedText>
              <Icon name="send" size={16} color={colors.info} />
            </Pressable>
          ))
        )}
      </Sheet>
    </Card>
  );
}
