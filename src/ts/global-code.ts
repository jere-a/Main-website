import {
  addEventListener,
  isHoliday,
  PrefersReducedMotion,
} from "./global/index";

const main = () => {
  addEventListener(
    document.body,
    "contextmenu",
    (e) => {
      e.preventDefault();
    },
    "img, picture",
  );

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
