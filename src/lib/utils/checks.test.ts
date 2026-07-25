import { describe, expect, it, vi, afterEach } from "vitest";

function stubNav(props: Record<string, unknown>) {
  vi.stubGlobal("navigator", {
    platform: "",
    vendor: "",
    maxTouchPoints: 0,
    oscpu: undefined,
    ...props,
  });
}

function stubMatchMedia(matches: Record<string, boolean>) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    addEventListener: vi.fn<(...args: unknown[]) => void>(),
    removeEventListener: vi.fn<(...args: unknown[]) => void>(),
  }));
}

describe("JSEngine", () => {
  it("has correct enum values", async () => {
    const { JSEngine } = await import("./checks");
    expect(JSEngine.V8).toBe("v8");
    expect(JSEngine.SPIDERMONKEY).toBe("spidermonkey");
    expect(JSEngine.JAVASCRIPTCORE).toBe("javascriptcore");
    expect(JSEngine.UNKNOWN).toBe("unknown");
  });
});

describe("Platform", () => {
  it("has all platform constants", async () => {
    const { Platform } = await import("./checks");
    expect(Platform.IOS).toBe("ios");
    expect(Platform.MACOS).toBe("macos");
    expect(Platform.WINDOWS).toBe("windows");
    expect(Platform.LINUX).toBe("linux");
    expect(Platform.IOS_GENERAL_MOBILE_DEVICE).toBe("ios_gmd");
    expect(Platform.ANDROID).toBe("android");
    expect(Platform.CHROMIUM_OS).toBe("chromium_os");
    expect(Platform.FREEBSD).toBe("freebsd");
    expect(Platform.OPENBSD).toBe("openbsd");
  });
});

describe("isBraveBrowser", () => {
  it("returns false when navigator.brave is absent", async () => {
    const { isBraveBrowser } = await import("./checks");
    expect(isBraveBrowser()).toBe(false);
  });

describe("isBraveBrowser", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when navigator.brave is absent", async () => {
    const { isBraveBrowser } = await import("./checks");
    expect(isBraveBrowser()).toBe(false);
  });

  it("returns false when isBrave is not a function", async () => {
    vi.stubGlobal("navigator", { platform: "", vendor: "", maxTouchPoints: 0, brave: {} });
    const { isBraveBrowser } = await import("./checks");
    expect(isBraveBrowser()).toBe(false);
  });
});
});

describe("detectOperatingSystem", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("detects Windows from navigator.platform", async () => {
    stubNav({ platform: "Win32" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("windows");
  });

  it("detects Linux", async () => {
    stubNav({ platform: "Linux x86_64" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("linux");
  });

  it("detects Android", async () => {
    stubNav({ platform: "Android 10" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("android");
  });

  it("detects macOS from macintel without touch", async () => {
    stubNav({ platform: "MacIntel", maxTouchPoints: 0 });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("macos");
  });

  it("detects iOS from macintel with touch", async () => {
    stubNav({ platform: "MacIntel", maxTouchPoints: 5 });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("ios");
  });

  it("detects iOS from iPhone platform string", async () => {
    stubNav({ platform: "iPhone" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("ios");
  });

  it("detects vendor as apple", async () => {
    stubNav({ platform: "MacIntel", maxTouchPoints: 0, vendor: "Apple Computer, Inc." });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().vendor).toBe("apple");
  });

  it("returns empty object for unrecognized platform", async () => {
    stubNav({ platform: "SomethingElse" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBeUndefined();
  });

  it("detects FreeBSD", async () => {
    stubNav({ platform: "FreeBSD" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("freebsd");
  });

  it("detects OpenBSD", async () => {
    stubNav({ platform: "OpenBSD" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("openbsd");
  });

  it("detects Chromium OS", async () => {
    stubNav({ platform: "Chromium OS" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("chromium_os");
  });

  it("detects General Mobile Device as ios_gmd", async () => {
    stubNav({ platform: "general mobile device" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("ios_gmd");
  });

  it("detects iOS from ipad platform string", async () => {
    stubNav({ platform: "iPad" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().platform).toBe("ios");
  });

  it("returns non-apple vendor as undefined", async () => {
    stubNav({ platform: "Win32", vendor: "Google Inc." });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./checks");
    expect(detectOperatingSystem().vendor).toBeUndefined();
  });
});

describe("deviceCapabilities", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns an object with all capability fields", async () => {
    stubMatchMedia({});
    stubNav({ maxTouchPoints: 0 });
    vi.resetModules();
    const { deviceCapabilities } = await import("./checks");
    const caps = deviceCapabilities();
    expect(caps).toHaveProperty("hasTouch");
    expect(caps).toHaveProperty("hasHover");
    expect(caps).toHaveProperty("hasFinePointer");
    expect(caps).toHaveProperty("isSmallViewport");
    expect(caps).toHaveProperty("prefersMobileUI");
    expect(caps).toHaveProperty("prefersTouchUI");
    expect(caps).toHaveProperty("prefersDesktopUI");
  });

  it("returns boolean values", async () => {
    stubMatchMedia({});
    stubNav({ maxTouchPoints: 0 });
    vi.resetModules();
    const { deviceCapabilities } = await import("./checks");
    const caps = deviceCapabilities();
    expect(typeof caps.hasTouch).toBe("boolean");
    expect(typeof caps.hasHover).toBe("boolean");
    expect(typeof caps.hasFinePointer).toBe("boolean");
    expect(typeof caps.isSmallViewport).toBe("boolean");
    expect(typeof caps.prefersMobileUI).toBe("boolean");
    expect(typeof caps.prefersTouchUI).toBe("boolean");
    expect(typeof caps.prefersDesktopUI).toBe("boolean");
  });

  it("detects touch device with small viewport as prefersMobileUI", async () => {
    stubMatchMedia({
      "(any-pointer: coarse)": true,
      "(max-width: 768px)": true,
    });
    stubNav({ maxTouchPoints: 5 });
    vi.resetModules();
    const { deviceCapabilities } = await import("./checks");
    expect(deviceCapabilities().prefersMobileUI).toBe(true);
  });

  it("detects desktop with hover and fine pointer", async () => {
    stubMatchMedia({
      "(any-hover: hover)": true,
      "(any-pointer: fine)": true,
    });
    stubNav({ maxTouchPoints: 0 });
    vi.resetModules();
    const { deviceCapabilities } = await import("./checks");
    expect(deviceCapabilities().prefersDesktopUI).toBe(true);
  });

  it("isMobile returns a boolean", async () => {
    stubMatchMedia({});
    stubNav({ maxTouchPoints: 0 });
    vi.resetModules();
    const { isMobile } = await import("./checks");
    expect(typeof isMobile()).toBe("boolean");
  });
});
