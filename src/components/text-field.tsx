import { useState } from 'react';
import { Platform, Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { fontFamily, radius, spacing } from '@/theme';

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: IconName;
  multiline?: boolean;
  bare?: boolean;
};

export function TextField({
  label,
  error,
  hint,
  icon,
  bare = false,
  secureTextEntry,
  style,
  multiline,
  value,
  placeholder,
  numberOfLines,
  ...props
}: TextFieldProps) {
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const singleLine = !multiline;
  const showPlaceholder = Boolean(multiline && placeholder && !value);

  return (
    <View style={{ gap: spacing.xs, alignSelf: 'stretch', minWidth: 0 }}>
      {label ? (
        <ThemedText variant="label" themeColor="text">
          {label}
        </ThemedText>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          backgroundColor: bare ? colors.search : colors.inputBackground,
          borderRadius: multiline ? radius.xl : radius.full,
          borderCurve: 'continuous',
          borderWidth: bare ? 0 : 1,
          borderColor: error ? colors.error : colors.inputBorder,
          paddingHorizontal: spacing.md,
          minWidth: 0,
          overflow: 'hidden',
          minHeight: multiline ? 120 : 52,
          height: singleLine ? 52 : undefined,
        }}>
        {icon ? (
          <View style={{ marginTop: multiline ? 16 : 0 }}>
            <Icon name={icon} size={18} color={colors.placeholder} />
          </View>
        ) : null}
        <View style={{ flex: 1, minWidth: 0, justifyContent: 'center', minHeight: multiline ? 100 : undefined }}>
          {showPlaceholder ? (
            <ThemedText
              numberOfLines={1}
              pointerEvents="none"
              style={{ position: 'absolute', left: 0, right: 0, top: spacing.md, color: colors.placeholder, fontSize: 14 }}>
              {placeholder}
            </ThemedText>
          ) : null}
          <TextInput
            placeholderTextColor={colors.placeholder}
            secureTextEntry={secureTextEntry ? hidden : false}
            multiline={Boolean(multiline)}
            numberOfLines={singleLine ? 1 : numberOfLines}
            scrollEnabled={singleLine ? false : undefined}
            textAlignVertical={multiline ? 'top' : 'center'}
            value={value}
            placeholder={showPlaceholder ? undefined : placeholder}
            style={[
              {
                flex: 1,
                minWidth: 0,
                color: colors.text,
                fontSize: 14,
                lineHeight: 20,
                fontFamily: fontFamily.regular,
                marginLeft: icon ? spacing.sm : 0,
                paddingVertical: 0,
                paddingTop: multiline ? spacing.md : 0,
                paddingBottom: multiline ? spacing.md : 0,
                height: singleLine ? 20 : undefined,
                maxHeight: singleLine ? 20 : undefined,
                outlineWidth: 0,
                ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
              },
              style,
            ]}
            {...props}
          />
        </View>
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((value) => !value)}
            hitSlop={8}>
            <Icon name={hidden ? 'eye' : 'eyeOff'} size={18} color={colors.icon} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <ThemedText variant="caption" themeColor="error">
          {error}
        </ThemedText>
      ) : hint ? (
        <ThemedText variant="caption">{hint}</ThemedText>
      ) : null}
    </View>
  );
}
