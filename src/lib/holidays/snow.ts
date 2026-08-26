/**
 * Snow particle ("particulator") effect for the Christmas holiday.
 *
 * Loads the tsparticles snow preset and mounts it into a dedicated container element. The
 * container is created on demand so the effect is fully self-contained and leaves no
 * markup in the document until it runs.
 */

import { tsParticles } from "@tsparticles/engine";
import { loadSnowPreset } from "@tsparticles/preset-snow";

/** id of the element the particle canvas is mounted into. */
const CONTAINER_ID = "tsparticles";

const ensureContainer = (): HTMLElement => {
  const existing = document.getElementById(CONTAINER_ID);

  if (existing) return existing;

  const container = document.createElement("div");
  container.id = CONTAINER_ID;
  document.body.appendChild(container);

  return container;
};

/** Start the snow particle animation. Safe to call repeatedly: the preset loads only once. */
export const snow = async (): Promise<void> => {
  await loadSnowPreset(tsParticles);
  await tsParticles.load({ id: CONTAINER_ID, options: { preset: "snow" } });
};

export const christmas = async (): Promise<void> => {
  await snow();
  ensureContainer();
};
