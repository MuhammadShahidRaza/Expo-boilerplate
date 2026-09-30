import { useLocalSearchParams } from 'expo-router';

import { LanguageScreen } from '@/screens/language';

export default function LanguageRoute() {
  const { flow } = useLocalSearchParams<{ flow?: string }>();
  return <LanguageScreen purpose={flow === 'onboarding' ? 'onboarding' : 'pick'} />;
}
