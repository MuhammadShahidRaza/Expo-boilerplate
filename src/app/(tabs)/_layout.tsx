import { useState } from 'react';
import { router, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppTabBar } from '@/components/navigation/app-tab-bar';
import { Icon } from '@/components/ui/icon';
import { Sheet } from '@/components/ui/sheet';
import { CreateSheetProvider } from '@/context/create-sheet';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { radius, spacing } from '@/theme';
import type { IconName } from '@/components/ui/icon';
import type { TintName } from '@/theme/colors';

const tintSoft = {
  blue: 'tintBlueSoft',
  gold: 'tintGoldSoft',
  red: 'tintRedSoft',
  brown: 'tintBrownSoft',
  green: 'tintGreenSoft',
  purple: 'tintPurpleSoft',
} as const;

const tintSolid = {
  blue: 'tintBlue',
  gold: 'tintGold',
  red: 'tintRed',
  brown: 'tintBrown',
  green: 'tintGreen',
  purple: 'tintPurple',
} as const;

const actions: { href: '/create-post' | '/create-event' | '/create-poll' | '/create-listing'; title: 'create.post' | 'create.event' | 'create.survey' | 'create.listing'; body: 'create.postBody' | 'create.eventBody' | 'create.surveyBody' | 'create.listingBody'; icon: IconName; tint: TintName }[] = [
  { href: '/create-post', title: 'create.post', body: 'create.postBody', icon: 'edit', tint: 'blue' },
  { href: '/create-event', title: 'create.event', body: 'create.eventBody', icon: 'calendar', tint: 'gold' },
  { href: '/create-poll', title: 'create.survey', body: 'create.surveyBody', icon: 'poll', tint: 'purple' },
  { href: '/create-listing', title: 'create.listing', body: 'create.listingBody', icon: 'bag', tint: 'green' },
];

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <CreateSheetProvider openCreate={() => setOpen(true)}>
      <Tabs
        tabBar={(props) => <AppTabBar state={props.state} navigation={props.navigation} />}
        screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="chat" />
        <Tabs.Screen name="assistant" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <Sheet visible={open} title={t('create.title')} onClose={() => setOpen(false)}>
        <View>
          {actions.map((action, index) => (
            <Pressable
              key={action.href}
              accessibilityRole="button"
              onPress={() => {
                setOpen(false);
                router.push(action.href);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                paddingVertical: spacing.md,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: colors.divider,
              }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors[tintSoft[action.tint]],
                }}>
                <Icon name={action.icon} size={20} color={colors[tintSolid[action.tint]]} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="headline">{t(action.title)}</ThemedText>
                <ThemedText variant="caption">{t(action.body)}</ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      </Sheet>
    </CreateSheetProvider>
  );
}
