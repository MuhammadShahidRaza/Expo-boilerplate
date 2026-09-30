import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { useAppleSignIn, useGoogleSignIn } from '@/hooks/use-social-auth';
import { useTranslation } from '@/hooks/use-translation';
import { googleClientIdForPlatform } from '@/services/social';
import { spacing } from '@/theme';

WebBrowser.maybeCompleteAuthSession();

type SocialAuthButtonsProps = {
  onSuccess: () => void;
};

export function SocialAuthButtons({ onSuccess }: SocialAuthButtonsProps) {
  const googleConfigured = Boolean(googleClientIdForPlatform());

  return (
    <View style={{ gap: spacing.sm }}>
      {googleConfigured ? <GoogleButton onSuccess={onSuccess} /> : <UnavailableGoogleButton />}
      <AppleButton onSuccess={onSuccess} />
    </View>
  );
}

function UnavailableGoogleButton() {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  return (
    <View style={{ gap: spacing.xs }}>
      <Button
        title={t('common.continueWithGoogle')}
        variant="secondary"
        onPress={() => setMessage(t('common.socialUnavailable'))}
      />
      {message ? (
        <ThemedText variant="caption" themeColor="textSecondary">
          {message}
        </ThemedText>
      ) : null}
    </View>
  );
}

function GoogleButton({ onSuccess }: SocialAuthButtonsProps) {
  const { t } = useTranslation();
  const { ready, signIn } = useGoogleSignIn();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onPress() {
    setMessage('');
    setLoading(true);
    const result = await signIn();
    setLoading(false);
    if (result === 'ok') {
      onSuccess();
      return;
    }
    if (result === 'unavailable') setMessage(t('common.socialUnavailable'));
  }

  return (
    <View style={{ gap: spacing.xs }}>
      <Button
        title={t('common.continueWithGoogle')}
        variant="secondary"
        loading={loading}
        disabled={!ready}
        onPress={() => void onPress()}
      />
      {message ? (
        <ThemedText variant="caption" themeColor="textSecondary">
          {message}
        </ThemedText>
      ) : null}
    </View>
  );
}

function AppleButton({ onSuccess }: SocialAuthButtonsProps) {
  const { t } = useTranslation();
  const signIn = useAppleSignIn();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onPress() {
    setMessage('');
    setLoading(true);
    const result = await signIn();
    setLoading(false);
    if (result === 'ok') {
      onSuccess();
      return;
    }
    if (result === 'unavailable') setMessage(t('common.socialUnavailable'));
  }

  return (
    <View style={{ gap: spacing.xs }}>
      <Button
        title={t('common.continueWithApple')}
        variant="secondary"
        loading={loading}
        onPress={() => void onPress()}
      />
      {message ? (
        <ThemedText variant="caption" themeColor="textSecondary">
          {message}
        </ThemedText>
      ) : null}
    </View>
  );
}
