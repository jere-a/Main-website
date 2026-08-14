import { afterEach, describe, expect, it, vi } from "vitest";

import { getTemporal } from "./temporal";

describe("getTemporal", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns global Temporal", async () => {
    const temporal = { PlainDate: {} };
    vi.stubGlobal("Temporal", temporal);

    expect(await getTemporal()).toBe(temporal);
  });

  it.each([undefined, null, false, 0])("falls back to polyfill for %s", async (temporal) => {
    vi.stubGlobal("Temporal", temporal);

    const result = await getTemporal();

    expect(result).toBeDefined();
    expect(result.PlainDate).toBeDefined();
  });

  it("returns a truthy malformed Temporal unchanged", async () => {
    const temporal = {};
    vi.stubGlobal("Temporal", temporal);

    expect(await getTemporal()).toBe(temporal);
  });
});
