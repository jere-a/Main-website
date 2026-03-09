import { type Lang, type translations, useTranslations } from "@/i18n";
import { detectLanguage } from "@/ts/global";

type HolidayLabels = (typeof translations)[Lang]["holiday"];
type HolidayLabel = HolidayLabels[keyof HolidayLabels];

type HolidayScript = () => Promise<unknown>;
type Holiday = {
  name: HolidayLabel;
  from: number;
  to: number;
  script: HolidayScript;
  timeto: number;
};
type IsHolidayReturn = {
  bool: boolean;
  holiday: string;
  script: HolidayScript;
  timeto: number;
};
type Duration = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const emptyScript: HolidayScript = async () => {};
const noHoliday: IsHolidayReturn = {
  bool: false,
  holiday: "",
  script: emptyScript,
  timeto: 0,
};

const holiday = (
  name: HolidayLabel,
  from: number,
  to: number,
  loader: () => Promise<void | (() => Promise<void>)>,
  timeto: number,
) => ({
  name,
  from,
  to,
  script: loader,
  timeto,
});

// biome-ignore lint/correctness/useHookAtTopLevel: Not a React hook
const trans = useTranslations(detectLanguage());

const year = new Date().getFullYear();
const fmt = (m: number, d: number, y = year) => Date.UTC(y, m - 1, d);

const holidays = [
  holiday(
    trans.holiday.halloween,
    fmt(10, 1),
    fmt(11, 10),
    () =>
      import("@/ts/global/holidays/halloween.ts").then((m) => m.main_halloween),
    fmt(10, 31),
  ),
  holiday(
    "christmas",
    fmt(11, 30),
    fmt(12, 25),
    () => import("@/ts/global/holidays/christmas.ts").then((m) => m.christmas),
    fmt(12, 24),
  ),
  holiday(
    "newyear",
    fmt(12, 26),
    fmt(1, 8, year + 1),
    () => import("@/ts/global/holidays/newYear.ts").then((m) => m.newYear),
    fmt(12, 31),
  ),
] satisfies readonly Holiday[];

export async function isHoliday(): Promise<IsHolidayReturn> {
  const now = Date.now();

  for (const h of holidays) {
    if (now >= h.from && now <= h.to) {
      return {
        bool: true,
        holiday: h.name,
        script: h.script,
        timeto: h.timeto,
      };
    }
  }

  return noHoliday;
}

export function holidayTimeTo(targetTime: number): Duration {
  const diff = Math.max(0, targetTime - Date.now());
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
  };
}
