import { type SiteConfig, siteConfig } from "@/config";

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

export type SiteConfigFeatures = {
  config: SiteConfig;
  params: typeof params;
};

export const siteFeatures = {
  config: siteConfig,
  params,
} satisfies SiteConfigFeatures;
