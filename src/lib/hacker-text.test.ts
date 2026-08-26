import { afterEach, describe, expect, it, vi } from "vitest";

import hackerText from "./hacker-text";

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

const el = (): HTMLElement => {
  const element = document.createElement("span");
  document.body.appendChild(element);

  return element;
};

describe("hackerText", () => {
  it("reveals the target text fully and stops the timer", () => {
    vi.useFakeTimers();
    const element = el();

    hackerText(element, "AB", "XY", 10, 1);
    vi.advanceTimersByTime(1000);

    expect(element.innerText).toBe("AB");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("scrambles unrevealed characters with the given letter set", () => {
    vi.useFakeTimers();
    const element = el();
    const rand = vi.spyOn(Math, "random").mockReturnValue(0);

    // iterations tiny -> only the first character reveals on the first tick
    hackerText(element, "AAA", "Z", 10, Number.MIN_VALUE);

    expect(element.innerText).toBe("");
    expect(rand).not.toHaveBeenCalled();

    rand.mockRestore();

    vi.advanceTimersByTime(1000); // eventually completes

    expect(element.innerText).toBe("AAA");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("finishes instantly for a zero-length target", () => {
    vi.useFakeTimers();
    const element = el();

    hackerText(element, "", "X", 10, 1);

    expect(element.innerText).toBe("");
  });

  it("keeps ticking until the whole text is revealed when iterations < 1", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const element = el();

    hackerText(element, "ABC", "Q", 10, 0.5);

    // Before any tick nothing is rendered and the interval is still pending.
    expect(element.innerText).toBe("");
    expect(vi.getTimerCount()).toBe(1);

    vi.advanceTimersByTime(30); // two ticks: iteration = 4 -> fully revealed, still ticking

    expect(element.innerText).toBe("ABC");

    vi.advanceTimersByTime(100); // iteration = 3+ -> done

    expect(element.innerText).toBe("ABC");
    expect(vi.getTimerCount()).toBe(0);
  });
});
