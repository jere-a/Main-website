import { siteConfig as config } from "@/config";

export const siteConfig = {
  config,
  params: {
    cookies: {
      cookiesEnabled: false,
      expire_days: 2,
    },
    functions: {
      holidayEffects: true,
      howOldSite: true,
      quicklink: true,
      fetchIPP: false,
      splashcursor: true,
    },
  },
};
