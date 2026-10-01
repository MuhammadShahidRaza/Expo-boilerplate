import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/ui/logo';
import { PasswordRules } from '@/components/ui/password-rules';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SocialAuthRow } from '@/components/ui/social-auth';
import { useSession } from '@/context/session-context';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useTranslation } from '@/hooks/use-translation';
import { issueCode } from '@/services/otp';
import { validateSignUp } from '@/validation';
import { spacing } from '@/theme';

export function SignUpScreen() {
  const { t } = useTranslation();
  const { signUp, hasAccount } = useSession();
  const { pickImage } = useImagePicker();
  const [uri, setUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
    accepted?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  async function onPickAvatar() {
    const result = await pickImage();
    if (result.status === 'denied') {
      Alert.alert(t('common.appName'), t('common.permissionDenied'));
      return;
    }
    if (result.status === 'ok') setUri(result.uri);
  }

  async function onSubmit() {
    const next = validateSignUp({ name, email, password, confirm, accepted }, t);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (hasAccount(email)) {
      setErrors({ email: t('validation.emailTaken') });
      return;
    }

    setLoading(true);
    await signUp({ fullName: name, email, password });
    issueCode(email, 'signup');
    setLoading(false);
    router.push({ pathname: '/verification', params: { email, purpose: 'signup' } });
  }

  return (
    <Screen keyboard>
      <ScreenHeader
        right={
          <ThemedText variant="label" themeColor="primary">
            {t('common.step')}
          </ThemedText>
        }
      />
      <Logo showTagline />
      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="title" themeColor="text">
          {t('common.signup')}
        </ThemedText>
        <ThemedText variant="body">{t('auth.signupBody')}</ThemedText>
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel={t('common.choosePhoto')} onPress={() => void onPickAvatar()} style={{ alignSelf: 'center' }}>
        <Avatar size={92} source={uri} badgeIcon="camera" />
      </Pressable>

      <TextField
        label={t('common.fullName')}
        icon="person"
        value={name}
        onChangeText={setName}
        placeholder={t('common.fullName')}
        autoComplete="name"
        textContentType="name"
        error={errors.name}
      />
      <TextField
        label={t('auth.emailAddress')}
        icon="mail"
        value={email}
        onChangeText={setEmail}
        placeholder={t('auth.emailPlaceholder')}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        error={errors.email}
      />
      <TextField
        label={t('common.password')}
        icon="lock"
        value={password}
        onChangeText={setPassword}
        placeholder={t('auth.passwordPlaceholder')}
        secureTextEntry
        textContentType="newPassword"
        error={errors.password}
      />
      <TextField
        label={t('common.confirmPassword')}
        icon="lock"
        value={confirm}
        onChangeText={setConfirm}
        placeholder={t('auth.passwordPlaceholder')}
        secureTextEntry
        textContentType="newPassword"
        error={errors.confirm}
      />

      <PasswordRules value={password} includeUppercase={false} />

      <Checkbox
        checked={accepted}
        onPress={() => setAccepted((value) => !value)}
        error={errors.accepted}
        label={
          <ThemedText variant="subhead">
            {t('auth.accept')}{' '}
            <ThemedText
              variant="subhead"
              themeColor="primary"
              onPress={() => router.push('/legal/terms')}>
              {t('auth.terms')}
            </ThemedText>
            {' & '}
            <ThemedText
              variant="subhead"
              themeColor="primary"
              onPress={() => router.push('/legal/privacy')}>
              {t('auth.privacy')}
            </ThemedText>
          </ThemedText>
        }
      />

      <Button title={t('common.continue')} loading={loading} onPress={() => void onSubmit()} />
      <SocialAuthRow />

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, flexWrap: 'wrap' }}>
        <ThemedText variant="subhead">{t('auth.hasAccount')}</ThemedText>
        <Pressable accessibilityRole="button" onPress={() => router.push('/login')}>
          <ThemedText variant="subhead" themeColor="primary">
            {t('common.login')}
          </ThemedText>
        </Pressable>
      </View>
    </Screen>
  );
}
