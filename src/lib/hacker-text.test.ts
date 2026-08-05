import { afterEach, describe, expect, it, vi } from "vitest";

import hackerText from "./hacker-text";

describe("hackerText", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("resolves target text with default options", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");
    el.innerText = "";

    hackerText(el, "Hi");

    for (let i = 0; i < 15; i++) {
      vi.advanceTimersByTime(30);
    }

    expect(el.innerText).toBe("Hi");
  });

  it.each([
    ["empty", ""],
    ["lowercase", "hello world"],
    ["mixed case", "HeLLo WoRLD"],
    ["digits and symbols", "H1 W2! a-b_c"],
    ["unicode", "héllo wörld"],
    ["single character", "Z"],
  ])("resolves %s target text", (_label, target) => {
    vi.useFakeTimers();
    const el = document.createElement("div");

    hackerText(el, target, undefined, 10, 1);

    for (let i = 0; i < target.length + 5; i++) {
      vi.advanceTimersByTime(10);
    }

    expect(el.innerText).toBe(target);
  });

  it("reveals letters left to right using only the letters set", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const el = document.createElement("div");

    hackerText(el, "ABC", "XY", 10, 1);

    vi.advanceTimersByTime(10);
    expect(el.innerText).toBe("XXX");

    vi.advanceTimersByTime(10);
    expect(el.innerText).toBe("AXX");

    vi.advanceTimersByTime(10);
    expect(el.innerText).toBe("ABC");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("stops the interval after the target is fully revealed", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");

    hackerText(el, "HI", undefined, 10, 1);

    vi.advanceTimersByTime(10);
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    vi.advanceTimersByTime(200);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("clears the interval immediately for empty target text", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");

    hackerText(el, "", undefined, 30, 1);
    vi.advanceTimersByTime(30);

    expect(el.innerText).toBe("");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("uses the iterations parameter as a speed factor", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");

    hackerText(el, "TEST", undefined, 30, 5);

    for (let i = 0; i < 50; i++) {
      vi.advanceTimersByTime(30);
    }

    expect(el.innerText).toBe("TEST");
  });
});
