import { useCallback } from 'react';

import { registerForPushNotifications } from '@/services/notifications';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPushToken } from '@/store/slices/notifications';

export function usePushNotifications() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.notifications.token);

  const enable = useCallback(async () => {
    const result = await registerForPushNotifications();
    if (result.status === 'ok') dispatch(setPushToken(result.token));
    return result;
  }, [dispatch]);

  return { token, enable };
}
