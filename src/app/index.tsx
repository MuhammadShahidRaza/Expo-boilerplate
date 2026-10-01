import { Redirect } from 'expo-router';

import { regions } from '@/data/catalog';
import { useSession } from '@/context/session-context';
import { useAppSelector } from '@/store/hooks';

export default function Index() {
  const { user } = useSession();
  const world = useAppSelector((state) => state.world);

  if (user) return <Redirect href="/home" />;
  if (!world.countryCode) return <Redirect href="/community" />;
  if (world.countryCode && regions[world.countryCode] && !world.stateName && !world.stateSkipped) {
    return <Redirect href="/state" />;
  }
  if (!world.languagePicked) return <Redirect href="/pick-language" />;
  if (!world.introSeen) return <Redirect href="/intro" />;
  return <Redirect href="/login" />;
}
