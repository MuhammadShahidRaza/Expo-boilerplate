import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { jobs } from '@/data/catalog';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch } from '@/store/hooks';
import { markIntroSeen } from '@/store/slices/world';
import { radius, spacing } from '@/theme';

const INITIALS = ['MC', 'JB', 'PL', 'SB', 'NF'] as const;

const BUSINESSES = [
  { initials: 'CM', name: 'Chez Marie Restaurant', rating: '4.8', tier: 'Platinum' },
  { initials: 'PT', name: 'Pierre Tax & Accounting', rating: '4.6', tier: 'Gold' },
] as const;

export function IntroScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [index, setIndex] = useState(0);

  function finish() {
    dispatch(markIntroSeen());
    router.replace('/login');
  }

  function onNext() {
    if (index >= 2) {
      finish();
      return;
    }
    setIndex((value) => value + 1);
  }

  const titles = [t('intro.slide1Title'), t('intro.slide2Title'), t('intro.slide3Title')] as const;
  const bodies = [t('intro.slide1Body'), t('intro.slide2Body'), t('intro.slide3Body')] as const;

  return (
    <Screen footer={<Button title={t('common.next')} trailing="arrowRight" onPress={onNext} />}>
      <View style={{ position: 'relative' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.skip')}
          onPress={finish}
          style={{
            position: 'absolute',
            top: spacing.sm,
            right: spacing.sm,
            zIndex: 2,
            backgroundColor: colors.tabBar,
            borderRadius: radius.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs + 2,
            borderWidth: 1,
            borderColor: colors.textInverse,
          }}>
          <ThemedText variant="label" themeColor="textInverse">
            {t('common.skip')}
          </ThemedText>
        </Pressable>

        <View
          style={{
            backgroundColor: colors.tabBar,
            borderRadius: radius.xxl,
            padding: spacing.lg,
            paddingTop: spacing.xl + spacing.sm,
            minHeight: 280,
            justifyContent: 'center',
            gap: spacing.md,
          }}>
          {index === 0 ? (
            <View style={{ gap: spacing.md, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {INITIALS.map((initials, i) => (
                  <View
                    key={initials}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: radius.full,
                      backgroundColor: colors.gold,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: i === 0 ? 0 : -10,
                      borderWidth: 2,
                      borderColor: colors.tabBar,
                    }}>
                    <ThemedText variant="label" themeColor="onGold">
                      {initials}
                    </ThemedText>
                  </View>
                ))}
              </View>
              <View
                style={{
                  alignSelf: 'stretch',
                  backgroundColor: colors.primary,
                  borderRadius: radius.xl,
                  padding: spacing.md,
                  gap: spacing.sm,
                }}>
                <ThemedText variant="headline" themeColor="gold">
                  Little Haiti Miami
                </ThemedText>
                <ThemedText variant="caption" themeColor="tabBarInactive">
                  {t('intro.members', { count: '1,284', place: 'Florida, United States' })}
                </ThemedText>
                <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
                  <Badge label={t('common.verified')} tone="success" icon="verified" />
                  <Badge label={t('intro.chapter')} tone="gold" />
                </View>
              </View>
            </View>
          ) : null}

          {index === 1 ? (
            <View style={{ gap: spacing.sm }}>
              {BUSINESSES.map((business) => (
                <View
                  key={business.name}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                    backgroundColor: colors.primary,
                    borderRadius: radius.xl,
                    padding: spacing.sm + 4,
                  }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.md,
                      backgroundColor: colors.tabBar,
                      borderWidth: 1,
                      borderColor: colors.gold,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ThemedText variant="label" themeColor="gold">
                      {business.initials}
                    </ThemedText>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText variant="headline" themeColor="textInverse">
                      {business.name}
                    </ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="star" size={14} color={colors.gold} />
                      <ThemedText variant="caption" themeColor="gold">
                        {business.rating}
                      </ThemedText>
                    </View>
                  </View>
                  <Chip label={business.tier} tone="gold" />
                </View>
              ))}
            </View>
          ) : null}

          {index === 2 ? (
            <View style={{ gap: spacing.sm }}>
              {jobs.map((job) => (
                <View
                  key={job.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                    backgroundColor: colors.primary,
                    borderRadius: radius.xl,
                    padding: spacing.md,
                  }}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText variant="headline" themeColor="textInverse">
                      {job.title}
                    </ThemedText>
                    <ThemedText variant="caption" themeColor="tabBarInactive">
                      {job.place}
                    </ThemedText>
                  </View>
                  <Chip label={t(`jobs.${job.type}`)} tone="gold" />
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View style={{ alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm }}>
        <View style={{ width: 36, height: 4, borderRadius: radius.full, backgroundColor: colors.gold }} />
        <ThemedText variant="title" themeColor="text" style={{ textAlign: 'center' }}>
          {titles[index]}
        </ThemedText>
        <ThemedText variant="body" style={{ textAlign: 'center' }}>
          {bodies[index]}
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm }}>
          {[0, 1, 2].map((dot) => (
            <View
              key={dot}
              style={{
                width: dot === index ? 22 : 8,
                height: 8,
                borderRadius: radius.full,
                backgroundColor: dot === index ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}
