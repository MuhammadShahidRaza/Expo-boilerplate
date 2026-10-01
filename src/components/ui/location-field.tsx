import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { matchPlaces } from '@/data/places';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

type LocationFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
};

export function LocationField({ value, onChangeText, placeholder, error }: LocationFieldProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => (open ? matchPlaces(value) : []), [open, value]);

  return (
    <View style={{ gap: spacing.xs, zIndex: 2 }}>
      <TextField
        value={value}
        onChangeText={(next) => {
          onChangeText(next);
          setOpen(true);
        }}
        placeholder={placeholder}
        icon="pin"
        error={matches.length > 0 ? undefined : error}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      />
      {matches.length > 0 ? (
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
          }}>
          {matches.map((place, index) => (
            <Pressable
              key={place}
              accessibilityRole="button"
              onPressIn={() => {
                onChangeText(place);
                setOpen(false);
              }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm + 2,
                backgroundColor: pressed ? colors.backgroundElement : colors.card,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: colors.divider,
              })}>
              <Icon name="pin" size={16} color={colors.info} />
              <ThemedText variant="subhead" themeColor="text" numberOfLines={1} style={{ flex: 1 }}>
                {place}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
