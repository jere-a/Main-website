declare global {
  interface Navigator {
    /** Firefox-only OS information string. */
    oscpu?: string;
  }
}

/**
 * Operating systems/platforms that can be detected from browser APIs.
 *
 * Note: Browser APIs intentionally do not provide a guaranteed OS identifier. These values are
 * best-effort guesses based on navigator properties.
 */
export const Platform = {
  IOS: "ios",
  MACOS: "macos",
  WINDOWS: "windows",
  LINUX: "linux",
  IOS_GENERAL_MOBILE_DEVICE: "ios_gmd",
  ANDROID: "android",
  CHROMIUM_OS: "chromium_os",
  FREEBSD: "freebsd",
  OPENBSD: "openbsd",
} as const;

export type Platform = (typeof Platform)[keyof typeof Platform];

/** Operating systems reported by Firefox's navigator.oscpu. */
export const Oscpu = {
  WINDOWS_CE: "windows_ce",
  WINDOWS: "windows",
  MACOS: "macos",
  LINUX: "linux",
} as const;

export type Oscpu = (typeof Oscpu)[keyof typeof Oscpu];

/** Result returned by {@link detectOperatingSystem}. */
export interface DetectionResult {
  /** Detected platform based on navigator.platform. */
  platform?: Platform;

  /** Browser vendor if detected. */
  vendor?: "apple";

  /** Firefox-specific OSCPU detection result. */
  oscpu?: Oscpu;
}

const PLATFORM_RULES = [
  [/^win/, Platform.WINDOWS],
  [/^(linux|suse|ubuntu)/, Platform.LINUX],
  [/^android/, Platform.ANDROID],
  [/^chromium os/, Platform.CHROMIUM_OS],
  [/^freebsd/, Platform.FREEBSD],
  [/^openbsd/, Platform.OPENBSD],
] as const;

const OSCPU_RULES = [
  [/windowsce/i, Oscpu.WINDOWS_CE],
  [/windows/i, Oscpu.WINDOWS],
  [/mac ?os/i, Oscpu.MACOS],
  [/linux/i, Oscpu.LINUX],
] as const;

let cachedResult: Readonly<DetectionResult> | undefined;

/**
 * Detects the user's operating system from available browser information.
 *
 * Detection sources: - `navigator.platform` - `navigator.maxTouchPoints` (used for iPadOS
 * detection) - `navigator.vendor` - `navigator.oscpu` (Firefox only)
 *
 * The result should be treated as a hint, not a guaranteed OS identifier.
 *
 * @example
 *   ```ts
 *   const os = detectOperatingSystem();
 *
 *   if (os.platform === Platform.WINDOWS) {
 *     console.log("Windows user");
 *   }
 *   ```;
 */
export function detectOperatingSystem(): Readonly<DetectionResult> {
  if (cachedResult) {
    return cachedResult;
  }

  const result: DetectionResult = {};
  const platform = navigator.platform.toLowerCase();

  const detectedPlatform = detectPlatform(platform);

  if (detectedPlatform !== undefined) {
    result.platform = detectedPlatform;
  }

  const vendor = detectVendor();

  if (vendor) {
    result.vendor = vendor;
  }

  const oscpu = navigator.oscpu?.toLowerCase();

  if (oscpu) {
    const detectedOscpu = detectOscpu(oscpu);

    if (detectedOscpu !== undefined) {
      result.oscpu = detectedOscpu;
    }
  }

  cachedResult = result;
  return result;
}

function detectVendor(): "apple" | undefined {
  return navigator.vendor.toLowerCase().startsWith("apple") ? "apple" : undefined;
}

/** Detects platform from navigator.platform. */
function detectPlatform(platform: string): Platform | undefined {
  if (platform.startsWith("macintel")) {
    return navigator.maxTouchPoints > 0 ? Platform.IOS : Platform.MACOS;
  }

  if (/^(ios|iphone|ipad|ipod)/.test(platform) || /(iphone|ipad|ipod)$/.test(platform)) {
    return Platform.IOS;
  }

  if (platform === "general mobile device") {
    return Platform.IOS_GENERAL_MOBILE_DEVICE;
  }

  return PLATFORM_RULES.find(([regex]) => regex.test(platform))?.[1];
}

/** Detects OS from Firefox navigator.oscpu. */
function detectOscpu(value: string): Oscpu | undefined {
  return OSCPU_RULES.find(([regex]) => regex.test(value))?.[1];
}
