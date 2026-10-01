import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SearchField } from '@/components/ui/search-field';
import { jobs } from '@/data/catalog';
import { useTranslation } from '@/hooks/use-translation';
import { spacing } from '@/theme';

export function JobsScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (job) => job.title.toLowerCase().includes(q) || job.place.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Screen>
      <ScreenHeader title={t('jobs.title')} />
      <SearchField value={query} onChangeText={setQuery} placeholder={t('common.search')} />
      {items.length === 0 ? (
        <ThemedText variant="body">{t('jobs.empty')}</ThemedText>
      ) : (
        items.map((job) => (
          <Card key={job.id}>
            <View style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm }}>
                <ThemedText variant="headline" style={{ flex: 1 }}>
                  {job.title}
                </ThemedText>
                <Badge
                  label={t(`jobs.${job.type}`)}
                  tone={job.type === 'full' ? 'success' : job.type === 'part' ? 'navy' : 'gold'}
                />
              </View>
              <ThemedText variant="caption">{job.place}</ThemedText>
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}
