import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { PasswordRules } from '@/components/ui/password-rules';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useSession } from '@/context/session-context';
import { useTranslation } from '@/hooks/use-translation';
import { validatePasswordChange } from '@/validation';

export function ChangePasswordScreen() {
  const { t } = useTranslation();
  const { updatePassword } = useSession();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});

  async function onSubmit() {
    const nextErrors = validatePasswordChange({ current, next, confirm }, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const result = await updatePassword(current, next);
    if (result === 'invalid') {
      setErrors({ current: t('validation.currentWrong') });
      return;
    }
    Alert.alert(t('common.passwordUpdated'));
    router.back();
  }

  return (
    <Screen keyboard footer={<Button title={t('common.save')} onPress={() => void onSubmit()} />}>
      <ScreenHeader title={t('common.changePassword')} />
      <TextField
        label={t('settings.current')}
        placeholder={t('settings.currentPlaceholder')}
        value={current}
        onChangeText={setCurrent}
        secureTextEntry
        icon="lock"
        error={errors.current}
      />
      <TextField
        label={t('settings.next')}
        placeholder={t('settings.nextPlaceholder')}
        value={next}
        onChangeText={setNext}
        secureTextEntry
        icon="lock"
        textContentType="newPassword"
        error={errors.next}
      />
      <TextField
        label={t('settings.confirm')}
        placeholder={t('settings.confirmPlaceholder')}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        icon="lock"
        error={errors.confirm}
      />
      <PasswordRules includeUppercase={false} value={next} />
    </Screen>
  );
}
