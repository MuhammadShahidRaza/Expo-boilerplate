import type { ConfigContext, ExpoConfig } from 'expo/config';

function hasPlugin(plugins: ExpoConfig['plugins'], name: string) {
  return plugins?.some((plugin) => plugin === name || (Array.isArray(plugin) && plugin[0] === name));
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins = [...(config.plugins ?? [])];
  const mapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!hasPlugin(plugins, 'expo-image-picker')) {
    plugins.push([
      'expo-image-picker',
      {
        photosPermission: 'Allow CC World to access your photos.',
        cameraPermission: 'Allow CC World to use the camera for posts.',
      },
    ]);
  }

  if (!hasPlugin(plugins, 'expo-video')) {
    plugins.push('expo-video');
  }

  if (!hasPlugin(plugins, 'expo-location')) {
    plugins.push([
      'expo-location',
      {
        locationWhenInUsePermission: 'Allow CC World to use your location while you are using the app.',
      },
    ]);
  }

  if (!hasPlugin(plugins, 'expo-audio')) {
    plugins.push([
      'expo-audio',
      {
        microphonePermission: 'Allow CC World to record voice messages.',
      },
    ]);
  }

  if (!hasPlugin(plugins, 'expo-notifications')) {
    plugins.push([
      'expo-notifications',
      {
        color: '#051229',
      },
    ]);
  }

  if (!hasPlugin(plugins, 'expo-dev-client')) {
    plugins.push('expo-dev-client');
  }

  return {
    ...config,
    name: config.name ?? 'cc-world',
    slug: config.slug ?? 'cc-world',
    ios: {
      ...config.ios,
      usesAppleSignIn: true,
    },
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        ...(mapsKey ? { googleMaps: { apiKey: mapsKey } } : {}),
      },
    },
    plugins,
  };
};
