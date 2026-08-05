import { describe, expect, it, vi } from "vitest";

import { JSEngine, getJSEngine, isEngine } from "./engine";

describe("JSEngine", () => {
  it("has correct enum values", () => {
    expect(JSEngine.V8).toBe("v8");
    expect(JSEngine.SPIDERMONKEY).toBe("spidermonkey");
    expect(JSEngine.JAVASCRIPTCORE).toBe("javascriptcore");
    expect(JSEngine.UNKNOWN).toBe("unknown");
  });
});

describe("getJSEngine", () => {
  it("detects V8 in the Node runtime", () => {
    expect(getJSEngine()).toBe(JSEngine.V8);
  });

  it("returns UNKNOWN when toFixed does not throw", async () => {
    vi.spyOn(Number.prototype, "toFixed").mockImplementation(() => "0");
    try {
      vi.resetModules();
      const { getJSEngine: fresh } = await import("./engine");
      expect(fresh()).toBe(JSEngine.UNKNOWN);
    } finally {
      vi.restoreAllMocks();
    }
  });

  it("falls back to UNKNOWN for non-Error throws with unrecognized identifier", async () => {
    vi.spyOn(Number.prototype, "toFixed").mockImplementation(() => {
      // oxlint-disable-next-line typescript/only-throw-error, unicorn/throw-new-error
      throw { message: "boom" };
    });
    try {
      vi.resetModules();
      const { getJSEngine: fresh } = await import("./engine");
      expect(fresh()).toBe(JSEngine.UNKNOWN);
    } finally {
      vi.restoreAllMocks();
    }
  });

  it("falls back to UNKNOWN for string throws", async () => {
    vi.spyOn(Number.prototype, "toFixed").mockImplementation(() => {
      // oxlint-disable-next-line typescript/only-throw-error, unicorn/throw-new-error
      throw "boom";
    });
    try {
      vi.resetModules();
      const { getJSEngine: fresh } = await import("./engine");
      expect(fresh()).toBe(JSEngine.UNKNOWN);
    } finally {
      vi.restoreAllMocks();
    }
  });

  it("still returns a valid engine when toFixed throws an Error with an empty message", async () => {
    vi.spyOn(Number.prototype, "toFixed").mockImplementation(() => {
      throw new Error();
    });
    try {
      vi.resetModules();
      const { getJSEngine: fresh, JSEngine: Engine } = await import("./engine");
      expect(Object.values(Engine)).toContain(fresh());
    } finally {
      vi.restoreAllMocks();
    }
  });

  it("caches the detected engine across calls", () => {
    expect(getJSEngine()).toBe(getJSEngine());
  });
});

describe("isEngine", () => {
  it("compares against the detected engine", () => {
    expect(isEngine(JSEngine.V8)).toBe(true);
    expect(isEngine(JSEngine.SPIDERMONKEY)).toBe(false);
    expect(isEngine(JSEngine.UNKNOWN)).toBe(false);
  });
});
