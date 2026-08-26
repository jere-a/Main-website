import { afterEach, describe, expect, it, vi } from "vitest";

import { CONTAINER_ID, snow } from "./snow";

const hoisted = vi.hoisted(() => ({
  load: vi.fn<() => Promise<{ id: string }>>(async () => ({ id: "tsparticles" })),
  preset: vi.fn<() => Promise<void>>(async () => undefined),
}));

vi.mock("@tsparticles/engine", () => ({
  tsParticles: { load: hoisted.load },
}));

vi.mock("@tsparticles/preset-snow", () => ({
  loadSnowPreset: hoisted.preset,
}));

afterEach(() => {
  document.body.innerHTML = "";
});

describe("snow", () => {
  it("loads the snow preset into the #tsparticles container", async () => {
    await snow();

    expect(hoisted.preset).toHaveBeenCalledTimes(1);
    expect(hoisted.load).toHaveBeenCalledWith({
      id: CONTAINER_ID,
      options: { preset: "snow" },
    });
    expect(hoisted.load).toHaveBeenCalledWith(
      expect.objectContaining({ id: CONTAINER_ID, options: { preset: "snow" } }),
    );
  });

  it("resolves with the loaded particle container", async () => {
    await expect(snow()).resolves.toMatchObject({ id: CONTAINER_ID });
  });
});
