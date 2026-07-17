/**
 * Feature flags configuration. Client-side feature toggles that can be used to enable/disable
 * specific site features independent of PostHog feature flags.
 */

import { type SiteConfig, siteConfig } from "@/config";

/** Feature flags and their associated site config. */
export type SiteConfigFeatures = {
  config: SiteConfig;
  params: {
    functions: {
      /** Enable holiday-themed visual effects (snow, fireworks, etc.). */
      holidayEffects: boolean;
      /** Enable "how old is this site" widget. */
      howOldSite: boolean;
      /** Enable Cloudflare IP trace display on 404 page. */
      fetchIPP: boolean;
      /** Enable the WebGL splash cursor effect. */
      splashcursor: boolean;
    };
  };
};

export const siteFeatures: SiteConfigFeatures = {
  config: siteConfig,
  params: {
    functions: {
      holidayEffects: true,
      howOldSite: true,
      fetchIPP: true,
      splashcursor: true,
    },
  },
};
