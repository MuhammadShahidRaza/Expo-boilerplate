import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { marks } from '@/data/images';
import { Icon, type IconName } from '@/components/ui/icon';
import { useCreateSheet } from '@/context/create-sheet';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppSelector } from '@/store/hooks';
import { radius } from '@/theme';

type TabRoute = { key: string; name: string; params?: object };

type TabBarProps = {
  state: { index: number; routes: TabRoute[] };
  navigation: {
    navigate: (name: string, params?: object) => void;
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
  };
};

function matchesTab(routeName: string, itemName: string) {
  return routeName === itemName || routeName === `${itemName}/index`;
}

const items: { name: string; label: 'tabs.home' | 'tabs.chat' | 'tabs.assistant' | 'tabs.profile'; icon: IconName }[] = [
  { name: 'home', label: 'tabs.home', icon: 'home' },
  { name: 'chat', label: 'tabs.chat', icon: 'chat' },
  { name: 'assistant', label: 'tabs.assistant', icon: 'sparkles' },
  { name: 'profile', label: 'tabs.profile', icon: 'person' },
];

export function AppTabBar({ state, navigation }: TabBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { openCreate } = useCreateSheet();
  const insets = useSafeAreaInsets();
  const unread = useAppSelector((store) => store.world.threads.reduce((sum, thread) => sum + thread.unread, 0));
  const left = items.slice(0, 2);
  const right = items.slice(2);

  const renderItem = (item: (typeof items)[number]) => {
    const route = state.routes.find((entry) => matchesTab(entry.name, item.name));
    const index = route ? state.routes.indexOf(route) : -1;
    const active = state.index === index;
    const color = active ? colors.tabBarActive : colors.tabBarInactive;
    return (
      <Pressable
        key={item.name}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        onPress={() => {
          if (!route) return;
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!active && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        }}
        style={{ flex: 1, alignItems: 'center', gap: 4, paddingTop: 10 }}>
        <View>
          <Icon name={item.icon} size={22} color={color} />
          {item.name === 'chat' && unread > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -8,
                minWidth: 16,
                height: 16,
                borderRadius: radius.full,
                backgroundColor: colors.gold,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ThemedText variant="caption" themeColor="onGold" style={{ fontSize: 10 }}>
                {unread}
              </ThemedText>
            </View>
          ) : null}
        </View>
        <ThemedText variant="caption" style={{ color, fontSize: 11 }}>
          {t(item.label)}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <View style={{ backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          backgroundColor: colors.tabBar,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingHorizontal: 8,
        }}>
        {left.map(renderItem)}
        <View style={{ width: 76, alignItems: 'center' }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('create.title')}
            onPress={openCreate}
            style={{
              width: 64,
              height: 64,
              borderRadius: radius.full,
              backgroundColor: colors.tabBar,
              borderWidth: 4,
              borderColor: colors.background,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -28,
            }}>
            <View style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={marks.gold} style={{ width: 52, height: 52 }} contentFit="contain" />
              <View style={{ position: 'absolute' }}>
                <Icon name="plus" size={26} color={colors.tabBar} />
              </View>
            </View>
          </Pressable>
        </View>
        {right.map(renderItem)}
      </View>
    </View>
  );
}
