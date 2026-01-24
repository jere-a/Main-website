/// <reference path="./posthog.d.ts">

export {};

declare global {
  interface Window {
    particlesInit: any;
    particlesLoaded: any;
  }
}
