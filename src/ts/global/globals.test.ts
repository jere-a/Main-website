import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { throttle } from "./globals";

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
