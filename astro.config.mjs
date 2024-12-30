// import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import purgecss from 'astro-purgecss';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { i18n, filterSitemapByDefaultLocale } from "astro-i18n-aut/integration";

import serviceWorker from 'astrojs-service-worker';

// Rollup
import { nodeResolve } from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';

// import siteConfig
import { siteConfig } from './src/config';

// Helper imports
import sitemap from '@astrojs/sitemap';
import playformCompress from '@playform/compress';

import { visualizer } from "rollup-plugin-visualizer";

const defaultLocale = "fi";
const locales = {
  fi: "fi-FI",
  en: "en-US"
};

// https://astro.build/config
export default defineConfig({
	site: siteConfig.url,
	output: 'static',
	integrations: [
		//mdx(), // vue({
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
		//react({
		//	include: ['**/react/*', '**/components/ui/*'],
		//}),
		purgecss({
			keyframes: false,
			safelist: {
				standard: ['halloween', 'butcherman', 'lightrope'],
				greedy: [
					/*astro*/
				],
			},
			extractors: [
				{
					extractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
					extensions: ['astro', 'html'],
				},
			],
		}),
    i18n({
      locales,
      defaultLocale,
      redirectDefaultLocale: false,
      exclude: ['pages/**/*.js', 'pages/**/*.ts', 'pages/**/*.md']
    }),
		partytown(),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale }),
    }),
		serviceWorker({
			registration: { autoRegister: false },
			workbox: { offlineGoogleAnalytics: false, disableDevLogs: true },
			swSrc: 'sw.js',
		}),
		playformCompress({
      Image: false,
		}),
	],
	build: {
	  format: 'directory'
	},
	trailingSlash: 'always',
	//i18n: {
	//	defaultLocale: 'fi',
	//	locales: ['fi', 'en'],
	//},
	vite: {
		build: {
			assetsInlineLimit: 4096*1.5,
			sourcemap: true,
			cssMinify: 'lightningcss',
			minify: 'terser',
			rollupOptions: {
				output: {
					entryFileNames: 'entry.[hash].mjs',
					chunkFileNames: 'chunks/chunk.[hash].mjs',
					assetFileNames: 'assets/asset.[hash][extname]',
					manualChunks: {
						dates: ['date-fns', 'dayjs'],
						global: ['src/ts/global'],
						components: ['src/ts/components'],
					},
					compact: true,
					generatedCode: {
					  arrowFunctions: true,
						constBindings: true,
						objectShorthand: true,
						preset: 'es2015'
					},
					interop: 'auto',
					minifyInternalExports: true,
				},
				preserveEntrySignatures: false,
			},
		},
		plugins: [nodeResolve({ browser: true }), strip(), terser(), 
		  visualizer({ emitFile: true, filename: "stats.html" })
		]
	},
});
