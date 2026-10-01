import { reloadAppAsync } from 'expo';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { I18nManager } from 'react-native';
import { initReactI18next } from 'react-i18next';

import { isLanguageCode, type LanguageCode } from '@/constants/languages';
import { STORAGE_KEYS } from '@/constants/storage';
import { en } from '@/i18n/languages/en';
import { es } from '@/i18n/languages/es';
import { fr } from '@/i18n/languages/fr';
import { ht } from '@/i18n/languages/ht';
import { store } from '@/store';
import { setAppLanguage } from '@/store/slices/app';
import { getItem, removeItem, setItem } from '@/utils/storage';

export const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  ht: { translation: ht },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function deviceLanguage(): LanguageCode {
  const code = getLocales()[0]?.languageCode;
  return isLanguageCode(code) ? code : 'en';
}

async function syncDirection(_language: LanguageCode) {
  const shouldRTL = false;
  if (I18nManager.isRTL === shouldRTL) {
    await removeItem(STORAGE_KEYS.rtlAttempt);
    return false;
  }

  const signature = shouldRTL ? 'rtl' : 'ltr';
  const attempted = await getItem<string>(STORAGE_KEYS.rtlAttempt);
  if (attempted === signature) return false;

  await setItem(STORAGE_KEYS.rtlAttempt, signature);
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(shouldRTL);
  await reloadAppAsync();
  return true;
}

export async function loadSavedLanguage() {
  const saved = await getItem<string>(STORAGE_KEYS.language);
  const persisted = store.getState().app.language;
  const language = isLanguageCode(saved) ? saved : isLanguageCode(persisted) ? persisted : deviceLanguage();
  if (!isLanguageCode(saved)) await setItem(STORAGE_KEYS.language, language);
  if (persisted !== language) store.dispatch(setAppLanguage(language));
  await i18n.changeLanguage(language);
  return syncDirection(language);
}

export async function changeAppLanguage(code: LanguageCode) {
  await setItem(STORAGE_KEYS.language, code);
  store.dispatch(setAppLanguage(code));
  await i18n.changeLanguage(code);
  await syncDirection(code);
}

export default i18n;
