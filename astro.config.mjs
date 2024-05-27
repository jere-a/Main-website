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
import { VitePWA } from "vite-plugin-pwa";

// Helper imports
import { manifest } from "./utils/seoConfig";


// https://astro.build/config
export default defineConfig({
  integrations: [partytown(), robotsTxt(), mdx(), vue(), svelte(), preact(), solidJs(), spotlightjs(), pageInsight()],
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true
  },
  i18n: {
    defaultLocale: "fi",
    locales: ["fi", "en"]
  },
  vite: {
    plugins: [
			VitePWA({
				registerType: "autoUpdate",
				manifest,
				workbox: {
				  globDirectory: 'dist',
				  globPatterns: [
				    '**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}',
				  ],
				  // Don't fallback on document based (e.g. `/some-page`) requests
				  // This removes an errant console.log message from showing up.
				  navigateFallback: null,
				},
			})
		],
    ssr: {
      noExternal: ['normalize.css']
    },
    css: {
      transformer: "lightningcss"
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'entry.[hash].mjs',
          chunkFileNames: 'chunks/chunk.[hash].mjs',
          assetFileNames: 'assets/asset.[hash][extname]'
        }
      }
    }
  }
});