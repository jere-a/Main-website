import posthog from "posthog-js";
import { language } from "./globals";

type HolidayScript = () => Promise<unknown>;

type Holiday = {
  name: string | (() => string);
  from: string;
  to: string;
  script: HolidayScript;
  timeto: string;
};

type IsHolidayReturn = {
  bool: boolean;
  holiday: string;
  script: HolidayScript;
  timeto: string;
};

type Duration = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const today = new Date();
const currentYear = today.getFullYear();

const { useTranslations, ui, defaultLang } = await import("@/i18n");

// biome-ignore lint/correctness/useHookAtTopLevel: Not a React hook
const trans = useTranslations(language() in ui ? language() : defaultLang);

const fmt = (m: number, d: number, y = currentYear) => `${y}-${m}-${d}`;

const holidays: Holiday[] = [
  {
    name: "halloween",
    from: fmt(10, 1),
    to: fmt(11, 10),
    script: async () =>
      (await import("@/ts/global/holidays/halloween.ts")).main_halloween,
    timeto: fmt(10, 31),
  },
  {
    name: () => trans("holiday.christmas"),
    from: fmt(11, 30),
    to: fmt(12, 25),
    script: async () =>
      (await import("@/ts/global/holidays/christmas.ts")).christmas,
    timeto: fmt(12, 24),
  },
  {
    name: () => trans("holiday.newyear"),
    from: fmt(12, 26),
    to: fmt(1, 8, currentYear + 1),
    script: async () =>
      (await import("@/ts/global/holidays/newYear.ts")).newYear,
    timeto: fmt(12, 31),
  },
];

const isBetween = (d: string, start: string, end: string) => {
  const date = new Date(d).getTime();
  return date >= new Date(start).getTime() && date <= new Date(end).getTime();
};

export async function isHoliday(
  _data?: (HTMLElement | string | undefined)[] | (string | undefined)[],
): Promise<IsHolidayReturn> {
  if (!posthog.isFeatureEnabled("holiday-effects")) {
    return { bool: false, holiday: "", script: async () => {}, timeto: "" };
  }

  for (const h of holidays) {
    if (isBetween(today.toISOString(), h.from, h.to)) {
      const name = typeof h.name === "function" ? h.name() : h.name;
      posthog.capture("holiday_enabled", { name, timeto: h.timeto });
      return { bool: true, holiday: name, script: h.script, timeto: h.timeto };
    }
  }

  return { bool: false, holiday: "", script: async () => {}, timeto: "" };
}

export function holidayTimeTo(targetDate?: string): Duration {
  const d = targetDate ? new Date(targetDate).getTime() : today.getTime();
  const diff = d - today.getTime();
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
