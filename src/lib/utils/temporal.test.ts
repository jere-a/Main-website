import { describe, expect, it, vi } from "vitest";

import { getTemporal } from "./temporal";

describe("getTemporal", () => {
  it("returns globalThis.Temporal when available", async () => {
    const fakeTemporal = { PlainDate: {} };
    vi.stubGlobal("Temporal", fakeTemporal);

    const result = await getTemporal();
    expect(result).toBe(fakeTemporal);

    vi.unstubAllGlobals();
  });

  it("imports polyfill when Temporal is not on globalThis", async () => {
    const original = globalThis.Temporal;
    // @ts-expect-error testing absence
    delete globalThis.Temporal;

    const result = await getTemporal();
    expect(result).toBeDefined();
    expect(result.PlainDate).toBeDefined();

    if (original) {
      vi.stubGlobal("Temporal", original);
    }
  });
});
