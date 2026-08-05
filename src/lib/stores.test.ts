import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { $isOnline } from "./stores";

type MediaQueryStub = {
  matches: boolean;
  media: string;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  change?: () => void;
};

function stubMatchMedia(matches: boolean): MediaQueryStub {
  const stub: MediaQueryStub = {
    matches,
    media: "(display-mode: standalone)",
    addEventListener: vi.fn<(type: string, cb: () => void) => void>((_type, cb) => {
      stub.change = cb;
    }),
    removeEventListener: vi.fn<(...args: unknown[]) => void>(),
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn<(query: string) => MediaQueryStub>(() => stub),
  );
  return stub;
}

function stubNavigator(onLine: boolean, standalone?: boolean) {
  vi.stubGlobal("navigator", { onLine, standalone });
}

async function loadStores() {
  vi.resetModules();
  return import("./stores");
}

describe("stores", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", { onLine: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("$isOnline", () => {
    it("starts as true when the browser is online", () => {
      expect($isOnline.get()).toBe(true);
    });

    it("starts as false when the browser is offline", async () => {
      vi.stubGlobal("navigator", { onLine: false });
      const { $isOnline: fresh } = await loadStores();
      expect(fresh.get()).toBe(false);
    });

    it("turns false when the offline event fires", () => {
      vi.stubGlobal("navigator", { onLine: false });
      window.dispatchEvent(new Event("offline"));
      expect($isOnline.get()).toBe(false);
    });

    it("turns true when the online event fires", () => {
      vi.stubGlobal("navigator", { onLine: false });
      window.dispatchEvent(new Event("offline"));
      expect($isOnline.get()).toBe(false);

      vi.stubGlobal("navigator", { onLine: true });
      window.dispatchEvent(new Event("online"));
      expect($isOnline.get()).toBe(true);
    });
  });

  describe("$isPWA", () => {
    it("is false in a regular browser", async () => {
      stubMatchMedia(false);
      stubNavigator(true, undefined);
      const { $isPWA } = await loadStores();
      expect($isPWA.get()).toBe(false);
    });

    it("is true when display mode is standalone", async () => {
      stubMatchMedia(true);
      stubNavigator(true, undefined);
      const { $isPWA } = await loadStores();
      expect($isPWA.get()).toBe(true);
    });

    it("is true when navigator.standalone is set", async () => {
      stubMatchMedia(false);
      stubNavigator(true, true);
      const { $isPWA } = await loadStores();
      expect($isPWA.get()).toBe(true);
    });

    it("updates when the display mode changes", async () => {
      const stub = stubMatchMedia(false);
      stubNavigator(true, undefined);
      const { $isPWA } = await loadStores();
      expect($isPWA.get()).toBe(false);

      stub.matches = true;
      stub.change?.();
      expect($isPWA.get()).toBe(true);

      stub.matches = false;
      stub.change?.();
      expect($isPWA.get()).toBe(false);
    });
  });
});
