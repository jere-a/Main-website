/**
 * I18n type definitions and locale loader registry. Defines the Lang type, default language, and
 * lazy-loaded translation modules.
 */

import type { fi } from "./locales/fi.ts";

export const Langs = ["fi", "en"] as const;

export type Lang = (typeof Langs)[number];

export const defaultLang: Lang = "fi";

/** Recursively stringify all leaf values of a type (translation values are always strings). */
type Stringify<T> = {
  readonly [K in keyof T]: T[K] extends object ? Stringify<T[K]> : string;
};

/** The canonical translation schema, derived from the Finnish locale. */
export type DefaultSchema = Stringify<typeof fi>;

export const translationLoaders = {
  fi: () => import("./locales/fi").then((m) => m.fi),
  en: () => import("./locales/en").then((m) => m.en),
} satisfies Record<Lang, () => Promise<DefaultSchema>>;
