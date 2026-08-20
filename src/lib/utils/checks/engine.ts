export const JSEngine = {
  V8: "v8",
  SPIDERMONKEY: "spidermonkey",
  JAVASCRIPTCORE: "javascriptcore",
  UNKNOWN: "unknown",
} as const;

export type JSEngine = (typeof JSEngine)[keyof typeof JSEngine];

type EngineIdentifiers = Record<number, JSEngine>;

export const ENGINE_IDENTIFIERS: EngineIdentifiers = {
  80: JSEngine.V8,
  58: JSEngine.SPIDERMONKEY,
  77: JSEngine.JAVASCRIPTCORE,
} as const;

export const BrowserFamily = {
  CHROMIUM: "chromium",
  FIREFOX: "firefox",
  SAFARI: "safari",
  UNKNOWN: "unknown",
} as const;

export type BrowserFamily = (typeof BrowserFamily)[keyof typeof BrowserFamily];

function detectJSEngine(): JSEngine {
  const constructor = [].constructor;
  try {
    (-1).toFixed(-1);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    const identifier = message.length + String(constructor).replace(constructor.name, "").length;

    return ENGINE_IDENTIFIERS[identifier] ?? JSEngine.UNKNOWN;
  }

  return JSEngine.UNKNOWN;
}

export function getJSEngine() {
  return detectJSEngine();
}

export const ENGINE_TO_BROWSER = {
  [JSEngine.V8]: BrowserFamily.CHROMIUM,
  [JSEngine.SPIDERMONKEY]: BrowserFamily.FIREFOX,
  [JSEngine.JAVASCRIPTCORE]: BrowserFamily.SAFARI,
  [JSEngine.UNKNOWN]: BrowserFamily.UNKNOWN,
} as const satisfies Record<JSEngine, BrowserFamily>;

export function getBrowserFamily(): BrowserFamily {
  return ENGINE_TO_BROWSER[getJSEngine()];
}

export function isEngine(engine: JSEngine) {
  return getJSEngine() === engine;
}
