import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { spacing } from '@/theme';

const pages = {
  about: {
    title: 'settings.about',
    sections: [
      { title: 'settings.aboutTitle', body: 'settings.aboutBody' },
      { title: 'settings.privacy', body: 'settings.privacyBody' },
    ],
  },
  privacy: {
    title: 'settings.privacy',
    sections: [
      { title: 'settings.privacy', body: 'settings.privacyBody' },
      { title: 'settings.privacy', body: 'legal.privacyBody' },
    ],
  },
  terms: {
    title: 'settings.terms',
    sections: [
      { title: 'settings.terms', body: 'settings.termsBody' },
      { title: 'settings.terms', body: 'legal.termsBody' },
    ],
  },
} as const;

type LegalSlug = keyof typeof pages;

function isLegalSlug(value: string): value is LegalSlug {
  return value in pages;
}

export function LegalPage() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const key = typeof slug === 'string' ? slug : '';

  useEffect(() => {
    if (!isLegalSlug(key)) router.back();
  }, [key]);

  if (!isLegalSlug(key)) return null;

  const page = pages[key];

  return (
    <Screen>
      <ScreenHeader title={t(page.title)} />
      {page.sections.map((section) => (
        <View key={section.body} style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ width: 3, borderRadius: 2, backgroundColor: colors.gold }} />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <ThemedText variant="headline" themeColor="gold">
              {t(section.title)}
            </ThemedText>
            <ThemedText variant="body">{t(section.body)}</ThemedText>
          </View>
        </View>
      ))}
    </Screen>
  );
}
