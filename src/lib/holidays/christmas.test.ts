import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  loadSnowPreset: vi.fn<(engine: unknown) => Promise<void>>(),
  load: vi.fn<(options: unknown) => Promise<void>>(),
}));

vi.mock("@tsparticles/engine", () => ({
  tsParticles: { load: h.load },
}));

vi.mock("@tsparticles/preset-snow", () => ({
  loadSnowPreset: h.loadSnowPreset,
}));

import { christmas } from "./christmas";

describe("christmas", () => {
  beforeEach(() => {
    h.loadSnowPreset.mockResolvedValue(undefined);
    h.load.mockResolvedValue(undefined);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("loads the snow preset for the tsParticles engine", async () => {
    await christmas();

    expect(h.loadSnowPreset).toHaveBeenCalledTimes(1);
    expect(h.loadSnowPreset.mock.calls[0]?.[0]).toBeDefined();
  });

  it("loads particles with the snow preset", async () => {
    await christmas();

    expect(h.load).toHaveBeenCalledTimes(1);
    expect(h.load).toHaveBeenCalledWith({
      id: "tsparticles",
      options: { preset: "snow" },
    });
  });

  it("injects a lightrope with 42 bulbs as the first body child", async () => {
    document.body.innerHTML = "<main>content</main>";

    await christmas();

    const lightrope = document.querySelector("ul.lightrope");
    expect(lightrope).not.toBeNull();
    expect(lightrope?.children).toHaveLength(42);
    expect(document.body.firstElementChild).toBe(lightrope);
  });

  it("inserts the lightrope even when the body is empty", async () => {
    await christmas();

    const lightrope = document.querySelector("ul.lightrope");
    expect(document.body.firstElementChild).toBe(lightrope);
    expect(lightrope?.children).toHaveLength(42);
  });
});
