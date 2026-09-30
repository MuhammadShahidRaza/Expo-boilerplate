import axios from 'axios';

import { getSecret, SECRET_KEYS } from '@/services/secure-store';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  const token = await getSecret(SECRET_KEYS.authToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function hasApi() {
  return Boolean(process.env.EXPO_PUBLIC_API_URL);
}
