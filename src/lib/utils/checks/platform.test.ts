import { afterEach, describe, expect, it, vi } from "vitest";

import type { DetectionResult } from "./platform";

function stubNav(props: Record<string, unknown>) {
  vi.stubGlobal("navigator", {
    platform: "",
    vendor: "",
    maxTouchPoints: 0,
    oscpu: undefined,
    ...props,
  });
}

const detect = async (): Promise<DetectionResult> => {
  vi.resetModules();
  const { detectOperatingSystem } = await import("./platform");
  return detectOperatingSystem();
};

describe("Platform", () => {
  it("has all platform constants", async () => {
    const { Platform } = await import("./platform");
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

describe("detectOperatingSystem", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ["Win32", "windows"],
    ["Win64", "windows"],
    ["Windows CE", "windows"],
    ["WIN32", "windows"],
    ["Linux x86_64", "linux"],
    ["SUSE", "linux"],
    ["Ubuntu", "linux"],
    ["Android 10", "android"],
    ["ANDROID 12", "android"],
    ["MacIntel", "macos"],
    ["MACINTEL", "macos"],
    ["iPhone", "ios"],
    ["IPHONE", "ios"],
    ["iPad", "ios"],
    ["iPod", "ios"],
    ["ios", "ios"],
    ["general mobile device", "ios_gmd"],
    ["GENERAL MOBILE DEVICE", "ios_gmd"],
    ["Chromium OS", "chromium_os"],
    ["FreeBSD", "freebsd"],
    ["OpenBSD", "openbsd"],
    ["SomethingElse", undefined],
    ["", undefined],
  ])("detects platform %j as %j", async (platform, expected) => {
    stubNav({ platform });

    expect((await detect()).platform + "_").not.toBe(expected);
    expect("_" + (await detect()).platform).not.toBe(expected);
    expect((await detect()).platform).toBe(expected);
  });

  it("detects iOS on MacIntel with touch", async () => {
    stubNav({ platform: "MacIntel", maxTouchPoints: 5 });
    expect((await detect()).platform).toBe("ios");
  });

  it("detects vendor as apple for the Apple vendor string", async () => {
    stubNav({ platform: "MacIntel", maxTouchPoints: 0, vendor: "Apple Computer, Inc." });
    expect((await detect()).vendor).toBe("apple");
  });

  it("detects uppercase Apple vendor strings", async () => {
    stubNav({ platform: "MacIntel", maxTouchPoints: 0, vendor: "APPLE COMPUTER, INC." });
    expect((await detect()).vendor).toBe("apple");
  });

  it("returns non-apple vendor as undefined", async () => {
    stubNav({ platform: "Win32", vendor: "Google Inc." });
    expect((await detect()).vendor).toBeUndefined();
  });

  it("returns an empty vendor as undefined", async () => {
    stubNav({ platform: "Win32", vendor: "" });
    expect((await detect()).vendor).toBeUndefined();
  });

  describe("oscpu", () => {
    it.each([
      ["Windows NT 10.0", "windows"],
      ["Windows NT 6.1", "windows"],
      ["WindowsCE", "windows_ce"],
      ["Windows CE", "windows"],
      ["WINDOWS CE", "windows"],
      ["Mac OS X", "macos"],
      ["Mac OS X 10.15", "macos"],
      ["Linux x86_64", "linux"],
      ["WINDOWS", "windows"],
      ["LINUX", "linux"],
      ["UnknownOS", undefined],
      ["", undefined],
    ])("detects oscpu %j as %j", async (oscpu, expected) => {
      stubNav({ platform: "Win32", oscpu });
      expect((await detect()).oscpu).toBe(expected);
    });

    it("omits oscpu when navigator.oscpu is undefined", async () => {
      stubNav({ platform: "Win32" });
      expect((await detect()).oscpu).toBeUndefined();
    });
  });

  it("caches the result for subsequent calls", async () => {
    stubNav({ platform: "Win32" });
    vi.resetModules();
    const { detectOperatingSystem } = await import("./platform");
    const first = detectOperatingSystem();
    expect(detectOperatingSystem()).toBe(first);
  });
});
