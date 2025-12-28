import { language } from "./globals";
import { christmas, newYear, main_halloween } from "./holidays/index";

class ExtendedDate extends Date {
  isBetween(start: string, end: string): boolean {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this >= startDate && this <= endDate;
  }
}

const today = new ExtendedDate();
const currentYear = today.getFullYear();

const transModule = await import("@/i18n");
const { useTranslations, ui, defaultLang } = transModule;
const trans = useTranslations(language() in ui ? language() : defaultLang);

const pad = (num: number) => num.toString().padStart(2, "0");

const getFormattedDate = (
  month: number,
  day: number,
  year: number = currentYear,
) => `${year}-${pad(month)}-${pad(day)}`;

const holidays = [
  {
    name: "halloween",
    from: getFormattedDate(10, 1),
    to: getFormattedDate(11, 10),
    script: main_halloween(),
    timeto: getFormattedDate(10, 31),
  },
  {
    name: () => trans("holiday.christmas"),
    from: getFormattedDate(11, 30),
    to: getFormattedDate(12, 25),
    script: christmas(),
    timeto: getFormattedDate(12, 24),
  },
  {
    name: () => trans("holiday.newyear"),
    from: getFormattedDate(12, 26),
    to: getFormattedDate(1, 8, currentYear + 1),
    script: newYear(),
    timeto: getFormattedDate(12, 31),
  },
];

export async function isHoliday() {
  for (const holiday of holidays) {
    if (today.isBetween(holiday.from, holiday.to)) {
      return {
        bool: true,
        holiday:
          typeof holiday.name === "function" ? holiday.name() : holiday.name,
        script: holiday.script(),
        timeto: holiday.timeto,
      };
    }
  }

  return {
    bool: false,
    holiday: "",
    timeto: "",
  };
}

export function holidayTimeTo(
  targetDate = `${currentYear}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`,
) {
  const diff = new Date(targetDate).getTime() - today.getTime();

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
