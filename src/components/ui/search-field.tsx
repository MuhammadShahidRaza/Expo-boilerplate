import { TextInput, View, type TextInputProps } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { fontFamily, radius, spacing } from '@/theme';

type SearchFieldProps = TextInputProps & {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchField({ value, onChangeText, placeholder, ...props }: SearchFieldProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.search,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        height: 48,
        minWidth: 0,
        overflow: 'hidden',
      }}>
      <Icon name="search" size={18} color={colors.placeholder} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        multiline={false}
        numberOfLines={1}
        scrollEnabled={false}
        style={{
          flex: 1,
          minWidth: 0,
          height: 20,
          maxHeight: 20,
          color: colors.text,
          fontFamily: fontFamily.regular,
          fontSize: 14,
          lineHeight: 20,
          paddingVertical: 0,
        }}
        {...props}
      />
    </View>
  );
}
