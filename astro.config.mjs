import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import playformCompress from '@playform/compress';
import { imageService } from '@unpic/astro/service';
import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';
import purgecss from 'astro-purgecss';
import { siteConfig } from './src/config';
import partytown from '@astrojs/partytown';
import playformInline from '@playform/inline';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import remarkToc from 'remark-toc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Features, browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
import package_json from './package.json';
import { i18n, filterSitemapByDefaultLocale } from 'astro-i18n-aut/integration';

export const defaultLocale = 'fi';
const locales = {
	fi: 'fi-FI',
	en: 'en-US',
};

export default defineConfig({
	site: siteConfig.url,
	output: 'static',
	image: { service: imageService({}), responsiveStyles: true },
	experimental: { svgo: true, chromeDevtoolsWorkspace: true, preserveScriptOrder: true },
	prefetch: true,
	integrations: [
		mdx(),
		preact({ include: ['**/preact/*', '**/react/*', '**/components/ui/*'] }),
		/* AstroPWA({
          strategies: 'injectManifest',
          srcDir: 'src',
          filename: 'sw.ts',
          manifest: {
              name: "Åzze's website",
              short_name: 'Åzze',
              description: siteConfig.description,
              theme_color: '#310a65',
              id: '/',
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
			exclude: ['pages/api/**/*', 'pages/**/*.md', 'pages/**/*.ts'],
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
		playformCompress({ Image: false }),
	],
	trailingSlash: 'never',
	build: {
		format: 'file',
	},
	scopedStyleStrategy: 'class',
	security: {
		allowedDomains: [
			{ hostname: '**.ozze.eu.org', protocol: 'https', port: '443' },
			{ hostname: 'gc.zgo.at', protocol: 'https', port: '443' },
			{ hostname: 'keepandroidopen.org', protocol: 'https', port: '443' },
		],
	},
	markdown: {
		remarkPlugins: [
			[remarkToc, { heading: 'toc', maxDepth: 3 }],
			[remarkMath, {}],
		],
		rehypePlugins: [rehypeKatex],
	},
	vite: {
		server: { allowedHosts: ['prerelease.ozze.eu.org'] },
		resolve: {
			extensions: ['.ts', '.mts', '.mjs', '.js', '.jsx', '.tsx', '.json'],
		},
		css: {
			devSourcemap: true,
			transformer: 'lightningcss',
			lightningcss: {
				exclude: Features.Nesting,
				targets: browserslistToTargets(browserslist(package_json.browserslist)),
			},
		},
		build: {
			sourcemap: true,
			cssMinify: 'lightningcss',
			rollupOptions: {
				output: {
					compact: true,
					generatedCode: { preset: 'es2015' },
					importAttributesKey: 'with',
					interop: 'auto',
				},
				preserveEntrySignatures: false,
				treeshake: 'smallest',
			},
		},
		plugins: [visualizer({ emitFile: true, filename: 'stats.html' })],
	},
});
