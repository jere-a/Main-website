import { describe, expect, it, vi, afterEach } from "vitest";
import hackerText from "./hacker-text";

describe("hackerText", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("sets element text to target text after animation completes", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");
    el.innerText = "";

    hackerText(el, "HI", undefined, 30, 1);

    for (let i = 0; i < 10; i++) {
      vi.advanceTimersByTime(30);
    }

    expect(el.innerText).toBe("HI");
  });

  it("works with empty target text", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");

    hackerText(el, "", undefined, 30, 1);
    vi.advanceTimersByTime(30);

    expect(el.innerText).toBe("");
  });

  it("respects custom letters character set", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");

    hackerText(el, "AB", "AB", 30, 10);

    for (let i = 0; i < 50; i++) {
      vi.advanceTimersByTime(30);
    }

    expect(el.innerText).toBe("AB");
  });

  it("resolves single character text", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");

    hackerText(el, "X", undefined, 10, 1);

    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(10);
    }

    expect(el.innerText).toBe("X");
  });

  it("resolves multi-word target text", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");

    hackerText(el, "HELLO WORLD", undefined, 10, 2);

    for (let i = 0; i < 100; i++) {
      vi.advanceTimersByTime(10);
    }

    expect(el.innerText).toBe("HELLO WORLD");
  });

  it("uses iterations parameter as speed factor", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");

    hackerText(el, "TEST", undefined, 30, 5);

    for (let i = 0; i < 50; i++) {
      vi.advanceTimersByTime(30);
    }

    expect(el.innerText).toBe("TEST");
  });
});
