const postcssPresetEnv = require('postcss-preset-env');
const tailwindNesting = require('tailwindcss/nesting');

module.exports = {
  plugins: [
    require('postcss-import'),
    tailwindNesting('postcss-nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano'),
    postcssPresetEnv({
      features: { 'nesting-rules': false },
    }),
  ],
};