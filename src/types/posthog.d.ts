// posthog.d.ts
import type { PostHog } from "@posthog/types";

declare global {
  interface Window {
    posthog?: PostHog;
    __posthog_initialized?: boolean;
  }
}
