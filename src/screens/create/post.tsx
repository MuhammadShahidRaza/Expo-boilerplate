import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
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
import { LocationField } from '@/components/ui/location-field';
import { SearchField } from '@/components/ui/search-field';
import { VideoPreview } from '@/components/ui/video-preview';
import { useSession } from '@/context/session-context';
import { postTypes } from '@/data/catalog';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addPost } from '@/store/slices/world';
import { radius, spacing } from '@/theme';

const EMOJIS = ['😀', '😂', '❤️', '👍', '🙏', '🎉', '🔥', '✨', '👏', '💯', '🇭🇹', '🙌'];

export function CreatePostScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const chapter = useAppSelector((state) => state.world.activeChapter);
  const { pickImage, takePhoto, pickVideo } = useImagePicker();
  const [body, setBody] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [place, setPlace] = useState('');
  const [showPlace, setShowPlace] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [postType, setPostType] = useState<string | null>(null);
  const [typeQuery, setTypeQuery] = useState('');
  const visibleTypes = useMemo(() => {
    const q = typeQuery.trim().toLowerCase();
    return postTypes.filter((id) => !q || t(`create.types.${id}`).toLowerCase().includes(q));
  }, [t, typeQuery]);

  const attachImage = async (source: 'library' | 'camera') => {
    const result = source === 'camera' ? await takePhoto() : await pickImage();
    if (result.status === 'ok') {
      setImageUri(result.uri);
      return;
    }
    if (result.status === 'unavailable') {
      const library = await pickImage();
      if (library.status === 'ok') setImageUri(library.uri);
      return;
    }
    if (result.status === 'denied') Alert.alert(t('common.permissionDenied'));
  };

  const attachVideo = async () => {
    const result = await pickVideo();
    if (result.status === 'ok') setVideoUri(result.uri);
    if (result.status === 'denied') Alert.alert(t('common.permissionDenied'));
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
        video: videoUri ?? undefined,
        place: place.trim() || undefined,
        postType: postType ?? undefined,
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

      <View style={{ gap: spacing.sm }}>
        <ThemedText variant="label">{t('create.postType')}</ThemedText>
        <ThemedText variant="caption">{t('create.postTypeHint')}</ThemedText>
        <SearchField value={typeQuery} onChangeText={setTypeQuery} placeholder={t('create.postTypeSearch')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: spacing.sm, alignItems: 'center' }}>
          {visibleTypes.map((id) => (
            <Chip
              key={id}
              label={t(`create.types.${id}`)}
              selected={postType === id}
              onPress={() => setPostType((current) => (current === id ? null : id))}
            />
          ))}
        </ScrollView>
      </View>

      <TextField value={body} onChangeText={setBody} placeholder={t('create.postPlaceholder')} multiline maxLength={500} />
      <ThemedText variant="caption" style={{ textAlign: 'right' }}>
        {body.length}/500
      </ThemedText>

      {imageUri ? (
        <View>
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: 180, borderRadius: radius.lg }} contentFit="cover" />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            onPress={() => setImageUri(null)}
            style={{
              position: 'absolute',
              top: spacing.sm,
              right: spacing.sm,
              width: 28,
              height: 28,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="close" size={18} color={colors.textInverse} />
          </Pressable>
        </View>
      ) : null}
      {videoUri ? (
        <View style={{ gap: spacing.sm }}>
          <VideoPreview uri={videoUri} />
          <Pressable accessibilityRole="button" onPress={() => setVideoUri(null)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="close" size={14} color={colors.icon} />
            <ThemedText variant="caption">{t('create.video')}</ThemedText>
          </Pressable>
        </View>
      ) : null}
      {showPlace ? <LocationField value={place} onChangeText={setPlace} placeholder={t('common.location')} /> : null}
      {showEmoji ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {EMOJIS.map((emoji) => (
            <Pressable
              key={emoji}
              accessibilityRole="button"
              accessibilityLabel={emoji}
              onPress={() => setBody((current) => `${current}${emoji}`)}
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.md,
                backgroundColor: colors.backgroundElement,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ThemedText variant="body">{emoji}</ThemedText>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider }}>
        <Icon name="globe" size={16} color={colors.icon} />
        <ThemedText variant="subhead">{t('create.visible', { chapter })}</ThemedText>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.lg, paddingTop: spacing.sm }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('create.addImage')} onPress={() => attachImage('library')}>
          <Icon name="image" size={22} color={imageUri ? colors.tintBlue : colors.info} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.choosePhoto')} onPress={() => attachImage('camera')}>
          <Icon name="camera" size={22} color={colors.info} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t('create.video')} onPress={attachVideo}>
          <Icon name="video" size={22} color={videoUri ? colors.tintBlue : colors.info} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.location')} onPress={() => setShowPlace((open) => !open)}>
          <Icon name="pin" size={22} color={place.trim() || showPlace ? colors.tintBlue : colors.info} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t('create.emoji')} onPress={() => setShowEmoji((open) => !open)}>
          <Icon name="smile" size={22} color={showEmoji ? colors.tintBlue : colors.info} />
        </Pressable>
      </View>
    </Screen>
  );
}
