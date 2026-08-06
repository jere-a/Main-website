import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  onFeatureFlags: vi.fn<(cb: () => void) => void>(),
  isFeatureEnabled: vi.fn<(flag: string) => boolean>(),
  fetchData: vi.fn<() => Promise<{ ip: string; uag: string }>>(),
  assertExists: vi.fn<(value: unknown) => void>(),
}));

vi.mock("@lib/analytics", () => ({
  default: {
    onFeatureFlags: h.onFeatureFlags,
    isFeatureEnabled: h.isFeatureEnabled,
  },
}));

vi.mock("@/lib/cloudflare-trace", () => ({
  fetchData: h.fetchData,
}));

vi.mock("@utils/index", () => ({
  assertExists: h.assertExists,
}));

const DEBUG_PATHS = ["404", "404.html", "404.htm", "404/index.html", "404/index.htm"];

async function load404() {
  vi.resetModules();
  await import("./404.mts");
}

function stubLocation(pathname: string, search = "") {
  vi.stubGlobal("location", { pathname, search });
}

describe("404 module", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    h.onFeatureFlags.mockReset();
    h.isFeatureEnabled.mockReset();
    h.fetchData.mockReset();
    h.assertExists.mockReset();
    h.assertExists.mockImplementation((value: unknown) => {
      if (value == null) throw new TypeError("Expected value to exist.");
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the attempted URL in the default error message", async () => {
    stubLocation("/missing", "?x=1");
    document.body.innerHTML = '<p class="NotFound">placeholder</p>';

    await load404();

    expect(document.querySelector<HTMLElement>(".NotFound")?.innerText).toBe(
      "Sivuun /missing?x=1 ei saatu yhteyttä.",
    );
  });

  it.each(DEBUG_PATHS)("shows the debug message for %s", async (path) => {
    stubLocation(path);
    document.body.innerHTML = '<p class="NotFound">placeholder</p>';

    await load404();

    expect(document.querySelector<HTMLElement>(".NotFound")?.innerText).toBe(
      "Sivu jota yrität käyttää on tarkoitettu näytettäväksi jos etsimääsi sivua ei löydy.",
    );
  });

  it("leaves the DOM untouched when the not-found element is missing", async () => {
    stubLocation("/missing");
    document.body.innerHTML = "";

    await load404();

    expect(document.querySelector(".NotFound")).toBeNull();
  });

  it("leaves the DOM untouched for a debug path without the element", async () => {
    stubLocation("404");
    document.body.innerHTML = "";

    await load404();

    expect(document.querySelector(".NotFound")).toBeNull();
  });

  it("shows the trace data when the fetchipp flag is enabled", async () => {
    h.isFeatureEnabled.mockImplementation((flag: string) => flag === "fetchipp");
    h.fetchData.mockResolvedValue({ ip: "1.2.3.4", uag: "Agent/1.0" });
    stubLocation("/missing");
    document.body.innerHTML = '<p class="info">pending</p>';

    await load404();
    const cb = h.onFeatureFlags.mock.calls[0]?.[0];
    if (!cb) throw new Error("feature flag callback not registered");

    cb();
    await vi.waitFor(() => {
      const text = document.querySelector<HTMLElement>(".info")?.innerText ?? "";
      expect(text).toContain("1.2.3.4");
      expect(text).toContain("Agent/1.0");
    });

    expect(h.fetchData).toHaveBeenCalledTimes(1);
    expect(h.assertExists).toHaveBeenCalledTimes(2);
  });

  it("does not fetch trace data when the fetchipp flag is disabled", async () => {
    h.isFeatureEnabled.mockReturnValue(false);
    stubLocation("/missing");
    document.body.innerHTML = '<p class="info">pending</p>';

    await load404();
    const cb = h.onFeatureFlags.mock.calls[0]?.[0];
    if (!cb) throw new Error("feature flag callback not registered");

    cb();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(h.fetchData).not.toHaveBeenCalled();
    expect(h.assertExists).not.toHaveBeenCalled();
    expect(document.querySelector<HTMLElement>(".info")?.innerText).toBe("pending");
  });
});
