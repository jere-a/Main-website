import posthog from "posthog-js";
import { language } from "./globals";

class ExtendedDate extends Date {
  isBetween(start: string, end: string): boolean {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this >= startDate && this <= endDate;
  }
}

const today = new ExtendedDate();
const currentYear = today.getFullYear();

const { useTranslations, ui, defaultLang } = await import("@/i18n");
const trans = useTranslations(language() in ui ? language() : defaultLang);

const getFormattedDate = (
  month: number,
  day: number,
  year: number = currentYear,
) => `${year}-${month}-${day}`;

const holidays = [
  {
    name: "halloween",
    from: getFormattedDate(10, 1),
    to: getFormattedDate(11, 10),
    script: async () => {
      (await import("@/ts/global/holidays/halloween.ts")).main_halloween;
    },
    timeto: getFormattedDate(10, 31),
  },
  {
    name: () => trans("holiday.christmas"),
    from: getFormattedDate(11, 30),
    to: getFormattedDate(12, 25),
    script: async () => {
      (await import("@/ts/global/holidays/christmas.ts")).christmas;
    },
    timeto: getFormattedDate(12, 24),
  },
  {
    name: () => trans("holiday.newyear"),
    from: getFormattedDate(12, 26),
    to: getFormattedDate(1, 8, currentYear + 1),
    script: async () => {
      (await import("@/ts/global/holidays/newYear.ts")).newYear;
    },
    timeto: getFormattedDate(12, 31),
  },
];

export async function isHoliday(_data?: (HTMLElement | string)[] | string[]) {
  for (const holiday of holidays) {
    if (posthog.isFeatureEnabled("holiday-effects")) {
      if (today.isBetween(holiday.from, holiday.to)) {
        posthog.capture("holiday_enabled", {
          name:
            typeof holiday.name === "function" ? holiday.name() : holiday.name,
          timeto: holiday.timeto,
        });
        return {
          bool: true,
          holiday:
            typeof holiday.name === "function" ? holiday.name() : holiday.name,
          script:
            typeof holiday.script === "function" ? holiday.script : () => {},
          timeto: holiday.timeto,
        };
      }
    }
  }

  return {
    bool: false,
    holiday: "",
    script: () => {},
    timeto: "",
  };
}

export function holidayTimeTo(
  targetDate: string = `${currentYear}-${
    today.getMonth() + 1
  }-${today.getDate()}`,
) {
  const diff = new Date(targetDate).getTime() - today.getTime();

  const msToDuration = (ms: number) => ({
    days: Math.floor(ms / (1000 * 60 * 60 * 24)),
    hours: Math.floor((ms / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((ms / (1000 * 60)) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  });

  return msToDuration(diff);
}
