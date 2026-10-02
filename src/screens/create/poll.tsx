import { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useSession } from '@/context/session-context';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch } from '@/store/hooks';
import { addPoll } from '@/store/slices/world';
import { fontFamily, radius, spacing } from '@/theme';

export function CreatePollScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSession();
  const dispatch = useAppDispatch();
  const { pickImage } = useImagePicker();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [attachment, setAttachment] = useState<string | null>(null);

  const attach = async () => {
    const result = await pickImage();
    if (result.status === 'ok') setAttachment(result.uri);
  };

  const updateOption = (index: number, value: string) => {
    setOptions((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((current) => current.filter((_, i) => i !== index));
  };

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions((current) => [...current, '']);
  };

  const onPublish = () => {
    const filled = options.map((item) => item.trim()).filter(Boolean);
    if (question.trim().length < 8) {
      Alert.alert(t('validation.pollQuestion'));
      return;
    }
    if (filled.length < 2) {
      Alert.alert(t('validation.pollOptions'));
      return;
    }
    dispatch(
      addPoll({
        author: user?.fullName ?? '',
        question: question.trim(),
        options: filled,
        avatar: 'portraitM',
        image: attachment ?? undefined,
      }),
    );
    router.back();
  };

  const fileName = attachment ? attachment.split('/').pop() ?? 'attachment.jpg' : null;

  return (
    <Screen keyboard>
      <ScreenHeader title={t('create.pollTitle')} />

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <ThemedText variant="label" themeColor="link">
            {t('create.pollQuestion')}
          </ThemedText>
          <ThemedText variant="caption">
            {question.length}/140
          </ThemedText>
        </View>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          maxLength={140}
          multiline
          placeholder={t('create.pollQuestion')}
          placeholderTextColor={colors.placeholder}
          style={{
            minHeight: 90,
            color: colors.text,
            fontFamily: fontFamily.regular,
            fontSize: 15,
            backgroundColor: colors.backgroundElement,
            borderRadius: radius.lg,
            padding: spacing.md,
          }}
        />
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: radius.full,
              backgroundColor: colors.tintBlueSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="attach" size={16} color={colors.tintBlue} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <ThemedText variant="headline">{t('create.addContext')}</ThemedText>
            <ThemedText variant="caption">{t('create.addContextBody')}</ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={attach}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: colors.tintBlueSoft,
              borderRadius: radius.full,
              paddingHorizontal: spacing.sm,
              paddingVertical: 6,
            }}>
            <Icon name="attach" size={14} color={colors.tintBlue} />
            <ThemedText variant="caption" style={{ color: colors.tintBlue }}>
              {t('create.attach')}
            </ThemedText>
          </Pressable>
        </View>
        {attachment && fileName ? (
          <View
            style={{
              marginTop: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              backgroundColor: colors.backgroundElement,
              borderRadius: radius.lg,
              padding: spacing.sm,
            }}>
            <Image source={{ uri: attachment }} style={{ width: 40, height: 40, borderRadius: radius.sm }} contentFit="cover" />
            <ThemedText variant="subhead" style={{ flex: 1 }} numberOfLines={1}>
              {fileName}
            </ThemedText>
            <Pressable accessibilityRole="button" onPress={() => setAttachment(null)}>
              <Icon name="close" size={16} color={colors.icon} />
            </Pressable>
          </View>
        ) : null}
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: radius.full,
              backgroundColor: colors.tintPurpleSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="poll" size={16} color={colors.tintPurple} />
          </View>
          <ThemedText variant="headline" style={{ flex: 1 }}>
            {t('create.options')}
          </ThemedText>
          <Badge label={t('create.choices', { count: options.length })} tone="navy" />
        </View>

        <View style={{ gap: spacing.sm }}>
          {options.map((option, index) => (
            <View
              key={`option-${index}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                backgroundColor: colors.backgroundElement,
                borderRadius: radius.lg,
                paddingHorizontal: spacing.sm,
                minHeight: 48,
              }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: radius.full,
                  backgroundColor: index === 0 ? colors.tintPurple : index === 1 ? colors.tintBlue : colors.tintGreen,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ThemedText variant="caption" themeColor="textInverse">
                  {index + 1}
                </ThemedText>
              </View>
              <TextInput
                value={option}
                onChangeText={(value) => updateOption(index, value)}
                placeholder={`${t('create.options')} ${index + 1}`}
                placeholderTextColor={colors.placeholder}
                style={{ flex: 1, color: colors.text, fontFamily: fontFamily.regular, fontSize: 14, paddingVertical: spacing.sm }}
              />
              <Icon name="image" size={16} color={colors.icon} />
              <Pressable accessibilityRole="button" onPress={() => removeOption(index)} disabled={options.length <= 2}>
                <Icon name="trash" size={16} color={options.length <= 2 ? colors.textDisabled : colors.error} />
              </Pressable>
            </View>
          ))}
        </View>

        {options.length < 6 ? (
          <Pressable
            accessibilityRole="button"
            onPress={addOption}
            style={{
              marginTop: spacing.md,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: colors.info,
              borderRadius: radius.lg,
              minHeight: 48,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: spacing.sm,
            }}>
            <Icon name="plus" size={16} color={colors.info} />
            <ThemedText variant="label" themeColor="link">
              {t('create.addChoice')}
            </ThemedText>
          </Pressable>
        ) : null}
      </Card>

      <Button title={t('create.publishPoll')} onPress={onPublish} style={{ backgroundColor: colors.tabBar, borderColor: colors.tabBar }} />
    </Screen>
  );
}
