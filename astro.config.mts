import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { filterSitemapByDefaultLocale, i18n } from "astro-i18n-aut/integration";
import pageInsight from "astro-page-insight";
import { defineConfig, fontProviders, svgoOptimizer } from "astro/config";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";

import { remarkReadingTime } from "./remark-reading-time.mts";
import { siteConfig } from "./src/config";

export const defaultLocale = "fi";
const locales = {
  fi: "fi-FI",
  en: "en-US",
} as const;

export default defineConfig({
  site: siteConfig.url,
  output: "static",
  image: {
    responsiveStyles: true,
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
    chromeDevtoolsWorkspace: true,
    clientPrerender: true,
  },
  prefetch: true,
  integrations: [
    mdx(),
    svelte(),
    preact({ include: ["**/preact/*", "**/react/*", "**/components/ui/*"], devtools: true }),
    /* AstroPWA({
          strategies: 'injectManifest',
          srcDir: 'src',
          filename: 'sw.ts',
          manifest: {
              name: "Åzze's website",
              short_name: 'Åzze',
              description: siteConfig.description,
              theme_color: '#310a65',
              id: 'ozze',
              start_url: '/?source=pwa',
              display: 'standalone',
              dir: 'ltr',
              icons: [
                  {
                      src: '/pwa-192x192.png',
                      sizes: '192x192',
                      type: 'image/png',
                      purpose: 'any',
                  },
                  {
                      src: '/pwa-512x512.png',
                      sizes: '512x512',
                      type: 'image/png',
                      purpose: 'any',
                  },
                  {
                      src: '/pwa-maskable-192x192.png',
                      sizes: '192x192',
                      type: 'image/png',
                      purpose: 'maskable',
                  },
                  {
                      src: '/pwa-maskable-512x512.png',
                      sizes: '512x512',
                      type: 'image/png',
                      purpose: 'maskable',
                  },
              ],
          },
      }), */
    i18n({
      locales,
      defaultLocale,
      exclude: ["pages/api/**/*", "pages/**/*.md", "pages/**/*.ts"],
    }),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale }),
    }),
    /* partytown(), */
    pageInsight(),
  ],
  trailingSlash: "never",
  build: {
    format: "file",
  },
  scopedStyleStrategy: "class",
  security: {
    allowedDomains: [
      { hostname: "**.ozze.eu.org", protocol: "https", port: "443" },
      { hostname: "gc.zgo.at", protocol: "https", port: "443" },
      { hostname: "keepandroidopen.org", protocol: "https", port: "443" },
    ],
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' https://res.cloudinary.com",
        "connect-src 'self' https://t.ozze.eu.org",
      ],
      styleDirective: {
        hashes: ["sha256-lfvLzRh67u2qNRREwSYQw1jS4uxEC3+oHCb9rqdTDLA="],
      },
      scriptDirective: {
        resources: ["'self'", "t.ozze.eu.org", "cdn.jsdelivr.net", "static.cloudflareinsights.com"],
      },
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        remarkReadingTime as never,
        remarkToc,
        remarkMath,
      ],
      rehypePlugins: [rehypeMathjax],
    }),
    syntaxHighlight: "prism",
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Creepster",
      cssVariable: "--font-creepster",
    },
    {
      provider: fontProviders.google(),
      name: "Butcherman",
      cssVariable: "--font-butcherman",
    },
  ],
});
