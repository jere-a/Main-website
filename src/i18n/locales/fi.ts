import type { LangSchema } from "../schema.ts";

export const fi: LangSchema = {
  nav: {
    home: "Koti",
    about: "Tietoja",
    images: {
      title: "Kuvat",
      desc: "Käy katsomassa minun ottamiani kuvia.",
    },
    blog: {
      title: "Blogi",
      desc: "Käy katsomassa blogiani.",
    },
    oldsite: "Ei muokkauksia tulossa.",
    lang: "Suomi",
  },
  index: {
    github: "Näytä lähde koodi GitHub:issa",
    h1: {
      title: "Åzze",
    },
    title: "Koti",
  },
  about: {
    title: "Tietoja minusta",
    author: "Jere Laitinen",
  },
  images: {
    title: "Kuvat",
    subtitle: "Minun ottamiani kuvia eri paikoista.",
  },
  notfound: {
    title: "404 Not Found",
    message: "Sivu jota yrität käyttää ei löytynyt.",
  },
  youtube: {
    title: "Youtube",
  },
  holiday: {
    christmas: "Joulu",
    newyear: "Uusi Vuosi",
    halloween: "Halloween",
  },
} satisfies LangSchema;
