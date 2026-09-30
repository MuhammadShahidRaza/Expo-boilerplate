import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { fontFamily, radius, spacing } from '@/theme';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, secureTextEntry, style, ...props }: TextFieldProps) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useTranslation();
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  return (
    <View style={{ gap: spacing.xs, alignSelf: 'stretch' }}>
      <ThemedText variant="subhead">{label}</ThemedText>
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          backgroundColor: colors.inputBackground,
          borderRadius: radius.md,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: error ? colors.error : colors.inputBorder,
          paddingHorizontal: spacing.md,
        }}>
        <TextInput
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry ? hidden : false}
          style={[
            {
              flex: 1,
              color: colors.text,
              fontSize: 16,
              paddingVertical: spacing.sm + spacing.xs,
              fontFamily: isRTL ? undefined : fontFamily.regular,
              textAlign: isRTL ? 'right' : 'left',
            },
            style,
          ]}
          {...props}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((value) => !value)}
            hitSlop={8}>
            <SymbolView
              name={{
                ios: hidden ? 'eye' : 'eye.slash',
                android: hidden ? 'visibility' : 'visibility_off',
                web: hidden ? 'visibility' : 'visibility_off',
              }}
              size={20}
              tintColor={isDark ? colors.textSecondary : colors.icon}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <ThemedText variant="caption" themeColor="error">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}
