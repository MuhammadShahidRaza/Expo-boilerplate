import { useState } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/context/session-context';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { radius, spacing } from '@/theme';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function EditProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, updateProfile } = useSession();
  const { pickImage } = useImagePicker();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarUri, setAvatarUri] = useState(user?.avatarUri ?? null);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [photoError, setPhotoError] = useState('');

  async function onPickPhoto() {
    setPhotoError('');
    const result = await pickImage();
    if (result.status === 'ok') setAvatarUri(result.uri);
    if (result.status === 'denied') setPhotoError(t('common.permissionDenied'));
  }

  async function onSubmit() {
    const nextNameError = fullName.trim() ? '' : t('common.nameRequired');
    const nextEmailError = !email.trim()
      ? t('common.emailRequired')
      : isEmail(email)
        ? ''
        : t('common.invalidEmail');
    setNameError(nextNameError);
    setEmailError(nextEmailError);
    if (nextNameError || nextEmailError) return;
    await updateProfile({ fullName, email, avatarUri });
    router.back();
  }

  return (
    <Screen>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.choosePhoto')}
        onPress={() => void onPickPhoto()}
        style={{ alignSelf: 'flex-start', alignItems: 'center', gap: spacing.xs }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: radius.full,
            overflow: 'hidden',
            backgroundColor: colors.backgroundElement,
          }}>
          {avatarUri ? <Image source={{ uri: avatarUri }} style={{ width: 72, height: 72 }} /> : null}
        </View>
        <ThemedText variant="caption">{t('common.choosePhoto')}</ThemedText>
      </Pressable>
      {photoError ? (
        <ThemedText variant="caption" themeColor="error">
          {photoError}
        </ThemedText>
      ) : null}
      <TextField
        label={t('common.fullName')}
        value={fullName}
        onChangeText={setFullName}
        autoComplete="name"
        error={nameError}
      />
      <TextField
        label={t('common.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        error={emailError}
      />
      <Button title={t('common.save')} onPress={() => void onSubmit()} />
    </Screen>
  );
}
