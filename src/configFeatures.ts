import { type SiteConfig, siteConfig } from "@/config";

export type SiteConfigFeatures = {
  config: SiteConfig;
  params: {
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
    functions: {
      holidayEffects: true,
      howOldSite: true,
      fetchIPP: true,
      splashcursor: true,
    },
  },
};
