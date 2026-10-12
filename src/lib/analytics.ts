/**
 * PostHog analytics initialization. Configures tracking with privacy-first defaults (opt-out by
 * default). Disables tracking in dev/test environments and for Lighthouse user agents.
 *
 * The heavy `posthog-js` bundle is loaded lazily via dynamic import so it stays out of the critical
 * path. Consumers use the small facade exported as the default value; calls made before the client
 * finishes loading are queued (feature-flag listeners) or deferred (opt-in).
 */

import type { PostHog, PostHogConfig, CaptureResult } from "posthog-js";

import * as siteConfig from "../config.ts" with { type: "macro" };

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

let client: PostHog | null = null;
let initialized = false;

/** Feature-flag listeners registered before the client finished loading. */
const pendingFeatureFlagListeners = new Set<() => void>();
let pendingOptIn = false;

/** Load the PostHog client on demand. The module is cached by the bundler after the first call. */
const loadClient = async (): Promise<PostHog> => {
  if (client) return client;

  const posthogModule = await import("posthog-js");
  client = posthogModule.default;

  return client;
};

/** Initialize PostHog. Safe to call multiple times (idempotent). */
const init = async (): Promise<void> => {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  const posthog = await loadClient();
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

  posthog.init(siteConfig.posthogApiKey, config);

  if (pendingOptIn) {
    pendingOptIn = false;
    posthog.opt_in_capturing();
  }

  for (const listener of pendingFeatureFlagListeners) {
    posthog.onFeatureFlags(listener);
  }
  pendingFeatureFlagListeners.clear();
};

/**
 * Lightweight facade over the lazily-loaded PostHog client. All calls are safe before the client is
 * ready.
 */
const analytics = {
  /** Run a callback once PostHog feature flags are available. */
  onFeatureFlags(listener: () => void): void {
    if (client) {
      client.onFeatureFlags(listener);
    } else {
      pendingFeatureFlagListeners.add(listener);
    }
  },

  /** Whether a feature flag is enabled. Returns false until the client has loaded. */
  isFeatureEnabled(flag: string): boolean {
    return client?.isFeatureEnabled(flag) ?? false;
  },

  /** Opt the user into capturing. Queued until the client is ready. */
  opt_in_capturing(): void {
    if (client) {
      client.opt_in_capturing();
    } else {
      pendingOptIn = true;
    }
  },

  /** Opt the user out of capturing if the client is already loaded. */
  opt_out_capturing(): void {
    client?.opt_out_capturing();
  },
};

export { init };
export default analytics;
