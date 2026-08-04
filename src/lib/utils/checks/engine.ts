export const JSEngine = {
  V8: "v8",
  SPIDERMONKEY: "spidermonkey",
  JAVASCRIPTCORE: "javascriptcore",
  UNKNOWN: "unknown",
} as const;

export type JSEngine = (typeof JSEngine)[keyof typeof JSEngine];

function detectJSEngine(): JSEngine {
  const constructor = [].constructor;
  try {
    (-1).toFixed(-1);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    const identifier = message.length + String(constructor).replace(constructor.name, "").length;

    return (
      {
        80: JSEngine.V8,
        58: JSEngine.SPIDERMONKEY,
        77: JSEngine.JAVASCRIPTCORE,
      }[identifier] ?? JSEngine.UNKNOWN
    );
  }

  return JSEngine.UNKNOWN;
}

let cachedEngine: JSEngine | undefined;

export function getJSEngine() {
  return (cachedEngine ??= detectJSEngine());
}

export function isEngine(engine: JSEngine) {
  return getJSEngine() === engine;
}
