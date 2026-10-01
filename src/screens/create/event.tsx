import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { DateTimeField, formatPickerDate, formatPickerTime } from '@/components/ui/date-time-field';
import { LocationField } from '@/components/ui/location-field';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { photos } from '@/data/images';
import { useSession } from '@/context/session-context';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch } from '@/store/hooks';
import { addEvent } from '@/store/slices/world';
import { validateEvent } from '@/validation';
import { spacing } from '@/theme';

export function CreateEventScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const { pickImage } = useImagePicker();
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<Partial<Record<'name' | 'date' | 'time' | 'details' | 'location', string>>>({});
  const insets = useSafeAreaInsets();

  const chooseCover = async () => {
    const result = await pickImage();
    if (result.status === 'ok') setCoverUri(result.uri);
  };

  const onCreate = () => {
    const nextErrors = validateEvent(
      {
        name,
        date: date ? formatPickerDate(date) : '',
        time: time ? formatPickerTime(time) : '',
        details,
        location,
      },
      t,
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !date || !time) return;
    dispatch(
      addEvent({
        name,
        date: formatPickerDate(date),
        time: formatPickerTime(time),
        day: String(date.getDate()).padStart(2, '0'),
        month: date.toLocaleString('en-US', { month: 'short' }),
        details,
        location,
        host: user?.fullName ?? '',
      }),
    );
    router.replace('/events');
  };

  return (
    <Screen keyboard padded={false} safeTop={false} contentContainerStyle={{ gap: 0, paddingHorizontal: 0, paddingTop: 0 }}>
      <View>
        <Image
          source={coverUri ? { uri: coverUri } : photos.festival}
          style={{ width: '100%', height: 180 }}
          contentFit="cover"
        />
        <View style={{ position: 'absolute', top: insets.top + 8, left: spacing.md }}>
          <IconButton icon="back" variant="light" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
        </View>
        <View style={{ position: 'absolute', top: insets.top + 8, right: spacing.md }}>
          <IconButton icon="camera" variant="light" accessibilityLabel={t('common.choosePhoto')} onPress={chooseCover} />
        </View>
        <View style={{ position: 'absolute', left: spacing.md, bottom: -24 }}>
          <Avatar source={user?.avatarUri ?? 'portraitM'} size={56} ring />
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.xl, gap: spacing.md }}>
        <View>
          <ThemedText variant="headline">{user?.fullName ?? ''}</ThemedText>
          <ThemedText variant="caption">{t('profile.host')}</ThemedText>
        </View>

        <TextField value={name} onChangeText={setName} placeholder={t('create.eventName')} icon="calendar" error={errors.name} />

        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <DateTimeField
              mode="date"
              value={date}
              onChange={(next) => {
                setDate(next);
                setErrors((current) => ({ ...current, date: undefined }));
              }}
              placeholder={t('create.date')}
              icon="calendar"
              error={errors.date}
            />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <DateTimeField
              mode="time"
              value={time}
              onChange={(next) => {
                setTime(next);
                setErrors((current) => ({ ...current, time: undefined }));
              }}
              placeholder={t('create.time')}
              icon="clock"
              error={errors.time}
            />
          </View>
        </View>

        <TextField value={details} onChangeText={setDetails} placeholder={t('create.details')} multiline error={errors.details} />
        <LocationField
          value={location}
          onChangeText={(next) => {
            setLocation(next);
            setErrors((current) => ({ ...current, location: undefined }));
          }}
          placeholder={t('common.location')}
          error={errors.location}
        />

        <Button title={t('create.createEvent')} onPress={onCreate} style={{ marginTop: spacing.sm, backgroundColor: colors.tabBar, borderColor: colors.tabBar }} />
      </View>
    </Screen>
  );
}
