import type { PostHogConfig } from "posthog-js";

declare global {
  interface Window {
    __posthog_initialized?: true;
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

const LOCAL = new Set(["localhost", "127.0.0.1", "::1"]);

const init = async (): Promise<void> => {
  if (typeof window === "undefined" || window.__posthog_initialized) return;
  window.__posthog_initialized = true;

  if (navigator.globalPrivacyControl) return;

  if (LOCAL.has(location.hostname)) return;

  const env = import.meta.env as ImportMetaEnv & {
    CI?: string;
    VITEST?: string | boolean;
  };
  const isTest = env.MODE === "test" || !!env.VITEST || env.CI === "true";

  const config = {
    api_host: "https://t.ozze.eu.org",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-11-30",
    capture_pageview: "history_change",
    ...(isTest && {
      advanced_disable_feature_flags: true,
      autocapture: false,
      disable_session_recording: true,
    }),
  } satisfies Partial<PostHogConfig>;

  const posthog = (await import("posthog-js")).default;

  posthog.init("phc_5MXCIWNtl5iS3fpCybKZjGJoe1RIoJlpHGBwfZgfUFF", config);
};

export default init;
