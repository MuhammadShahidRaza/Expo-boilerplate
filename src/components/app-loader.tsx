import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useAppSelector } from '@/store/hooks';

export function AppLoader() {
  const loading = useAppSelector((state) => state.ui.isAppLoading);
  const { colors } = useTheme();

  if (!loading) return null;

  return (
    <View
      pointerEvents="auto"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.25)',
      }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
