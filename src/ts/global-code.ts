import { navigate } from "astro:transitions/client";
import { siteConfig } from "@/config";
import { $ } from "@/ts/jquery";
import { PrefersReducedMotion } from "./global";

const main = () => {
  $(document).on("astro:page-load", () => {
    $("a").on("mousedown", function (e) {
      e.preventDefault();
      navigate($(this).attr("href"));
    });
    if (siteConfig.params.functions.quicklink) {
      import("quicklink").then(({ listen }) => {
        listen({ prerender: true });
      });
    }
    console.log("who");
  });
};

export function init() {
  PrefersReducedMotion();
}

export default main;
