import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Logo } from '@/components/ui/logo';
import { PasswordRules } from '@/components/ui/password-rules';
import { SocialAuthRow } from '@/components/ui/social-auth';
import { useSession } from '@/context/session-context';
import { useTranslation } from '@/hooks/use-translation';
import { isSignupPassword, validateLogin } from '@/validation';
import { spacing } from '@/theme';

export function LoginScreen() {
  const { t } = useTranslation();
  const { signInSocial, rememberedEmail } = useSession();
  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    const next = validateLogin({ email, password }, t);
    if (!next.password && !isSignupPassword(password)) {
      next.password = t('validation.passwordWeak');
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    const trimmed = email.trim();
    const rawName = trimmed.split('@')[0]?.replace(/[._-]+/g, ' ').trim() || 'Member';
    const name = rawName.replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase());
    await signInSocial({ fullName: name, email: trimmed });
    setLoading(false);
    router.replace('/home');
  }

  return (
    <Screen keyboard>
      <Logo showTagline />
      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="title" themeColor="text">
          {t('auth.welcome')}
        </ThemedText>
        <ThemedText variant="body">{t('auth.welcomeBody')}</ThemedText>
      </View>

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
        textContentType="password"
        error={errors.password}
      />
      <PasswordRules value={password} includeUppercase={false} />

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/forgot-password')}
        style={{ alignSelf: 'flex-end' }}>
        <ThemedText variant="subhead" themeColor="primary">
          {t('common.forgotPassword')}
        </ThemedText>
      </Pressable>

      <Button title={t('common.login')} loading={loading} onPress={() => void onSubmit()} />
      <SocialAuthRow />

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, flexWrap: 'wrap' }}>
        <ThemedText variant="subhead">{t('auth.noAccount')}</ThemedText>
        <Pressable accessibilityRole="button" onPress={() => router.push('/sign-up')}>
          <ThemedText variant="subhead" themeColor="primary">
            {t('common.signUp')}
          </ThemedText>
        </Pressable>
      </View>
    </Screen>
  );
}
