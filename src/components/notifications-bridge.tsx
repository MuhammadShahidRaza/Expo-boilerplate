import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import '@/services/notifications';

import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/notifications';

export function NotificationsBridge() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (process.env.EXPO_OS === 'web') return;
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      dispatch(
        addNotification({
          id: notification.request.identifier,
          title: notification.request.content.title ?? '',
          body: notification.request.content.body ?? '',
          receivedAt: new Date().toISOString(),
        }),
      );
    });
    return () => subscription.remove();
  }, [dispatch]);

  return null;
}
