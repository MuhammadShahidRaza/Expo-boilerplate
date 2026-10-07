import {
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

export type NotificationPrefs = {
  newPosts: boolean;
  reactions: boolean;
  comments: boolean;
  direct: boolean;
  group: boolean;
  reminders: boolean;
  newEvents: boolean;
};

export type WorldState = {
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
  blockedAuthors: string[];
  reportedPostIds: string[];
  reports: { postId: string; reason: string; authorName: string; body: string }[];
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

export const initialState: WorldState = {
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
  blockedAuthors: [],
  reportedPostIds: [],
  reports: [],
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

export function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}
