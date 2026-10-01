import { KeyboardAvoidingView, Platform, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { spacing } from '@/theme';

type ScreenProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  tab?: boolean;
  keyboard?: boolean;
  safeTop?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  footer,
  scroll = true,
  padded = true,
  tab = false,
  keyboard = false,
  safeTop = true,
  contentContainerStyle,
  style,
}: ScreenProps) {
  const { colors } = useTheme();
  const measured = useSafeAreaInsets();
  const insets = {
    top: measured.top || initialWindowMetrics?.insets.top || 0,
    bottom: measured.bottom || initialWindowMetrics?.insets.bottom || 0,
  };
  const padding = padded ? spacing.md : 0;

  const content = scroll ? (
    <ScrollView
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        {
          paddingHorizontal: padding,
          paddingTop: padding,
          paddingBottom: footer ? spacing.md : insets.bottom + (tab ? 128 : spacing.xl),
          gap: spacing.md,
          flexGrow: 1,
        },
        contentContainerStyle,
      ]}>
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1, paddingHorizontal: padding, paddingTop: padding }, contentContainerStyle]}>{children}</View>
  );

  const body = (
    <View style={[{ flex: 1, backgroundColor: colors.background, paddingTop: safeTop ? insets.top : 0 }, style]}>
      {content}
      {footer ? (
        <View
          style={{
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + spacing.sm,
            gap: spacing.sm,
            backgroundColor: colors.background,
          }}>
          {footer}
        </View>
      ) : null}
    </View>
  );

  if (!keyboard) return body;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {body}
    </KeyboardAvoidingView>
  );
}
