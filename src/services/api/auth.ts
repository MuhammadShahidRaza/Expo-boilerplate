import { ENV } from '@/constants/env';
import { API_ROUTES } from '@/services/api/routes';
import { post, postWithSingleFile } from '@/services/api/http';

export type AuthUser = {
  name?: string;
  full_name?: string;
  fullName?: string;
  email?: string;
  avatar?: string | null;
  token?: string;
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
  message?: string;
};

const DUMMY_USER: AuthUser = {
  fullName: 'John Doe',
  full_name: 'John Doe',
  name: 'John Doe',
  email: 'johndoe@example.com',
  avatar: null,
  token: 'temp_token',
};

function alphaAuth(email?: string): AuthResponse {
  return {
    token: 'temp_token',
    user: { ...DUMMY_USER, email: email || DUMMY_USER.email },
    message: 'Alpha phase',
  };
}

export function authToken(response?: AuthResponse | null) {
  if (!response) return null;
  return response.token ?? response.access_token ?? response.data?.token ?? response.data?.access_token ?? null;
}

export function authUser(response?: AuthResponse | null) {
  if (!response) return null;
  return response.user ?? response.data?.user ?? null;
}

export async function loginRequest(email: string, password: string) {
  if (ENV.IS_ALPHA_PHASE) return alphaAuth(email);
  return (await post({
    url: API_ROUTES.LOGIN,
    data: { email, password },
    includeToken: false,
  })) as AuthResponse | undefined;
}

export async function registerRequest(fullName: string, email: string, password: string) {
  if (ENV.IS_ALPHA_PHASE) return alphaAuth(email);
  return (await post({
    url: API_ROUTES.REGISTER,
    data: { name: fullName, email, password },
    includeToken: false,
  })) as AuthResponse | undefined;
}

export async function socialLoginRequest(provider: 'google' | 'apple', token: string, email?: string) {
  if (ENV.IS_ALPHA_PHASE) return alphaAuth(email);
  return (await post({
    url: API_ROUTES.SOCIAL_LOGIN,
    data: { provider, token, email },
    includeToken: false,
  })) as AuthResponse | undefined;
}

export async function forgotPasswordRequest(email: string) {
  if (ENV.IS_ALPHA_PHASE) return { message: 'Alpha phase' };
  return post({ url: API_ROUTES.FORGOT_PASSWORD, data: { email }, includeToken: false });
}

export async function resetPasswordRequest(email: string, password: string, code?: string) {
  if (ENV.IS_ALPHA_PHASE) return { message: 'Alpha phase' };
  return post({ url: API_ROUTES.RESET_PASSWORD, data: { email, password, code }, includeToken: false });
}

export async function changePasswordRequest(currentPassword: string, password: string) {
  if (ENV.IS_ALPHA_PHASE) return { message: 'Alpha phase' };
  return post({
    url: API_ROUTES.CHANGE_PASSWORD,
    data: { current_password: currentPassword, password },
  });
}

export async function updateProfileRequest(fullName: string, email: string) {
  if (ENV.IS_ALPHA_PHASE) return alphaAuth(email);
  return post({ url: API_ROUTES.UPDATE_PROFILE, data: { name: fullName, email } });
}

export async function uploadProfilePicture(uri: string) {
  if (ENV.IS_ALPHA_PHASE) return;
  let file: { uri: string; name: string; type: string } | Blob = {
    uri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  };
  if (process.env.EXPO_OS === 'web') {
    const response = await fetch(uri);
    file = await response.blob();
  }
  return postWithSingleFile({
    url: API_ROUTES.UPLOAD_PROFILE_PICTURE,
    data: { file },
  });
}
