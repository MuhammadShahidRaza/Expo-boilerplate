import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useSession } from '@/context/session-context';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import type { IdentityDocuments } from '@/store/slices/user';
import { radius, spacing } from '@/theme';
import { validateIdentity } from '@/validation';

type DocKey = 'nic' | 'ssn' | 'passport' | 'license';

const fields: { key: DocKey; label: 'verify.nic' | 'verify.ssn' | 'verify.passport' | 'verify.license'; placeholder: 'verify.nicPlaceholder' | 'verify.ssnPlaceholder' | 'verify.passportPlaceholder' | 'verify.licensePlaceholder'; secure?: boolean }[] = [
  { key: 'nic', label: 'verify.nic', placeholder: 'verify.nicPlaceholder' },
  { key: 'ssn', label: 'verify.ssn', placeholder: 'verify.ssnPlaceholder', secure: true },
  { key: 'passport', label: 'verify.passport', placeholder: 'verify.passportPlaceholder' },
  { key: 'license', label: 'verify.license', placeholder: 'verify.licensePlaceholder' },
];

export function IdentityScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, updateProfile } = useSession();
  const { pickImage } = useImagePicker();
  const saved = user?.documents;
  const [values, setValues] = useState({
    nic: saved?.nic ?? '',
    ssn: '',
    passport: saved?.passport ?? '',
    license: saved?.license ?? '',
  });
  const [photos, setPhotos] = useState<IdentityDocuments['photos']>(saved?.photos ?? {});
  const [errors, setErrors] = useState<Partial<Record<DocKey, string>>>({});

  async function onPhoto(key: DocKey) {
    const result = await pickImage();
    if (result.status === 'denied') {
      Alert.alert(t('common.appName'), t('common.permissionDenied'));
      return;
    }
    if (result.status !== 'ok') return;
    setPhotos((current) => ({ ...current, [key]: result.uri }));
  }

  async function onSubmit() {
    if (!user) return;
    const ssn = values.ssn.trim() || saved?.ssn || '';
    const nextErrors = validateIdentity({ ...values, ssn }, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await updateProfile({
      ...user,
      verified: true,
      documents: {
        nic: values.nic.trim(),
        ssn,
        passport: values.passport.trim(),
        license: values.license.trim(),
        photos,
      },
    });
    Alert.alert(t('verify.verifiedTitle'), t('verify.verifiedBody'));
    router.back();
  }

  return (
    <Screen keyboard>
      <ScreenHeader title={t('verify.title')} />
      {user?.verified ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Icon name="verified" size={18} color={colors.info} />
          <ThemedText variant="headline">{t('verify.verifiedTitle')}</ThemedText>
        </View>
      ) : null}
      <ThemedText variant="body">{t('verify.body')}</ThemedText>
      <ThemedText variant="caption">{t('verify.deviceNote')}</ThemedText>
      {fields.map((field) => (
        <View key={field.key} style={{ gap: spacing.sm }}>
          <TextField
            label={t(field.label)}
            value={values[field.key]}
            onChangeText={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
            placeholder={field.key === 'ssn' && saved?.ssn ? t('verify.ssnPlaceholder') : t(field.placeholder)}
            error={errors[field.key]}
            secureTextEntry={field.secure}
            autoCapitalize="characters"
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => void onPhoto(field.key)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            {photos[field.key] ? (
              <Image source={{ uri: photos[field.key] }} style={{ width: 44, height: 44, borderRadius: radius.md }} contentFit="cover" />
            ) : (
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.md,
                  backgroundColor: colors.backgroundElement,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="camera" size={18} color={colors.info} />
              </View>
            )}
            <ThemedText variant="label" themeColor="link">
              {photos[field.key] ? t('verify.photoAdded') : t('verify.addPhoto')}
            </ThemedText>
          </Pressable>
        </View>
      ))}
      <Button title={t('verify.submit')} onPress={() => void onSubmit()} />
    </Screen>
  );
}
