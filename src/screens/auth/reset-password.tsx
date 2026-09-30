import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/context/session-context';
import { useTranslation } from '@/hooks/use-translation';

export function ResetPasswordScreen() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { resetPassword } = useSession();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [formError, setFormError] = useState('');

  async function onSubmit() {
    const nextPasswordError = !password
      ? t('common.passwordRequired')
      : password.length < 8
        ? t('common.passwordShort')
        : '';
    const nextConfirmError = password !== confirmPassword ? t('common.passwordMismatch') : '';
    setPasswordError(nextPasswordError);
    setConfirmError(nextConfirmError);
    setFormError('');
    if (nextPasswordError || nextConfirmError) return;

    const result = await resetPassword(email ?? '', password);
    if (result === 'invalid') {
      setFormError(t('common.accountNotFound'));
      return;
    }
    router.replace('/login');
  }

  return (
    <Screen>
      <ThemedText variant="body">{t('auth.resetBody')}</ThemedText>
      <TextField
        label={t('common.newPassword')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="newPassword"
        error={passwordError}
      />
      <TextField
        label={t('common.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        textContentType="newPassword"
        error={confirmError}
      />
      {formError ? (
        <ThemedText variant="caption" themeColor="error">
          {formError}
        </ThemedText>
      ) : null}
      <Button title={t('common.resetPassword')} onPress={() => void onSubmit()} />
      <Button title={t('common.backToLogin')} variant="ghost" onPress={() => router.replace('/login')} />
    </Screen>
  );
}
