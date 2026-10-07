import type { PayloadAction } from '@reduxjs/toolkit';

import type { SharedPost, Thread } from '@/data/content';
import type { PhotoKey } from '@/data/images';

import { uid, type WorldState } from './state';

export const chatReducers = {
  sendMessage(
    state: WorldState,
    action: PayloadAction<{ threadId: string; text?: string; audioUri?: string; durationMs?: number; post?: SharedPost }>,
  ) {
    const thread = state.threads.find((item) => item.id === action.payload.threadId);
    const text = action.payload.text?.trim() ?? '';
    if (!thread || (!text && !action.payload.audioUri && !action.payload.post)) return;
    thread.messages.push({
      id: uid('msg'),
      mine: true,
      text,
      audioUri: action.payload.audioUri,
      durationMs: action.payload.durationMs,
      post: action.payload.post,
      createdAt: new Date().toISOString(),
    });
    thread.unread = 0;
  },
  markThreadRead(state: WorldState, action: PayloadAction<string>) {
    const thread = state.threads.find((item) => item.id === action.payload);
    if (thread) thread.unread = 0;
  },
  ensureThread(
    state: WorldState,
    action: PayloadAction<{ id: string; name: string; avatar: PhotoKey; kind: Thread['kind']; text?: string }>,
  ) {
    const existing = state.threads.find((item) => item.id === action.payload.id);
    if (existing) return;
    state.threads.unshift({
      id: action.payload.id,
      name: action.payload.name,
      avatar: action.payload.avatar,
      kind: action.payload.kind,
      online: false,
      unread: 0,
      messages: action.payload.text
        ? [{ id: uid('msg'), mine: true, text: action.payload.text, createdAt: new Date().toISOString() }]
        : [],
    });
  },
};
