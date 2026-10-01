import { Image } from 'expo-image';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { photos, type PhotoKey } from '@/data/images';
import { useTheme } from '@/hooks/use-theme';
import { radius } from '@/theme';

type AvatarProps = {
  source?: PhotoKey | string | null;
  initials?: string;
  size?: number;
  online?: boolean;
  badgeIcon?: IconName;
  ring?: boolean;
};

function isPhotoKey(value: string): value is PhotoKey {
  return value in photos;
}

export function Avatar({ source, initials, size = 48, online = false, badgeIcon, ring = false }: AvatarProps) {
  const { colors } = useTheme();
  const image =
    typeof source === 'string' && source.length > 0
      ? isPhotoKey(source)
        ? photos[source]
        : { uri: source }
      : null;

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: radius.full,
          overflow: 'hidden',
          backgroundColor: colors.goldSoft,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: ring ? 3 : 0,
          borderColor: colors.card,
        }}>
        {image ? (
          <Image source={image} style={{ width: size, height: size }} contentFit="cover" />
        ) : (
          <ThemedText variant="headline" themeColor="gold" style={{ fontSize: size * 0.32 }}>
            {initials ?? ''}
          </ThemedText>
        )}
      </View>
      {online ? (
        <View
          style={{
            position: 'absolute',
            right: 2,
            bottom: 2,
            width: 12,
            height: 12,
            borderRadius: radius.full,
            backgroundColor: colors.success,
            borderWidth: 2,
            borderColor: colors.card,
          }}
        />
      ) : null}
      {badgeIcon ? (
        <View
          style={{
            position: 'absolute',
            right: -2,
            bottom: -2,
            width: 26,
            height: 26,
            borderRadius: radius.full,
            backgroundColor: colors.gold,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: colors.card,
          }}>
          <Icon name={badgeIcon} size={13} color={colors.onGold} />
        </View>
      ) : null}
    </View>
  );
}
