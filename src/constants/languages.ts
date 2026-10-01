export const languages = [
  { code: 'ht', nativeLabel: 'Kreyòl Ayisyen', englishLabel: 'Haitian Creole', short: 'KR', rtl: false },
  { code: 'en', nativeLabel: 'English', englishLabel: 'English', short: 'EN', rtl: false },
  { code: 'fr', nativeLabel: 'Français', englishLabel: 'French', short: 'FR', rtl: false },
  { code: 'es', nativeLabel: 'Español', englishLabel: 'Spanish', short: 'ES', rtl: false },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

export function isLanguageCode(value: string | null | undefined): value is LanguageCode {
  return languages.some((language) => language.code === value);
}
