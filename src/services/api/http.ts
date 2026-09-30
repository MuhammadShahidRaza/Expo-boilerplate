import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import NetInfo from '@react-native-community/netinfo';

import { ENV } from '@/constants/env';
import { api } from '@/services/api/client';
import { HttpError, NetworkError } from '@/services/api/errors';
import { deleteSecret, SECRET_KEYS } from '@/services/secure-store';
import { store } from '@/store';
import { resetAppSession } from '@/store/slices/app';
import { setIsAppLoading } from '@/store/slices/ui';
import { clearUser } from '@/store/slices/user';

type FileLike = {
  uri?: string;
  name?: string;
  type?: string;
};

export type RequestOptions = {
  url: string;
  data?: object;
  config?: AxiosRequestConfig;
  includeToken?: boolean;
  showLoader?: boolean;
  addToPending?: boolean;
};

type ApiErrorBody = {
  error?: { messages?: string[]; code?: number; message?: string };
  message?: string;
  messages?: string[];
  errors?: Array<string | { message?: string }>;
  code?: number;
};

type PendingRequest = {
  config: AxiosRequestConfig;
  includeToken: boolean;
  showLoader: boolean;
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
};

const pendingRequests: PendingRequest[] = [];

function isFileValue(value: unknown): value is FileLike {
  if (!value || typeof value !== 'object') return false;
  const file = value as FileLike;
  return Boolean(file.uri && file.name && file.type);
}

NetInfo.addEventListener((state) => {
  if (!state.isConnected || pendingRequests.length === 0) return;
  const queued = pendingRequests.splice(0, pendingRequests.length);
  queued.forEach((request) => {
    makeHttpRequest(request.config, request.includeToken, request.showLoader, false)
      .then(request.resolve)
      .catch(request.reject);
  });
});

function extractErrorMessage(body: ApiErrorBody) {
  if (body.error?.messages?.[0]) return body.error.messages[0];
  if (body.messages?.[0]) return body.messages[0];
  if (body.message) return body.message;
  const first = body.errors?.[0];
  if (typeof first === 'string') return first;
  if (first?.message) return first.message;
  if (body.error?.message) return body.error.message;
  return null;
}

async function checkUnAuth(status?: number) {
  if (status !== 401) return;
  store.dispatch(clearUser());
  store.dispatch(resetAppSession());
  await deleteSecret(SECRET_KEYS.authToken);
}

async function handleRequestError(error: AxiosError<ApiErrorBody>): Promise<never> {
  if (!error.response) {
    const netState = await NetInfo.fetch();
    if (error.code === 'ECONNABORTED') {
      throw new NetworkError('The request took too long to complete.');
    }
    if (!netState.isConnected) {
      throw new NetworkError('No internet connection.');
    }
    throw new NetworkError('Server unreachable.');
  }

  const status = error.response.status;
  const message = extractErrorMessage(error.response.data ?? {}) ?? error.response.statusText ?? 'Request failed';
  await checkUnAuth(status);
  throw new HttpError(message, status, error.response.data?.errors);
}

async function makeHttpRequest(
  config: AxiosRequestConfig,
  includeToken = true,
  showLoader = true,
  addToPending = false,
): Promise<unknown> {
  if (ENV.IS_ALPHA_PHASE) return;

  const netState = await NetInfo.fetch();
  if (!netState.isConnected) {
    if (addToPending) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ config, includeToken, showLoader, resolve, reject });
      });
    }
    store.dispatch(setIsAppLoading(false));
    throw new NetworkError('No internet connection.');
  }

  try {
    if (showLoader) store.dispatch(setIsAppLoading(true));
    const response = await api.request({
      ...config,
      headers: {
        ...config.headers,
        ...(includeToken ? {} : { 'X-Skip-Auth': '1' }),
      },
    });
    store.dispatch(setIsAppLoading(false));
    const body = response.data as { response?: unknown } | undefined;
    return body && typeof body === 'object' && 'response' in body && body.response ? body.response : response.data;
  } catch (error) {
    store.dispatch(setIsAppLoading(false));
    if (axios.isAxiosError(error)) {
      await handleRequestError(error);
    }
    throw error;
  }
}

function toFormData(data: object) {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;
    if (isFileValue(value)) {
      if (process.env.EXPO_OS === 'web') {
        form.append(key, value as unknown as Blob);
        return;
      }
      form.append(key, value as unknown as Blob);
      return;
    }
    form.append(key, typeof value === 'string' ? value : JSON.stringify(value));
  });
  return form;
}

export function get({ url, config = {}, includeToken = true, showLoader = true, addToPending = false }: RequestOptions) {
  return makeHttpRequest({ method: 'GET', url, ...config }, includeToken, showLoader, addToPending);
}

export function post({
  url,
  data,
  config = {},
  includeToken = true,
  showLoader = true,
  addToPending = false,
}: RequestOptions) {
  return makeHttpRequest({ method: 'POST', url, data, ...config }, includeToken, showLoader, addToPending);
}

export function put({
  url,
  data,
  config = {},
  includeToken = true,
  showLoader = true,
  addToPending = false,
}: RequestOptions) {
  return makeHttpRequest({ method: 'PUT', url, data, ...config }, includeToken, showLoader, addToPending);
}

export function patch({
  url,
  data,
  config = {},
  includeToken = true,
  showLoader = true,
  addToPending = false,
}: RequestOptions) {
  return makeHttpRequest({ method: 'PATCH', url, data, ...config }, includeToken, showLoader, addToPending);
}

export function remove({
  url,
  data,
  config = {},
  includeToken = true,
  showLoader = true,
  addToPending = false,
}: RequestOptions) {
  return makeHttpRequest({ method: 'DELETE', url, data, ...config }, includeToken, showLoader, addToPending);
}

export function postWithSingleFile({
  url,
  data = {},
  config = {},
  includeToken = true,
  showLoader = true,
}: RequestOptions) {
  if (ENV.IS_ALPHA_PHASE) return Promise.resolve(undefined);
  return makeHttpRequest(
    {
      method: 'POST',
      url,
      data: toFormData(data),
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    },
    includeToken,
    showLoader,
    false,
  );
}
