import posthog from "posthog-js";
import { type Lang, translations, useTranslations } from "@/i18n";

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

const empty: HolidayScript = async () => {};
const noHoliday: IsHolidayReturn = {
  bool: false,
  holiday: "",
  script: empty,
  timeto: "",
};

const isLang = (x: string): x is Lang => x in translations;
const langAttr = document.documentElement.lang.toLowerCase();
const lang = (
  isLang(langAttr)
    ? langAttr
    : isLang(langAttr.split("-")[0])
      ? langAttr.split("-")[0]
      : "en"
) as Lang;

// biome-ignore lint/correctness/useHookAtTopLevel: Not a React hook
const trans = useTranslations(lang);

const y = new Date().getFullYear();
const p2 = (n: number) => `${n}`.padStart(2, "0");
const fmt = (m: number, d: number, yr = y) => `${yr}-${p2(m)}-${p2(d)}`;

const holidays = [
  {
    name: "halloween",
    from: fmt(10, 1),
    to: fmt(11, 10),
    script: () =>
      import("@/ts/global/holidays/halloween.ts").then((m) => m.main_halloween),
    timeto: fmt(10, 31),
  },
  {
    name: () => trans.holiday.christmas,
    from: fmt(11, 30),
    to: fmt(12, 25),
    script: () =>
      import("@/ts/global/holidays/christmas.ts").then((m) => m.christmas),
    timeto: fmt(12, 24),
  },
  {
    name: () => trans.holiday.newyear,
    from: fmt(12, 26),
    to: fmt(1, 8, y + 1),
    script: () =>
      import("@/ts/global/holidays/newYear.ts").then((m) => m.newYear),
    timeto: fmt(12, 31),
  },
] satisfies readonly Holiday[];

export async function isHoliday(
  _data?: (HTMLElement | string | undefined)[] | (string | undefined)[],
): Promise<IsHolidayReturn> {
  if (!posthog.isFeatureEnabled("holiday-effects")) return noHoliday;

  const now = Date.now();
  for (const h of holidays) {
    if (now >= Date.parse(h.from) && now <= Date.parse(h.to)) {
      const holiday = typeof h.name === "function" ? h.name() : h.name;
      posthog.capture("holiday_enabled", { name: holiday, timeto: h.timeto });
      return { bool: true, holiday, script: h.script, timeto: h.timeto };
    }
  }
  return noHoliday;
}

export function holidayTimeTo(targetDate?: string): Duration {
  const now = Date.now();
  const s = Math.floor(
    ((targetDate ? Date.parse(targetDate) : now) - now) / 1e3,
  );
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor(s / 3600) % 24,
    minutes: Math.floor(s / 60) % 60,
    seconds: s % 60,
  };
}
