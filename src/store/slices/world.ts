import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { countryByCode } from '@/data/catalog';
import {
  businesses,
  seedAssistant,
  seedEvents,
  seedListings,
  seedNotices,
  seedPolls,
  seedPosts,
  seedThreads,
  type AssistantMessage,
  type CommunityRef,
  type EventItem,
  type Listing,
  type Notice,
  type Poll,
  type Post,
  type Thread,
} from '@/data/content';
import type { PhotoKey } from '@/data/images';

export type NotificationPrefs = {
  newPosts: boolean;
  reactions: boolean;
  comments: boolean;
  direct: boolean;
  group: boolean;
  reminders: boolean;
  newEvents: boolean;
};

type WorldState = {
  countryCode: string | null;
  stateName: string | null;
  stateSkipped: boolean;
  languagePicked: boolean;
  introSeen: boolean;
  originIds: string[];
  primaryOriginId: string | null;
  communities: CommunityRef[];
  posts: Post[];
  polls: Poll[];
  threads: Thread[];
  listings: Listing[];
  events: EventItem[];
  notices: Notice[];
  prefs: NotificationPrefs;
  following: string[];
  assistant: AssistantMessage[];
  bio: string;
  activeChapter: string;
};

const initialState: WorldState = {
  countryCode: null,
  stateName: null,
  stateSkipped: false,
  languagePicked: false,
  introSeen: false,
  originIds: [],
  primaryOriginId: null,
  communities: [],
  posts: seedPosts,
  polls: seedPolls,
  threads: seedThreads,
  listings: seedListings,
  events: seedEvents,
  notices: seedNotices,
  prefs: {
    newPosts: true,
    reactions: true,
    comments: true,
    direct: true,
    group: false,
    reminders: true,
    newEvents: false,
  },
  following: [],
  assistant: seedAssistant,
  bio: 'Community advocate & local food lover.\nLittle Haiti proud',
  activeChapter: 'Little Haiti Miami',
};

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    setCountry(state, action: PayloadAction<string>) {
      const country = countryByCode(action.payload);
      state.countryCode = action.payload;
      state.stateName = null;
      state.stateSkipped = false;
      if (!country) return;
      const existing = state.communities.find((item) => item.code === country.code);
      state.communities = state.communities.map((item) => ({ ...item, active: false }));
      if (existing) {
        existing.active = true;
      } else {
        state.communities.unshift({
          id: country.code,
          code: country.code,
          name: country.name,
          active: true,
        });
      }
    },
    setStateName(state, action: PayloadAction<string>) {
      state.stateName = action.payload;
      state.stateSkipped = false;
      const active = state.communities.find((item) => item.active);
      if (active) active.state = action.payload;
    },
    skipState(state) {
      state.stateSkipped = true;
      state.stateName = null;
    },
    markLanguagePicked(state) {
      state.languagePicked = true;
    },
    markIntroSeen(state) {
      state.introSeen = true;
    },
    toggleOrigin(state, action: PayloadAction<string>) {
      if (state.originIds.includes(action.payload)) {
        state.originIds = state.originIds.filter((id) => id !== action.payload);
        if (state.primaryOriginId === action.payload) state.primaryOriginId = state.originIds[0] ?? null;
        return;
      }
      if (state.originIds.length >= 5) return;
      state.originIds.push(action.payload);
    },
    setPrimaryOrigin(state, action: PayloadAction<string>) {
      state.primaryOriginId = action.payload;
    },
    setActiveCommunity(state, action: PayloadAction<string>) {
      state.communities = state.communities.map((item) => ({ ...item, active: item.id === action.payload }));
      const active = state.communities.find((item) => item.id === action.payload);
      if (active) {
        state.countryCode = active.code;
        state.stateName = active.state ?? null;
      }
    },
    addCommunity(state, action: PayloadAction<string>) {
      const country = countryByCode(action.payload);
      if (!country || state.communities.some((item) => item.code === country.code)) return;
      state.communities.push({ id: country.code, code: country.code, name: country.name, active: false });
    },
    removeCommunity(state, action: PayloadAction<string>) {
      const target = state.communities.find((item) => item.id === action.payload);
      if (!target || target.active) return;
      state.communities = state.communities.filter((item) => item.id !== action.payload);
    },
    toggleLike(state, action: PayloadAction<string>) {
      const post = state.posts.find((item) => item.id === action.payload);
      if (!post) return;
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
    },
    toggleSave(state, action: PayloadAction<string>) {
      const post = state.posts.find((item) => item.id === action.payload);
      if (!post) return;
      post.saved = !post.saved;
    },
    addComment(state, action: PayloadAction<{ postId: string; author: string; body: string; avatar: PhotoKey }>) {
      const post = state.posts.find((item) => item.id === action.payload.postId);
      if (!post || !action.payload.body.trim()) return;
      post.comments.unshift({
        id: uid('comment'),
        author: action.payload.author,
        avatar: action.payload.avatar,
        body: action.payload.body.trim(),
        createdAt: new Date().toISOString(),
      });
    },
    addPost(state, action: PayloadAction<{ author: string; body: string; chapter: string; avatar: PhotoKey; image?: string }>) {
      state.posts.unshift({
        id: uid('post'),
        authorName: action.payload.author,
        avatar: action.payload.avatar,
        chapter: action.payload.chapter,
        createdAt: new Date().toISOString(),
        body: action.payload.body.trim(),
        image: action.payload.image,
        likes: 0,
        shares: 0,
        liked: false,
        saved: false,
        mine: true,
        comments: [],
      });
    },
    votePoll(state, action: PayloadAction<{ pollId: string; optionId: string }>) {
      const poll = state.polls.find((item) => item.id === action.payload.pollId);
      if (!poll || poll.votedId) return;
      const option = poll.options.find((item) => item.id === action.payload.optionId);
      if (!option) return;
      option.votes += 1;
      poll.votedId = option.id;
    },
    addPoll(state, action: PayloadAction<{ author: string; question: string; options: string[]; avatar: PhotoKey }>) {
      state.polls.unshift({
        id: uid('poll'),
        authorName: action.payload.author,
        avatar: action.payload.avatar,
        createdAt: new Date().toISOString(),
        question: action.payload.question.trim(),
        votedId: null,
        options: action.payload.options.filter((label) => label.trim()).map((label) => ({ id: uid('opt'), label: label.trim(), votes: 0 })),
      });
    },
    sendMessage(
      state,
      action: PayloadAction<{ threadId: string; text?: string; audioUri?: string; durationMs?: number }>,
    ) {
      const thread = state.threads.find((item) => item.id === action.payload.threadId);
      const text = action.payload.text?.trim() ?? '';
      if (!thread || (!text && !action.payload.audioUri)) return;
      thread.messages.push({
        id: uid('msg'),
        mine: true,
        text,
        audioUri: action.payload.audioUri,
        durationMs: action.payload.durationMs,
        createdAt: new Date().toISOString(),
      });
      thread.unread = 0;
    },
    markThreadRead(state, action: PayloadAction<string>) {
      const thread = state.threads.find((item) => item.id === action.payload);
      if (thread) thread.unread = 0;
    },
    ensureThread(
      state,
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
    setGoing(state, action: PayloadAction<{ id: string; going: boolean }>) {
      const event = state.events.find((item) => item.id === action.payload.id);
      if (!event) return;
      const was = event.going === true;
      event.going = action.payload.going;
      if (action.payload.going && !was) event.attendees += 1;
      if (!action.payload.going && was) event.attendees = Math.max(0, event.attendees - 1);
    },
    addEvent(
      state,
      action: PayloadAction<{
        name: string;
        date: string;
        time: string;
        details: string;
        location: string;
        host: string;
        day?: string;
        month?: string;
      }>,
    ) {
      const day = action.payload.day || action.payload.date.slice(0, 2) || '01';
      state.events.unshift({
        id: uid('event'),
        title: action.payload.name.trim(),
        day,
        month: action.payload.month || 'Sep',
        place: action.payload.location.trim(),
        dateLabel: action.payload.date.trim(),
        time: action.payload.time.trim(),
        address: action.payload.location.trim(),
        about: action.payload.details.trim(),
        host: action.payload.host,
        image: 'festival',
        going: true,
        attendees: 1,
      });
    },
    addListing(
      state,
      action: PayloadAction<{
        title: string;
        description: string;
        category: Listing['category'];
        price: number;
        condition: Listing['condition'];
        quantity: number;
        sellerName: string;
        image: PhotoKey | string;
      }>,
    ) {
      state.listings.unshift({
        id: uid('listing'),
        title: action.payload.title.trim(),
        price: action.payload.price,
        category: action.payload.category,
        condition: action.payload.condition,
        image: action.payload.image,
        sellerName: action.payload.sellerName,
        sellerAvatar: 'portraitM',
        description: action.payload.description.trim(),
        quantity: action.payload.quantity,
      });
    },
    toggleFollow(state, action: PayloadAction<string>) {
      if (state.following.includes(action.payload)) {
        state.following = state.following.filter((id) => id !== action.payload);
      } else {
        state.following.push(action.payload);
      }
    },
    setPref(state, action: PayloadAction<{ key: keyof NotificationPrefs; value: boolean }>) {
      state.prefs[action.payload.key] = action.payload.value;
    },
    markNoticesRead(state) {
      state.notices.forEach((notice) => {
        notice.unread = false;
      });
    },
    askAssistant(state, action: PayloadAction<string>) {
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
    setBio(state, action: PayloadAction<string>) {
      state.bio = action.payload;
    },
    setChapter(state, action: PayloadAction<string>) {
      state.activeChapter = action.payload;
    },
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
  addPost,
  votePoll,
  addPoll,
  sendMessage,
  markThreadRead,
  ensureThread,
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
