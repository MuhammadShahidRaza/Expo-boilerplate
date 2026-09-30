import { Redirect } from 'expo-router';

import { useSession } from '@/context/session-context';

export default function Index() {
  const { user, hasOnboarded } = useSession();

  if (user) return <Redirect href="/home" />;
  if (!hasOnboarded) return <Redirect href="/onboarding" />;
  return <Redirect href="/get-started" />;
}
