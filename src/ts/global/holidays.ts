import posthog from "posthog-js";

import { type Lang, type translations, useTranslations } from "@/i18n";
import { detectLanguage, getTemporal } from "@/ts/global";

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

const Temporal = await getTemporal();

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

const year = Temporal.Now.plainDateISO().year;
const fmt = (m: number, d: number, y = year) =>
  Temporal.PlainDate.from({ year: y, month: m, day: d }).toZonedDateTime("UTC").epochMilliseconds;

const holidays = [
  holiday(
    trans.holiday.halloween,
    fmt(10, 1),
    fmt(11, 10),
    () => import("@/ts/global/holidays/halloween.ts").then((m) => m.main_halloween),
    fmt(10, 31),
  ),
  holiday(
    trans.holiday.christmas,
    fmt(11, 30),
    fmt(12, 25),
    () => import("@/ts/global/holidays/christmas.ts").then((m) => m.christmas),
    fmt(12, 24),
  ),
  holiday(
    trans.holiday.newyear,
    fmt(12, 26),
    fmt(1, 8, year + 1),
    () => import("@/ts/global/holidays/newYear.ts").then((m) => m.newYear),
    fmt(12, 31),
  ),
] satisfies readonly Holiday[];

export async function isHoliday(): Promise<IsHolidayReturn> {
  const now = Temporal.Now.instant().epochMilliseconds;

  if (posthog.featureFlags.isFeatureEnabled("holiday-effects")) {
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
  }

  return noHoliday;
}

interface HolidayTime extends Duration {
  time: string;
}

export function holidayTimeTo(targetTime: number): HolidayTime {
  const nowMs = Temporal.Now.instant().epochMilliseconds;
  const diff = Math.max(0, targetTime - nowMs);

  const totalSeconds = Math.floor(diff / 1000);

  const timeParts: Duration = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
  };

  type UnitFormatters = {
    day: Intl.NumberFormat;
    hour: Intl.NumberFormat;
    minute: Intl.NumberFormat;
    second: Intl.NumberFormat;
  };

  var unitFormatters: UnitFormatters = {
    day: new Intl.NumberFormat(detectLanguage(), {
      style: "unit",
      unit: "day",
      unitDisplay: "narrow",
    }),
    hour: new Intl.NumberFormat(detectLanguage(), {
      style: "unit",
      unit: "hour",
      unitDisplay: "narrow",
    }),
    minute: new Intl.NumberFormat(detectLanguage(), {
      style: "unit",
      unit: "minute",
      unitDisplay: "narrow",
    }),
    second: new Intl.NumberFormat(detectLanguage(), {
      style: "unit",
      unit: "second",
      unitDisplay: "narrow",
    }),
  };

  function formatUnit(value: number, unit: keyof UnitFormatters) {
    return unitFormatters[unit].format(value);
  }

  const remaining = Array.from({ length: 7 });
  const separator = " ";

  var parts = 0;
  remaining[0] = timeParts.days > 0 ? formatUnit(timeParts.days, "day") : null;
  if (remaining[0]) parts++;
  remaining[1] = parts ? separator : null;
  remaining[2] = parts || timeParts.hours > 0 ? formatUnit(timeParts.hours, "hour") : null;
  if (remaining[2]) parts++;
  remaining[3] = parts ? separator : null;
  remaining[4] = parts || timeParts.minutes > 0 ? formatUnit(timeParts.minutes, "minute") : null;
  if (remaining[4]) parts++;
  remaining[5] = parts ? separator : null;
  remaining[6] = formatUnit(timeParts.seconds, "second");

  return {
    time: remaining.join(""),
    ...timeParts,
  };
}
