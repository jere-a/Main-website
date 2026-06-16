import browserslist from "browserslist";
import { browserslistToTargets, Features } from "lightningcss";
import type { UserConfig } from "vite";
import oxlintPlugin from "vite-plugin-oxlint";

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
  },
  plugins: [oxlintPlugin()],
} satisfies UserConfig;
