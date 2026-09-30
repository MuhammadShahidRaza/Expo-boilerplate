import { useState } from 'react';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { useSession } from '@/context/session-context';
import { useTranslation } from '@/hooks/use-translation';

export function ChangePasswordScreen() {
  const { t } = useTranslation();
  const { updatePassword } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentError, setCurrentError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  async function onSubmit() {
    const nextCurrent = currentPassword ? '' : t('common.passwordRequired');
    const nextPassword = !password
      ? t('common.passwordRequired')
      : password.length < 8
        ? t('common.passwordShort')
        : '';
    const nextConfirm = password !== confirmPassword ? t('common.passwordMismatch') : '';
    setCurrentError(nextCurrent);
    setPasswordError(nextPassword);
    setConfirmError(nextConfirm);
    if (nextCurrent || nextPassword || nextConfirm) return;

    const result = await updatePassword(currentPassword, password);
    if (result === 'invalid') {
      setCurrentError(t('common.wrongPassword'));
      return;
    }
    router.back();
  }

  return (
    <Screen>
      <TextField
        label={t('common.currentPassword')}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        error={currentError}
      />
      <TextField
        label={t('common.newPassword')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="newPassword"
        error={passwordError}
      />
      <TextField
        label={t('common.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        error={confirmError}
      />
      <Button title={t('common.save')} onPress={() => void onSubmit()} />
    </Screen>
  );
}
