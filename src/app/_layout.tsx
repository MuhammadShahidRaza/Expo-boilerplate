import { useEffect, useState } from 'react';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import '@/global.css';

import { AppLoader } from '@/components/app-loader';
import { SplashIntro } from '@/components/splash-intro';
import { NotificationsBridge } from '@/components/notifications-bridge';
import { OfflineBanner } from '@/components/offline-banner';
import { SessionProvider, useSession } from '@/context/session-context';
import { I18nProvider } from '@/i18n/provider';
import { useTheme } from '@/hooks/use-theme';
import { persistor, store } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { ensureProfileSamples } from '@/store/slices/world';
import { fontFamily } from '@/theme';
import { AppThemeProvider } from '@/theme/theme-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppThemeProvider>
            <I18nProvider>
              <SessionProvider>
                <NavigationShell fontsLoaded={fontsLoaded} />
              </SessionProvider>
            </I18nProvider>
          </AppThemeProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

function NavigationShell({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { isDark, colors } = useTheme();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    dispatch(ensureProfileSamples());
  }, [dispatch]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  if (!fontsLoaded) return null;

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  };

  const screenOptions = {
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal' as const,
    headerTintColor: colors.text,
    headerStyle: { backgroundColor: colors.background },
    contentStyle: { backgroundColor: colors.background },
    headerTitleStyle: { fontFamily: fontFamily.semibold },
  };

  if (!splashDone) return <SplashIntro onFinish={() => setSplashDone(true)} />;

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <OfflineBanner />
      <NotificationsBridge />
      <AppLoader />
      <Stack screenOptions={{ ...screenOptions, headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(setup)" />
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={Boolean(user)}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(main)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
