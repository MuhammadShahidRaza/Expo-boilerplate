export const languages = [
  { code: 'en', nativeLabel: 'English', rtl: false },
  { code: 'es', nativeLabel: 'Español', rtl: false },
  { code: 'nl', nativeLabel: 'Nederlands', rtl: false },
  { code: 'de', nativeLabel: 'Deutsch', rtl: false },
  { code: 'pt', nativeLabel: 'Português', rtl: false },
  { code: 'ar', nativeLabel: 'العربية', rtl: true },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

export function isLanguageCode(value: string | null | undefined): value is LanguageCode {
  return languages.some((language) => language.code === value);
}
