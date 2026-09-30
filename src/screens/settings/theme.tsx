import { View } from 'react-native';

import { GroupedList, GroupedRow } from '@/components/grouped-list';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { spacing, type ThemeMode } from '@/theme';

const modes: ThemeMode[] = ['system', 'light', 'dark'];

export function ThemeScreen() {
  const { t } = useTranslation();
  const { colors, themeMode, setThemeMode } = useTheme();

  const labels: Record<ThemeMode, string> = {
    system: t('common.system'),
    light: t('common.light'),
    dark: t('common.dark'),
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.md }}>
      <GroupedList>
        {modes.map((mode) => (
          <GroupedRow
            key={mode}
            title={labels[mode]}
            selected={themeMode === mode}
            onPress={() => setThemeMode(mode)}
          />
        ))}
      </GroupedList>
    </View>
  );
}
