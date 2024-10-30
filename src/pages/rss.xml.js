import rss from '@astrojs/rss';
import { siteConfig } from '@/config';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
		title: siteConfig.Blogtitle,
		description: siteConfig.rss_description,
		site: context.site,
		xmlns: { atom: 'http://www.w3.org/2005/Atom' },
		items: blog.map((post) => ({
			title: post.data.title,
			tags: post.data.tags,
			content: sanitizeHtml(parser.render(post.body), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
			}),
			pubDate: post.data.pubDate,
			// Compute RSS link from post `slug`
			// This example assumes all posts are rendered as `/blog/[slug]` routes
			link: `/blog/${post.slug}/`,
		})),
  });
}