export type PushResult =
  | { status: 'ok'; token: string }
  | { status: 'denied' }
  | { status: 'unavailable' };

export async function registerForPushNotifications(): Promise<PushResult> {
  return { status: 'unavailable' };
}
