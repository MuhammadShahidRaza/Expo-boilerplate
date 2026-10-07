import type { PayloadAction } from '@reduxjs/toolkit';

import { businesses } from '@/data/content';

import { uid, type NotificationPrefs, type WorldState } from './state';

export const inboxReducers = {
  toggleFollow(state: WorldState, action: PayloadAction<string>) {
    if (state.following.includes(action.payload)) {
      state.following = state.following.filter((id) => id !== action.payload);
    } else {
      state.following.push(action.payload);
    }
  },
  setPref(state: WorldState, action: PayloadAction<{ key: keyof NotificationPrefs; value: boolean }>) {
    state.prefs[action.payload.key] = action.payload.value;
  },
  markNoticesRead(state: WorldState) {
    state.notices.forEach((notice) => {
      notice.unread = false;
    });
  },
  askAssistant(state: WorldState, action: PayloadAction<string>) {
    const text = action.payload.trim();
    if (!text) return;
    state.assistant.push({ id: uid('ask'), mine: true, text });
    const lower = text.toLowerCase();
    if (lower.includes('tax') || lower.includes('kontab') || lower.includes('creole') || lower.includes('krey')) {
      state.assistant.push({
        id: uid('reply'),
        mine: false,
        text: 'Men 2 kontab verifye toupre ou ki pale Kreyòl:',
        cards: businesses
          .filter((item) => item.filter === 'tax')
          .slice(0, 2)
          .map((item) => ({
            id: item.id,
            name: item.name,
            meta: `${item.rating ?? '—'} · ${item.distance} · ${item.tier}`,
            initials: item.initials,
          })),
      });
      return;
    }
    const match = businesses.find((item) => lower.includes(item.name.toLowerCase().split(' ')[0].toLowerCase()));
    state.assistant.push({
      id: uid('reply'),
      mine: false,
      text: match
        ? `${match.name} is ${match.distance} away. ${match.blurb}`
        : 'I can help you find businesses, events, and jobs in your community. Try asking for a tax preparer or a restaurant.',
    });
  },
  setBio(state: WorldState, action: PayloadAction<string>) {
    state.bio = action.payload;
  },
  setChapter(state: WorldState, action: PayloadAction<string>) {
    state.activeChapter = action.payload;
  },
};
