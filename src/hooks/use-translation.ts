import { useTranslation as useI18nTranslation } from 'react-i18next';

import { isLanguageCode, type LanguageCode } from '@/constants/languages';
import { changeAppLanguage } from '@/i18n';

export function useTranslation() {
  const { t, i18n } = useI18nTranslation();
  const language: LanguageCode = isLanguageCode(i18n.language) ? i18n.language : 'en';
  const isRTL = false;

  return {
    t,
    i18n,
    language,
    isRTL,
    changeLanguage: changeAppLanguage,
  };
}
