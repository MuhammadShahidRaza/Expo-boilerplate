export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? '',
  IS_ALPHA_PHASE: process.env.EXPO_PUBLIC_IS_ALPHA_PHASE !== 'false',
} as const;
