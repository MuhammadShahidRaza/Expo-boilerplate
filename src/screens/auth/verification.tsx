import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Logo } from '@/components/ui/logo';
import { OtpInput } from '@/components/ui/otp-input';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useTranslation } from '@/hooks/use-translation';
import { checkCode, currentCode } from '@/services/otp';
import { spacing } from '@/theme';

export function VerificationScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ email?: string; purpose?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';
  const purpose = typeof params.purpose === 'string' ? params.purpose : 'signup';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function onSubmit() {
    if (code.trim().length < 4) {
      setError(t('validation.otpRequired'));
      return;
    }
    if (!checkCode(email, code)) {
      setError(t('validation.otpInvalid'));
      return;
    }
    if (purpose === 'reset') {
      router.replace({ pathname: '/forgot-password', params: { step: 'reset', email } });
      return;
    }
    router.replace('/origin');
  }

  return (
    <Screen keyboard footer={<Button title={t('auth.sendOtp')} onPress={onSubmit} />}>
      <ScreenHeader />
      <Logo showTagline />
      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="title" themeColor="text">
          {t('auth.verifyTitle')}
        </ThemedText>
        <ThemedText variant="body">
          {t('auth.verifyBody', { email, code: currentCode(email) ?? '' })}
        </ThemedText>
      </View>
      <OtpInput value={code} onChange={(value) => { setCode(value); setError(''); }} length={4} error={error} />
    </Screen>
  );
}
