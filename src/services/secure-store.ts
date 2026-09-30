import '@/utils/install-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const SECRET_KEYS = {
  accountPassword: 'ccworld.account-password',
  authToken: 'ccworld.auth-token',
} as const;

function webStorage() {
  return typeof localStorage === 'undefined' ? null : localStorage;
}

export async function setSecret(key: string, value: string) {
  if (Platform.OS === 'web') {
    webStorage()?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function getSecret(key: string) {
  if (Platform.OS === 'web') {
    return webStorage()?.getItem(key) ?? null;
  }
  return SecureStore.getItemAsync(key);
}

export async function deleteSecret(key: string) {
  if (Platform.OS === 'web') {
    webStorage()?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
