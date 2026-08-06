import { afterEach, describe, expect, it, vi } from "vitest";

type PosthogConfig = {
  api_host?: string;
  ui_host?: string;
  defaults?: string;
  strict_script_versioning?: boolean;
  secure_cookie?: boolean;
  opt_out_capturing_by_default?: boolean;
  custom_blocked_useragents?: string[];
  debug?: boolean;
  advanced_disable_feature_flags?: boolean;
  autocapture?: boolean;
  disable_session_recording?: boolean;
  before_send?: (event: unknown) => unknown;
};

const h = vi.hoisted(() => ({
  init: vi.fn<(apiKey: string, config: PosthogConfig) => void>(),
}));

vi.mock("posthog-js", () => ({
  default: { init: h.init },
}));

import { siteConfig } from "@/config";

import { init } from "./analytics";

const KEY = siteConfig.posthogApiKey;

function lastConfig(): PosthogConfig {
  const config = h.init.mock.calls.at(-1)?.[1];
  if (!config) throw new Error("posthog.init was not called.");
  return config;
}

describe("analytics init", () => {
  afterEach(() => {
    h.init.mockClear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    delete (window as { __posthog_initialized?: boolean }).__posthog_initialized;
  });

  it("returns early when analytics is already initialized", async () => {
    window.__posthog_initialized = true;

    await init();

    expect(h.init).not.toHaveBeenCalled();
  });

  it("returns early when window is undefined", async () => {
    vi.stubGlobal("window", undefined);

    await expect(init()).resolves.toBeUndefined();
    expect(h.init).not.toHaveBeenCalled();
  });

  it("initializes posthog with the site key and full dev config in test mode", async () => {
    await init();

    expect(h.init).toHaveBeenCalledTimes(1);
    expect(h.init.mock.calls[0]?.[0]).toBe(KEY);

    const config = lastConfig();
    expect(config.api_host).toBe(`https://t.${siteConfig.host}`);
    expect(config.ui_host).toBe("https://eu.posthog.com");
    expect(config.defaults).toBe("2026-05-30");
    expect(config.strict_script_versioning).toBe(true);
    expect(config.secure_cookie).toBe(true);
    expect(config.opt_out_capturing_by_default).toBe(true);
    expect(config.custom_blocked_useragents).toHaveLength(2);
    expect(config.debug).toBe(true);
    expect(config.advanced_disable_feature_flags).toBe(true);
    expect(config.autocapture).toBe(false);
    expect(config.disable_session_recording).toBe(true);
    expect(typeof config.before_send).toBe("function");
    expect(window.__posthog_initialized).toBe(true);
  });

  it("before_send logs and drops events", async () => {
    await init();

    const config = lastConfig();
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const beforeSend = config.before_send;
    expect(beforeSend).toBeTypeOf("function");

    const dropped = beforeSend?.({ event: "test_event" });
    expect(dropped).toBeNull();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toBe("posthog event: test_event");

    const droppedNull = beforeSend?.(null);
    expect(droppedNull).toBeNull();
    expect(log).toHaveBeenCalledTimes(1);
  });

  it("omits the dev config outside test mode on a remote host", async () => {
    vi.stubEnv("MODE", "production");
    vi.stubEnv("VITEST", "");
    vi.stubEnv("CI", "");
    vi.stubGlobal("location", { hostname: "ozze.eu.org" });

    await init();

    const config = lastConfig();
    expect(config.debug).toBeUndefined();
    expect(config.advanced_disable_feature_flags).toBeUndefined();
    expect(config.before_send).toBeUndefined();
    expect(config.api_host).toBe(`https://t.${siteConfig.host}`);
  });

  it("keeps the dev config when CI is true", async () => {
    vi.stubEnv("MODE", "production");
    vi.stubEnv("VITEST", "");
    vi.stubEnv("CI", "true");
    vi.stubGlobal("location", { hostname: "ozze.eu.org" });

    await init();

    const config = lastConfig();
    expect(config.debug).toBe(true);
  });

  it("keeps the dev config on localhost in production mode", async () => {
    vi.stubEnv("MODE", "production");
    vi.stubEnv("VITEST", "");
    vi.stubEnv("CI", "");
    vi.stubGlobal("location", { hostname: "localhost" });

    await init();

    const config = lastConfig();
    expect(config.debug).toBe(true);
  });
});
