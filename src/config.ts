export const siteConfig = {
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
} as const;
