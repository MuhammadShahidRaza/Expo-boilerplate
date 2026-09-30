import { useState } from 'react';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/context/session-context';
import { useTranslation } from '@/hooks/use-translation';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { hasAccount } = useSession();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function onSubmit() {
    if (!email.trim()) {
      setError(t('common.emailRequired'));
      return;
    }
    if (!isEmail(email)) {
      setError(t('common.invalidEmail'));
      return;
    }
    if (!hasAccount(email)) {
      setError(t('common.accountNotFound'));
      return;
    }
    router.push({ pathname: '/verification', params: { mode: 'forgot', email: email.trim() } });
  }

  return (
    <Screen>
      <ThemedText variant="body">{t('auth.forgotBody')}</ThemedText>
      <TextField
        label={t('common.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        error={error}
      />
      <Button title={t('common.sendCode')} onPress={onSubmit} />
    </Screen>
  );
}
