import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { siteConfig } from '../config';
const markdown = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
    title: 'Åzze’s Blog',
    description: 'A small indebended content creator for the internet',
    site: context.site,
    xmlns: {atom: 'http://www.w3.org/2005/Atom'},
    items: blog.map((post) => ({
        title: post.data.title,
        description: sanitizeHtml(markdown.render(post.body).replace('src="/', `src="${siteConfig.url}/`).replace('href="/', `href="${siteConfig.url}/`)
                                  .split(' ').slice(0, 50).join(' ')),
        content: sanitizeHtml(markdown.render(post.body)),
        pubDate: post.data.pubDate,
        // Compute RSS link from post `slug`
        // This example assumes all posts are rendered as `/blog/[slug]` routes
        link: `/blog/${post.slug}/`,
    })),
  });
}