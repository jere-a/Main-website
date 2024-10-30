const postcssPresetEnv = require('postcss-preset-env');
const tailwindNesting = require('tailwindcss/nesting');
const atomizer = require('postcss-atomizer');
const postcssPrefixer = require('postcss-prefixer');

module.exports = {
	plugins: [
		require('postcss-import'),
		tailwindNesting('postcss-nesting'),
		require('tailwindcss'),
		atomizer(),
		require('autoprefixer'),
		postcssPresetEnv({
			features: { 'nesting-rules': false, 'custom-properties': true },
		}),
		require('cssnano'),
	],
};
