/** Site-wide configuration values. */
export type SiteConfig = {
  /** Primary domain (e.g. "ozze.eu.org"). */
  host: string;
  /** Computed full URL with protocol. */
  url: string;
  /** Site title displayed in headers and metadata. */
  title: string;
  /** Blog section title. */
  blogTitle: string;
  /** SEO site name for metadata. */
  siteName: string;
  /** Default meta description. */
  description: string;
  /** RSS feed description text. */
  rssDescription: string;
  /** Number of blog posts shown per page. */
  postsPerPage: number;
  /** Maximum number of recent posts to fetch. */
  postsRecent: number;
  /** Author name used in metadata. */
  mainAuthor: string;
  /** YouTube channel ID. */
  youtubeChannelId: string;
  /** PostHog analytics project API key. */
  posthogApiKey: string;
  /** Default locale code (e.g. "fi-fi"). */
  mainLanguage: string;
  /** Author contact info. */
  author: {
    contacts: {
      github: string;
    };
  };
  /** Computed external URLs. */
  urls: {
    giturl: string;
  };
};

export const siteConfig: SiteConfig = {
  host: "ozze.eu.org",
  get url() {
    return `https://${siteConfig.host}`;
  },
  title: "Åzze",
  blogTitle: "Åzze's Blog",
  siteName: "",
  description: "Pieni nettisivuni.",
  rssDescription: "Small Content Creator for the internet.",
  postsPerPage: 7,
  postsRecent: 200,
  mainAuthor: "Jere E.L",
  youtubeChannelId: "UCNAVV2j-Bmuu9ApfTYwYAeA",
  posthogApiKey: "phc_5MXCIWNtl5iS3fpCybKZjGJoe1RIoJlpHGBwfZgfUFF",
  mainLanguage: "fi-fi",
  author: {
    contacts: {
      github: "jere-a",
    },
  },
  urls: {
    get giturl() {
      return `https://github.com/${siteConfig.author.contacts.github}/Main-website`;
    },
  },
};
