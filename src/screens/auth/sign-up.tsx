import { useState } from 'react';
import { router } from 'expo-router';
import { Checkbox, Host } from '@expo/ui';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/context/session-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { spacing } from '@/theme';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SignUpScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { signUp } = useSession();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = t('common.nameRequired');
    if (!email.trim()) next.email = t('common.emailRequired');
    else if (!isEmail(email)) next.email = t('common.invalidEmail');
    if (!password) next.password = t('common.passwordRequired');
    else if (password.length < 8) next.password = t('common.passwordShort');
    if (password !== confirmPassword) next.confirmPassword = t('common.passwordMismatch');
    if (!agreed) next.agreed = t('common.mustAgree');
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    await signUp({ fullName, email, password });
    setLoading(false);
    router.push('/verification?mode=signup');
  }

  return (
    <Screen>
      <TextField
        label={t('common.fullName')}
        value={fullName}
        onChangeText={setFullName}
        autoComplete="name"
        textContentType="name"
        error={errors.fullName}
      />
      <TextField
        label={t('common.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        error={errors.email}
      />
      <TextField
        label={t('common.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="newPassword"
        error={errors.password}
      />
      <TextField
        label={t('common.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        textContentType="newPassword"
        error={errors.confirmPassword}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Host matchContents colorScheme={isDark ? 'dark' : 'light'}>
          <Checkbox value={agreed} onValueChange={setAgreed} />
        </Host>
        <ThemedText variant="subhead">
          {t('common.agreeToTerms')}{' '}
          <ThemedText variant="subhead" themeColor="primary" onPress={() => router.push('/terms')}>
            {t('common.terms')}
          </ThemedText>
        </ThemedText>
      </View>
      {errors.agreed ? (
        <ThemedText variant="caption" themeColor="error">
          {errors.agreed}
        </ThemedText>
      ) : null}
      <Button title={t('common.signUp')} onPress={() => void onSubmit()} loading={loading} />
      <View style={{ flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' }}>
        <ThemedText variant="subhead">{t('common.alreadyHaveAccount')}</ThemedText>
        <Pressable onPress={() => router.push('/login')}>
          <ThemedText variant="subhead" themeColor="primary">
            {t('common.login')}
          </ThemedText>
        </Pressable>
      </View>
    </Screen>
  );
}
