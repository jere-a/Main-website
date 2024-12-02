/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  build: {
    sourcemap: true,
  },
});
