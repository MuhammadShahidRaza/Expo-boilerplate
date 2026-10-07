import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

type PickResult =
  | { status: 'ok'; uri: string }
  | { status: 'denied' }
  | { status: 'canceled' }
  | { status: 'unavailable' };

function fromResult(result: ImagePicker.ImagePickerResult): PickResult {
  if (result.canceled || !result.assets[0]) return { status: 'canceled' };
  return { status: 'ok', uri: result.assets[0].uri };
}

export function useImagePicker() {
  const pickImage = useCallback(async (): Promise<PickResult> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return { status: 'denied' };

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    return fromResult(result);
  }, []);

  const takePhoto = useCallback(async (): Promise<PickResult> => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return { status: 'denied' };
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      return fromResult(result);
    } catch {
      return { status: 'unavailable' };
    }
  }, []);

  const pickVideo = useCallback(async (): Promise<PickResult> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return { status: 'denied' };

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 0.8,
      videoMaxDuration: 60,
    });

    return fromResult(result);
  }, []);

  return { pickImage, takePhoto, pickVideo };
}
