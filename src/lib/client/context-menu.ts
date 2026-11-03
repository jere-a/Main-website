/** Suppress the native context menu on images. */

import { on } from "@utils/index";

export const suppressImageContextMenu = (): void => {
  on(
    document.body,
    "contextmenu",
    (event) => {
      event.preventDefault();
    },
    "img, picture",
  );
};
