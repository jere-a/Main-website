import { defaultLang, type Lang, Langs } from "@/i18n";

type EventHandler<E extends Event = Event> = (this: Element, event: E) => void;

const langs = Object.values(Langs) as readonly Lang[];

export const detectLanguage = (lang?: string): Lang => {
  const candidates = [
    lang,
    document?.documentElement.lang,
    ...(navigator?.languages ?? []),
    navigator?.language,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const code = candidate.slice(0, 2).toLowerCase();

    if (langs.includes(code as Lang)) {
      return code as Lang;
    }
  }

  return defaultLang;
};

export const throttle = <Args extends unknown[]>(
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
    timer = setTimeout(async () => {
      timer = null;
      if (waiting) {
        await cb(...waiting);
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

export function on<K extends keyof HTMLElementEventMap>(
  element: Element,
  eventName: K,
  handler: EventHandler<HTMLElementEventMap[K]>,
  selector?: string,
): (event: Event) => void {
  const wrappedHandler = (event: Event): void => {
    if (selector) {
      const target = event.target as Element | null;
      const matched = target?.closest(selector);
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
  const isIOS = (window.navigator as any).standalone === true;
  return isStandalone || isIOS;
}

export async function getTemporal(): Promise<typeof import("@js-temporal/polyfill").Temporal> {
  const g = globalThis as unknown as {
    Temporal?: typeof import("@js-temporal/polyfill").Temporal;
  };
  if (g.Temporal) {
    return g.Temporal;
  }

  const { Temporal } = await import("@js-temporal/polyfill");
  return Temporal;
}
