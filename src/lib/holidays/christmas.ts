/**
 * Christmas holiday effect. Initializes snow particle animation and injects a decorative light rope
 * into the document body.
 */

import { tsParticles } from "@tsparticles/engine";
import { loadSnowPreset } from "@tsparticles/preset-snow";

const LIGHT_COUNT = 42;

export const christmas = async () => {
  await loadSnowPreset(tsParticles);

  await tsParticles.load({
    id: "tsparticles",
    options: {
      preset: "snow",
    },
  });

  const lightrope = document.createElement("ul");
  lightrope.className = "lightrope";
  for (let i = 0; i < LIGHT_COUNT; i++) {
    const listItem = document.createElement("li");
    lightrope.appendChild(listItem);
  }
  document.body.insertBefore(lightrope, document.body.firstChild);
};
