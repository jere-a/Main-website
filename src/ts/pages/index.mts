import { siteConfig } from "@/config";
import { capitalize, holidayTimeTo, isHoliday, query } from "@/ts/global";
import global from "@/ts/global-code";

const main = async () => {
  if (!main.once) {
    main.once = true;
    //const { language, isHoliday, query, holidayTimeTo, capitalize } = await import(
    //	'@/ts/global'
    //);
    // const { formatDistanceToNowStrict, isEqual } = await import('date-fns');
    // const { enUS, fi } = await import('date-fns/locale');

    if (siteConfig.params.functions.holidayEffects) {
      const holiday = await isHoliday([
        query(".main"),
        query(".instructions"),
        query("p.holidays"),
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

        if (msg !== "" || msg !== null) query("p.holidays").innerText = msg;
      };

      if (holiday.bool) {
        query("p.holidays").classList.remove("invisible");
        holiday.script;
        updateHolidayMessage();
        setInterval(updateHolidayMessage, 1000);
      }
    }
  }
};

main.once = false;
global();
document.addEventListener("astro:page-load", main);
document.addEventListener("DOMContentLoaded", main);
