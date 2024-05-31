import { defineConfig } from 'astro/config';
import partytown from "@astrojs/partytown";
import robotsTxt from "astro-robots-txt";
import mdx from "@astrojs/mdx";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import preact from "@astrojs/preact";
import solidJs from "@astrojs/solid-js";
import lit from "@astrojs/lit";
import spotlightjs from "@spotlightjs/astro";
import pageInsight from "astro-page-insight";

// Helper imports
import { manifest } from "./utils/seoConfig";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: 'https://ozze.eu.org',
  integrations: [robotsTxt({
    host: 'ozze.eu.org',
    transform(content) {
      return `# Robots.txt file for search egines to crawl the website for indexing\n
      # Created in the distant future (the year 2000) after\n
      # the robotic uprising of the mid 90's which wiped out all humans.\n\n${content}`;
    }
  }), mdx(), vue(), svelte(), preact(), solidJs(), pageInsight(), react(), tailwind(), partytown(), sitemap(), playformCompress({
    Image: false,
  })],
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true
  },

  i18n: {
    defaultLocale: "fi",
    locales: ["fi", "en"]
  },

  vite: {
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          entryFileNames: 'entry.[hash].mjs',
          chunkFileNames: 'chunks/chunk.[hash].mjs',
          assetFileNames: 'assets/asset.[hash][extname]',
        }
      }
    }
  }
});