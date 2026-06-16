import { defineConfig } from "rolldown";

export default defineConfig({
  output: {
    minify: true,
    topLevelVar: true,
    comments: {
      legal: true,
      annotation: false,
      jsdoc: false,
    },
    sourcemap: true,
  },
  preserveEntrySignatures: false,
  optimization: {
    inlineConst: { mode: "all", pass: 100 },
  },
});
