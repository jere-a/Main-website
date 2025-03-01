import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `
# Created in the distant future (the year 2000) after
# the robotic uprising of the mid 90's which wiped out all humans.

User-agent: *
Disallow: /cgi-bin/
Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};
