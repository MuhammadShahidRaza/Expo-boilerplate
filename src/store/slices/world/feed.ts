import type { PayloadAction } from '@reduxjs/toolkit';

import { seedPollComments } from '@/data/content';
import type { PhotoKey } from '@/data/images';

import { uid, type WorldState } from './state';

function withPollSocial(poll: WorldState['polls'][number]) {
  if (typeof poll.likes !== 'number') poll.likes = poll.id === 'poll-trail' ? 24 : 0;
  if (typeof poll.liked !== 'boolean') poll.liked = false;
  if (!Array.isArray(poll.comments)) {
    poll.comments = poll.id === 'poll-trail' ? seedPollComments.map((item) => ({ ...item })) : [];
  }
}

export const feedReducers = {
  toggleLike(state: WorldState, action: PayloadAction<string>) {
    const post = state.posts.find((item) => item.id === action.payload);
    if (!post) return;
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  },
  toggleSave(state: WorldState, action: PayloadAction<string>) {
    const post = state.posts.find((item) => item.id === action.payload);
    if (!post) return;
    post.saved = !post.saved;
  },
  addComment(state: WorldState, action: PayloadAction<{ postId: string; author: string; body: string; avatar: PhotoKey }>) {
    const post = state.posts.find((item) => item.id === action.payload.postId);
    const poll = state.polls.find((item) => item.id === action.payload.postId);
    const target = post ?? poll;
    if (!target || !action.payload.body.trim()) return;
    if (poll) withPollSocial(poll);
    target.comments.unshift({
      id: uid('comment'),
      author: action.payload.author,
      avatar: action.payload.avatar,
      body: action.payload.body.trim(),
      createdAt: new Date().toISOString(),
      mine: true,
    });
  },
  deleteComment(state: WorldState, action: PayloadAction<{ postId: string; commentId: string }>) {
    const post = state.posts.find((item) => item.id === action.payload.postId);
    const poll = state.polls.find((item) => item.id === action.payload.postId);
    const target = post ?? poll;
    if (!target) return;
    if (poll) withPollSocial(poll);
    target.comments = target.comments.filter((comment) => comment.id !== action.payload.commentId);
  },
  addPost(
    state: WorldState,
    action: PayloadAction<{
      author: string;
      body: string;
      chapter: string;
      avatar: PhotoKey;
      image?: string;
      video?: string;
      place?: string;
      postType?: string;
    }>,
  ) {
    const postType = action.payload.postType;
    state.posts.unshift({
      id: uid('post'),
      authorName: action.payload.author,
      avatar: action.payload.avatar,
      chapter: action.payload.chapter,
      createdAt: new Date().toISOString(),
      body: action.payload.body.trim(),
      image: action.payload.image,
      video: action.payload.video,
      place: action.payload.place,
      postType,
      official: postType === 'official' || undefined,
      likes: 0,
      shares: 0,
      liked: false,
      saved: false,
      mine: true,
      comments: [],
    });
  },
  deletePost(state: WorldState, action: PayloadAction<string>) {
    state.posts = state.posts.filter((post) => post.id !== action.payload);
  },
  sharePost(state: WorldState, action: PayloadAction<string>) {
    const post = state.posts.find((item) => item.id === action.payload);
    if (post) post.shares += 1;
  },
  reportPost(
    state: WorldState,
    action: PayloadAction<{ postId: string; reason: string; authorName: string; body: string }>,
  ) {
    if (!state.reportedPostIds) state.reportedPostIds = [];
    if (!state.reports) state.reports = [];
    if (state.reportedPostIds.includes(action.payload.postId)) return;
    state.reportedPostIds.push(action.payload.postId);
    state.reports.unshift(action.payload);
  },
  blockAuthor(state: WorldState, action: PayloadAction<string>) {
    const name = action.payload.trim();
    if (!name) return;
    if (!state.blockedAuthors) state.blockedAuthors = [];
    if (!state.blockedAuthors.includes(name)) state.blockedAuthors.push(name);
  },
  unblockAuthor(state: WorldState, action: PayloadAction<string>) {
    state.blockedAuthors = (state.blockedAuthors ?? []).filter((name) => name !== action.payload);
  },
  preparePoll(state: WorldState, action: PayloadAction<string>) {
    const poll = state.polls.find((item) => item.id === action.payload);
    if (!poll) return;
    withPollSocial(poll);
  },
  togglePollLike(state: WorldState, action: PayloadAction<string>) {
    const poll = state.polls.find((item) => item.id === action.payload);
    if (!poll) return;
    withPollSocial(poll);
    poll.liked = !poll.liked;
    poll.likes += poll.liked ? 1 : -1;
  },
  votePoll(state: WorldState, action: PayloadAction<{ pollId: string; optionId: string }>) {
    const poll = state.polls.find((item) => item.id === action.payload.pollId);
    if (!poll || poll.votedId) return;
    const option = poll.options.find((item) => item.id === action.payload.optionId);
    if (!option) return;
    option.votes += 1;
    poll.votedId = option.id;
  },
  addPoll(
    state: WorldState,
    action: PayloadAction<{
      author: string;
      question: string;
      options: { label: string; image?: string }[];
      avatar: PhotoKey;
      image?: string;
    }>,
  ) {
    state.polls.unshift({
      id: uid('poll'),
      authorName: action.payload.author,
      avatar: action.payload.avatar,
      createdAt: new Date().toISOString(),
      question: action.payload.question.trim(),
      votedId: null,
      image: action.payload.image,
      likes: 0,
      liked: false,
      comments: [],
      options: action.payload.options
        .filter((option) => option.label.trim())
        .map((option) => ({ id: uid('opt'), label: option.label.trim(), votes: 0, image: option.image })),
    });
  },
};
