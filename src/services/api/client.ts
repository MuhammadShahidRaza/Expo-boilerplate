import axios from 'axios';

import { ENV } from '@/constants/env';
import { getSecret, SECRET_KEYS } from '@/services/secure-store';

export const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  const headers = config.headers;
  const skip = headers?.['X-Skip-Auth'];
  if (skip) {
    delete headers['X-Skip-Auth'];
    return config;
  }
  const token = await getSecret(SECRET_KEYS.authToken);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function hasApi() {
  return Boolean(ENV.API_URL) && !ENV.IS_ALPHA_PHASE;
}
