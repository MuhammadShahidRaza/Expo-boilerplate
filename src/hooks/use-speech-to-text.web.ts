import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechToTextOptions = {
  lang?: string;
  onFinal?: (text: string) => void;
};

type SpeechToggleResult =
  | { ok: true }
  | { ok: false; reason: 'unavailable' | 'denied' };

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: {
    results: ArrayLike<{ isFinal?: boolean; 0?: { transcript?: string } }>;
  }) => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const scope = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

export function useSpeechToText({ lang = 'en-US', onFinal }: SpeechToTextOptions = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const onFinalRef = useRef(onFinal);
  const transcriptRef = useRef('');
  const finalizedRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        // ignore
      }
    };
  }, []);

  const finish = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed || finalizedRef.current) return;
    finalizedRef.current = true;
    onFinalRef.current?.(trimmed);
  }, []);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      setListening(false);
    }
  }, []);

  const start = useCallback(async (): Promise<SpeechToggleResult> => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return { ok: false, reason: 'unavailable' };

    try {
      const recognition = new Ctor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;
      recognitionRef.current = recognition;
      transcriptRef.current = '';
      finalizedRef.current = false;
      setTranscript('');

      recognition.onstart = () => setListening(true);
      recognition.onend = () => {
        setListening(false);
        finish(transcriptRef.current);
      };
      recognition.onerror = () => setListening(false);
      recognition.onresult = (event) => {
        let next = '';
        let isFinal = false;
        for (let i = 0; i < event.results.length; i += 1) {
          const result = event.results[i];
          next += result?.[0]?.transcript ?? '';
          if (result?.isFinal) isFinal = true;
        }
        next = next.trim();
        transcriptRef.current = next;
        setTranscript(next);
        if (isFinal) finish(next);
      };

      recognition.start();
      return { ok: true };
    } catch {
      setListening(false);
      return { ok: false, reason: 'unavailable' };
    }
  }, [finish, lang]);

  const toggle = useCallback(async (): Promise<SpeechToggleResult> => {
    if (listening) {
      stop();
      return { ok: true };
    }
    return start();
  }, [listening, start, stop]);

  return { listening, transcript, start, stop, toggle };
}
