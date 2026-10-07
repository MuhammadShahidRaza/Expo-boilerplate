import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useSession } from '@/context/session-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addComment, deleteComment, preparePoll } from '@/store/slices/world';
import { spacing } from '@/theme';
import { confirmAction } from '@/utils/confirm';
import { formatAgo } from '@/utils/time';

export function CommentsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = useAppSelector((state) => state.world.posts.find((item) => item.id === id));
  const poll = useAppSelector((state) => state.world.polls.find((item) => item.id === id));
  const comments = post?.comments ?? poll?.comments ?? [];
  const [body, setBody] = useState('');

  useEffect(() => {
    if (poll && !Array.isArray(poll.comments)) dispatch(preparePoll(poll.id));
  }, [dispatch, poll]);

  function send() {
    if ((!post && !poll) || !body.trim() || !user || !id) return;
    dispatch(
      addComment({
        postId: id,
        author: user.fullName,
        body: body.trim(),
        avatar: 'portrait',
      }),
    );
    setBody('');
  }

  function askDelete(commentId: string) {
    if (!id) return;
    confirmAction({
      title: t('comments.deleteTitle'),
      message: t('comments.deleteBody'),
      confirmLabel: t('comments.delete'),
      cancelLabel: t('common.cancel'),
      onConfirm: () => dispatch(deleteComment({ postId: id, commentId })),
    });
  }

  return (
    <Screen
      keyboard
      footer={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <TextField
              value={body}
              onChangeText={setBody}
              placeholder={t('comments.placeholder')}
              returnKeyType="send"
              onSubmitEditing={send}
            />
          </View>
          <IconButton
            icon="send"
            variant="gold"
            accessibilityLabel={t('common.post')}
            onPress={send}
          />
        </View>
      }>
      <ScreenHeader title={t('comments.title')} />
      {comments.length === 0 ? (
        <ThemedText variant="body">{t('comments.empty')}</ThemedText>
      ) : (
        comments.map((comment) => {
          const mine = Boolean(comment.mine || (user?.fullName && comment.author === user.fullName));
          return (
            <View key={comment.id} style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Avatar source={comment.avatar} size={40} />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <ThemedText variant="headline" style={{ flex: 1 }}>
                    {comment.author}
                  </ThemedText>
                  <ThemedText variant="caption">{formatAgo(comment.createdAt, t)}</ThemedText>
                  {mine ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t('comments.delete')}
                      onPress={() => askDelete(comment.id)}
                      hitSlop={8}>
                      <Icon name="trash" size={16} color={colors.error} />
                    </Pressable>
                  ) : null}
                </View>
                <ThemedText variant="body">{comment.body}</ThemedText>
              </View>
            </View>
          );
        })
      )}
    </Screen>
  );
}
