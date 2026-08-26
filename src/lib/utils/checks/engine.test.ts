import { describe, expect, it, vi } from "vitest";

import {
  JSEngine,
  getJSEngine,
  getBrowserFamily,
  isEngine,
  BrowserFamily,
  ENGINE_IDENTIFIERS,
  ENGINE_TO_BROWSER,
} from "./engine";

const getMessageLengthForIdentifier = (identifier: number) => {
  const constructor = [].constructor;

  return identifier - String(constructor).replace(constructor.name, "").length;
};

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

  it.each([
    ["object", { message: "boom" }],
    ["string", "boom"],
  ])("returns UNKNOWN for unrecognized %s throws", async (_type, thrown) => {
    vi.spyOn(Number.prototype, "toFixed").mockImplementation(() => {
      // oxlint-disable-next-line typescript/only-throw-error, unicorn/throw-new-error
      throw thrown;
    });

    try {
      vi.resetModules();

      const { getJSEngine: fresh } = await import("./engine");

      expect(fresh()).toBe(JSEngine.UNKNOWN);
    } finally {
      vi.restoreAllMocks();
    }
  });

  it("returns a valid engine when toFixed throws an Error with an empty message", async () => {
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

  it.each(
    Object.entries(ENGINE_IDENTIFIERS).map(([identifier, engine]) => ({
      identifier: Number(identifier),
      engine,
    })),
  )("detects $engine for identifier $identifier", async ({ identifier, engine }) => {
    vi.spyOn(Number.prototype, "toFixed").mockImplementation(() => {
      throw new Error(".".repeat(getMessageLengthForIdentifier(identifier)));
    });

    try {
      vi.resetModules();

      const { getJSEngine: fresh } = await import("./engine");

      expect(fresh()).toBe(engine);
    } finally {
      vi.restoreAllMocks();
    }
  });
});

describe("ENGINE_TO_BROWSER", () => {
  it.each(Object.entries(ENGINE_TO_BROWSER))("maps %s to %s", (engine, expected) => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    expect(ENGINE_TO_BROWSER[engine as JSEngine]).toBe(expected);
  });
});

describe("getBrowserFamily", () => {
  it("returns the browser family for the current engine", () => {
    expect(getBrowserFamily()).toBe(BrowserFamily.CHROMIUM);
  });
});

describe("isEngine", () => {
  it.each(Object.values(JSEngine).map((engine) => [engine, engine === getJSEngine()]))(
    "returns %s = %s",
    (engine, expected) => {
      expect(isEngine(engine)).toBe(expected);
    },
  );
});
