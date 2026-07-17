import { defaultLang, type Lang, Langs } from "../../i18n/types.ts";

type EventHandler<E extends Event = Event> = (this: Element, event: E) => void;

const langs = Object.values(Langs);

export const detectLanguage = (lang?: string): Lang => {
  const candidates = [
    lang,
    document.documentElement.lang,
    ...navigator.languages,
    navigator.language,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const code = candidate.slice(0, 2).toLowerCase();
    const matched = langs.find((l) => l === code);
    if (matched) return matched;
  }

  return defaultLang;
};

export const throttle = <Args extends Array<unknown>>(
  cb: (...args: Args) => void | Promise<void>,
  delay = 1000,
) => {
  let waiting: Args | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return async (...args: Args) => {
    if (timer) {
      waiting = args;
      return;
    }
    await cb(...args);
    timer = setTimeout(() => {
      void (async () => {
        timer = null;
        if (waiting) {
          await catchErrorTyped(Promise.resolve(cb(...waiting)));
          waiting = null;
        }
      })();
    }, delay);
  };
};

export async function catchErrorTyped<T, E extends new (message?: string) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[],
): Promise<[undefined, T] | [InstanceType<E>]> {
  try {
    const data = await promise;
    return [undefined, data] as [undefined, T];
  } catch (error) {
    if (errorsToCatch === undefined || errorsToCatch.some((e) => error instanceof e)) {
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return [error] as [InstanceType<E>];
    }
    throw error;
  }
}

export const injectCSS = (css: string): HTMLStyleElement => {
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
  return el;
};

export const addCSSFromURL = (url: string): void => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
};

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

export function getQueryParam(name: string): string | undefined {
  return new URLSearchParams(window.location.search).get(name) ?? undefined;
}

import type { Temporal as TemporalType } from "@js-temporal/polyfill";

export async function getTemporal(): Promise<typeof TemporalType | typeof globalThis.Temporal> {
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  if ("Temporal" in globalThis && globalThis.Temporal) {
    return globalThis.Temporal;
  }

  return (await import("@js-temporal/polyfill")).Temporal;
}
