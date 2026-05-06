export type LangSchema = {
  nav: {
    home: string;
    about: string;
    images: {
      title: string;
      desc: string;
    };
    blog: {
      title: string;
      desc: string;
    };
  };
  index: {
    github: string;
    h1: {
      title: string;
    };
    title: string;
    intro: {
      start: string;
      youtubeLabel: string;
      end: string;
    };
  };
  about: {
    title: string;
    author: string;
  };
  images: {
    title: string;
    subtitle: string;
    winterLandscape: string;
    bigRoot: string;
    blueSky: string;
    sunflower: string;
    morningMist: string;
    colorfulBridge: string;
    bridgeAtNight: string;
  };
  notfound: {
    title: string;
    message: string;
  };
  youtube: {
    title: string;
  };
  footer: {
    copyright: string;
  };
  holiday: {
    christmas: string;
    newyear: string;
    halloween: string;
  };
};
