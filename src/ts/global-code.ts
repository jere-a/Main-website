import { addEventListener, isHoliday } from "./global/index";

const main = () => {
  addEventListener(
    document.body,
    "contextmenu",
    (e) => {
      e.preventDefault();
    },
    "img, picture",
  );

  window.addEventListener("vite:preloadError", (event) => {
    window.location.reload();
  });

  const runHolidayEffects = async () => {
    const holiday = await isHoliday();
    if (holiday.bool) {
      holiday.script();
    }
  };
  runHolidayEffects();
};

export default main;
