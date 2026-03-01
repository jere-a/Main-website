/// <reference path="./posthog.d.ts">

export {};

declare global {
  interface Window {
    particlesInit: (options?: Record<string, unknown>) => Promise<void>;
    particlesLoaded: (container: HTMLElement) => Promise<void>;
  }
}
