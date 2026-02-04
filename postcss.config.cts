const combineSelectors = require("postcss-combine-duplicated-selectors");

module.exports = {
  plugins: [
    require("@tailwindcss/postcss"),
    require("postcss-import"),
    require("autoprefixer"),
    combineSelectors({
      removeDuplicatedProperties: true,
      removeDuplicatedValues: true,
    }),
    require("cssnano")({
      preset: "advanced",
    }),
  ],
};
