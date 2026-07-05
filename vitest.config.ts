/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

const config: Parameters<typeof getViteConfig>[0] & {
  test: { environment: string; include: string[] };
} = {
  build: {
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
};

export default getViteConfig(config);
