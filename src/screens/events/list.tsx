import { router } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppSelector } from '@/store/hooks';
import { radius, spacing } from '@/theme';

export function EventsListScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const events = useAppSelector((state) => state.world.events);

  return (
    <Screen>
      <ScreenHeader title={t('home.upcoming')} />
      {events.map((event) => (
        <Card key={event.id} onPress={() => router.push(`/event/${event.id}`)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: radius.md,
                backgroundColor: colors.gold,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ThemedText variant="headline" themeColor="onGold">
                {event.day}
              </ThemedText>
              <ThemedText variant="caption" themeColor="onGold">
                {event.month}
              </ThemedText>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText variant="headline">{event.title}</ThemedText>
              <ThemedText variant="caption">
                {event.place} · {event.time}
              </ThemedText>
            </View>
          </View>
        </Card>
      ))}
    </Screen>
  );
}
