import { api } from '@/services/api/client';
import { API_ROUTES } from '@/services/api/routes';

export type AuthUser = {
  name?: string;
  full_name?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
};

export type AuthResponse = {
  token?: string;
  access_token?: string;
  user?: AuthUser;
  data?: {
    token?: string;
    access_token?: string;
    user?: AuthUser;
  };
};

export function authToken(response: AuthResponse) {
  return response.token ?? response.access_token ?? response.data?.token ?? response.data?.access_token ?? null;
}

export function authUser(response: AuthResponse) {
  return response.user ?? response.data?.user ?? null;
}

export async function loginRequest(email: string, password: string) {
  const { data } = await api.post<AuthResponse>(API_ROUTES.LOGIN, { email, password });
  return data;
}

export async function registerRequest(fullName: string, email: string, password: string) {
  const { data } = await api.post<AuthResponse>(API_ROUTES.REGISTER, {
    name: fullName,
    email,
    password,
  });
  return data;
}

export async function socialLoginRequest(provider: 'google' | 'apple', token: string, email?: string) {
  const { data } = await api.post<AuthResponse>(API_ROUTES.SOCIAL_LOGIN, { provider, token, email });
  return data;
}

export async function forgotPasswordRequest(email: string) {
  const { data } = await api.post(API_ROUTES.FORGOT_PASSWORD, { email });
  return data;
}

export async function resetPasswordRequest(email: string, password: string, code?: string) {
  const { data } = await api.post(API_ROUTES.RESET_PASSWORD, { email, password, code });
  return data;
}

export async function changePasswordRequest(currentPassword: string, password: string) {
  const { data } = await api.post(API_ROUTES.CHANGE_PASSWORD, {
    current_password: currentPassword,
    password,
  });
  return data;
}

export async function updateProfileRequest(fullName: string, email: string) {
  const { data } = await api.post(API_ROUTES.UPDATE_PROFILE, { name: fullName, email });
  return data;
}

export async function uploadProfilePicture(uri: string) {
  const form = new FormData();
  if (process.env.EXPO_OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    form.append('file', blob, 'avatar.jpg');
  } else {
    form.append('file', {
      uri,
      name: 'avatar.jpg',
      type: 'image/jpeg',
    } as unknown as Blob);
  }

  const { data } = await api.post(API_ROUTES.UPLOAD_PROFILE_PICTURE, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
