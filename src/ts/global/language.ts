/** Language detection utilities for client-side code. */

import { defaultLang, type Lang, Langs } from "../../i18n/types.ts";

const supportedLangs = Object.values(Langs);

/**
 * Detect the user's preferred language from: the provided lang argument, the document's `lang`
 * attribute, or `navigator.languages`. Falls back to `defaultLang` if no match is found.
 */
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
    const matched = supportedLangs.find((l) => l === code);
    if (matched) return matched;
  }

  return defaultLang;
};
