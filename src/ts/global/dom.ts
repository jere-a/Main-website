/** DOM manipulation utilities for client-side code. */

type EventHandler<E extends Event = Event> = (this: Element, event: E) => void;

/** Inject a CSS string into the document head as a <style> element. */
export const injectCSS = (css: string): HTMLStyleElement => {
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
  return el;
};

/** Load an external stylesheet by appending a <link> element to the document head. */
export const addCSSFromURL = (url: string): void => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Attach an event listener with optional CSS selector delegation. When a selector is provided, the
 * handler fires only if the event target matches it. Returns the wrapped handler for removal.
 */
export function on<K extends keyof HTMLElementEventMap>(
  element: Element,
  eventName: K,
  handler: EventHandler<HTMLElementEventMap[K]>,
  selector?: string,
): (event: HTMLElementEventMap[K]) => void {
  const wrappedHandler = (event: HTMLElementEventMap[K]): void => {
    if (selector) {
      const target = event.target;
      if (target instanceof Element) {
        const matched = target.closest(selector);
        if (matched) handler.call(matched, event);
        return;
      }
    }
    handler.call(element, event);
  };
  element.addEventListener(eventName, wrappedHandler as EventListener); // oxlint-disable-line typescript/no-unsafe-type-assertion
  return wrappedHandler;
}
