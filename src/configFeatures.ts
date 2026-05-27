import { type SiteConfig, siteConfig } from "@/config";

export type SiteConfigFeatures = {
  config: SiteConfig;
  params: {
    cookies: {
      cookiesEnabled: boolean;
      expire_days: number;
    };
    functions: {
      holidayEffects: boolean;
      howOldSite: boolean;
      fetchIPP: boolean;
      splashcursor: boolean;
    };
  };
};

export const siteFeatures: SiteConfigFeatures = {
  config: siteConfig,
  params: {
    cookies: {
      cookiesEnabled: false,
      expire_days: 2,
    },
    functions: {
      holidayEffects: true,
      howOldSite: true,
      fetchIPP: true,
      splashcursor: true,
    },
  },
};
