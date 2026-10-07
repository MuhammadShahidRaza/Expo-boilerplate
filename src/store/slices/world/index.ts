import { createSlice } from '@reduxjs/toolkit';

import { businesses } from '@/data/content';

import { catalogReducers } from './catalog';
import { chatReducers } from './chat';
import { feedReducers } from './feed';
import { inboxReducers } from './inbox';
import { setupReducers } from './setup';
import { initialState } from './state';

const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    ...setupReducers,
    ...feedReducers,
    ...chatReducers,
    ...catalogReducers,
    ...inboxReducers,
  },
});

export const {
  setCountry,
  setStateName,
  skipState,
  markLanguagePicked,
  markIntroSeen,
  toggleOrigin,
  setPrimaryOrigin,
  setActiveCommunity,
  addCommunity,
  removeCommunity,
  toggleLike,
  toggleSave,
  addComment,
  deleteComment,
  addPost,
  deletePost,
  sharePost,
  reportPost,
  blockAuthor,
  unblockAuthor,
  preparePoll,
  togglePollLike,
  votePoll,
  addPoll,
  sendMessage,
  markThreadRead,
  ensureThread,
  ensureProfileSamples,
  setGoing,
  addEvent,
  addListing,
  toggleFollow,
  setPref,
  markNoticesRead,
  askAssistant,
  setBio,
  setChapter,
} = worldSlice.actions;

export const worldReducer = worldSlice.reducer;

export const businessById = (id: string) => businesses.find((item) => item.id === id);

export type { NotificationPrefs } from './state';
