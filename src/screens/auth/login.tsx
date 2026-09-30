import { useState } from 'react';
import { router } from 'expo-router';
import { Checkbox, Host } from '@expo/ui';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { SocialAuthButtons } from '@/components/social-auth-buttons';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/context/session-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { spacing } from '@/theme';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function LoginScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { signIn, rememberedEmail } = useSession();
  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(rememberedEmail.length > 0);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    const nextEmailError = email.trim()
      ? isEmail(email)
        ? ''
        : t('common.invalidEmail')
      : t('common.emailRequired');
    const nextPasswordError = password ? '' : t('common.passwordRequired');
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError('');
    if (nextEmailError || nextPasswordError) return;

    setLoading(true);
    const result = await signIn(email, password, remember);
    setLoading(false);
    if (result === 'missing') {
      setFormError(t('common.accountNotFound'));
      return;
    }
    if (result === 'invalid') {
      setFormError(t('common.wrongPassword'));
      return;
    }
    if (result === 'network') {
      setFormError(t('common.networkError'));
      return;
    }
    router.replace('/home');
  }

  return (
    <Screen>
      <TextField
        label={t('common.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        error={emailError}
      />
      <TextField
        label={t('common.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        error={passwordError}
      />
      <Host matchContents colorScheme={isDark ? 'dark' : 'light'}>
        <Checkbox label={t('common.rememberMe')} value={remember} onValueChange={setRemember} />
      </Host>
      {formError ? (
        <ThemedText variant="caption" themeColor="error">
          {formError}
        </ThemedText>
      ) : null}
      <Pressable onPress={() => router.push('/forgot-password')}>
        <ThemedText variant="subhead" themeColor="primary">
          {t('common.forgotPassword')}
        </ThemedText>
      </Pressable>
      <Button title={t('common.login')} onPress={() => void onSubmit()} loading={loading} />
      <SocialAuthButtons onSuccess={() => router.replace('/home')} />
      <View style={{ flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' }}>
        <ThemedText variant="subhead">{t('common.noAccount')}</ThemedText>
        <Pressable onPress={() => router.push('/sign-up')}>
          <ThemedText variant="subhead" themeColor="primary">
            {t('common.signUp')}
          </ThemedText>
        </Pressable>
      </View>
    </Screen>
  );
}
