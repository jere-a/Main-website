import type { PostHogConfig } from "posthog-js";

declare global {
  interface Window {
    __posthog_initialized?: true;
  }
}

let posthogInstance: typeof import("posthog-js").default | null = null;

async function getPosthog() {
  if (!posthogInstance) {
    const { default: posthog } = await import("posthog-js");
    posthogInstance = posthog;
  }
  return posthogInstance;
}

const LOCAL = new Set(["localhost", "127.0.0.1", "::1"]);

const init = async (): Promise<void> => {
  if (typeof window === "undefined" || window.__posthog_initialized) return;
  window.__posthog_initialized = true;

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

  const posthog = await getPosthog();

  posthog.init("phc_5MXCIWNtl5iS3fpCybKZjGJoe1RIoJlpHGBwfZgfUFF", config);
};

export default init;
