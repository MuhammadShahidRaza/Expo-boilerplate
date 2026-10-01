import { useState } from 'react';
import { Alert, Linking, Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { validateContact } from '@/validation';
import { radius, spacing } from '@/theme';

export function ContactScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});

  function onSubmit() {
    const nextErrors = validateContact({ subject, message }, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    Alert.alert(t('validation.sent'));
    setSubject('');
    setMessage('');
  }

  return (
    <Screen
      keyboard
      footer={<Button title={t('settings.contactNow')} onPress={onSubmit} />}>
      <ScreenHeader title={t('settings.contact')} />
      <ThemedText variant="body">{t('settings.contactBody')}</ThemedText>
      <TextField
        label={t('settings.subject')}
        placeholder={t('settings.subjectPlaceholder')}
        value={subject}
        onChangeText={setSubject}
        error={errors.subject}
      />
      <TextField
        label={t('settings.message')}
        placeholder={t('settings.messagePlaceholder')}
        value={message}
        onChangeText={setMessage}
        multiline
        error={errors.message}
      />
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={t('settings.emailNote')}
        onPress={() => void Linking.openURL('mailto:support@ccworld.app')}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          backgroundColor: colors.goldSoft,
          borderRadius: radius.xl,
          padding: spacing.md,
          opacity: pressed ? 0.85 : 1,
        })}>
        <Icon name="mail" size={18} color={colors.gold} />
        <ThemedText variant="subhead" themeColor="gold" style={{ flex: 1 }}>
          {t('settings.emailNote')}
        </ThemedText>
      </Pressable>
    </Screen>
  );
}
