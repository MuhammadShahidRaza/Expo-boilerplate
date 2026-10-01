import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { CodeBadge } from '@/components/ui/code-badge';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SelectRow } from '@/components/ui/select-row';
import { languages, type LanguageCode } from '@/constants/languages';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch } from '@/store/hooks';
import { markLanguagePicked } from '@/store/slices/world';
import { spacing } from '@/theme';

export function LanguageSettingsScreen() {
  const { t, language, changeLanguage } = useTranslation();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<LanguageCode>(language);

  async function onSelect(code: LanguageCode) {
    setSelected(code);
    await changeLanguage(code);
  }

  function onSave() {
    dispatch(markLanguagePicked());
    router.back();
  }

  return (
    <Screen footer={<Button title={t('common.save')} onPress={onSave} />}>
      <ScreenHeader title={t('settings.language')} />
      <View style={{ gap: spacing.xs }}>
        <ThemedText variant="title" themeColor="text">
          {t('setup.chooseLanguage')}
        </ThemedText>
        <ThemedText variant="body">{t('setup.languageBody')}</ThemedText>
      </View>
      <View style={{ gap: spacing.sm }}>
        {languages.map((item) => {
          const active = selected === item.code;
          return (
            <SelectRow
              key={item.code}
              title={item.nativeLabel}
              subtitle={t(`languages.${item.code}`)}
              selected={active}
              leading={<CodeBadge code={item.short} active={active} />}
              trailing="check"
              onPress={() => void onSelect(item.code)}
            />
          );
        })}
      </View>
    </Screen>
  );
}
