import { useState } from 'react';
import { router } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useSession } from '@/context/session-context';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBio } from '@/store/slices/world';
import { spacing } from '@/theme';

export function EditProfileScreen() {
  const { t } = useTranslation();
  const { user, updateProfile } = useSession();
  const { pickImage } = useImagePicker();
  const dispatch = useAppDispatch();
  const storedBio = useAppSelector((state) => state.world.bio);
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [bio, setBioValue] = useState(storedBio);
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUri ?? null);
  const [nameError, setNameError] = useState('');

  async function onPickPhoto() {
    const result = await pickImage();
    if (result.status === 'ok') setAvatarUri(result.uri);
  }

  async function onSave() {
    if (fullName.trim().length < 2) {
      setNameError(t('validation.nameRequired'));
      return;
    }
    setNameError('');
    await updateProfile({
      fullName: fullName.trim(),
      email: user?.email ?? '',
      avatarUri,
    });
    dispatch(setBio(bio));
    Alert.alert(t('common.profileUpdated'));
    router.back();
  }

  return (
    <Screen keyboard>
      <ScreenHeader
        title={t('common.editProfile')}
        right={
          <View style={{ width: 96 }}>
            <Button
              title={t('common.save')}
              variant="gold"
              onPress={() => void onSave()}
              style={{ alignSelf: 'flex-end', minHeight: 40, paddingHorizontal: 16, width: undefined }}
            />
          </View>
        }
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.choosePhoto')}
        onPress={() => void onPickPhoto()}
        style={{ alignSelf: 'center', marginVertical: spacing.sm }}>
        <Avatar source={avatarUri || 'portrait'} size={104} badgeIcon="camera" ring />
      </Pressable>

      <TextField
        label={t('common.fullName')}
        value={fullName}
        onChangeText={setFullName}
        autoComplete="name"
        error={nameError}
      />
      <TextField
        label={t('profile.bioLabel')}
        value={bio}
        onChangeText={setBioValue}
        multiline
      />
    </Screen>
  );
}
