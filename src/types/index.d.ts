/// <reference path="./posthog.d.ts">
import "astro";

declare global {
  interface Window {
    particlesInit: (options?: Record<string, unknown>) => Promise<void>;
    particlesLoaded: (container: HTMLElement) => Promise<void>;
  }
}

declare module "astro" {
  interface HTMLAttributes {
    nonce?: string;
  }
}
