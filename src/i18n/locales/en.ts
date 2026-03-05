import type { schema } from "./schema";

export const en = {
  nav: {
    home: "Home",
    about: "About",
    images: {
      title: "Images",
      desc: "Come to see what images i have taken.",
    },
    blog: {
      title: "Blog",
      desc: "Go check out my blog.",
    },
    oldsite: "Not being updated.",
    lang: "English",
  },
  index: {
    github: "View source on GitHub",
    h1: {
      title: "Åzze",
    },
    title: "Home",
  },
  about: {
    title: "About Me",
    author: "Jere Laitinen",
  },
  images: {
    title: "Images",
    subtitle: "My photos from various places.",
  },
  notfound: {
    title: "404 Not Found",
    message: "The page you are looking for was not found.",
  },
  youtube: {
    title: "Youtube",
  },
  holiday: {
    christmas: "Christmas",
    newyear: "New Year",
  },
} as const satisfies schema;
