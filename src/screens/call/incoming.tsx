import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppSelector } from '@/store/hooks';
import { radius, spacing } from '@/theme';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function IncomingCallScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string; video?: string }>();
  const thread = useAppSelector((state) => state.world.threads.find((item) => item.id === id));
  const name = thread?.name ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: colors.tabBar, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.md }}>
          <Icon name="shield" size={18} color={colors.gold} />
          <ThemedText variant="caption" themeColor="textInverse">
            {t('call.member')}
          </ThemedText>
        </View>

        <View style={{ alignItems: 'center', gap: spacing.md }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                position: 'absolute',
                width: 180,
                height: 180,
                borderRadius: radius.full,
                borderWidth: 1.5,
                borderColor: colors.gold,
                opacity: 0.35,
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: radius.full,
                borderWidth: 1.5,
                borderColor: colors.gold,
                opacity: 0.55,
              }}
            />
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: radius.full,
                backgroundColor: colors.gold,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ThemedText variant="title" themeColor="onGold" style={{ fontSize: 36 }}>
                {initials(name)}
              </ThemedText>
            </View>
          </View>
          <ThemedText variant="title" themeColor="textInverse" style={{ textAlign: 'center' }}>
            {name}
          </ThemedText>
          <ThemedText variant="body" themeColor="textInverse">
            {t('call.incoming')}
          </ThemedText>
          <ThemedText variant="caption" style={{ color: colors.tabBarInactive }}>
            {t('call.family')}
          </ThemedText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingBottom: spacing.xl,
            paddingTop: spacing.lg,
          }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('call.decline')}
            onPress={() => router.back()}
            style={{ alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: radius.full,
                backgroundColor: colors.error,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="callEnd" size={28} color={colors.textInverse} />
            </View>
            <ThemedText variant="label" themeColor="textInverse">
              {t('call.decline')}
            </ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('call.accept')}
            onPress={() => router.replace({ pathname: '/call-active', params: { id: id ?? '' } })}
            style={{ alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: radius.full,
                backgroundColor: colors.success,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="phone" size={28} color={colors.textInverse} />
            </View>
            <ThemedText variant="label" themeColor="textInverse">
              {t('call.accept')}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
