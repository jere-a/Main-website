/**
 * Shared blog-collection helpers.
 *
 * Draft handling and ordering live here so the blog index, the post route, and the RSS feed can
 * never disagree about what is published (a draft once leaked into the feed because each call site
 * filtered independently).
 */

import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

/** Drafts stay visible in development and are excluded from production builds. */
const includeDrafts = import.meta.env.DEV;

/** Published posts, newest first. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const entries = await getCollection("blog");

  return entries
    .filter((entry) => includeDrafts || !entry.data.draft)
    .toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Published posts for a single language, newest first. */
export async function getPublishedPostsByLang(lang: string): Promise<BlogPost[]> {
  return (await getPublishedPosts()).filter((entry) => entry.data.lang === lang);
}
