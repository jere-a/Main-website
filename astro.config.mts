import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import playformCompress from "@playform/compress";
import purgecss from "astro-purgecss";
import { defineConfig, fontProviders, svgoOptimizer } from "astro/config";
import { siteConfig } from "./src/config";
import { filterSitemapByDefaultLocale, i18n } from "astro-i18n-aut/integration";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";

export const defaultLocale = "fi";
const locales = {
  fi: "fi-FI",
  en: "en-US",
};

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
    preact({ include: ["**/preact/*", "**/react/*", "**/components/ui/*"] }),
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
    purgecss({
      keyframes: false,
      safelist: {
        standard: ["halloween", "butcherman", "lightrope"],
        greedy: [
          /*astro*/
        ],
      },
      extractors: [
        {
          extractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
          extensions: ["astro", "html"],
        },
      ],
    }),
    playformCompress({
      Image: false,
      CSS: { lightningcss: { minify: true } },
      SVG: false,
      JavaScript: false,
      Parser: {
        CSS: "lightningcss",
      },
    }),
  ],
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "always",
  },
  scopedStyleStrategy: "class",
  security: {
    allowedDomains: [
      { hostname: "**.ozze.eu.org", protocol: "https", port: "443" },
      { hostname: "gc.zgo.at", protocol: "https", port: "443" },
      { hostname: "keepandroidopen.org", protocol: "https", port: "443" },
    ],
    /* csp: {
            styleDirective: {
                resources: ["'self'", "'nonce-preloadscripts'"],
            },
            scriptDirective: {
                resources: ["'self'", 'cdn.jsdelivr.net', "'nonce-preloadscripts'"],
            },
        }, */
  },
  markdown: {
    remarkPlugins: [
      [remarkToc, { heading: "toc", maxDepth: 3 }],
      [remarkMath, {}],
    ],
    rehypePlugins: [rehypeMathjax],
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
