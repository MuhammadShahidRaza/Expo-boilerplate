import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
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

function formatTimer(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function ActiveCallScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useAppSelector((state) => state.world.threads.find((item) => item.id === id));
  const name = thread?.name ?? '';
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [translate, setTranslate] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const controls: {
    key: string;
    icon: IconName;
    label: string;
    active?: boolean;
    danger?: boolean;
    onPress: () => void;
  }[] = [
    { key: 'mute', icon: 'mic', label: t('call.mute'), active: muted, onPress: () => setMuted((value) => !value) },
    {
      key: 'camera',
      icon: 'video',
      label: t('call.camera'),
      active: !cameraOn,
      onPress: () => setCameraOn((value) => !value),
    },
    {
      key: 'translate',
      icon: 'translate',
      label: t('call.translate'),
      active: translate,
      onPress: () => setTranslate((value) => !value),
    },
    { key: 'end', icon: 'callEnd', label: t('call.end'), danger: true, onPress: () => router.back() },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.tabBar, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: spacing.sm }}>
          <View style={{ gap: 4 }}>
            <ThemedText variant="headline" themeColor="textInverse">
              {name}
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: radius.full, backgroundColor: colors.success }} />
              <ThemedText variant="caption" themeColor="textInverse">
                {t('call.inCall')} · {formatTimer(elapsed)}
              </ThemedText>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: colors.navySoft,
              borderRadius: radius.full,
              paddingHorizontal: spacing.sm + 2,
              paddingVertical: 6,
            }}>
            <Icon name="sparkles" size={14} color={colors.gold} />
            <ThemedText variant="caption" themeColor="gold">
              {t('call.captions')}
            </ThemedText>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end', marginTop: spacing.md }}>
          <View
            style={{
              width: 88,
              height: 120,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.navySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ThemedText variant="label" themeColor="textInverse">
              {t('call.you')}
            </ThemedText>
          </View>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 140,
              height: 140,
              borderRadius: radius.full,
              backgroundColor: colors.goldSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ThemedText variant="title" themeColor="gold" style={{ fontSize: 40 }}>
              {initials(name)}
            </ThemedText>
          </View>
          <ThemedText variant="caption" style={{ color: colors.tabBarInactive }}>
            {t('call.cameraFeed')}
          </ThemedText>
        </View>

        <View
          style={{
            backgroundColor: colors.navySoft,
            borderRadius: radius.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 2,
            marginBottom: spacing.lg,
            gap: 4,
          }}>
          <ThemedText variant="body" themeColor="textInverse" style={{ textAlign: 'center' }}>
            {t('call.caption')}
          </ThemedText>
          {translate ? (
            <ThemedText variant="caption" style={{ color: colors.tabBarInactive, textAlign: 'center' }}>
              Je peux apporter les tables pour le stand.
            </ThemedText>
          ) : null}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: spacing.md,
            paddingHorizontal: spacing.sm,
          }}>
          {controls.map((control) => (
            <Pressable
              key={control.key}
              accessibilityRole="button"
              accessibilityLabel={control.label}
              onPress={control.onPress}
              style={{ alignItems: 'center', gap: spacing.sm, width: 72 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.full,
                  backgroundColor: control.danger ? colors.error : control.active ? colors.gold : colors.navySoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name={control.icon}
                  size={22}
                  color={control.danger || control.active ? colors.onGold : colors.textInverse}
                />
              </View>
              <ThemedText variant="caption" themeColor="textInverse">
                {control.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
