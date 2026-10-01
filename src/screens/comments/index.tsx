import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useSession } from '@/context/session-context';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addComment } from '@/store/slices/world';
import { spacing } from '@/theme';
import { formatAgo } from '@/utils/time';

export function CommentsScreen() {
  const { t } = useTranslation();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = useAppSelector((state) => state.world.posts.find((item) => item.id === id));
  const [body, setBody] = useState('');

  function send() {
    if (!post || !body.trim() || !user) return;
    dispatch(
      addComment({
        postId: post.id,
        author: user.fullName,
        body: body.trim(),
        avatar: 'portrait',
      }),
    );
    setBody('');
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
      {!post || post.comments.length === 0 ? (
        <ThemedText variant="body">{t('comments.empty')}</ThemedText>
      ) : (
        post.comments.map((comment) => (
          <View key={comment.id} style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Avatar source={comment.avatar} size={40} />
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <ThemedText variant="headline">{comment.author}</ThemedText>
                <ThemedText variant="caption">{formatAgo(comment.createdAt, t)}</ThemedText>
              </View>
              <ThemedText variant="body">{comment.body}</ThemedText>
            </View>
          </View>
        ))
      )}
    </Screen>
  );
}
