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

const cookiesParams = {
  cookiesEnabled: false,
  expire_days: 2,
} as const;

const functionsParams = {
  holidayEffects: true,
  howOldSite: true,
  fetchIPP: true,
  splashcursor: true,
} as const;

const params = {
  cookies: cookiesParams,
  functions: functionsParams,
} as const;

export const siteFeatures: SiteConfigFeatures = {
  config: siteConfig,
  params,
} satisfies SiteConfigFeatures;
