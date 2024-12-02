import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import purgecss from 'astro-purgecss';
import { defineConfig } from 'astro/config';

import serviceWorker from 'astrojs-service-worker';

// import siteConfig
import { siteConfig } from './src/config';

// Helper imports
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import playformCompress from '@playform/compress';

import { visualizer } from "rollup-plugin-visualizer";

import stylify from '@stylify/astro';
import { hooks } from '@stylify/bundler';
import fastGlob from 'fast-glob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pagesDir = 'src/pages';
const layoutsDir = 'src/layouts';
const stylesDir = 'src/styles';

/** @type { import('@stylify/bundler').BundlerConfigInterface[]} */
const stylifyBundles = [];
const layoutCssLayerName = 'layout';
const pageCssLayerName = 'page';

const getFileCssLayerName = (filePath) =>
	filePath.includes('/pages/') ? pageCssLayerName : layoutCssLayerName;

const getOutputFileName = (file) => {
	const parsedFile = path.parse(file);
	const fileName = parsedFile.name.toLowerCase();
	const dirNameCleanupRegExp = new RegExp(`${pagesDir}|${layoutsDir}|\\W`, 'g');
	const dir = parsedFile.dir.replace(dirNameCleanupRegExp, '');
	return `${dir.length ? `${dir}-` : ''}${fileName}.css`;
};

const createBundle = (file) => {
	const fileCssLayerName = getFileCssLayerName(file);

	return {
		outputFile: `${stylesDir}/${fileCssLayerName}/${getOutputFileName(file)}`,
		files: [file],
		cssLayer: fileCssLayerName,
	};
};

const createBundles = (files) => {
	for (const file of files) {
		stylifyBundles.push(createBundle(file));
	}
};

// 1. Map files in layouts/pages and create bundles
createBundles(fastGlob.sync(`${pagesDir}/**/*.astro`));
createBundles(fastGlob.sync(`${layoutsDir}/**/*.astro`));

// 2. Init Stylify Astro Integraton
const stylifyIntegration = stylify({
	bundler: {
		id: 'astro',
		// Set CSS @layers order
		cssLayersOrder: {
			// Order will be @layer layout,page;
			order: [layoutCssLayerName, pageCssLayerName].join(','),
			// Layers order will be exported into file with layout @layer
			exportLayer: [layoutCssLayerName],
		},
	},
	bundles: stylifyBundles,
});

// 3. Add hook that processes opened files
/** @param { import('@stylify/bundler').BundleFileDataInterface } data */
hooks.addListener('bundler:fileToProcessOpened', (data) => {
	let { content, filePath } = data;

	// 3.1 Only for layout and page files
	if (filePath.includes('/pages/') || filePath.includes('/layouts/')) {
		const cssFilePathImport = `import '/${stylesDir}/${getFileCssLayerName(
			filePath
		)}/${getOutputFileName(filePath)}';`;

		if (!content.includes(cssFilePathImport)) {
			if (/import \S+ from (?:'|")\S+(\/layouts\/\S+)(?:'|");/.test(content)) {
				content = content.replace(
					/import \S+ from (?:'|")\S+\/layouts\/\S+(?:'|");/,
					`$&\n${cssFilePathImport}`
				);
			} else if (/^\s*---\n/.test(content)) {
				content = content.replace(/^(\s*)---\n/, `$&${cssFilePathImport}\n`);
			} else {
				content = `---\n${cssFilePathImport}\n---\n${content}`;
			}

			fs.writeFileSync(filePath, content);
		}
	}

	// 3.2 For all files
	const regExp = new RegExp(`import \\S+ from (?:'|")\\S+(\\/components\\/\\S+)(?:'|");`, 'g');
	let importedComponent;
	const importedComponentFiles = [];
	const rootDir = path.dirname(fileURLToPath(import.meta.url));

	while ((importedComponent = regExp.exec(content))) {
		importedComponentFiles.push(path.join(rootDir, 'src', importedComponent[1]));
	}

	data.contentOptions.files = importedComponentFiles;
});

// 4. Wait for bundler to initialize and watch for directories
// to create new bundles when a file is added
hooks.addListener('bundler:initialized', ({ bundler }) => {
	// Watch layouts and pages directories
	// If you plan to use nested directories like blog/_slug.astro
	// for which you want to automatize bundles configuration
	// You will need to add the path to them here
	const dirsToWatchForNewBundles = [layoutsDir, pagesDir];
	for (const dir of dirsToWatchForNewBundles) {
		fs.watch(dir, (eventType, fileName) => {
			const fileFullPath = path.join(dir, fileName);

			if (eventType !== 'rename' || !fs.existsSync(fileFullPath)) {
				return;
			}

			bundler.bundle([createBundle(fileFullPath)]);
		});
	}
});

// https://astro.build/config
export default defineConfig({
	site: siteConfig.url,
	integrations: [
		serviceWorker({
			registration: { autoRegister: false },
			workbox: { offlineGoogleAnalytics: false },
			swSrc: 'sw.js',
		}),
		mdx(), // vue({
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
		tailwind(),
		stylifyIntegration,
		purgecss({
			keyframes: false,
			safelist: {
				standard: ['halloween', 'butcherman'],
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
		partytown(),
		sitemap(),
		playformCompress({
			Image: false,
		}),
	],
	redirects: {
		'/articles/[...slug]': '/blog/[...slug]',
		'/articles': '/blog',
	},
	i18n: {
		defaultLocale: 'fi',
		locales: ['fi', 'en'],
	},
	vite: {
		build: {
			assetsInlineLimit: 4096*1.5,
			/* sourcemap: true, */
			rollupOptions: {
				output: {
					entryFileNames: 'entry.[hash].[name].mjs',
					chunkFileNames: 'chunks/chunk.[hash].[name].mjs',
					assetFileNames: 'assets/asset.[hash].[name][extname]',
					compact: true,
				},
			},
		},
		plugins: [
		  visualizer({
        emitFile: true,
        filename: "stats.html",
      })
		]
	},
});
