/**
 * Snow particle ("particulator") effect for the Christmas holiday.
 *
 * Loads the tsparticles snow preset and mounts it into a dedicated container element. The
 * container is created on demand so the effect is fully self-contained and leaves no
 * markup in the document until it runs.
 */

import { tsParticles, type Container } from "@tsparticles/engine";
import { loadSnowPreset } from "@tsparticles/preset-snow";

/** id of the element the particle canvas is mounted into. */
export const CONTAINER_ID = "tsparticles";

/** Start the snow particle animation. Safe to call repeatedly: the preset loads only once. */
export const snow = async (): Promise<Container | undefined> => {
  await loadSnowPreset(tsParticles);

  return tsParticles.load({ id: CONTAINER_ID, options: { preset: "snow" } });
};
