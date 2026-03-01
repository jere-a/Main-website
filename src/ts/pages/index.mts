import { siteFeatures } from "@/configFeatures";
import { capitalize, holidayTimeTo, isHoliday, query } from "@/ts/global";
import global from "@/ts/global-code";
import { $ } from "@/ts/jquery/basic";

const main = async () => {
  if (!main.once) {
    main.once = true;

    if (siteFeatures.params.functions.holidayEffects) {
      const mainEl = query(".main");
      const instructionsEl = query(".instructions");
      const holidaysEl = query("p.holidays");
      const holiday = await isHoliday([
        mainEl ?? undefined,
        instructionsEl ?? undefined,
        holidaysEl ?? undefined,
        ".navItem",
      ]);

      const updateHolidayMessage = () => {
        const { days, hours, minutes, seconds } = holidayTimeTo(holiday.timeto);
        let msg: string;

        const now = new Date();
        const holidayDate = new Date(holiday.timeto);

        if (
          holidayDate.getFullYear() === now.getFullYear() &&
          holidayDate.getMonth() === now.getMonth() &&
          holidayDate.getDate() === now.getDate()
        ) {
          msg = `${capitalize(holiday.holiday)} on tänään.`;
        } else if (days < 0) {
          msg = `${capitalize(holiday.holiday)} oli jo ${Math.abs(
            days,
          )} päivää ja ${Math.abs(hours)} tuntia sitten.`;
        } else {
          msg = `${capitalize(
            holiday.holiday,
          )} ${days} päivää, ${hours} tuntia, ${minutes} minuuttia ja ${seconds} sekuntia.`;
        }

        const holidaysEl = query("p.holidays");
        if (holidaysEl && msg !== "" && msg !== null)
          holidaysEl.innerText = msg;
      };

      if (holiday.bool) {
        const holidaysEl = query("p.holidays");
        if (holidaysEl) {
          holidaysEl.classList.remove("invisible");
          updateHolidayMessage();
          setInterval(updateHolidayMessage, 1000);
        }
      }
    }
  }
};

main.once = false;
document.addEventListener("astro:page-load", main);
$(document).ready(() => {
  main();
  global();
});
