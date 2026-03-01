const author = {
  name: "equilibriumuk",
  photo: "/users/",
  bio: "Web Developer & SRE",
  contacts: {
    github: "jere-a",
  },
} as const;

const urls = {
  giturl: "https://github.com/jere-a/Main-website",
} as const;

export type SiteConfig = {
  host: string;
  url: string;
  oldSite: string;
  title: string;
  Blogtitle: string;
  siteName: string;
  description: string;
  rss_description: string;
  postsPerPage: number;
  postsRecent: number;
  mainAuthor: string;
  yt_cid: string;
  mainLanguage: string;
  author: typeof author;
  urls: typeof urls;
};

export const siteConfig = {
  host: "ozze.eu.org",
  url: "https://ozze.eu.org",
  oldSite: "http://old.ozze.eu.org/index.html",
  title: "Åzze",
  Blogtitle: "Åzze's Blog",
  siteName: "",
  description: "Pieni nettisivuni.",
  rss_description: "Small Content Creator for the internet.",
  postsPerPage: 7,
  postsRecent: 5,
  mainAuthor: "Jere E.L",
  yt_cid: "UCNAVV2j-Bmuu9ApfTYwYAeA",
  mainLanguage: "fi-fi",
  author,
  urls,
} satisfies SiteConfig;
