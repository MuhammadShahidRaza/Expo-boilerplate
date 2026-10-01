import { Alert, Platform, Pressable, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { marks } from '@/data/images';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppleSignIn, useGoogleSignIn } from '@/hooks/use-social-auth';
import { radius, shadows, spacing } from '@/theme';

function BrandButton({
  label,
  image,
  tint,
  onPress,
}: {
  label: string;
  image: number;
  tint?: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 52,
        borderRadius: radius.full,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: spacing.sm,
        boxShadow: shadows.card,
        opacity: pressed ? 0.8 : 1,
      })}>
      <Image source={image} style={{ width: 22, height: 22 }} tintColor={tint} contentFit="contain" />
      <ThemedText variant="headline">{label}</ThemedText>
    </Pressable>
  );
}

function googleClientReady() {
  if (Platform.OS === 'ios') return Boolean(process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID);
  if (Platform.OS === 'android') return Boolean(process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID);
  return Boolean(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
}

function GoogleAuthButton({
  label,
  onUnavailable,
}: {
  label: string;
  onUnavailable: () => void;
}) {
  const google = useGoogleSignIn();

  return (
    <BrandButton
      label={label}
      image={marks.google}
      onPress={() => {
        void google.signIn().then((result) => {
          if (result === 'unavailable') onUnavailable();
        });
      }}
    />
  );
}

export function SocialAuthRow() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const apple = useAppleSignIn();
  const unavailable = () => Alert.alert(t('common.appName'), t('auth.socialUnavailable'));

  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        <ThemedText variant="caption">{t('auth.orContinue')}</ThemedText>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {googleClientReady() ? (
          <GoogleAuthButton label={t('auth.google')} onUnavailable={unavailable} />
        ) : (
          <BrandButton label={t('auth.google')} image={marks.google} onPress={unavailable} />
        )}
        <BrandButton
          label={t('auth.apple')}
          image={marks.apple}
          tint={colors.text}
          onPress={() => {
            void apple().then((result) => {
              if (result === 'unavailable') unavailable();
            });
          }}
        />
      </View>
    </View>
  );
}
