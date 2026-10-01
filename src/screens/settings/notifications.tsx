import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SwitchRow } from '@/components/ui/switch-row';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPref, type NotificationPrefs } from '@/store/slices/world';
import { spacing } from '@/theme';

type PrefKey = keyof NotificationPrefs;

const sections: { caption: string; items: PrefKey[] }[] = [
  { caption: 'settings.postsFeed', items: ['newPosts', 'reactions', 'comments'] },
  { caption: 'settings.messages', items: ['direct', 'group'] },
  { caption: 'settings.events', items: ['reminders', 'newEvents'] },
];

export function NotificationPreferencesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const prefs = useAppSelector((state) => state.world.prefs);

  return (
    <Screen>
      <ScreenHeader title={t('common.notifications')} />

      {sections.map((section) => (
        <Card key={section.caption}>
          <ThemedText variant="caption" style={{ marginBottom: spacing.xs }}>
            {t(section.caption)}
          </ThemedText>
          {section.items.map((key, index) => (
            <View key={key}>
              <SwitchRow
                title={t(`settings.${key}`)}
                body={t(`settings.${key}Body`)}
                value={prefs[key]}
                onValueChange={(value) => dispatch(setPref({ key, value }))}
              />
              {index < section.items.length - 1 ? (
                <View style={{ height: 1, backgroundColor: colors.border }} />
              ) : null}
            </View>
          ))}
        </Card>
      ))}
    </Screen>
  );
}
