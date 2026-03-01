export const languages = {
  fi: "Suomi",
  en: "English",
} as const;

export const defaultLang = "fi";

export const ui = {
  fi: {
    "nav.home": "Koti",
    "nav.about": "Tietoja",
    "nav.images": "Kuvat",
    "nav.blog": "Blog",
    "nav.images.desc": "Käy katsomassa minun ottamiani kuvia.",
    "nav.blog.desc": "Käy katsomassa blogiani.",
    "nav.oldsite": "Ei muokkauksia tulossa.",
    "index.h1.title": "Åzze",
    "index.title": "Koti",
    "holiday.christmas": "Joulu",
    "holiday.newyear": "Uusi Vuosi",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.images": "Images",
    "nav.blog": "Blog",
    "nav.images.desc": "Come to see what images i have taken.",
    "nav.blog.desc": "Go check out my blog.",
    "nav.oldsite": "Not being updated.",
    "index.h1.title": "Åzze",
    "index.title": "Home",
    "holiday.christmas": "Christmas",
    "holiday.newyear": "New Year",
  },
} as const;

export type UI = typeof ui;
export type Lang = keyof UI;

export type TranslationKeys = {
  [K in Lang]: keyof UI[K];
}[Lang];

export type UISchema = {
  [K in Lang]: z.infer<typeof translationSchema>;
};

export const showDefaultLang = false;

/* -------------------------------------------------- */
/* ZOD VALIDATION SCHEMAS */
/* -------------------------------------------------- */

import { z } from "zod";

const translationEntrySchema = z.record(z.string(), z.string());

export const translationSchema = translationEntrySchema;

export const uiSchema = z.record(z.literal("fi"), translationEntrySchema);

export function validateTranslation(
  _lang: unknown,
  data: unknown,
): data is UI[Lang] {
  return translationSchema.safeParse(data).success;
}

export function validateUI(data: unknown): data is UI {
  return uiSchema.safeParse(data).success;
}
