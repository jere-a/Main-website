/**
 * Feature flags configuration. Client-side feature toggles that can be used to enable/disable
 * specific site features independent of PostHog feature flags.
 */

import { siteConfig } from "@/config";

export const siteFeatures = {
  config: siteConfig,
  params: {
    functions: {
      holidayEffects: true,
      howOldSite: true,
      fetchIPP: true,
    },
  },
};
