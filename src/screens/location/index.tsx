import { useState } from 'react';
import * as Location from 'expo-location';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCoordinates } from '@/store/slices/location';
import { radius } from '@/theme';

export function LocationScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const coordinates = useAppSelector((state) => state.location.coordinates);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onEnable() {
    setMessage('');
    setLoading(true);
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      setLoading(false);
      setMessage(t('common.permissionDenied'));
      return;
    }
    const position = await Location.getCurrentPositionAsync({});
    dispatch(
      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
    );
    setLoading(false);
  }

  return (
    <Screen>
      <ThemedText variant="body">{t('services.locationHint')}</ThemedText>
      <Button title={t('services.enableLocation')} loading={loading} onPress={() => void onEnable()} />
      {message ? (
        <ThemedText variant="caption" themeColor="error">
          {message}
        </ThemedText>
      ) : null}
      {coordinates ? (
        <View style={{ height: 360, borderRadius: radius.lg, overflow: 'hidden' }}>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}>
            <Marker coordinate={coordinates} />
          </MapView>
        </View>
      ) : null}
    </Screen>
  );
}
