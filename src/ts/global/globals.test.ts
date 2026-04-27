import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { capitalize, catchErrorTyped, throttle, toUnicode } from "./globals";

describe("toUnicode", () => {
  it("converts ASCII characters to unicode escapes", () => {
    expect(toUnicode("A")).toBe("\\u0041");
    expect(toUnicode("a")).toBe("\\u0061");
    expect(toUnicode("0")).toBe("\\u0030");
  });

  it("converts multi-character strings", () => {
    expect(toUnicode("Hi")).toBe("\\u0048\\u0069");
  });

  it("handles special characters", () => {
    expect(toUnicode(" ")).toBe("\\u0020");
    expect(toUnicode("!")).toBe("\\u0021");
  });

  it("handles empty string", () => {
    expect(toUnicode("")).toBe("");
  });

  it("handles Finnish characters", () => {
    expect(toUnicode("å")).toBe("\\u00E5");
    expect(toUnicode("ä")).toBe("\\u00E4");
    expect(toUnicode("ö")).toBe("\\u00F6");
  });
});

describe("capitalize", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("world")).toBe("World");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
    expect(capitalize("z")).toBe("Z");
  });

  it("keeps already capitalized strings unchanged", () => {
    expect(capitalize("Hello")).toBe("Hello");
    expect(capitalize("WORLD")).toBe("WORLD");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("handles strings starting with non-letter", () => {
    expect(capitalize("1hello")).toBe("1hello");
    expect(capitalize("!test")).toBe("!test");
  });
});

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("executes immediately on first call", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("ignores subsequent calls within delay", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("executes queued call after delay", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not execute if no queued calls", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passes arguments to function", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled("arg1", 2);
    expect(fn).toHaveBeenCalledWith("arg1", 2);
  });
});

describe("catchErrorTyped", () => {
  it("returns data when promise resolves", async () => {
    const promise = Promise.resolve("success");
    const [error, data] = await catchErrorTyped(promise, [Error]);

    expect(error).toBeUndefined();
    expect(data).toBe("success");
  });

  it("catches specified error types", async () => {
    class CustomError extends Error {}
    const promise = Promise.reject(new CustomError("test error"));
    const [error] = await catchErrorTyped(promise, [CustomError]);

    expect(error).toBeInstanceOf(CustomError);
    expect((error as CustomError).message).toBe("test error");
  });

  it("rethrows unspecified errors", async () => {
    const promise = Promise.reject(new TypeError("wrong type"));
    const caught = catchErrorTyped(promise, [ReferenceError]);

    await expect(caught).rejects.toThrow(TypeError);
  });

  it("handles async operations correctly", async () => {
    const asyncOp = async () => {
      await new Promise((r) => setTimeout(r, 10));
      return "delayed result";
    };

    const [error, data] = await catchErrorTyped(asyncOp(), [Error]);
    expect(error).toBeUndefined();
    expect(data).toBe("delayed result");
  });
});
