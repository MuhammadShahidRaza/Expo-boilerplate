import { useCallback } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, OAuthProvider, signInWithCredential } from 'firebase/auth';
import { Platform } from 'react-native';

import { useSession } from '@/context/session-context';
import { authToken, socialLoginRequest } from '@/services/api/auth';
import { hasApi } from '@/services/api/client';
import { getFirebaseAuth } from '@/services/firebase';
import { SECRET_KEYS, setSecret } from '@/services/secure-store';
import { readIdTokenProfile } from '@/services/social';

type ProviderName = 'google' | 'apple';

export function useProviderSignIn() {
  const { signInSocial } = useSession();

  return useCallback(
    async (
      provider: ProviderName,
      idToken: string | null,
      profile: { email?: string | null; fullName?: string | null },
    ) => {
      const email = profile.email?.trim().toLowerCase();
      if (!email) return 'unavailable' as const;

      const auth = getFirebaseAuth();
      if (auth && idToken) {
        try {
          const credential =
            provider === 'google'
              ? GoogleAuthProvider.credential(idToken)
              : new OAuthProvider('apple.com').credential({ idToken });
          await signInWithCredential(auth, credential);
        } catch (error) {
          console.warn('firebase social sign-in failed', error);
        }
      }

      if (hasApi() && idToken) {
        try {
          const response = await socialLoginRequest(provider, idToken, email);
          const token = authToken(response);
          if (token) await setSecret(SECRET_KEYS.authToken, token);
        } catch (error) {
          console.warn('social login request failed', error);
        }
      }

      await signInSocial({
        fullName: profile.fullName?.trim() || email,
        email,
      });
      return 'ok' as const;
    },
    [signInSocial],
  );
}

export function useGoogleSignIn() {
  const complete = useProviderSignIn();
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  const signIn = useCallback(async () => {
    const result = await promptAsync();
    if (result.type !== 'success') {
      return result.type === 'cancel' || result.type === 'dismiss' ? ('canceled' as const) : ('unavailable' as const);
    }
    const idToken = result.params.id_token ?? null;
    const profile = idToken ? readIdTokenProfile(idToken) : {};
    return complete('google', idToken, profile);
  }, [complete, promptAsync]);

  return { ready: Boolean(request), signIn };
}

export function useAppleSignIn() {
  const complete = useProviderSignIn();

  return useCallback(async () => {
    if (Platform.OS !== 'ios') return 'unavailable' as const;
    const available = await AppleAuthentication.isAvailableAsync();
    if (!available) return 'unavailable' as const;

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const fullName = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(' ');
      return complete('apple', credential.identityToken, {
        email: credential.email,
        fullName,
      });
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
      if (code === 'ERR_REQUEST_CANCELED') return 'canceled' as const;
      console.warn('apple sign-in failed', error);
      return 'unavailable' as const;
    }
  }, [complete]);
}
