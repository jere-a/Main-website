// import mdx from '@astrojs/mdx';

import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
// Helper imports
import sitemap from "@astrojs/sitemap";
import playformCompress from "@playform/compress";
import { imageService } from "@unpic/astro/service";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig } from "astro/config";
import { filterSitemapByDefaultLocale, i18n } from "astro-i18n-aut/integration";
import purgecss from "astro-purgecss";
import vtbot from "astro-vtbot";
import { visualizer } from "rollup-plugin-visualizer";
// import siteConfig
import { siteConfig } from "./src/config";

const defaultLocale = "fi";
const locales = {
  fi: "fi-FI",
  en: "en-US",
};

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  output: "static",

  image: {
    service: imageService({}),
  },

  experimental: {
    svgo: true,
  },

  prefetch: {
    defaultStrategy: "viewport",
  },

  integrations: [
    vtbot(),
    mdx(),
    preact({
      include: ["**/preact/*", "**/react/*", "**/components/ui/*"],
    }),


    AstroPWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      manifest: {
        name: "Åzze's website",
        short_name: "Åzze",
        description: siteConfig.description,
        theme_color: "#310a65",
        id: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),

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
          extractor: (content) =>
            content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
          extensions: ["astro", "html"],
        },
      ],
    }),

    i18n({
      locales,
      defaultLocale,
      redirectDefaultLocale: false,
      exclude: ["pages/**/*.js", "pages/**/*.ts", "pages/**/*.md"],
    }),

    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale }),
    }),

    //serviceWorker({
    //	registration: { autoRegister: true },
    //	workbox: { offlineGoogleAnalytics: false, disableDevLogs: true },
    //	swSrc: 'sw.js',
    //}),

    playformCompress({
      Image: false,
    }),
  ],

  trailingSlash: "never",
  scopedStyleStrategy: "class",
  security: {
    allowedDomains: [
      {
        hostname: "**.ozze.eu.org",
        protocol: "https",
        port: "443",
      },
      {
        hostname: "gc.zgo.at",
        protocol: "https",
        port: "443",
      },
    ],
  },

  //i18n: {
  //	defaultLocale: 'fi',
  //	locales: ['fi', 'en'],
  //},

  vite: {
    server: {
      allowedHosts: ["prerelease.ozze.eu.org"],
    },

    build: {
      sourcemap: true,
      cssMinify: "lightningcss",
      minify: "terser",

      rollupOptions: {
        output: {
          entryFileNames: "entry.[hash].mjs",
          chunkFileNames: "chunks/chunk.[hash].mjs",
          assetFileNames: "assets/asset.[hash][extname]",
          manualChunks: {
            global: ["src/ts/global"],
            jquery: ["src/ts/jquery"],
          },

          compact: true,

          generatedCode: {
            arrowFunctions: true,
            constBindings: true,
            objectShorthand: true,
            preset: "es2015",
          },

          interop: "auto",
          minifyInternalExports: true,
        },

        preserveEntrySignatures: false,
        treeshake: "smallest",
      },
    },

    plugins: [
      // terser is already used by Vite via build.minify
      visualizer({ emitFile: true, filename: "stats.html" }),
    ],
  },
});
