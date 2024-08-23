const postcssPresetEnv = require('postcss-preset-env');
const tailwindNesting = require('tailwindcss/nesting');

module.exports = {
  plugins: [
    require('postcss-import'),
    tailwindNesting('postcss-nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
    postcssPresetEnv({
      features: { 'nesting-rules': false },
    }),
    require('cssnano'),
  ],
};