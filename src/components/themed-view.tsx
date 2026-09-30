import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Surface = 'background' | 'backgroundElement' | 'backgroundSelected';

export type ThemedViewProps = ViewProps & {
  type?: Surface;
};

export function ThemedView({ style, type = 'background', ...otherProps }: ThemedViewProps) {
  const { colors } = useTheme();

  return <View style={[{ backgroundColor: colors[type] }, style]} {...otherProps} />;
}
