import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { passwordChecks } from '@/validation';
import { radius, spacing } from '@/theme';

type PasswordRulesProps = {
  value: string;
  includeUppercase?: boolean;
};

export function PasswordRules({ value, includeUppercase = true }: PasswordRulesProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const checks = passwordChecks(value);
  const rules = [
    { ok: checks.length, label: t('validation.ruleLength') },
    ...(includeUppercase ? [{ ok: checks.upper, label: t('validation.ruleUpper') }] : []),
    { ok: checks.number, label: t('validation.ruleNumber') },
    { ok: checks.special, label: t('validation.ruleSpecial') },
  ];

  return (
    <View style={{ backgroundColor: colors.backgroundElement, borderRadius: radius.xl, padding: spacing.md, gap: spacing.sm }}>
      <ThemedText variant="headline" themeColor="text">
        {t('validation.requirements')}
      </ThemedText>
      {rules.map((rule) => (
        <View key={rule.label} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: rule.ok ? colors.success : 'transparent',
              borderWidth: 1.5,
              borderColor: rule.ok ? colors.success : colors.textDisabled,
            }}>
            <ThemedText variant="caption" style={{ color: rule.ok ? colors.textInverse : colors.textDisabled, fontSize: 11, lineHeight: 14 }}>
              {rule.ok ? '✓' : ''}
            </ThemedText>
          </View>
          <ThemedText variant="subhead" themeColor={rule.ok ? 'success' : 'textSecondary'}>
            {rule.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}
