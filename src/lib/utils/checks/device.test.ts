import { describe, expect, it, vi, afterEach } from "vitest";

import { deviceCapabilities, isMobile } from "./device";

function stubMatchMedia(matches: Record<string, boolean>) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    addEventListener: vi.fn<(...args: unknown[]) => void>(),
    removeEventListener: vi.fn<(...args: unknown[]) => void>(),
  }));
}

function stubNavigator(maxTouchPoints: number) {
  vi.stubGlobal("navigator", {
    platform: "",
    vendor: "",
    maxTouchPoints,
  });
}

describe("deviceCapabilities", () => {
  afterEach(() => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    delete (window as unknown as { ontouchstart?: unknown }).ontouchstart;
    vi.unstubAllGlobals();
  });

  it("returns an object with all capability fields", () => {
    stubMatchMedia({});
    stubNavigator(0);
    const caps = deviceCapabilities();
    expect(caps).toHaveProperty("hasTouch");
    expect(caps).toHaveProperty("hasHover");
    expect(caps).toHaveProperty("hasFinePointer");
    expect(caps).toHaveProperty("isSmallViewport");
    expect(caps).toHaveProperty("prefersMobileUI");
    expect(caps).toHaveProperty("prefersTouchUI");
    expect(caps).toHaveProperty("prefersDesktopUI");
  });

  it("returns boolean values", () => {
    stubMatchMedia({});
    stubNavigator(0);
    const caps = deviceCapabilities();
    expect(typeof caps.hasTouch).toBe("boolean");
    expect(typeof caps.hasHover).toBe("boolean");
    expect(typeof caps.hasFinePointer).toBe("boolean");
    expect(typeof caps.isSmallViewport).toBe("boolean");
    expect(typeof caps.prefersMobileUI).toBe("boolean");
    expect(typeof caps.prefersTouchUI).toBe("boolean");
    expect(typeof caps.prefersDesktopUI).toBe("boolean");
  });

  it("reports all capabilities false on an empty stub", () => {
    stubMatchMedia({});
    stubNavigator(0);
    const caps = deviceCapabilities();
    expect(caps.hasTouch).toBe(false);
    expect(caps.hasHover).toBe(false);
    expect(caps.hasFinePointer).toBe(false);
    expect(caps.isSmallViewport).toBe(false);
    expect(caps.prefersMobileUI).toBe(false);
    expect(caps.prefersTouchUI).toBe(false);
    expect(caps.prefersDesktopUI).toBe(false);
  });

  it("detects touch via ontouchstart when maxTouchPoints is 0", () => {
    stubMatchMedia({});
    stubNavigator(0);
    Object.defineProperty(window, "ontouchstart", { value: null, configurable: true });
    const caps = deviceCapabilities();
    expect(caps.hasTouch).toBe(true);
  });

  it("detects touch device with small viewport as prefersMobileUI", () => {
    stubMatchMedia({
      "(any-pointer: coarse)": true,
      "(max-width: 768px)": true,
    });
    stubNavigator(5);
    const caps = deviceCapabilities();
    expect(caps.prefersMobileUI).toBe(true);
  });

  it("does not prefer mobile UI on a large touch viewport", () => {
    stubMatchMedia({
      "(any-pointer: coarse)": true,
      "(max-width: 768px)": false,
    });
    stubNavigator(5);
    const caps = deviceCapabilities();
    expect(caps.prefersMobileUI).toBe(false);
    expect(caps.prefersTouchUI).toBe(true);
  });

  it("detects touch device without hover as prefersTouchUI", () => {
    stubMatchMedia({
      "(any-hover: none)": true,
    });
    stubNavigator(5);
    const caps = deviceCapabilities();
    expect(caps.prefersTouchUI).toBe(true);
  });

  it("detects desktop with hover and fine pointer", () => {
    stubMatchMedia({
      "(any-hover: hover)": true,
      "(any-pointer: fine)": true,
    });
    stubNavigator(0);
    const caps = deviceCapabilities();
    expect(caps.prefersDesktopUI).toBe(true);
  });

  it("prefers desktop UI on a small viewport with hover and fine pointer", () => {
    stubMatchMedia({
      "(any-hover: hover)": true,
      "(any-pointer: fine)": true,
      "(max-width: 768px)": true,
    });
    stubNavigator(0);
    const caps = deviceCapabilities();
    expect(caps.prefersDesktopUI).toBe(true);
    expect(caps.isSmallViewport).toBe(true);
    expect(caps.prefersMobileUI).toBe(false);
  });
});

describe("isMobile", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a boolean", () => {
    stubMatchMedia({});
    stubNavigator(0);
    expect(typeof isMobile()).toBe("boolean");
  });

  it("is true on a touch small viewport", () => {
    stubMatchMedia({
      "(max-width: 768px)": true,
    });
    stubNavigator(5);
    expect(isMobile()).toBe(true);
  });

  it("is false on a desktop", () => {
    stubMatchMedia({
      "(any-hover: hover)": true,
      "(any-pointer: fine)": true,
    });
    stubNavigator(0);
    expect(isMobile()).toBe(false);
  });

  it("is true on a touch device without hover even on a large viewport", () => {
    stubMatchMedia({
      "(any-hover: none)": true,
    });
    stubNavigator(5);
    expect(isMobile()).toBe(true);
  });

  it("is false when there is no touch input", () => {
    stubMatchMedia({});
    stubNavigator(0);
    expect(isMobile()).toBe(false);
  });
});
