import { Image } from 'expo-image';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { photos } from '@/data/images';

type SplashIntroProps = {
  onFinish: () => void;
};

const LOGO_WIDTH = 300;
const LOGO_HEIGHT = LOGO_WIDTH * (606 / 906);

export function SplashIntro({ onFinish }: SplashIntroProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (!cancelled) onFinish();
    };

    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      const duration = reduce ? 900 : 4600;
      progress.value = withTiming(1, { duration, easing: Easing.linear }, (settled) => {
        if (settled) runOnJS(finish)();
      });
    });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [onFinish, progress]);

  const globeStyle = useAnimatedStyle(() => {
    const intro = interpolate(progress.value, [0, 0.1], [0.9, 1], 'clamp');
    const move = interpolate(progress.value, [0.42, 0.72], [0, 1], 'clamp');
    return {
      opacity: interpolate(move, [0, 0.9, 1], [1, 1, 0], 'clamp'),
      transform: [
        { translateY: interpolate(move, [0, 1], [0, 46]) },
        { scale: intro * interpolate(move, [0, 1], [1, 0.2]) },
      ],
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    const move = interpolate(progress.value, [0.42, 0.72], [0, 1], 'clamp');
    return {
      opacity: interpolate(move, [0, 0.2, 1], [0, 1, 1], 'clamp'),
      transform: [{ translateY: interpolate(move, [0, 1], [160, 0]) }],
    };
  });

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.layer, logoStyle]}>
        <Image source={photos.logo} style={styles.logo} contentFit="contain" />
      </Animated.View>
      <Animated.View style={[styles.layer, globeStyle]}>
        <Image source={photos.globe} style={styles.globe} contentFit="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  globe: {
    width: 176,
    height: 176,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
});
