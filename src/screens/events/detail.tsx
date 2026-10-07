import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { resolvePhoto } from '@/data/images';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setGoing } from '@/store/slices/world';
import { confirmAction } from '@/utils/confirm';
import { radius, spacing } from '@/theme';

export function EventDetailScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = useAppSelector((state) => state.world.events.find((item) => item.id === id));
  const insets = useSafeAreaInsets();

  if (!event) {
    return (
      <Screen>
        <IconButton icon="back" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
        <ThemedText variant="body">{t('business.emptyEvents')}</ThemedText>
      </Screen>
    );
  }

  return (
    <Screen
      padded={false}
      safeTop={false}
      footer={
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Button
              title={t('event.going')}
              variant="primary"
              icon="check"
              onPress={() =>
                confirmAction({
                  title: t('event.goingTitle'),
                  message: t('event.goingBody'),
                  confirmLabel: t('event.going'),
                  cancelLabel: t('common.cancel'),
                  onConfirm: () => dispatch(setGoing({ id: event.id, going: true })),
                })
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title={t('event.notGoing')}
              variant="softDanger"
              icon="close"
              onPress={() =>
                confirmAction({
                  title: t('event.notGoingTitle'),
                  message: t('event.notGoingBody'),
                  confirmLabel: t('event.notGoing'),
                  cancelLabel: t('common.cancel'),
                  onConfirm: () => dispatch(setGoing({ id: event.id, going: false })),
                })
              }
            />
          </View>
        </View>
      }>
      <View>
        <Image
          source={resolvePhoto(event.image)}
          style={{ width: '100%', height: 260, borderBottomLeftRadius: radius.xxl, borderBottomRightRadius: radius.xxl }}
          contentFit="cover"
        />
        <View style={{ position: 'absolute', top: insets.top + 8, left: spacing.md }}>
          <IconButton
            icon="back"
            variant="light"
            accessibilityLabel={t('common.back')}
            onPress={() => router.back()}
          />
        </View>
        <View style={{ position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.lg, gap: spacing.sm }}>
          <Badge label={t('event.badge')} tone="gold" icon="calendar" />
          <ThemedText variant="title" themeColor="textInverse">
            {event.title}
          </ThemedText>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.md, gap: spacing.md, paddingTop: spacing.md }}>
        <InfoRow
          icon="calendar"
          title={event.dateLabel}
          subtitle={t('event.away')}
        />
        <InfoRow icon="clock" title={event.time} />
        <InfoRow icon="pin" title={event.place} subtitle={event.address} />

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Avatar source="festival" size={44} />
            <View style={{ flex: 1 }}>
              <ThemedText variant="caption">{t('event.organized')}</ThemedText>
              <ThemedText variant="headline">{event.host}</ThemedText>
            </View>
          </View>
        </Card>

        <ThemedText variant="section">{t('event.about')}</ThemedText>
        <ThemedText variant="body">{event.about}</ThemedText>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ flexDirection: 'row' }}>
            {(['portrait', 'portraitM', 'portrait', 'portraitM'] as const).map((source, index) => (
              <View key={`${source}-${index}`} style={{ marginLeft: index === 0 ? 0 : -10 }}>
                <Avatar source={source} size={32} ring />
              </View>
            ))}
          </View>
          <ThemedText variant="caption">{t('event.attendees', { count: event.attendees })}</ThemedText>
        </View>
      </View>
    </Screen>
  );
}

function InfoRow({
  icon,
  title,
  subtitle,
}: {
  icon: 'calendar' | 'clock' | 'pin';
  title: string;
  subtitle?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.md,
          backgroundColor: colors.tintBlueSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={icon} size={18} color={colors.tintBlue} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText variant="headline">{title}</ThemedText>
        {subtitle ? <ThemedText variant="caption">{subtitle}</ThemedText> : null}
      </View>
    </View>
  );
}
