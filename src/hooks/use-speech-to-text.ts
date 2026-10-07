import { useCallback, useState } from 'react';

type SpeechToTextOptions = {
  lang?: string;
  onFinal?: (text: string) => void;
};

export type SpeechToggleResult =
  | { ok: true }
  | { ok: false; reason: 'unavailable' | 'denied' };

/**
 * Speech recognition needs a development build on iOS/Android.
 * Expo Go does not ship ExpoSpeechRecognition, so native stays a safe stub.
 */
export function useSpeechToText(_options: SpeechToTextOptions = {}) {
  const [listening] = useState(false);
  const [transcript] = useState('');

  const stop = useCallback(() => undefined, []);
  const start = useCallback(async (): Promise<SpeechToggleResult> => ({ ok: false, reason: 'unavailable' }), []);
  const toggle = useCallback(async (): Promise<SpeechToggleResult> => ({ ok: false, reason: 'unavailable' }), []);

  return { listening, transcript, start, stop, toggle };
}
