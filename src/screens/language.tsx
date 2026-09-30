import { router } from 'expo-router';
import { View } from 'react-native';

import { GroupedList, GroupedRow } from '@/components/grouped-list';
import { languages, type LanguageCode } from '@/constants/languages';
import { useSession } from '@/context/session-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { spacing } from '@/theme';

export function LanguageScreen({ purpose }: { purpose: 'onboarding' | 'pick' }) {
  const { colors } = useTheme();
  const { language, changeLanguage } = useTranslation();
  const { completeOnboarding } = useSession();

  async function onSelect(code: LanguageCode) {
    if (purpose === 'onboarding') {
      await completeOnboarding();
    }
    await changeLanguage(code);
    if (purpose === 'onboarding') {
      router.replace('/get-started');
      return;
    }
    if (router.canGoBack()) router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.md }}>
      <GroupedList>
        {languages.map((item) => (
          <GroupedRow
            key={item.code}
            title={item.nativeLabel}
            selected={language === item.code}
            onPress={() => {
              void onSelect(item.code);
            }}
          />
        ))}
      </GroupedList>
    </View>
  );
}
