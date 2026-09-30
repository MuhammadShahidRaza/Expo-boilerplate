import { Stack } from 'expo-router/stack';

import { useTheme } from '@/hooks/use-theme';
import { fontFamily } from '@/theme';

export function TabStack({ title }: { title: string }) {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeTitleEnabled: true,
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.background },
        headerLargeStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontFamily: fontFamily.semibold },
      }}>
      <Stack.Screen name="index" options={{ title }} />
    </Stack>
  );
}
