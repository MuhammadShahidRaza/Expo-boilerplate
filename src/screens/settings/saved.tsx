import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { PostCard } from '@/components/feed/post-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useTranslation } from '@/hooks/use-translation';
import { useAppSelector } from '@/store/hooks';
import { View } from 'react-native';
import { spacing } from '@/theme';

export function SavedScreen() {
  const { t } = useTranslation();
  const posts = useAppSelector((state) => state.world.posts.filter((post) => post.saved));

  return (
    <Screen>
      <ScreenHeader title={t('settings.saved')} />
      {posts.length === 0 ? (
        <ThemedText variant="body">{t('profile.savedEmpty')}</ThemedText>
      ) : (
        <View style={{ gap: spacing.md }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      )}
    </Screen>
  );
}
