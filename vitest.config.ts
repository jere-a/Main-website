/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  build: {
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
