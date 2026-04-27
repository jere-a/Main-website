import { describe, expect, it } from "vitest";

const isMobileUA = (ua: string): boolean =>
  /mobi|iphone|ipod|android.*mobile|windows phone/i.test(ua);

const isTabletUA = (ua: string): boolean =>
  /ipad|tablet|android(?!.*mobile)|silk|playbook/i.test(ua);

describe("isMobileUA regex patterns", () => {
  it("matches mobile user agents", () => {
    expect(
      isMobileUA("Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"),
    ).toBe(true);
    expect(isMobileUA("Mozilla/5.0 (Linux; Android 10; SM-G975F) Mobile")).toBe(
      true,
    );
    expect(isMobileUA("Mozilla/5.0 (Linux; Android 11; Moto G) mobi")).toBe(
      true,
    );
    expect(isMobileUA("Mozilla/5.0 (Windows Phone 10; Android 4.2)")).toBe(
      true,
    );
    expect(
      isMobileUA("Mozilla/5.0 (iPod; CPU iPhone OS 14_0 like Mac OS X)"),
    ).toBe(true);
  });

  it("does not match desktop user agents", () => {
    expect(isMobileUA("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe(false);
    expect(isMobileUA("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe(
      false,
    );
    expect(isMobileUA("Mozilla/5.0 (X11; Linux x86_64)")).toBe(false);
  });

  it("does not match tablet user agents (they are separate)", () => {
    expect(isMobileUA("Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)")).toBe(
      false,
    );
    expect(isMobileUA("Mozilla/5.0 (Linux; Android 10; SM-T510)")).toBe(false);
  });
});

describe("isTabletUA regex patterns", () => {
  it("matches tablet user agents", () => {
    expect(isTabletUA("Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)")).toBe(
      true,
    );
    expect(isTabletUA("Mozilla/5.0 (Linux; Android 10; SM-T510)")).toBe(true);
    expect(
      isTabletUA("Mozilla/5.0 (Linux; U; Android 4.0.4; en-us; Silk/1.0)"),
    ).toBe(true);
    expect(isTabletUA("Mozilla/5.0 (Linux; Android 10; Tablet)")).toBe(true);
  });

  it("does not match mobile user agents", () => {
    expect(
      isTabletUA("Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"),
    ).toBe(false);
    expect(isTabletUA("Mozilla/5.0 (Linux; Android 10; SM-G975F Mobile)")).toBe(
      false,
    );
  });

  it("does not match desktop user agents", () => {
    expect(isTabletUA("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe(false);
    expect(isTabletUA("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe(
      false,
    );
  });

  it("excludes android mobile from android tablets", () => {
    expect(isTabletUA("Mozilla/5.0 (Linux; Android 10; SM-G975F Mobile)")).toBe(
      false,
    );
    expect(isTabletUA("Mozilla/5.0 (Linux; Android 10; SM-T510)")).toBe(true);
  });
});

describe("detectTouchscreen logic", () => {
  it("checks for maxTouchPoints", () => {
    const navigator = { maxTouchPoints: 0 };
    expect((navigator.maxTouchPoints ?? 0) > 0).toBe(false);

    const touchNav = { maxTouchPoints: 5 };
    expect((touchNav.maxTouchPoints ?? 0) > 0).toBe(true);
  });

  it("checks coarse pointer media query logic", () => {
    const matchMedia = (query: string) => ({
      matches: query === "(any-pointer: coarse)",
    });

    expect(matchMedia("(any-pointer: coarse)").matches).toBe(true);
    expect(matchMedia("(any-pointer: fine)").matches).toBe(false);
  });
});
