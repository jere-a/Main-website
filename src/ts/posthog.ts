import type { PostHogConfig, CaptureResult } from "posthog-js";
import posthog from "posthog-js";

import { siteConfig } from "@/config";

declare global {
  interface Window {
    __posthog_initialized?: boolean;
  }
}

const LOCAL = new Set(["localhost", "127.0.0.1", "::1"]);
const LIGHTHOUSE_USER_AGENTS = [
  "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
];

const init = async (): Promise<void> => {
  if (typeof window === "undefined" || window.__posthog_initialized) return;
  window.__posthog_initialized = true;

  const env = import.meta.env as ImportMetaEnv & {
    CI?: string;
    VITEST?: string | boolean;
  };
  const isTest = env.MODE === "test" || !!env.VITEST || env.CI === "true";
  const isLocal = LOCAL.has(location.hostname);
  const isDev = isTest || isLocal;

  const config = {
    api_host: `https://t.${siteConfig.host}`,
    ui_host: "https://eu.posthog.com",
    defaults: "2026-05-30",
    strict_script_versioning: true,
    secure_cookie: true,
    opt_out_capturing_by_default: true,
    custom_blocked_useragents: LIGHTHOUSE_USER_AGENTS,
    ...(isDev && {
      debug: true,
      advanced_disable_feature_flags: true,
      autocapture: false,
      disable_session_recording: true,
      before_send: (event: CaptureResult | null): CaptureResult | null => {
        if (event) {
          // oxlint-disable-next-line no-console
          console.log(`posthog event: ${event.event}`, event);
        }
        return null;
      },
    }),
  } satisfies Partial<PostHogConfig>;

  posthog.init(siteConfig.posthog_id, config);
};

export default init;
