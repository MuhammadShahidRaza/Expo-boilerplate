import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/context/session-context';
import { useTranslation } from '@/hooks/use-translation';

function makeCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function VerificationScreen() {
  const { t } = useTranslation();
  const { mode, email } = useLocalSearchParams<{ mode?: string; email?: string }>();
  const { completeSignIn } = useSession();
  const [expected, setExpected] = useState(makeCode);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (code.trim().length !== 4) {
      setError(t('common.codeRequired'));
      return;
    }
    if (code.trim() !== expected) {
      setError(t('common.codeInvalid'));
      return;
    }
    if (mode === 'forgot') {
      router.replace({ pathname: '/reset-password', params: { email: email ?? '' } });
      return;
    }
    setLoading(true);
    await completeSignIn();
    setLoading(false);
    router.replace('/home');
  }

  return (
    <Screen>
      <ThemedText variant="body">{t('auth.localCode', { code: expected })}</ThemedText>
      <TextField
        label={t('common.verify')}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={4}
        error={error}
      />
      <Button title={t('common.verify')} onPress={() => void onSubmit()} loading={loading} />
      <Button
        title={t('auth.resend')}
        variant="ghost"
        onPress={() => {
          setExpected(makeCode());
          setCode('');
          setError('');
        }}
      />
    </Screen>
  );
}
