// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  trailingComma: "es5",
  tabWidth: 4,
  semi: true,
  singleQuote: true,
  useTabs: true,
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: [".*", "*.md", "*.toml", "*.yml"],
      options: {
        useTabs: false,
      },
    },
    {
      files: ["**/*.astro"],
      options: {
        parser: "astro",
      },
    },
  ],
};

export default config;
