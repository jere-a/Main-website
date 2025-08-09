// import mdx from '@astrojs/mdx';
import partytown from "@astrojs/partytown";
import purgecss from "astro-purgecss";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import preact from "@astrojs/preact";
import { filterSitemapByDefaultLocale, i18n } from "astro-i18n-aut/integration";
import mdx from "@astrojs/mdx";

import AstroPWA from "@vite-pwa/astro";
import { imageService } from "@unpic/astro/service";
import vtbot from "astro-vtbot";

// Rollup
import { nodeResolve } from "@rollup/plugin-node-resolve";
import strip from "@rollup/plugin-strip";
import terser from "@rollup/plugin-terser";

// import siteConfig
import { siteConfig } from "./src/config";

// Helper imports
import sitemap from "@astrojs/sitemap";
import playformCompress from "@playform/compress";

import { visualizer } from "rollup-plugin-visualizer";

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
  integrations: [
    vtbot(),
    mdx(),
    // vue({
    //   include: '**/vue/*'
    // }),
    //svelte({
    //	include: '**/svelte/*',
    //}),
    //solidJs({
    //	include: '**/solid/*',
    //}),
    //alpinejs(),
    //qwikdev({
    //	include: '**/qwik/*',
    //}), //preact({
    //  include: '**/preact/*'
    //}),
    preact({
      include: ["**/preact/*"],
    }),
    react({
      include: ["**/react/*", "**/components/ui/*"],
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
    //partytown(),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale }),
    }), //serviceWorker({
    //	registration: { autoRegister: true },
    //	workbox: { offlineGoogleAnalytics: false, disableDevLogs: true },
    //	swSrc: 'sw.js',
    //}),
    playformCompress({
      Image: false,
    }),
  ],
  trailingSlash: "never",
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
            dates: ["date-fns", "dayjs"],
            global: ["src/ts/global"],
            jquery: ["src/ts/jquery"],
            pages: ["src/pages"],
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
      nodeResolve({ browser: true }),
      strip(),
      terser(),
      visualizer({ emitFile: true, filename: "stats.html" }),
    ],
  },
});
