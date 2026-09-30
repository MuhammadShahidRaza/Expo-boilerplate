import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

const slideKeys = [
  ['auth.slide1Title', 'auth.slide1Body'],
  ['auth.slide2Title', 'auth.slide2Body'],
  ['auth.slide3Title', 'auth.slide3Body'],
] as const;

export function OnboardingScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const [titleKey, bodyKey] = slideKeys[index];
  const last = index === slideKeys.length - 1;

  function continueFlow() {
    router.push('/language?flow=onboarding');
  }

  return (
    <Screen contentContainerStyle={{ justifyContent: 'space-between' }}>
      <View style={{ gap: spacing.sm, paddingTop: spacing.xl }}>
        <ThemedText variant="largeTitle">{t(titleKey)}</ThemedText>
        <ThemedText variant="body">{t(bodyKey)}</ThemedText>
      </View>

      <View style={{ gap: spacing.lg }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' }}>
          {slideKeys.map((slide, slideIndex) => (
            <View
              key={slide[0]}
              style={{
                width: slideIndex === index ? 22 : 8,
                height: 8,
                borderRadius: radius.full,
                backgroundColor: slideIndex === index ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
        <Button
          title={last ? t('common.getStarted') : t('common.next')}
          onPress={() => {
            if (last) continueFlow();
            else setIndex((value) => value + 1);
          }}
        />
        {last ? null : (
          <Button title={t('common.skip')} variant="ghost" onPress={continueFlow} />
        )}
      </View>
    </Screen>
  );
}
