import { isFunction } from "@utils/typecheck.ts";

import { isEngine, JSEngine } from "./engine.ts";

interface BraveNavigator extends Navigator {
  brave?: {
    isBrave?: () => Promise<boolean>;
  };
}

export async function isBrave(): Promise<boolean> {
  if (typeof navigator === "undefined") {
    return false;
  }

  const isBraveFn = (navigator as BraveNavigator).brave?.isBrave;

  if (!isEngine(JSEngine.V8) || !isFunction(isBraveFn)) {
    return false;
  }

  return isBraveFn().catch(() => false);
}

export async function braveResistance(): Promise<boolean> {
  if (!(await isBrave())) {
    return false;
  }

  return "keyboard" in navigator && navigator.keyboard === null;
}
