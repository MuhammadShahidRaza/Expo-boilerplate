import { TabStack } from '@/components/tab-stack';
import { useTranslation } from '@/hooks/use-translation';

export default function ProfileLayout() {
  const { t } = useTranslation();
  return <TabStack title={t('tabs.profile')} />;
}
