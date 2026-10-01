import { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Logo } from '@/components/ui/logo';
import { OtpInput } from '@/components/ui/otp-input';
import { PasswordRules } from '@/components/ui/password-rules';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useSession } from '@/context/session-context';
import { useTranslation } from '@/hooks/use-translation';
import { checkCode, currentCode, issueCode } from '@/services/otp';
import { isEmail, isStrongPassword } from '@/validation';
import { spacing } from '@/theme';

type Step = 'email' | 'code' | 'reset';

export function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { resetPassword } = useSession();
  const params = useLocalSearchParams<{ step?: string; email?: string }>();
  const initialEmail = typeof params.email === 'string' ? params.email : '';
  const initialStep: Step = params.step === 'reset' ? 'reset' : 'email';

  const [step, setStep] = useState<Step>(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoCode = useMemo(() => currentCode(email) ?? '', [email, step]);

  async function onEmailContinue() {
    if (!email.trim()) {
      setError(t('validation.emailRequired'));
      return;
    }
    if (!isEmail(email)) {
      setError(t('validation.emailInvalid'));
      return;
    }
    issueCode(email, 'reset');
    setError('');
    setStep('code');
  }

  function onCodeContinue() {
    if (code.trim().length < 4) {
      setError(t('validation.otpRequired'));
      return;
    }
    if (!checkCode(email, code)) {
      setError(t('validation.otpInvalid'));
      return;
    }
    setError('');
    setStep('reset');
  }

  async function onResetContinue() {
    if (!isStrongPassword(password)) {
      setError(t('validation.passwordRules'));
      return;
    }
    if (confirm !== password) {
      setError(t('validation.passwordMismatch'));
      return;
    }
    setLoading(true);
    const result = await resetPassword(email, password);
    setLoading(false);
    if (result !== 'ok') {
      setError(t('common.accountNotFound'));
      return;
    }
    Alert.alert(t('common.appName'), t('common.passwordUpdated'));
    router.replace('/login');
  }

  const footerTitle =
    step === 'email' ? t('common.continue') : step === 'code' ? t('auth.sendOtp') : t('common.resetPassword');

  return (
    <Screen
      keyboard
      footer={
        <Button
          title={footerTitle}
          loading={loading}
          onPress={() => {
            if (step === 'email') void onEmailContinue();
            else if (step === 'code') onCodeContinue();
            else void onResetContinue();
          }}
        />
      }>
      <ScreenHeader />
      <Logo showTagline />

      {step === 'email' ? (
        <View style={{ gap: spacing.md }}>
          <ThemedText variant="title" themeColor="text">
            {t('common.forgotPassword')}
          </ThemedText>
          <ThemedText variant="body">{t('auth.forgotBody')}</ThemedText>
          <TextField
            label={t('auth.emailAddress')}
            icon="mail"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError('');
            }}
            placeholder={t('auth.emailPlaceholder')}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            error={error}
          />
        </View>
      ) : null}

      {step === 'code' ? (
        <View style={{ gap: spacing.md }}>
          <ThemedText variant="title" themeColor="text">
            {t('auth.verifyTitle')}
          </ThemedText>
          <ThemedText variant="body">
            {t('auth.verifyBody', { email, code: demoCode || (currentCode(email) ?? '') })}
          </ThemedText>
          <OtpInput
            value={code}
            onChange={(value) => {
              setCode(value);
              setError('');
            }}
            length={4}
            error={error}
          />
        </View>
      ) : null}

      {step === 'reset' ? (
        <View style={{ gap: spacing.md }}>
          <ThemedText variant="title" themeColor="text">
            {t('common.resetPassword')}
          </ThemedText>
          <ThemedText variant="body">{t('auth.resetBody')}</ThemedText>
          <TextField
            label={t('common.newPassword')}
            icon="lock"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setError('');
            }}
            placeholder={t('auth.passwordPlaceholder')}
            secureTextEntry
            textContentType="newPassword"
            error={error && !confirm ? error : undefined}
          />
          <TextField
            label={t('common.confirmPassword')}
            icon="lock"
            value={confirm}
            onChangeText={(value) => {
              setConfirm(value);
              setError('');
            }}
            placeholder={t('auth.passwordPlaceholder')}
            secureTextEntry
            textContentType="newPassword"
            error={error}
          />
          <PasswordRules value={password} includeUppercase />
        </View>
      ) : null}
    </Screen>
  );
}
