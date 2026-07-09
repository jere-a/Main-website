/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
