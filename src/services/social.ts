import { Platform } from 'react-native';

export function googleClientIdForPlatform() {
  if (Platform.OS === 'ios') return process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  if (Platform.OS === 'android') return process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
}

export function readIdTokenProfile(idToken: string) {
  try {
    const segment = idToken.split('.')[1];
    if (!segment || typeof atob !== 'function') return {};
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(normalized)) as { email?: string; name?: string };
    return { email: json.email, fullName: json.name };
  } catch {
    return {};
  }
}
