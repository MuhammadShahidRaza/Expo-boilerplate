import { Image } from 'expo-image';
import { View } from 'react-native';

import { photos } from '@/data/images';

const widths = { sm: 168, md: 220, lg: 280 } as const;
const ratio = 606 / 906;

type LogoProps = {
  size?: keyof typeof widths;
  showTagline?: boolean;
};

export function Logo({ size = 'md' }: LogoProps) {
  const width = widths[size];

  return (
    <View style={{ alignItems: 'center', alignSelf: 'center' }}>
      <Image
        source={photos.logo}
        style={{ width, height: width * ratio }}
        contentFit="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}
