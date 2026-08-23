/// <reference types="vitest" />
import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@lib": path.resolve(import.meta.dirname, "src/lib"),
      "@utils": path.resolve(import.meta.dirname, "src/lib/utils"),
      "@components": path.resolve(import.meta.dirname, "src/components"),
      "@styles": path.resolve(import.meta.dirname, "src/styles"),
    },
  },
  test: {
    environment: "happy-dom",
    restoreMocks: true,
    coverage: {
      provider: "istanbul",
      include: [
        "src/lib/**/*.{js,mjs,cjs,ts,mts,cts}",
        "src/i18n/**/*.{js,mjs,cjs,ts,mts,cts}",
        "src/config.ts",
        "src/configFeatures.ts",
        "!src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}",
      ],
    },
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
