import { isEngine, JSEngine } from "./engine.ts";

interface BraveNavigator extends Navigator {
  brave?: {
    isBrave(): Promise<boolean>;
  };
}

export function isBraveBrowser(): boolean {
  const nav = navigator as BraveNavigator;

  return typeof nav.brave?.isBrave === "function";
}

export function isBrave() {
  return (
    isEngine(JSEngine.V8) &&
    "flat" in Array.prototype &&
    (navigator as BraveNavigator).brave?.isBrave()
  );
}

export function BraveResistance() {
  return isBrave() && "keyboard" in navigator && navigator.keyboard === null;
}
