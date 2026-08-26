/**
 * Christmas holiday effect. Runs the snow particle animation and injects a decorative light rope
 * into the document body.
 */

import { prependToBody } from "./dom.ts";
import { createLightrope } from "./lightrope.ts";
import { snow } from "./snow.ts";

export const christmas = async (): Promise<void> => {
  await snow();
  prependToBody(createLightrope());
};
