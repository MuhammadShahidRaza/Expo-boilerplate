import { useRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { fontFamily, spacing } from '@/theme';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
};

export function OtpInput({ value, onChange, length = 4, error }: OtpInputProps) {
  const { colors } = useTheme();
  const input = useRef<TextInput>(null);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  return (
    <View style={{ gap: spacing.sm }}>
      <Pressable accessibilityRole="keyboardkey" onPress={() => input.current?.focus()} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
        {digits.map((digit, index) => {
          const filled = digit.trim().length > 0;
          const active = index === Math.min(value.length, length - 1);
          return (
            <View key={index} style={{ flex: 1, alignItems: 'center', gap: spacing.sm }}>
              <ThemedText variant="display" themeColor="text">
                {filled ? digit : ' '}
              </ThemedText>
              <View style={{ height: 3, alignSelf: 'stretch', backgroundColor: filled || active ? colors.primary : colors.border }} />
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={input}
        value={value}
        onChangeText={(next) => onChange(next.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus
        style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
      />
      {error ? (
        <ThemedText variant="caption" themeColor="error" style={{ fontFamily: fontFamily.regular }}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}
