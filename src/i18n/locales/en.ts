import type { LangSchema } from "../schema.ts";

export const en: LangSchema = {
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
    intro: {
      start:
        "I made this page when I became interested in building this. You can find me on ",
      youtubeLabel: "YouTube",
      end: " and you can also send me feedback at: ",
    },
    oldSite: "Old Website",
  },
  about: {
    title: "About Me",
    author: "Jere Laitinen",
  },
  images: {
    title: "Images",
    subtitle: "My photos from various places.",
    winterLandscape: "Winter Landscape From the Bridge.",
    bigRoot: "Big Stump.",
    blueSky: "Blue Sky.",
    sunflower: "Sunflower.",
    morningMist: "Morning Mist.",
    colorfulBridge: "Colorful bridge at night",
    bridgeAtNight: "Bridge at night",
  },
  notfound: {
    title: "404 Not Found",
    message: "The page you are looking for was not found.",
  },
  youtube: {
    title: "Youtube",
  },
  footer: {
    copyright: "Copyright © ",
  },
  holiday: {
    christmas: "Christmas",
    newyear: "New Year",
    halloween: "Halloween",
  },
} satisfies LangSchema;
