import type { Post } from '@/data/content';

const empty: string[] = [];

export function stableList(list?: string[]) {
  return list ?? empty;
}

export function visiblePosts(posts: Post[], blockedAuthors?: string[], reportedPostIds?: string[]) {
  const blocked = new Set(stableList(blockedAuthors));
  const reported = new Set(stableList(reportedPostIds));
  return posts.filter((post) => !blocked.has(post.authorName) && !reported.has(post.id));
}
