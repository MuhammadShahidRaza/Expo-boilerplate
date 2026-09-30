import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import { Button } from '@/components/button';
import { GroupedList, GroupedRow } from '@/components/grouped-list';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/context/session-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { radius, spacing } from '@/theme';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function ProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, signOut } = useSession();

  function finishLogout() {
    void signOut().then(() => router.replace('/get-started'));
  }

  function onLogout() {
    if (process.env.EXPO_OS === 'web') {
      const confirmed = window.confirm(`${t('common.logoutTitle')}\n\n${t('common.logoutBody')}`);
      if (confirmed) finishLogout();
      return;
    }

    Alert.alert(t('common.logoutTitle'), t('common.logoutBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.logout'), style: 'destructive', onPress: finishLogout },
    ]);
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        {user?.avatarUri ? (
          <Image
            source={{ uri: user.avatarUri }}
            style={{ width: 56, height: 56, borderRadius: radius.full }}
          />
        ) : (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.full,
              backgroundColor: colors.backgroundElement,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ThemedText variant="headline">{initials(user?.fullName ?? '')}</ThemedText>
          </View>
        )}
        <View style={{ flex: 1, gap: spacing.xs }}>
          <ThemedText variant="headline">{user?.fullName}</ThemedText>
          <ThemedText selectable variant="subhead">
            {user?.email}
          </ThemedText>
        </View>
      </View>
      <GroupedList>
        <GroupedRow title={t('common.editProfile')} onPress={() => router.push('/edit-profile')} />
        <GroupedRow title={t('common.settings')} onPress={() => router.push('/settings')} />
        <GroupedRow title={t('common.language')} onPress={() => router.push('/language')} />
        <GroupedRow title={t('common.theme')} onPress={() => router.push('/theme')} />
      </GroupedList>
      <Button title={t('common.logout')} variant="destructive" onPress={onLogout} />
    </Screen>
  );
}
