export { deviceCapabilities, isMobile } from "./device.ts";
export {
  BrowserFamily,
  ENGINE_IDENTIFIERS,
  ENGINE_TO_BROWSER,
  JSEngine,
  getBrowserFamily,
  getJSEngine,
  isEngine,
} from "./engine.ts";
export { isBrave, braveResistance } from "./brave.ts";
export { detectOperatingSystem, Platform, type DetectionResult, Oscpu } from "./platform.ts";
