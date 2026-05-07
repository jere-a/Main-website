import type { UserConfig } from "vite";
import browserslist from "browserslist";
import { Features, browserslistToTargets } from "lightningcss";
import package_json from "./package.json";

export default {
  resolve: {
    extensions: [".ts", ".mts", ".mjs", ".js", ".jsx", ".tsx", ".json"],
  },
  server: { allowedHosts: ["prerelease.ozze.eu.org"] },
  css: {
    devSourcemap: true,
    transformer: "lightningcss",
    lightningcss: {
      exclude: Features.Nesting,
      targets: browserslistToTargets(browserslist(package_json.browserslist)),
    },
  },
  build: {
    sourcemap: true,
    cssMinify: "lightningcss",
    rolldownOptions: {
      output: {
        minify: true,
        topLevelVar: true,
        comments: {
          legal: true,
          annotation: false,
          jsdoc: false,
        },
      },
      preserveEntrySignatures: false,
      optimization: {
        inlineConst: { mode: "smart", pass: 25 },
      },
    },
  },
  plugins: [],
} satisfies UserConfig;
