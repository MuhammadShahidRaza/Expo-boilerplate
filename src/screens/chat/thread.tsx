import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendMessage } from '@/store/slices/world';
import type { ChatMessage } from '@/data/content';
import { radius, spacing } from '@/theme';
import { formatClock } from '@/utils/time';

function formatVoice(ms: number) {
  const total = Math.max(1, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

const playbackMode = {
  allowsRecording: false,
  playsInSilentMode: true,
  interruptionMode: 'doNotMix' as const,
  shouldPlayInBackground: false,
  shouldRouteThroughEarpiece: false,
};

type WebClip = {
  paused: boolean;
  currentTime: number;
  duration: number;
  onended: (() => void) | null;
  ontimeupdate: (() => void) | null;
  pause: () => void;
  play: () => Promise<void>;
};

const WAVE = [0.4, 0.7, 1, 0.55, 0.85, 0.45, 0.75, 1, 0.6, 0.35, 0.8, 0.5, 0.95, 0.65, 0.4, 0.72, 1, 0.58, 0.38, 0.82, 0.48, 0.9];

function VoiceWave({ progress, color, phase = 0 }: { progress: number; color: string; phase?: number }) {
  const moving = phase > 0;
  return (
    <View style={{ height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
      {WAVE.map((shape, index) => {
        const played = index / WAVE.length < progress;
        const level = moving ? 0.28 + 0.72 * Math.abs(Math.sin(index * 0.55 + phase)) : shape;
        return (
          <View
            key={index}
            style={{
              width: 3,
              height: 4 + level * 20,
              borderRadius: radius.full,
              backgroundColor: color,
              opacity: moving ? 0.45 + level * 0.55 : played ? 1 : 0.35,
            }}
          />
        );
      })}
    </View>
  );
}

const webClips = new Map<string, WebClip>();

function toggleWebClip(
  uri: string,
  onPlaying: (playing: boolean) => void,
  onTime: (time: number, duration: number) => void,
) {
  const AudioCtor = (globalThis as { Audio?: new (src: string) => WebClip }).Audio;
  if (!AudioCtor) return;
  let clip = webClips.get(uri);
  if (!clip) {
    clip = new AudioCtor(uri);
    webClips.set(uri, clip);
  }
  if (!clip.paused) {
    clip.pause();
    onPlaying(false);
    return;
  }
  clip.currentTime = 0;
  clip.onended = () => onPlaying(false);
  clip.ontimeupdate = () => onTime(clip.currentTime, clip.duration || 0);
  void clip.play().then(() => onPlaying(true)).catch(() => onPlaying(false));
}

function VoiceBubble({ message, mine }: { message: ChatMessage; mine: boolean }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const player = useAudioPlayer(message.audioUri ? { uri: message.audioUri } : null, {
    keepAudioSessionActive: true,
  });
  const status = useAudioPlayerStatus(player);
  const [webPlaying, setWebPlaying] = useState(false);
  const [webTime, setWebTime] = useState(0);
  const [webDuration, setWebDuration] = useState(0);
  const playing = Platform.OS === 'web' ? webPlaying : status.playing;
  const tint = mine ? colors.onGold : colors.primary;
  const durationSec =
    (Platform.OS === 'web' ? webDuration : status.duration) || (message.durationMs ?? 0) / 1000;
  const timeSec = Platform.OS === 'web' ? webTime : status.currentTime;
  const progress = durationSec > 0 ? Math.min(1, timeSec / durationSec) : 0;

  const toggle = () => {
    if (Platform.OS === 'web' && message.audioUri) {
      toggleWebClip(message.audioUri, setWebPlaying, (time, duration) => {
        setWebTime(time);
        setWebDuration(duration);
      });
      return;
    }
    if (player.playing) {
      player.pause();
      return;
    }
    void setAudioModeAsync(playbackMode).then(async () => {
      player.muted = false;
      player.volume = 1;
      await player.seekTo(0);
      player.play();
    });
  };

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={t('chat.voice')} onPress={() => void toggle()} style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: radius.full,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: mine ? colors.background : colors.goldSoft,
          }}>
          <View style={{ marginLeft: playing ? 0 : 2 }}>
            <Icon name={playing ? 'pause' : 'play'} size={13} color={mine ? colors.primary : colors.gold} />
          </View>
        </View>
        <VoiceWave progress={progress} color={tint} />
      </View>
      <ThemedText variant="caption" style={{ color: tint, marginLeft: 44 }}>
        {formatVoice((timeSec > 0 ? timeSec : durationSec || 1) * 1000)}
      </ThemedText>
    </Pressable>
  );
}

export function ConversationScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useAppSelector((state) => state.world.threads.find((item) => item.id === id));
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordPhase, setRecordPhase] = useState(0);

  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => setRecordPhase((value) => value + 0.45), 120);
    return () => clearInterval(timer);
  }, [recording]);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 200);

  const messages = useMemo(() => [...(thread?.messages ?? [])].reverse(), [thread?.messages]);

  if (!thread) {
    return (
      <Screen>
        <IconButton icon="back" accessibilityLabel={t('common.back')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/chat'))} />
        <ThemedText variant="headline">{t('chat.empty')}</ThemedText>
      </Screen>
    );
  }

  const onSend = () => {
    const value = text.trim();
    if (!value) return;
    dispatch(sendMessage({ threadId: thread.id, text: value }));
    setText('');
  };

  const toggleRecording = async () => {
    if (recording) {
      const durationMs = Math.max(500, recorderState.durationMillis || Math.round(recorder.currentTime * 1000));
      await recorder.stop();
      setRecording(false);
      await setAudioModeAsync(playbackMode);
      const uri = recorder.uri;
      if (!uri) return;
      dispatch(
        sendMessage({
          threadId: thread.id,
          audioUri: uri,
          durationMs,
        }),
      );
      return;
    }

    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('common.appName'), t('chat.micDenied'));
      return;
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    setRecording(true);
  };

  return (
    <Screen
      scroll={false}
      padded={false}
      keyboard
      footer={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            {recording ? (
              <View
                style={{
                  minHeight: 52,
                  borderRadius: radius.full,
                  backgroundColor: colors.dangerSoft,
                  alignItems: 'center',
                  paddingHorizontal: spacing.md,
                  flexDirection: 'row',
                  gap: spacing.sm,
                }}>
                <Icon name="mic" size={16} color={colors.error} />
                <VoiceWave progress={1} color={colors.error} phase={recordPhase} />
                <ThemedText variant="caption" themeColor="error">
                  {formatVoice(recorderState.durationMillis)}
                </ThemedText>
              </View>
            ) : (
              <TextField
                bare
                value={text}
                onChangeText={setText}
                placeholder={t('chat.placeholder')}
                returnKeyType="send"
                onSubmitEditing={onSend}
              />
            )}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={recording ? t('chat.recording') : t('chat.voice')}
            onPress={() => void toggleRecording()}
            style={({ pressed }) => ({
              width: 48,
              height: 48,
              borderRadius: radius.full,
              backgroundColor: recording ? colors.error : colors.search,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}>
            <Icon name="mic" size={20} color={recording ? colors.textInverse : colors.text} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.message')}
            onPress={onSend}
            style={({ pressed }) => ({
              width: 48,
              height: 48,
              borderRadius: radius.full,
              backgroundColor: colors.tabBar,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}>
            <Icon name="send" size={18} color={colors.textInverse} />
          </Pressable>
        </View>
      }>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          }}>
          <IconButton icon="back" variant="ghost" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
          <Avatar source={thread.avatar} size={40} online={thread.online} />
          <View style={{ flex: 1 }}>
            <ThemedText variant="headline" numberOfLines={1}>
              {thread.name}
            </ThemedText>
            {thread.online ? (
              <ThemedText variant="caption" themeColor="success">
                {t('common.online')}
              </ThemedText>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.call')}
            onPress={() => router.push({ pathname: '/call-incoming', params: { id: thread.id, video: '0' } })}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: radius.full,
              backgroundColor: colors.tabBar,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}>
            <Icon name="phone" size={16} color={colors.textInverse} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('call.camera')}
            onPress={() => router.push({ pathname: '/call-incoming', params: { id: thread.id, video: '1' } })}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: radius.full,
              backgroundColor: colors.tabBar,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}>
            <Icon name="video" size={16} color={colors.textInverse} />
          </Pressable>
        </View>

        <FlatList
          inverted
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.md }}
          ListFooterComponent={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.divider }} />
              <ThemedText variant="caption">{t('common.today')}</ThemedText>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.divider }} />
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ alignItems: item.mine ? 'flex-end' : 'flex-start', gap: 4 }}>
              <View
                style={{
                  maxWidth: item.audioUri ? '88%' : '78%',
                  backgroundColor: item.mine ? colors.bubbleMine : colors.bubbleTheirs,
                  borderRadius: radius.xl,
                  paddingHorizontal: item.audioUri ? spacing.sm + 2 : spacing.md,
                  paddingVertical: item.audioUri ? spacing.sm : spacing.sm + 2,
                }}>
                {item.audioUri ? (
                  <VoiceBubble message={item} mine={item.mine} />
                ) : (
                  <ThemedText variant="body" style={{ color: item.mine ? colors.onGold : colors.text }}>
                    {item.text}
                  </ThemedText>
                )}
              </View>
              <ThemedText variant="caption">{formatClock(item.createdAt)}</ThemedText>
            </View>
          )}
        />
      </View>
    </Screen>
  );
}
