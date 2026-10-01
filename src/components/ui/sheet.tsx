import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/icon-button';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { radius, spacing } from '@/theme';

type SheetProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Sheet({ visible, title, subtitle, onClose, children }: SheetProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
        />
        <View
          style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: radius.xxl,
            borderTopRightRadius: radius.xxl,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + spacing.lg,
            gap: spacing.md,
          }}>
          <View style={{ alignSelf: 'center', width: 42, height: 4, borderRadius: radius.full, backgroundColor: colors.border }} />
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md }}>
            <View style={{ flex: 1, gap: 4 }}>
              <ThemedText variant="title">{title}</ThemedText>
              {subtitle ? <ThemedText variant="subhead">{subtitle}</ThemedText> : null}
            </View>
            <IconButton icon="close" variant="soft" accessibilityLabel={t('common.close')} onPress={onClose} />
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
