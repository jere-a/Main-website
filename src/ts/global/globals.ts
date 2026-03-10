import { defaultLang, type Lang, translations } from "@/i18n";

type EventHandler<E extends Event = Event> = (this: Element, event: E) => void;

export const toUnicode = (str: string): string =>
  str
    .split("")
    .map((char: string): string => {
      const code = char.charCodeAt(0).toString(16).toUpperCase();
      return `\\u${code.padStart(4, "0")}`;
    })
    .join("");

export const detectLanguage = (lang = navigator.language): Lang => {
  const shortLang = lang.split("-")[0];

  if (Object.keys(translations).includes(shortLang)) {
    return shortLang as Lang;
  }

  return defaultLang;
};

export const throttle = <Args extends unknown[]>(
  cb: (...args: Args) => void | Promise<void>,
  delay = 1000,
) => {
  let waiting: Args | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Args) => {
    if (timer) {
      waiting = args;
      return;
    }
    cb(...args);
    timer = setTimeout(() => {
      timer = null;
      if (waiting) {
        cb(...waiting);
        waiting = null;
        timer = setTimeout(() => {}, delay);
      }
    }, delay);
  };
};

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

export async function catchErrorTyped<
  T,
  E extends new (
    message?: string,
  ) => Error,
>(
  promise: Promise<T>,
  errorsToCatch: E[],
): Promise<[undefined, T] | [InstanceType<E>]> {
  try {
    const data = await promise;
    return [undefined, data];
  } catch (error) {
    if (errorsToCatch.some((E) => error instanceof E)) {
      return [error as InstanceType<E>];
    }
    throw error;
  }
}

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export function addEventListener<K extends keyof HTMLElementEventMap>(
  element: Element,
  eventName: K,
  handler: EventHandler<HTMLElementEventMap[K]>,
  selector?: string,
): (event: Event) => void {
  const wrappedHandler = (event: Event): void => {
    if (selector) {
      const target = event.target as Element | null;
      if (!target) return;
      const matched = target.closest(selector);
      if (matched) handler.call(matched, event as HTMLElementEventMap[K]);
      return;
    }
    handler.call(element, event as HTMLElementEventMap[K]);
  };
  element.addEventListener(eventName, wrappedHandler);
  return wrappedHandler;
}

export function getQueryParam(name: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

export function isPWA(): boolean {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  // biome-ignore lint/suspicious/noExplicitAny: only in IOS
  const isIOS = (window.navigator as any).standalone === true;
  return isStandalone || isIOS;
}

export async function getTemporal(): Promise<
  typeof import("@js-temporal/polyfill").Temporal
> {
  if ((globalThis as any).Temporal) {
    return (globalThis as any).Temporal;
  }

  const { Temporal } = await import("@js-temporal/polyfill");
  return Temporal;
}
