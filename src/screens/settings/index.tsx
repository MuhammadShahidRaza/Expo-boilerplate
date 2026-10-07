import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useSession } from '@/context/session-context';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { unblockAuthor } from '@/store/slices/world';
import { confirmAction } from '@/utils/confirm';
import { stableList } from '@/utils/feed';

const noReports: { postId: string; reason: string; authorName: string; body: string }[] = [];
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { radius, spacing } from '@/theme';

type RowProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
  danger?: boolean;
};

function Row({ icon, label, onPress, danger = false }: RowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm + 2,
        opacity: pressed ? 0.75 : 1,
      })}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.md,
          backgroundColor: danger ? colors.dangerSoft : colors.chip,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={icon} size={18} color={danger ? colors.error : colors.text} />
      </View>
      <ThemedText variant="headline" themeColor={danger ? 'error' : 'text'} style={{ flex: 1 }}>
        {label}
      </ThemedText>
      {danger ? null : <Icon name="chevronRight" size={18} color={colors.textDisabled} />}
    </Pressable>
  );
}

export function SettingsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, signOut, deleteAccount } = useSession();
  const dispatch = useAppDispatch();
  const blocked = useAppSelector((state) => stableList(state.world.blockedAuthors));
  const reports = useAppSelector((state) => state.world.reports ?? noReports);

  function onLogout() {
    confirmAction({
      title: t('common.logoutTitle'),
      message: t('common.logoutBody'),
      confirmLabel: t('settings.logout'),
      cancelLabel: t('common.cancel'),
      onConfirm: () => void signOut(),
    });
  }

  function onDeleteAccount() {
    confirmAction({
      title: t('settings.deleteAccountTitle'),
      message: t('settings.deleteAccountBody'),
      confirmLabel: t('settings.deleteAccount'),
      cancelLabel: t('common.cancel'),
      onConfirm: () => void deleteAccount(),
    });
  }

  function onUnblock(name: string) {
    confirmAction({
      title: t('post.unblockTitle', { name }),
      message: t('post.unblockBody'),
      confirmLabel: t('post.unblock'),
      cancelLabel: t('common.cancel'),
      onConfirm: () => dispatch(unblockAuthor(name)),
    });
  }

  const rows: { icon: IconName; label: string; href: string }[] = [
    { icon: 'verified', label: t('settings.verification'), href: '/identity' },
    { icon: 'bell', label: t('settings.notifications'), href: '/notification-preferences' },
    { icon: 'lock', label: t('settings.password'), href: '/change-password' },
    { icon: 'info', label: t('settings.about'), href: '/legal/about' },
    { icon: 'shield', label: t('settings.privacy'), href: '/legal/privacy' },
    { icon: 'doc', label: t('settings.terms'), href: '/legal/terms' },
    { icon: 'mic', label: t('settings.contact'), href: '/contact' },
    { icon: 'bookmark', label: t('settings.saved'), href: '/saved' },
    { icon: 'translate', label: t('settings.language'), href: '/language' },
    { icon: 'sparkles', label: t('settings.theme'), href: '/theme' },
  ];

  return (
    <Screen>
      <ScreenHeader title={t('settings.title')} />

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Avatar source={user?.avatarUri || 'portrait'} size={56} ring />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ThemedText variant="headline">{user?.fullName}</ThemedText>
              {user?.verified ? <Icon name="verified" size={16} color={colors.info} /> : null}
            </View>
            <ThemedText variant="caption">{user?.email}</ThemedText>
          </View>
        </View>
      </Card>

      <Card>
        {rows.map((row, index) => (
          <View key={row.href}>
            <Row icon={row.icon} label={row.label} onPress={() => router.push(row.href as never)} />
            {index < rows.length - 1 ? (
              <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 56 }} />
            ) : null}
          </View>
        ))}
      </Card>

      {blocked.length > 0 ? (
        <Card>
          <ThemedText variant="label">{t('post.blockedTitle')}</ThemedText>
          {blocked.map((name) => (
            <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm }}>
              <ThemedText variant="headline" style={{ flex: 1 }}>
                {name}
              </ThemedText>
              <Pressable accessibilityRole="button" onPress={() => onUnblock(name)}>
                <ThemedText variant="label" themeColor="link">
                  {t('post.unblock')}
                </ThemedText>
              </Pressable>
            </View>
          ))}
        </Card>
      ) : null}

      <Card>
        <ThemedText variant="label">{t('post.reportList')}</ThemedText>
        {reports.length === 0 ? (
          <ThemedText variant="caption" style={{ marginTop: spacing.sm }}>
            {t('post.reportEmpty')}
          </ThemedText>
        ) : (
          reports.map((report) => (
            <View key={report.postId} style={{ gap: 2, paddingTop: spacing.sm }}>
              <ThemedText variant="headline">{report.authorName}</ThemedText>
              <ThemedText variant="caption" numberOfLines={2}>
                {report.body}
              </ThemedText>
              <ThemedText variant="caption" themeColor="error">
                {t(`post.${report.reason}`)}
              </ThemedText>
            </View>
          ))
        )}
      </Card>

      <Card>
        <Row icon="logout" label={t('settings.logout')} danger onPress={onLogout} />
        <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 56 }} />
        <Row icon="trash" label={t('settings.deleteAccount')} danger onPress={onDeleteAccount} />
      </Card>
    </Screen>
  );
}
