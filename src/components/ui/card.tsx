import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { radius, shadows } from '@/theme';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  selected?: boolean;
};

export function Card({ children, onPress, style, padded = true, selected = false }: CardProps) {
  const { colors } = useTheme();
  const body = (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.xl,
          borderCurve: 'continuous',
          borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth,
          borderColor: selected ? colors.primary : colors.border,
          padding: padded ? 14 : 0,
          boxShadow: shadows.card,
        },
        style,
      ]}>
      {children}
    </View>
  );

  if (!onPress) return body;

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.86 : 1 })}>
      {body}
    </Pressable>
  );
}
