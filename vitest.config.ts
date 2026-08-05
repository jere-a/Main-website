/// <reference types="vitest" />
import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@utils": path.resolve(__dirname, "src/lib/utils"),
      "@components": path.resolve(__dirname, "src/components"),
      "@styles": path.resolve(__dirname, "src/styles"),
    },
  },
  test: {
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      thresholds: {
        "100": true,
      },
    },
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
