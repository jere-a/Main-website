/** Shared holiday effect DOM helpers. */

/** Insert an element as the first child of <body> (no-op outside a browser document). */
export const prependToBody = (element: HTMLElement): void => {
  if (typeof document === "undefined") return;

  document.body.insertBefore(element, document.body.firstChild);
};
