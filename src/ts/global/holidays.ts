import posthog from "posthog-js";

import { type DefaultSchema, type Lang, useTranslations } from "@/i18n";
import { detectLanguage, getTemporal } from "@/ts/global";

const Temporal = await getTemporal();

type HolidayLabels = DefaultSchema["holiday"];
type HolidayKey = keyof HolidayLabels;
type HolidayLabel = HolidayLabels[HolidayKey];

type HolidayEffect = () => void | Promise<void>;
type HolidayLoader = () => Promise<HolidayEffect>;

type HolidayDate = readonly [month: number, day: number, yearOffset?: number];

type HolidayDef = {
  key: HolidayKey;
  from: HolidayDate;
  to: HolidayDate;
  target: HolidayDate;
  load: HolidayLoader;
};

export type ActiveHoliday = {
  key: HolidayKey;
  name: HolidayLabel;
  from: number;
  to: number;
  timeto: number;
  loadScript: HolidayLoader;
  runScript: () => Promise<void>;
};

const holidays = [
  {
    key: "halloween",
    from: [10, 1],
    to: [11, 10],
    target: [10, 31],
    load: () => import("@/ts/global/holidays/halloween.ts").then((m) => m.main_halloween),
  },
  {
    key: "christmas",
    from: [11, 30],
    to: [12, 25],
    target: [12, 24],
    load: () => import("@/ts/global/holidays/christmas.ts").then((m) => m.christmas),
  },
  {
    key: "newyear",
    from: [12, 26],
    to: [1, 8, 1],
    target: [12, 31],
    load: () => import("@/ts/global/holidays/newYear.ts").then((m) => m.newYear),
  },
] as const satisfies readonly HolidayDef[];

let labelLang: Lang | undefined;
let labelCache: HolidayLabels | undefined;

const labels = async (): Promise<HolidayLabels> => {
  const lang = detectLanguage();

  if (labelCache && labelLang === lang) {
    return labelCache;
  }

  labelLang = lang;
  labelCache = (await useTranslations(lang)).holiday;

  return labelCache;
};

const dateMs = ([month, day, offset = 0]: HolidayDate, year: number): number =>
  Temporal.PlainDate.from({ year: year + offset, month, day }).toZonedDateTime("UTC")
    .epochMilliseconds;

export async function isHoliday(): Promise<ActiveHoliday | null> {
  if (!posthog.featureFlags.isFeatureEnabled("holiday-effects")) {
    return null;
  }

  const now = Temporal.Now.instant().epochMilliseconds;
  const today = Temporal.Now.plainDateISO();

  // Important: in January, we are still inside the previous New Year season.
  const seasonYear = today.month === 1 ? today.year - 1 : today.year;

  for (const h of holidays) {
    const from = dateMs(h.from, seasonYear);
    const to = dateMs(h.to, seasonYear);

    if (now >= from && now <= to) {
      const holidayLabels = await labels();

      return {
        key: h.key,
        name: holidayLabels[h.key],
        from,
        to,
        timeto: dateMs(h.target, seasonYear),
        loadScript: h.load,
        runScript: async () => {
          const script = await h.load();
          await script();
        },
      };
    }
  }

  return null;
}

type Duration = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

interface HolidayTime extends Duration {
  time: string;
}

type Unit = "day" | "hour" | "minute" | "second";
type UnitFormatters = Record<Unit, Intl.NumberFormat>;

const unitOptions = {
  style: "unit",
  unitDisplay: "narrow",
} as const;

let formatterLang: Lang | undefined;
let formatters: UnitFormatters | undefined;

const getFormatters = (): UnitFormatters => {
  const lang = detectLanguage();

  if (formatters && formatterLang === lang) return formatters;

  formatterLang = lang;

  formatters = {
    day: new Intl.NumberFormat(lang, { ...unitOptions, unit: "day" }),
    hour: new Intl.NumberFormat(lang, { ...unitOptions, unit: "hour" }),
    minute: new Intl.NumberFormat(lang, { ...unitOptions, unit: "minute" }),
    second: new Intl.NumberFormat(lang, { ...unitOptions, unit: "second" }),
  };

  return formatters;
};

export function holidayTimeTo(targetTime: number): HolidayTime {
  const totalSeconds = Math.floor(
    Math.max(0, targetTime - Temporal.Now.instant().epochMilliseconds) / 1000,
  );

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  const f = getFormatters();

  let time = "";

  if (days) time = f.day.format(days);
  if (time || hours) time += `${time ? " " : ""}${f.hour.format(hours)}`;
  if (time || minutes) time += `${time ? " " : ""}${f.minute.format(minutes)}`;
  time += `${time ? " " : ""}${f.second.format(seconds)}`;

  return {
    time,
    days,
    hours,
    minutes,
    seconds,
  };
}
