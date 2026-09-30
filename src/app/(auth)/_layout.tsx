import { Stack } from 'expo-router/stack';

import { useSession } from '@/context/session-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { fontFamily } from '@/theme';

export default function AuthLayout() {
  const { hasOnboarded } = useSession();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      initialRouteName={hasOnboarded ? 'get-started' : 'onboarding'}
      screenOptions={{
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontFamily: fontFamily.semibold },
      }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="get-started" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: t('common.login') }} />
      <Stack.Screen name="sign-up" options={{ title: t('common.signUp') }} />
      <Stack.Screen name="forgot-password" options={{ title: t('common.forgotPassword') }} />
      <Stack.Screen name="verification" options={{ title: t('common.verify') }} />
      <Stack.Screen name="reset-password" options={{ title: t('common.resetPassword') }} />
    </Stack>
  );
}
