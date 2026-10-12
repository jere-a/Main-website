import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

import * as siteConfig from "@/config";
import { getPublishedPosts } from "@/lib/blog";

const parser = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

export async function GET(context: APIContext) {
  const blog = await getPublishedPosts();

  return rss({
    title: siteConfig.blogTitle,
    description: siteConfig.rssDescription,
    site: context.site ?? siteConfig.url,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    items: blog.map((post) => ({
      title: post.data.title,
      tags: post.data.tags,
      content: sanitizeHtml(parser.render(post.body ?? ""), {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
      }),
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}`,
    })),
  });
}
