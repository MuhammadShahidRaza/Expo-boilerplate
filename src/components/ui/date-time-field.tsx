import { useState, type ComponentType } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { radius, spacing } from '@/theme';

type Mode = 'date' | 'time';

type DateTimeFieldProps = {
  mode: Mode;
  value: Date | null;
  onChange: (value: Date) => void;
  placeholder: string;
  icon: IconName;
  error?: string;
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toWebValue(mode: Mode, value: Date | null) {
  if (!value) return '';
  if (mode === 'date') return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

function fromWebValue(mode: Mode, raw: string, current: Date | null) {
  if (!raw) return null;
  const next = new Date(current ?? Date.now());
  if (mode === 'date') {
    const [year, month, day] = raw.split('-').map(Number);
    if (!year || !month || !day) return null;
    next.setFullYear(year, month - 1, day);
    return next;
  }
  const [hour, minute] = raw.split(':').map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  next.setHours(hour, minute, 0, 0);
  return next;
}

export function formatPickerDate(value: Date) {
  return value.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatPickerTime(value: Date) {
  return value.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function DateTimeField({ mode, value, onChange, placeholder, icon, error }: DateTimeFieldProps) {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => value ?? new Date());
  const label = value ? (mode === 'date' ? formatPickerDate(value) : formatPickerTime(value)) : placeholder;

  const showNative = () => {
    if (Platform.OS === 'web') return;
    setDraft(value ?? new Date());
    setOpen(true);
  };

  const confirm = () => {
    onChange(draft);
    setOpen(false);
  };

  return (
    <View style={{ gap: spacing.xs, minWidth: 0, alignSelf: 'stretch' }}>
      <View style={{ position: 'relative', minWidth: 0 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={placeholder}
          onPress={showNative}
          style={{
            height: 52,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.inputBackground,
            borderRadius: radius.full,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: error ? colors.error : colors.inputBorder,
            paddingHorizontal: spacing.md,
            overflow: 'hidden',
          }}>
          <Icon name={icon} size={18} color={colors.placeholder} />
          <ThemedText
            variant="body"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ flex: 1, marginLeft: spacing.sm, color: value ? colors.text : colors.placeholder }}>
            {label}
          </ThemedText>
        </Pressable>
        {Platform.OS === 'web' ? (
          <WebInput mode={mode} value={value} onChange={onChange} />
        ) : null}
      </View>
      {error ? (
        <ThemedText variant="caption" themeColor="error">
          {error}
        </ThemedText>
      ) : null}

      {open && Platform.OS === 'android' ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode={mode}
          minimumDate={mode === 'date' ? startOfToday() : undefined}
          accentColor={colors.gold}
          onValueChange={(_event, next) => {
            onChange(next);
            setOpen(false);
          }}
          onDismiss={() => setOpen(false)}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              onPress={() => setOpen(false)}
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
            />
            <View
              style={{
                backgroundColor: colors.card,
                borderTopLeftRadius: radius.xxl,
                borderTopRightRadius: radius.xxl,
                paddingBottom: insets.bottom + spacing.sm,
              }}>
              <View style={{ alignItems: 'flex-end', paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
                <Pressable accessibilityRole="button" onPress={confirm}>
                  <ThemedText variant="headline" themeColor="gold">
                    {t('common.done')}
                  </ThemedText>
                </Pressable>
              </View>
              <DateTimePicker
                value={draft}
                mode={mode}
                display="spinner"
                minimumDate={mode === 'date' ? startOfToday() : undefined}
                accentColor={colors.gold}
                themeVariant={isDark ? 'dark' : 'light'}
                onValueChange={(_event, next) => setDraft(next)}
                style={{ height: 216 }}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function WebInput({ mode, value, onChange }: { mode: Mode; value: Date | null; onChange: (value: Date) => void }) {
  const Input = 'input' as unknown as ComponentType<{
    type: string;
    value: string;
    onChange: (event: { target: { value: string } }) => void;
    style: Record<string, string | number>;
  }>;

  return (
    <Input
      type={mode === 'date' ? 'date' : 'time'}
      value={toWebValue(mode, value)}
      onChange={(event) => {
        const next = fromWebValue(mode, event.target.value, value);
        if (next) onChange(next);
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
      }}
    />
  );
}
