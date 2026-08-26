/**
 * Christmas holiday effect. Runs the snow particle animation and injects a decorative light rope
 * into the document body.
 */

import { LIGHT_COUNT, createLightrope } from "./lightrope.ts";
import { christmas as particles } from "./snow.ts";

export const christmas = async (): Promise<void> => {
  await particles();
  document.body.insertBefore(createLightrope(), document.body.firstChild);
};

/** Exposed for tests. */
export { LIGHT_COUNT };
