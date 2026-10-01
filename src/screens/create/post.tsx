import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { useSession } from '@/context/session-context';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addPost } from '@/store/slices/world';
import { radius, spacing } from '@/theme';

export function CreatePostScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const chapter = useAppSelector((state) => state.world.activeChapter);
  const { pickImage } = useImagePicker();
  const [body, setBody] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const chooseImage = async () => {
    const result = await pickImage();
    if (result.status === 'ok') setImageUri(result.uri);
  };

  const onPost = () => {
    const value = body.trim();
    if (!value) return;
    dispatch(
      addPost({
        author: user?.fullName ?? '',
        body: value,
        chapter,
        avatar: 'portraitM',
        image: imageUri ?? undefined,
      }),
    );
    router.back();
  };

  return (
    <Screen keyboard>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <IconButton icon="close" variant="ghost" accessibilityLabel={t('common.close')} onPress={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ThemedText variant="headline">{t('create.postTitle')}</ThemedText>
        </View>
        <Button title={t('common.post')} variant="gold" disabled={!body.trim()} onPress={onPost} style={{ minHeight: 40, alignSelf: 'auto', paddingHorizontal: spacing.md }} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Avatar source={user?.avatarUri ?? 'portraitM'} size={48} />
        <View style={{ flex: 1, gap: spacing.sm }}>
          <ThemedText variant="headline">{user?.fullName ?? ''}</ThemedText>
          <Chip label={chapter} tone="gold" />
        </View>
      </View>

      <TextField value={body} onChangeText={setBody} placeholder={t('create.postPlaceholder')} multiline maxLength={500} />
      <ThemedText variant="caption" style={{ textAlign: 'right' }}>
        {body.length}/500
      </ThemedText>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 180, borderRadius: radius.lg }} contentFit="cover" />
      ) : null}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider }}>
        <Icon name="globe" size={16} color={colors.icon} />
        <ThemedText variant="subhead">{t('create.visible', { chapter })}</ThemedText>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.lg, paddingTop: spacing.sm }}>
        <Pressable accessibilityRole="button" onPress={chooseImage}>
          <Icon name="image" size={22} color={colors.info} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={chooseImage}>
          <Icon name="camera" size={22} color={colors.info} />
        </Pressable>
        <Icon name="video" size={22} color={colors.info} />
        <Icon name="pin" size={22} color={colors.info} />
        <Icon name="smile" size={22} color={colors.info} />
      </View>
    </Screen>
  );
}
