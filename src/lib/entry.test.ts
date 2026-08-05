import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  init: vi.fn<() => Promise<void>>(),
  on: vi.fn<
    (
      element: unknown,
      eventName: string,
      handler: (event: Event) => void,
      selector?: string,
    ) => void
  >(),
  subscribe: vi.fn<(listener: (value: unknown) => void) => () => void>(),
}));

vi.mock("./analytics.ts", () => ({
  init: h.init,
}));

vi.mock("./utils/index", () => ({
  on: h.on,
  $holiday: { subscribe: h.subscribe },
}));

import main from "./entry";

type HolidayLike = {
  key: string;
  runScript: ReturnType<typeof vi.fn>;
};

function captureKeydownHandler(): (event: KeyboardEvent) => void {
  const calls = h.on.mock.calls.filter(([, type]) => type === "keydown");
  const handler = calls.at(-1)?.[2];
  if (!handler) throw new Error("keydown handler not registered");
  return handler;
}

function playKonami(handler: (event: KeyboardEvent) => void) {
  for (const key of [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "B",
    "A",
  ]) {
    handler(new KeyboardEvent("keydown", { key }));
  }
}

describe("entry main", () => {
  beforeEach(() => {
    h.init.mockReset();
    h.init.mockResolvedValue(undefined);
    h.on.mockReset();
    h.subscribe.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("schedules posthog init via setTimeout when requestIdleCallback is unavailable", () => {
    vi.useFakeTimers();

    main();
    expect(h.init).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(h.init).toHaveBeenCalledTimes(1);
  });

  it("schedules posthog init via requestIdleCallback when available", () => {
    const idleCallback = vi.fn<(cb: () => void, options: { timeout: number }) => void>();
    vi.stubGlobal("requestIdleCallback", idleCallback);

    main();

    expect(idleCallback).toHaveBeenCalledTimes(1);
    expect(idleCallback.mock.calls[0]?.[1]).toEqual({ timeout: 2000 });
    expect(h.init).not.toHaveBeenCalled();

    const runInit = idleCallback.mock.calls[0]?.[0];
    if (!runInit) throw new Error("idle callback not captured");
    runInit();
    expect(h.init).toHaveBeenCalledTimes(1);
  });

  it("logs an error when posthog init fails", () => {
    vi.useFakeTimers();
    const error = new Error("boom");
    h.init.mockRejectedValue(error);
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);

    main();
    vi.advanceTimersByTime(1000);
    void vi.waitFor(() => expect(log).toHaveBeenCalledWith("init failed", error));
  });

  it("suppresses the context menu on images and pictures", () => {
    main();

    const call = h.on.mock.calls.find(([, type]) => type === "contextmenu");
    expect(call).toBeDefined();
    expect(call?.[0]).toBe(document.body);
    expect(call?.[3]).toBe("img, picture");

    const event = new Event("contextmenu");
    const preventDefault = vi.spyOn(event, "preventDefault").mockImplementation(() => undefined);
    const handler = call?.[2];
    if (!handler) throw new Error("contextmenu handler not registered");
    handler(event);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("does not log when a wrong key is pressed", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);

    main();
    const handler = captureKeydownHandler();
    handler(new KeyboardEvent("keydown", { key: "X" }));

    expect(log).not.toHaveBeenCalled();
  });

  it("logs the konami message when the full sequence is entered", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);

    main();
    const handler = captureKeydownHandler();
    playKonami(handler);

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith("Konami code activated.");
  });

  it("reloads the page on a vite preload error", () => {
    const addEventListener =
      vi.fn<(type: string, listener: (...args: unknown[]) => void) => void>();
    vi.stubGlobal("addEventListener", addEventListener);
    const reload = vi.fn<() => void>();

    main();

    const handler = addEventListener.mock.calls.find(([type]) => type === "vite:preloadError")?.[1];
    if (!handler) throw new Error("vite preload listener not registered");

    vi.stubGlobal("location", { reload });
    handler();

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("skips holiday effects when the holiday is null", () => {
    main();
    const cb = h.subscribe.mock.calls[0]?.[0];
    if (!cb) throw new Error("holiday subscriber not registered");

    expect(() => cb(null)).not.toThrow();
  });

  it("runs the script of a new holiday only once per key", () => {
    main();
    const cb = h.subscribe.mock.calls[0]?.[0];
    if (!cb) throw new Error("holiday subscriber not registered");

    const halloween: HolidayLike = { key: "halloween", runScript: vi.fn<() => Promise<void>>() };
    cb(halloween);
    expect(halloween.runScript).toHaveBeenCalledTimes(1);

    cb(halloween);
    expect(halloween.runScript).toHaveBeenCalledTimes(1);

    const christmas: HolidayLike = { key: "christmas", runScript: vi.fn<() => Promise<void>>() };
    cb(christmas);
    expect(christmas.runScript).toHaveBeenCalledTimes(1);
    expect(halloween.runScript).toHaveBeenCalledTimes(1);

    cb(null);
    expect(christmas.runScript).toHaveBeenCalledTimes(1);
  });
});
