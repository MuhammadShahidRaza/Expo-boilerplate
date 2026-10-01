import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { businesses } from '@/data/content';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { askAssistant, businessById } from '@/store/slices/world';
import { radius, spacing } from '@/theme';

type Mode = 'ask' | 'translator';

const languages = ['Kreyòl', 'English', 'Français', 'Español'] as const;

const dictionary: Record<string, string> = {
  mwen: 'I',
  bezwen: 'need',
  konnen: 'know',
  yon: 'a',
  ki: 'what',
  lè: 'time',
  magazen: 'store',
  an: 'the',
  louvri: 'opens',
  demen: 'tomorrow',
};

const phraseMap: Record<string, string> = {
  'Mwen bezwen konnen ki lè magazen an louvri demen': 'I need to know what time the store opens tomorrow.',
};

function translateText(text: string, to: string) {
  const exact = phraseMap[text.trim()];
  if (exact) return exact;
  const words = text.toLowerCase().split(/\s+/);
  const translated = words.map((word) => dictionary[word.replace(/[.,!?]/g, '')] ?? null).filter(Boolean);
  if (translated.length > 0) return translated.join(' ');
  return `${to}: ${text}`;
}

export function AssistantScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.world.assistant);
  const [mode, setMode] = useState<Mode>('ask');
  const [text, setText] = useState('');
  const [from, setFrom] = useState<(typeof languages)[number]>('Kreyòl');
  const [to, setTo] = useState<(typeof languages)[number]>('English');
  const [speaker, setSpeaker] = useState<string | null>(null);
  const [spoken, setSpoken] = useState<string | null>(null);

  const askMessages = useMemo(() => [...messages].reverse(), [messages]);

  const onSend = () => {
    const value = text.trim();
    if (!value) return;
    if (mode === 'ask') {
      dispatch(askAssistant(value));
    } else {
      setSpeaker(value);
      setSpoken(translateText(value, to));
    }
    setText('');
  };

  const swapLanguages = () => {
    setFrom(to);
    setTo(from);
  };

  const cycleLanguage = (current: (typeof languages)[number], setter: (value: (typeof languages)[number]) => void) => {
    const index = languages.indexOf(current);
    setter(languages[(index + 1) % languages.length]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ backgroundColor: colors.gold, paddingTop: insets.top, paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <IconButton icon="sparkles" variant="light" accessibilityLabel={t('assistant.title')} />
          <View style={{ flex: 1 }}>
            <ThemedText variant="headline" themeColor="textInverse">
              {t('assistant.title')}
            </ThemedText>
            <ThemedText variant="caption" themeColor="textInverse">
              {t('assistant.speaks')}
            </ThemedText>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.tabBar,
            borderRadius: radius.full,
            padding: 4,
            gap: 4,
          }}>
          {(
            [
              { id: 'ask' as const, label: t('assistant.ask') },
              { id: 'translator' as const, label: t('assistant.translator') },
            ] as const
          ).map((item) => {
            const active = mode === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => setMode(item.id)}
                style={{
                  flex: 1,
                  borderRadius: radius.full,
                  paddingVertical: spacing.sm,
                  alignItems: 'center',
                  backgroundColor: active ? colors.card : 'transparent',
                }}>
                <ThemedText variant="label" style={{ color: active ? colors.gold : colors.textInverse, textAlign: 'center' }}>
                  {item.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {mode === 'ask' ? (
          <FlatList
            inverted
            data={askMessages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={{ alignItems: item.mine ? 'flex-end' : 'flex-start', gap: spacing.sm }}>
                <View
                  style={{
                    maxWidth: '86%',
                    backgroundColor: item.mine ? colors.tabBar : colors.card,
                    borderRadius: radius.xl,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm + 2,
                    borderWidth: item.mine ? 0 : 1,
                    borderColor: colors.border,
                  }}>
                  <ThemedText variant="body" style={{ color: item.mine ? colors.textInverse : colors.text }}>
                    {item.text}
                  </ThemedText>
                </View>
                {item.cards?.map((card) => (
                  <Pressable
                    key={card.id}
                    accessibilityRole="button"
                    onPress={() => {
                      if (businessById(card.id) || businesses.some((biz) => biz.id === card.id)) {
                        router.push(`/business/${card.id}`);
                      }
                    }}
                    style={({ pressed }) => ({
                      width: '86%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.sm,
                      backgroundColor: colors.card,
                      borderRadius: radius.lg,
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: spacing.sm,
                      opacity: pressed ? 0.85 : 1,
                    })}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: radius.md,
                        backgroundColor: colors.tabBar,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <ThemedText variant="label" themeColor="gold">
                        {card.initials}
                      </ThemedText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText variant="headline">{card.name}</ThemedText>
                      <ThemedText variant="caption">{card.meta}</ThemedText>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          />
        ) : (
          <FlatList
            data={[1]}
            keyExtractor={() => 'translator'}
            contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: 120 }}
            renderItem={() => (
              <View style={{ gap: spacing.md }}>
                <Card>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => cycleLanguage(from, setFrom)} accessibilityRole="button">
                      <ThemedText variant="headline">{from}</ThemedText>
                    </Pressable>
                    <IconButton icon="translate" variant="soft" accessibilityLabel={t('assistant.swap')} onPress={swapLanguages} />
                    <Pressable onPress={() => cycleLanguage(to, setTo)} accessibilityRole="button">
                      <ThemedText variant="headline">{to}</ThemedText>
                    </Pressable>
                  </View>
                </Card>

                {speaker ? (
                  <Card>
                    <ThemedText variant="caption">{t('assistant.speaker', { language: from })}</ThemedText>
                    <ThemedText variant="body" style={{ marginTop: spacing.sm }}>
                      {speaker}
                    </ThemedText>
                  </Card>
                ) : null}

                {spoken ? (
                  <View
                    style={{
                      backgroundColor: colors.gold,
                      borderRadius: radius.xl,
                      padding: 14,
                      gap: spacing.sm,
                    }}>
                    <ThemedText variant="caption" themeColor="textInverse">
                      {t('assistant.spoken', { language: to })}
                    </ThemedText>
                    <ThemedText variant="body" themeColor="textInverse">
                      {spoken}
                    </ThemedText>
                  </View>
                ) : null}

                <Card
                  onPress={() => Alert.alert(t('assistant.analysis'), t('assistant.analysisBody'))}
                  style={{ borderColor: colors.gold, borderWidth: 1.5 }}>
                  <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
                    <Icon name="sparkles" size={18} color={colors.text} />
                    <View style={{ flex: 1, gap: 4 }}>
                      <ThemedText variant="headline">{t('assistant.analysis')}</ThemedText>
                      <ThemedText variant="caption">{t('assistant.analysisBody')}</ThemedText>
                    </View>
                  </View>
                </Card>
              </View>
            )}
          />
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 108,
          backgroundColor: colors.background,
        }}>
        <View style={{ flex: 1 }}>
          <TextField bare value={text} onChangeText={setText} placeholder={t('assistant.placeholder')} onSubmitEditing={onSend} returnKeyType="send" />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('assistant.placeholder')}
          disabled={!text.trim()}
          onPress={onSend}
          style={({ pressed }) => ({
            width: 52,
            height: 52,
            borderRadius: radius.full,
            backgroundColor: colors.gold,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !text.trim() ? 0.4 : pressed ? 0.85 : 1,
          })}>
          <Icon name="send" size={20} color={colors.onGold} />
        </Pressable>
      </View>
    </View>
  );
}
