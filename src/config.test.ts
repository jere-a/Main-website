import { describe, expect, it } from "vitest";

import { siteConfig } from "./config";
import type { SiteConfig } from "./config";

describe("siteConfig", () => {
  it("has correct host", () => {
    expect(siteConfig.host).toBe("ozze.eu.org");
  });

  it("computes url from host", () => {
    expect(siteConfig.url).toBe("https://ozze.eu.org");
  });

  it("has a title", () => {
    expect(typeof siteConfig.title).toBe("string");
    expect(siteConfig.title.length).toBeGreaterThan(0);
  });

  it("has blogTitle", () => {
    expect(typeof siteConfig.blogTitle).toBe("string");
  });

  it("has a description", () => {
    expect(typeof siteConfig.description).toBe("string");
    expect(siteConfig.description.length).toBeGreaterThan(0);
  });

  it("has rssDescription", () => {
    expect(typeof siteConfig.rssDescription).toBe("string");
  });

  it("has positive postsPerPage", () => {
    expect(siteConfig.postsPerPage).toBeGreaterThan(0);
  });

  it("has positive postsRecent", () => {
    expect(siteConfig.postsRecent).toBeGreaterThan(0);
  });

  it("has mainAuthor as string", () => {
    expect(typeof siteConfig.mainAuthor).toBe("string");
    expect(siteConfig.mainAuthor.length).toBeGreaterThan(0);
  });

  it("has youtubeChannelId", () => {
    expect(typeof siteConfig.youtubeChannelId).toBe("string");
  });

  it("has posthogApiKey starting with phc_", () => {
    expect(siteConfig.posthogApiKey).toMatch(/^phc_/);
  });

  it("has mainLanguage as a locale code", () => {
    expect(typeof siteConfig.mainLanguage).toBe("string");
    expect(siteConfig.mainLanguage).toMatch(/^[a-z]{2}-[a-z]{2}$/);
  });

  it("has author contacts with github", () => {
    expect(typeof siteConfig.author.contacts.github).toBe("string");
  });

  it("computes giturl from github username", () => {
    expect(siteConfig.urls.giturl).toBe(
      `https://github.com/${siteConfig.author.contacts.github}/Main-website`,
    );
  });

  it("giturl getter is reactive to github username changes", () => {
    const original = siteConfig.author.contacts.github;
    try {
      siteConfig.author.contacts.github = "test-user";
      expect(siteConfig.urls.giturl).toBe("https://github.com/test-user/Main-website");
    } finally {
      siteConfig.author.contacts.github = original;
    }
  });

  it("satisfies the SiteConfig type shape", () => {
    const config: SiteConfig = siteConfig;
    expect(config).toBeDefined();
  });
});
