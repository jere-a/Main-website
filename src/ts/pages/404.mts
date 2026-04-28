import posthog from "posthog-js";
import { siteFeatures } from "@/configFeatures";
import { fetchData } from "@/ts/cloudflare-trace";

const { pathname, search } = window.location;
const notshow = [
  "404",
  "404.html",
  "404.htm",
  "404/index.html",
  "404/index.htm",
];

const notFoundEl = document.querySelector<HTMLParagraphElement>(".NotFound");
const infoEl = document.querySelector<HTMLParagraphElement>(".info");

if (!notshow.includes(pathname) && notFoundEl) {
  notFoundEl.innerText = `Sivuun ${pathname}${search} ei saatu yhteyttä.`;
} else if (notFoundEl) {
  notFoundEl.innerText = `Sivu jota yrität käyttää on tarkoitettu näytettäväksi jos etsimääsi sivua ei löydy.`;
}

if (
  posthog.isFeatureEnabled("fetchipp") ||
  siteFeatures.params.functions.fetchIPP
) {
  const data = await fetchData().then((a) => a);
  if (infoEl) {
    infoEl.innerText = `Yhteyttä yrittänyt ip osoite: ${data.ip}\nUserAgent: ${data.uag}`;
  }
}
