import '@/utils/install-storage';

import { webStorage } from '@/utils/web-storage';

export async function setItem(key: string, value: unknown) {
  try {
    webStorage().setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('setItem failed', key, error);
  }
}

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = webStorage().getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.warn('getItem failed', key, error);
    return null;
  }
}

export async function removeItem(key: string) {
  try {
    webStorage().removeItem(key);
  } catch (error) {
    console.warn('removeItem failed', key, error);
  }
}
