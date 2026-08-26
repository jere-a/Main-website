/**
 * Decorative Christmas light rope: a <ul class="lightrope"> with a fixed number of empty <li>
 * bulbs, styled by the site's lightrope CSS.
 */

export const LIGHT_COUNT = 42;

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

/** Build the light rope element (not yet attached to the document). */
export const createLightrope = (): HTMLUListElement => {
  const lightrope = document.createElement("ul");
  lightrope.className = "lightrope";

  for (const _ of range(LIGHT_COUNT)) {
    lightrope.appendChild(document.createElement("li"));
  }

  return lightrope;
};
