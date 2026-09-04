/**
 * PostHog analytics initialization. Configures tracking with privacy-first defaults (opt-out by
 * default). Disables tracking in dev/test environments and for Lighthouse user agents.
 */

import type { PostHogConfig, CaptureResult } from "posthog-js";
import posthogModule from "posthog-js";

import * as siteConfig from "@/config";

declare global {
  interface Window {
    __posthog_initialized?: boolean;
  }
}

/** Hostnames where analytics should be disabled. */
const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

const CHROME_119 = "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0";

/** User agent strings to block from analytics (Lighthouse audits). */
const BLOCKED_USER_AGENTS = [
  `Mozilla/5.0 (Linux; Android 11; moto g power (2022)) ${CHROME_119} Mobile Safari/537.36`,
  `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ${CHROME_119} Safari/537.36`,
];

function isDevMode(): boolean {
  const isTest = import.meta.env.MODE === "test";
  const isLocal = LOCALHOST_HOSTNAMES.has(location.hostname);

  return isTest || isLocal;
}

function posthogSendEvent(event: CaptureResult | null): CaptureResult | null {
  if (event) {
    // oxlint-disable-next-line no-console
    console.log(`posthog event: ${event.event}`, event);
  }
  return null;
}

/** Initialize PostHog. Safe to call multiple times (idempotent). */
const init = async (): Promise<void> => {
  if (typeof window === "undefined" || window.__posthog_initialized) return;
  window.__posthog_initialized = true;

  const isDev = isDevMode();

  const devConfig = {
    debug: true,
    advanced_disable_feature_flags: true,
    autocapture: false,
    disable_session_recording: true,
    before_send: (event: CaptureResult | null) => posthogSendEvent(event),
  } satisfies Partial<PostHogConfig>;

  const config = {
    api_host: `https://t.${siteConfig.host}`,
    ui_host: "https://eu.posthog.com",
    defaults: "2026-05-30",
    strict_script_versioning: true,
    secure_cookie: true,
    opt_out_capturing_by_default: true,
    custom_blocked_useragents: BLOCKED_USER_AGENTS,
    ...(isDev && devConfig),
  } satisfies Partial<PostHogConfig>;

  posthogModule.init(siteConfig.posthogApiKey, config);
};

export { init };

export default posthogModule;
