import { Alert } from 'react-native';

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
};

export function confirmAction({ title, message, confirmLabel, cancelLabel, onConfirm }: ConfirmOptions) {
  if (process.env.EXPO_OS === 'web') {
    const ok = window.confirm(message ? `${title}\n\n${message}` : title);
    if (ok) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
