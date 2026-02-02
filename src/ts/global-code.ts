import { navigate } from "astro:transitions/client";
import { siteConfig } from "@/configFeatures";
import { $ } from "@/ts/jquery";
import { isHoliday, PrefersReducedMotion } from "./global/index";

const main = () => {
  $("a").on("mousedown", function (e) {
    e.preventDefault();
    navigate($(this).attr("href"));
  });

  $("img").on("contextmenu", (e) => {
    e.preventDefault();
  });
  $("picture").on("contextmenu", (e) => {
    e.preventDefault();
  });

  if (siteConfig.params.functions.quicklink) {
    import("quicklink").then(({ listen }) => {
      listen();
    });
  }

  const runHolidayEffects = async () => {
    const holiday = await isHoliday();
    if (holiday.bool) {
      holiday.script();
    }
  };
  runHolidayEffects();
};

export function init() {
  PrefersReducedMotion();
}

export default main;
