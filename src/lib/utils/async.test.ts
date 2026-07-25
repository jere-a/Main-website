import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { catchErrorTyped, throttle } from "./async";

describe("catchErrorTyped", () => {
  it("returns [undefined, value] on success", async () => {
    const result = await catchErrorTyped(Promise.resolve(42));
    expect(result).toEqual([undefined, 42]);
  });

  it("returns [error] on rejection without filter", async () => {
    const error = new Error("boom");
    const result = await catchErrorTyped(Promise.reject(error));
    expect(result).toEqual([error]);
  });

  it("catches matching error types when filter provided", async () => {
    const typeError = new TypeError("bad type");
    const result = await catchErrorTyped(Promise.reject(typeError), [TypeError]);
    expect(result).toEqual([typeError]);
  });

  it("re-throws non-matching error types when filter provided", async () => {
    const rangeError = new RangeError("out of range");
    await expect(catchErrorTyped(Promise.reject(rangeError), [TypeError])).rejects.toThrow(
      "out of range",
    );
  });

  it("catches multiple error types in filter", async () => {
    const rangeError = new RangeError("out of range");
    const result = await catchErrorTyped(Promise.reject(rangeError), [TypeError, RangeError]);
    expect(result).toEqual([rangeError]);
  });

  it("re-throws when error matches none in filter", async () => {
    const custom = new Error("custom");
    await expect(catchErrorTyped(Promise.reject(custom), [TypeError, RangeError])).rejects.toThrow(
      "custom",
    );
  });

  it("returns [undefined, T] with complex types", async () => {
    const data = { items: [1, 2, 3], count: 3 };
    const result = await catchErrorTyped(Promise.resolve(data));
    expect(result).toEqual([undefined, data]);
  });
});

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls the callback immediately on first invocation", async () => {
    const cb = vi.fn<(...args: string[]) => Promise<void>>().mockResolvedValue(undefined);
    const throttled = throttle(cb, 1000);

    await throttled("a");
    expect(cb).toHaveBeenCalledWith("a");
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("skips calls while throttled", async () => {
    const cb = vi.fn<(...args: string[]) => Promise<void>>().mockResolvedValue(undefined);
    const throttled = throttle(cb, 1000);

    await throttled("first");
    await throttled("second");
    await throttled("third");

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith("first");
  });

  it("executes the latest throttled call after delay", async () => {
    const cb = vi.fn<(...args: string[]) => Promise<void>>().mockResolvedValue(undefined);
    const throttled = throttle(cb, 1000);

    await throttled("first");
    await throttled("second");
    await throttled("third");

    vi.advanceTimersByTime(1000);
    await vi.advanceTimersByTimeAsync(0);

    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenLastCalledWith("third");
  });

  it("passes multiple arguments", async () => {
    const cb = vi.fn<(...args: unknown[]) => Promise<void>>().mockResolvedValue(undefined);
    const throttled = throttle(cb, 1000);

    await throttled("x", 42, true);
    expect(cb).toHaveBeenCalledWith("x", 42, true);
  });
});
