import type { PayloadAction } from '@reduxjs/toolkit';

import { seedEvents, seedListings, seedPolls, seedPosts, type Listing } from '@/data/content';
import type { PhotoKey } from '@/data/images';

import { uid, type WorldState } from './state';

export const catalogReducers = {
  ensureProfileSamples(state: WorldState) {
    for (const post of seedPosts) {
      if (!post.mine || state.posts.some((item) => item.id === post.id)) continue;
      state.posts.push({ ...post, comments: post.comments.map((comment) => ({ ...comment })) });
    }
    for (const poll of seedPolls) {
      if (!poll.mine || state.polls.some((item) => item.id === poll.id)) continue;
      state.polls.push({
        ...poll,
        comments: (poll.comments ?? []).map((comment) => ({ ...comment })),
        options: poll.options.map((option) => ({ ...option })),
      });
    }
    for (const listing of seedListings) {
      if (!listing.mine || state.listings.some((item) => item.id === listing.id)) continue;
      state.listings.push({ ...listing });
    }
    for (const event of seedEvents) {
      if (!event.mine || state.events.some((item) => item.id === event.id)) continue;
      state.events.push({ ...event });
    }
  },
  setGoing(state: WorldState, action: PayloadAction<{ id: string; going: boolean }>) {
    const event = state.events.find((item) => item.id === action.payload.id);
    if (!event) return;
    const was = event.going === true;
    event.going = action.payload.going;
    if (action.payload.going && !was) event.attendees += 1;
    if (!action.payload.going && was) event.attendees = Math.max(0, event.attendees - 1);
  },
  addEvent(
    state: WorldState,
    action: PayloadAction<{
      name: string;
      date: string;
      time: string;
      details: string;
      location: string;
      host: string;
      day?: string;
      month?: string;
      image?: string;
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
      image: action.payload.image || 'festival',
      going: true,
      attendees: 1,
    });
  },
  addListing(
    state: WorldState,
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
};
