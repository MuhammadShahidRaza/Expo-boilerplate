// @ts-nocheck
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { worldReducer } from './index.ts';
import {
  addComment,
  addListing,
  addPost,
  blockAuthor,
  deleteComment,
  deletePost,
  reportPost,
  sendMessage,
  sharePost,
  unblockAuthor,
} from './index.ts';
import { visiblePosts } from '../../../utils/feed.ts';

function run(state, action) {
  return worldReducer(state, action);
}

describe('posts, chat, block, and listings', () => {
  it('adds a typed post, sends it in chat, then deletes it', () => {
    let state = worldReducer(undefined, { type: '@@INIT' });
    const before = state.posts.length;
    state = run(
      state,
      addPost({
        author: 'Marcus Williams',
        body: 'Saturday market is open',
        chapter: 'Little Haiti Miami',
        avatar: 'portraitM',
        postType: 'marketplace',
        place: 'Little Haiti',
      }),
    );
    const post = state.posts[0];
    assert.equal(state.posts.length, before + 1);
    assert.equal(post.postType, 'marketplace');
    assert.equal(post.place, 'Little Haiti');
    assert.equal(post.mine, true);

    const threadId = state.threads[0].id;
    const messages = state.threads[0].messages.length;
    state = run(
      state,
      sendMessage({
        threadId,
        post: {
          authorName: post.authorName,
          avatar: post.avatar,
          chapter: post.chapter,
          body: post.body,
          image: 'cleanup',
          video: 'file://note.mp4',
          place: post.place,
          postType: post.postType,
        },
      }),
    );
    state = run(state, sharePost(post.id));
    const shared = state.threads[0].messages.at(-1);
    assert.equal(state.threads[0].messages.length, messages + 1);
    assert.equal(shared.post.body, 'Saturday market is open');
    assert.equal(shared.post.image, 'cleanup');
    assert.equal(shared.post.video, 'file://note.mp4');
    assert.equal(state.posts[0].shares, 1);

    state = run(state, deletePost(post.id));
    assert.equal(state.posts.some((item) => item.id === post.id), false);
  });

  it('hides a reported post and restores a blocked author after unblock', () => {
    let state = worldReducer(undefined, { type: '@@INIT' });
    const post = state.posts.find((item) => item.authorName === 'Marie Celestin');
    assert.ok(post);
    state = run(state, blockAuthor(post.authorName));
    assert.equal(visiblePosts(state.posts, state.blockedAuthors, state.reportedPostIds).some((item) => item.id === post.id), false);
    assert.equal(state.threads.some((thread) => !state.blockedAuthors.includes(thread.name) && thread.name === post.authorName), false);

    state = run(state, unblockAuthor(post.authorName));
    assert.equal(visiblePosts(state.posts, state.blockedAuthors, state.reportedPostIds).some((item) => item.id === post.id), true);
    assert.equal(state.blockedAuthors.includes(post.authorName), false);

    state = run(
      state,
      reportPost({ postId: post.id, reason: 'reportSpam', authorName: post.authorName, body: post.body }),
    );
    assert.equal(state.reports[0].authorName, post.authorName);
    assert.equal(visiblePosts(state.posts, state.blockedAuthors, state.reportedPostIds).some((item) => item.id === post.id), false);
  });

  it('adds a listing that can be found by title and seller', () => {
    let state = worldReducer(undefined, { type: '@@INIT' });
    const before = state.listings.length;
    state = run(
      state,
      addListing({
        title: 'Blue cooler',
        description: 'Works well and stays cold all day.',
        category: 'food',
        price: 25,
        condition: 'used',
        quantity: 1,
        sellerName: 'Marcus Williams',
        image: 'food',
      }),
    );
    assert.equal(state.listings.length, before + 1);
    const listing = state.listings[0];
    assert.equal(listing.title, 'Blue cooler');
    assert.equal(listing.sellerName, 'Marcus Williams');
    assert.equal(listing.price, 25);
    const mine = state.listings.filter((item) => item.sellerName === 'Marcus Williams' && item.title === 'Blue cooler');
    assert.equal(mine.length, 1);
  });

  it('does not send an empty chat message', () => {
    let state = worldReducer(undefined, { type: '@@INIT' });
    const count = state.threads[0].messages.length;
    state = run(state, sendMessage({ threadId: state.threads[0].id, text: '   ' }));
    assert.equal(state.threads[0].messages.length, count);
  });

  it('adds and deletes a comment on a post', () => {
    let state = worldReducer(undefined, { type: '@@INIT' });
    const postId = state.posts[0].id;
    const before = state.posts[0].comments.length;
    state = run(
      state,
      addComment({
        postId,
        author: 'Marcus Williams',
        body: 'See you there',
        avatar: 'portraitM',
      }),
    );
    const comment = state.posts[0].comments[0];
    assert.equal(state.posts[0].comments.length, before + 1);
    assert.equal(comment.mine, true);
    state = run(state, deleteComment({ postId, commentId: comment.id }));
    assert.equal(state.posts[0].comments.some((item) => item.id === comment.id), false);
  });
});
