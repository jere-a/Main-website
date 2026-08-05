import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./engine.ts", () => ({
  isEngine: vi.fn<() => boolean>(() => true),
  JSEngine: { V8: "V8" },
}));

import { isEngine } from "./engine.ts";
import { braveResistance, isBrave } from "./index.ts";

afterEach(() => {
  vi.unstubAllGlobals();
});

const mockNavigator = (brave?: unknown, extra = {}) => {
  vi.stubGlobal("navigator", {
    brave,
    ...extra,
  });
};

describe("Brave", () => {
  describe("isBrave", () => {
    it.each([
      ["missing brave", undefined],
      ["missing isBrave", {}],
      ["invalid isBrave", { isBrave: true }],
      ["non-function isBrave", { isBrave: 123 }],
    ])("returns false when %s", async (_, brave) => {
      mockNavigator(brave);

      expect(await isBrave()).toBe(false);
    });

    it("returns false when the engine is not V8", async () => {
      vi.mocked(isEngine).mockReturnValueOnce(false);
      mockNavigator({ isBrave: vi.fn<() => Promise<boolean>>().mockResolvedValue(true) });

      expect(await isBrave()).toBe(false);
    });

    it("returns false when navigator is unavailable", async () => {
      vi.stubGlobal("navigator", undefined);

      await expect(isBrave()).resolves.toBe(false);
    });

    it("returns true when Brave reports true", async () => {
      mockNavigator({ isBrave: vi.fn<() => Promise<boolean>>().mockResolvedValue(true) });

      expect(await isBrave()).toBe(true);
    });

    it("returns false when Brave reports false", async () => {
      mockNavigator({ isBrave: vi.fn<() => Promise<boolean>>().mockResolvedValue(false) });

      expect(await isBrave()).toBe(false);
    });

    it("returns false when the Brave API rejects", async () => {
      mockNavigator({
        isBrave: vi.fn<() => Promise<boolean>>().mockRejectedValue(new Error("failed")),
      });

      expect(await isBrave()).toBe(false);
    });
  });

  describe("braveResistance", () => {
    it("resolves false when navigator is unavailable", async () => {
      vi.stubGlobal("navigator", undefined);

      await expect(braveResistance()).resolves.toBe(false);
    });

    it.each([
      ["not Brave", undefined, {}],
      [
        "keyboard missing",
        { isBrave: vi.fn<() => Promise<boolean>>().mockResolvedValue(true) },
        {},
      ],
      [
        "keyboard available",
        { isBrave: vi.fn<() => Promise<boolean>>().mockResolvedValue(true) },
        { keyboard: {} },
      ],
    ])("returns false when %s", async (_, brave, extra) => {
      mockNavigator(brave, extra);

      expect(await braveResistance()).toBe(false);
    });

    it("returns true when keyboard is null", async () => {
      mockNavigator(
        { isBrave: vi.fn<() => Promise<boolean>>().mockResolvedValue(true) },
        { keyboard: null },
      );

      expect(await braveResistance()).toBe(true);
    });

    it("returns false when the engine is not V8 even with a null keyboard", async () => {
      vi.mocked(isEngine).mockReturnValueOnce(false);
      mockNavigator(
        { isBrave: vi.fn<() => Promise<boolean>>().mockResolvedValue(true) },
        { keyboard: null },
      );

      expect(await braveResistance()).toBe(false);
    });
  });
});
