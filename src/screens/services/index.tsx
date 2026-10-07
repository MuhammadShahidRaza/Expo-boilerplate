import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { serviceCategories } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import type { TintName } from '@/theme/colors';
import { radius, spacing } from '@/theme';

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

export function ServicesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string>('local');

  return (
    <Screen>
      <ScreenHeader title={t('services.title')} />
      <ThemedText variant="subhead">{t('services.hint')}</ThemedText>
      {serviceCategories.map((category) => {
        const open = expanded === category.id;
        const tint = category.tint as TintName;
        return (
          <Card key={category.id} padded>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (category.id === 'marketplace') {
                  router.push('/marketplace');
                  return;
                }
                if (category.id === 'jobs' || category.id === 'training') {
                  router.push('/jobs');
                  return;
                }
                if (category.chips.length === 0) {
                  router.push('/directory');
                  return;
                }
                setExpanded(open ? '' : category.id);
              }}
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.md,
                  backgroundColor: colors[tintSoft[tint]],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name={category.icon} size={20} color={colors[tintSolid[tint]]} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <ThemedText variant="headline">{t(`services.${category.id}`)}</ThemedText>
                <ThemedText variant="caption">{t(`services.${category.id}Body`)}</ThemedText>
              </View>
              <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
                <Icon name="chevronDown" size={18} color={colors.icon} />
              </View>
            </Pressable>
            {open && category.chips.length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
                {category.chips.map((chipId) => (
                  <Chip
                    key={chipId}
                    label={t(`services.${chipId}`)}
                    onPress={() =>
                      router.push({
                        pathname: '/directory',
                        params: { filter: chipId },
                      })
                    }
                  />
                ))}
              </View>
            ) : null}
          </Card>
        );
      })}
    </Screen>
  );
}
