import { navigate } from "astro:transitions/client";
import { siteConfig } from "@/config";
import { $ } from "@/ts/jquery";
import { PrefersReducedMotion, isHoliday } from "./global/index";

const main = () => {
  $("a").on("mousedown", function (e) {
    e.preventDefault();
    navigate($(this).attr("href"));
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
