import { useVideoPlayer, VideoView } from 'expo-video';
import { View } from 'react-native';

import { radius } from '@/theme';

export function VideoPreview({ uri, height = 190 }: { uri: string; height?: number }) {
  const player = useVideoPlayer(uri, (next) => {
    next.loop = false;
  });

  return (
    <View style={{ height, borderRadius: radius.lg, overflow: 'hidden' }}>
      <VideoView player={player} style={{ width: '100%', height }} nativeControls contentFit="cover" />
    </View>
  );
}
