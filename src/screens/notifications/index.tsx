import { Pressable, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Icon, type IconName } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import type { Notice } from '@/data/content';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { markNoticesRead } from '@/store/slices/world';
import { radius, spacing } from '@/theme';
import { formatAgo } from '@/utils/time';

const kindIcon: Record<Notice['kind'], IconName> = {
  like: 'heart',
  comment: 'comment',
  alert: 'bell',
  message: 'mail',
  follow: 'person',
  event: 'calendar',
};

function NoticeLeading({ kind }: { kind: Notice['kind'] }) {
  const { colors } = useTheme();
  const icon = kindIcon[kind];

  if (kind === 'alert' || kind === 'event') {
    const soft = kind === 'alert' ? colors.dangerSoft : colors.goldSoft;
    const tint = kind === 'alert' ? colors.error : colors.gold;
    return (
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: radius.full,
          backgroundColor: soft,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={icon} size={20} color={tint} />
      </View>
    );
  }

  return (
    <View style={{ width: 48, height: 48 }}>
      <Avatar source="portrait" size={48} />
      <View
        style={{
          position: 'absolute',
          right: -2,
          bottom: -2,
          width: 22,
          height: 22,
          borderRadius: radius.full,
          backgroundColor:
            kind === 'like'
              ? colors.error
              : kind === 'follow'
                ? colors.tintPurple
                : kind === 'message'
                  ? colors.tintGreen
                  : colors.info,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: colors.card,
        }}>
        <Icon name={icon} size={11} color={colors.textInverse} />
      </View>
    </View>
  );
}

function NoticeRow({ notice }: { notice: Notice }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
      <NoticeLeading kind={notice.kind} />
      <View style={{ flex: 1, gap: 4 }}>
        <ThemedText variant="body" themeColor={notice.kind === 'alert' ? 'error' : 'text'}>
          {notice.body}
        </ThemedText>
        <ThemedText variant="caption">{formatAgo(notice.createdAt, t)}</ThemedText>
      </View>
      {notice.unread ? (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: radius.full,
            backgroundColor: colors.gold,
            marginTop: 6,
          }}
        />
      ) : null}
    </View>
  );
}

export function NotificationsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const notices = useAppSelector((state) => state.world.notices);
  const today = notices.filter((item) => item.section === 'today');
  const earlier = notices.filter((item) => item.section === 'earlier');

  return (
    <Screen>
      <ScreenHeader
        title={t('notices.title')}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.markRead')}
            onPress={() => dispatch(markNoticesRead())}
            hitSlop={8}>
            <ThemedText variant="label" themeColor="primary">
              {t('common.markRead')}
            </ThemedText>
          </Pressable>
        }
      />

      {notices.length === 0 ? (
        <ThemedText variant="body">{t('notices.empty')}</ThemedText>
      ) : (
        <View style={{ gap: spacing.lg }}>
          {today.length ? (
            <View style={{ gap: spacing.md }}>
              <ThemedText variant="caption">{t('common.today').toUpperCase()}</ThemedText>
              {today.map((notice) => (
                <NoticeRow key={notice.id} notice={notice} />
              ))}
            </View>
          ) : null}
          {earlier.length ? (
            <View style={{ gap: spacing.md }}>
              <View style={{ height: 1, backgroundColor: colors.border }} />
              <ThemedText variant="caption">{t('common.earlier').toUpperCase()}</ThemedText>
              {earlier.map((notice) => (
                <NoticeRow key={notice.id} notice={notice} />
              ))}
            </View>
          ) : null}
        </View>
      )}
    </Screen>
  );
}
