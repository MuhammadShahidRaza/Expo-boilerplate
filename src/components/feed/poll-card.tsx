import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';

import { resolvePhoto } from '@/data/images';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { Poll } from '@/data/content';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch } from '@/store/hooks';
import { votePoll } from '@/store/slices/world';
import { radius, spacing } from '@/theme';

export function PollCard({ poll }: { poll: Poll }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const total = poll.options.reduce((sum, option) => sum + option.votes, 0) || 1;

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Avatar source={poll.avatar} size={40} />
        <ThemedText variant="headline" style={{ flex: 1 }}>
          {poll.authorName}
        </ThemedText>
        <Badge label={t('home.poll')} tone="gold" icon="poll" />
      </View>
      <ThemedText variant="section" style={{ marginTop: spacing.md }}>
        {poll.question}
      </ThemedText>
      {poll.image ? (
        <Image source={resolvePhoto(poll.image)} style={{ width: '100%', height: 140, borderRadius: radius.lg, marginTop: spacing.md }} contentFit="cover" />
      ) : null}
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        {poll.options.map((option) => {
          const percent = Math.round((option.votes / total) * 100);
          const selected = poll.votedId === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              disabled={Boolean(poll.votedId)}
              onPress={() => dispatch(votePoll({ pollId: poll.id, optionId: option.id }))}
              style={{
                borderRadius: radius.lg,
                backgroundColor: selected ? colors.navySoft : colors.chip,
                padding: spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
              }}>
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: radius.full,
                  borderWidth: 1.5,
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.primary : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {selected ? <Icon name="check" size={11} color={colors.textInverse} /> : null}
              </View>
              <ThemedText variant="subhead" themeColor="text" style={{ flex: 1 }}>
                {option.label}
              </ThemedText>
              {poll.votedId ? (
                <ThemedText variant="headline" themeColor="textSecondary">
                  {percent}%
                </ThemedText>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm }}>
        <Icon name="verified" size={14} color={colors.info} />
        <ThemedText variant="caption" style={{ flex: 1 }}>
          {t('home.votes', { count: poll.options.reduce((sum, option) => sum + option.votes, 0) })}
        </ThemedText>
        <Icon name="heart" size={16} color={colors.icon} />
        <ThemedText variant="caption">24</ThemedText>
        <Icon name="comment" size={16} color={colors.icon} />
        <ThemedText variant="caption">8</ThemedText>
      </View>
    </Card>
  );
}
