import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import preact from '@astrojs/preact';
import solidJs from '@astrojs/solid-js';
import lit from '@astrojs/lit';

// import siteConfig
import { siteConfig } from './src/config';

// Helper imports
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import playformCompress from '@playform/compress';
import qwikdev from "@qwikdev/astro";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
	site: siteConfig.url,
	integrations: [
		mdx(),
		// vue({
		//   include: '**/vue/*'
		// }),
		svelte({
			include: '**/svelte/*',
		}),
		lit({
			include: '**/lit/*',
		}),
		solidJs({
			include: '**/solid/*',
		}),
		alpinejs(),
		qwikdev({
			include: '**/qwik/*',
		}),
		//preact({
		//  include: '**/preact/*'
		//}),
		react({
      include: ['**/react/*', '**/components/ui/*'],
		}),
		tailwind(),
		partytown(),
		sitemap(),
		playformCompress({
			Image: false,
		}),
	],
	redirects: {
		"/articles/[...slug]": "/blog/[...slug]",
		"/articles": "/blog"
	},
	prefetch: {
		defaultStrategy: 'viewport',
		prefetchAll: true,
	},
	i18n: {
		defaultLocale: 'fi',
		locales: ['fi', 'en'],
	},
	vite: {
    build: {
			/* sourcemap: true, */
      rollupOptions: {
				output: {
					entryFileNames: 'entry.[hash].mjs',
					chunkFileNames: 'chunks/chunk.[hash].mjs',
					assetFileNames: 'assets/asset.[hash][extname]',
          compact: true,
        },
			},
		},
	},
});