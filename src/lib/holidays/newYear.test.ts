import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type MockFireworks = {
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  updateOptions: ReturnType<typeof vi.fn>;
  el: HTMLElement;
  opts: Record<string, unknown>;
};

const h = vi.hoisted(() => ({
  instances: [] as MockFireworks[],
}));

vi.mock("fireworks-js", () => ({
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  Fireworks: vi.fn<
    (this: unknown, el: HTMLElement, opts: Record<string, unknown>) => MockFireworks
  >(function (this: unknown, el: HTMLElement, opts: Record<string, unknown>) {
    const instance: MockFireworks = {
      start: vi.fn<() => void>(),
      stop: vi.fn<() => void>(),
      updateOptions: vi.fn<() => void>(),
      el,
      opts,
    };
    h.instances.push(instance);
    return instance;
  }),
}));

vi.mock("@/data/sounds/explosion0.mp3", () => ({ default: "exp0" }));
vi.mock("@/data/sounds/explosion1.mp3", () => ({ default: "exp1" }));
vi.mock("@/data/sounds/explosion2.mp3", () => ({ default: "exp2" }));

import { newYear } from "./newYear";

const getInstance = (index = 0): MockFireworks => {
  const instance = h.instances[index];
  if (!instance) throw new Error("No Fireworks instance was created.");
  return instance;
};

const getContainer = (): HTMLElement | null =>
  document.querySelector<HTMLElement>(".fireworks-container");

describe("newYear", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    h.instances.length = 0;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does nothing when window is undefined", async () => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    vi.stubGlobal("window", undefined);

    await newYear();

    expect(h.instances).toHaveLength(0);
    vi.unstubAllGlobals();
  });

  it("creates a fullscreen fireworks container on first run", async () => {
    await newYear();

    const container = getContainer();
    expect(container).not.toBeNull();
    expect(container?.parentElement).toBe(document.body);
    expect(container?.style.position).toBe("absolute");
    expect(container?.style.inset).toBe("0");
    expect(container?.style.zIndex).toBe("-2");
    expect(container?.style.pointerEvents).toBe("none");
    expect(container?.style.overflow).toBe("hidden");

    expect(h.instances).toHaveLength(1);
    const instance = getInstance();
    expect(instance.el).toBe(container);
    expect(instance.opts).toEqual({
      boundaries: {
        x: 50,
        y: 50,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      sound: { enabled: false, files: ["exp0", "exp1", "exp2"] },
    });
    expect(instance.start).toHaveBeenCalledTimes(1);
    expect(instance.stop).not.toHaveBeenCalled();
  });

  it("cleans up the previous instance on a second run", async () => {
    await newYear();
    const firstContainer = getContainer();

    await newYear();

    const containers = document.querySelectorAll(".fireworks-container");
    expect(containers).toHaveLength(1);
    expect(containers[0]).not.toBe(firstContainer);
    expect(h.instances).toHaveLength(2);
    expect(getInstance(0).stop).toHaveBeenCalledTimes(1);
    expect(getInstance(1).stop).not.toHaveBeenCalled();
  });

  it("enables sound on the first pointer interaction only", async () => {
    await newYear();
    const instance = getInstance();

    window.dispatchEvent(new Event("pointerdown"));
    expect(instance.updateOptions).toHaveBeenCalledTimes(1);
    expect(instance.updateOptions).toHaveBeenCalledWith({ sound: { enabled: true } });

    window.dispatchEvent(new Event("pointerdown"));
    expect(instance.updateOptions).toHaveBeenCalledTimes(1);
  });

  it("enables sound on the first key interaction only", async () => {
    await newYear();
    const instance = getInstance();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(instance.updateOptions).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(instance.updateOptions).toHaveBeenCalledTimes(1);
  });
});
