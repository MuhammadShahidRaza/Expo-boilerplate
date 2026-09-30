import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

if (process.env.EXPO_OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export type PushResult =
  | { status: 'ok'; token: string }
  | { status: 'denied' }
  | { status: 'unavailable' };

export async function registerForPushNotifications(): Promise<PushResult> {
  if (process.env.EXPO_OS === 'web' || !Device.isDevice) {
    return { status: 'unavailable' };
  }

  const existing = await Notifications.getPermissionsAsync();
  const permission =
    existing.status === 'granted' ? existing : await Notifications.requestPermissionsAsync();
  if (permission.status !== 'granted') return { status: 'denied' };

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return { status: 'unavailable' };

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return { status: 'ok', token: token.data };
  } catch (error) {
    console.warn('push token failed', error);
    return { status: 'unavailable' };
  }
}
