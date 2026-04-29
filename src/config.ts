export type SiteConfig = {
  host: string;
  url: string;
  title: string;
  Blogtitle: string;
  siteName: string;
  description: string;
  rss_description: string;
  postsPerPage: number;
  postsRecent: number;
  mainAuthor: string;
  yt_cid: string;
  posthog_id: string;
  mainLanguage: string;
  author: {
    contacts: {
      github: string;
    };
  };
  urls: {
    giturl: string;
  };
};

const author = {
  contacts: {
    github: "jere-a",
  },
} as const;

const urls = {
  giturl: "https://github.com/jere-a/Main-website",
} as const;

export const siteConfig: SiteConfig = {
  host: "ozze.eu.org",
  url: "https://ozze.eu.org",
  title: "Åzze",
  Blogtitle: "Åzze's Blog",
  siteName: "",
  description: "Pieni nettisivuni.",
  rss_description: "Small Content Creator for the internet.",
  postsPerPage: 7,
  postsRecent: 200,
  mainAuthor: "Jere E.L",
  yt_cid: "UCNAVV2j-Bmuu9ApfTYwYAeA",
  posthog_id: "phc_5MXCIWNtl5iS3fpCybKZjGJoe1RIoJlpHGBwfZgfUFF",
  mainLanguage: "fi-fi",
  author,
  urls,
} satisfies SiteConfig;
