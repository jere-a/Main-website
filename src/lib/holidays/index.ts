import posthog from "@lib/analytics";
import { atom, onMount } from "nanostores";

// oxlint-disable promise/prefer-await-to-then
import { type DefaultSchema, type Lang, useTranslations } from "@/i18n/index.ts";
import { detectLanguage } from "@/lib/utils/language.ts";

type HolidayLabels = DefaultSchema["holiday"];
type HolidayKey = keyof HolidayLabels;
type HolidayLabel = HolidayLabels[HolidayKey];

type HolidayEffect = () => void | Promise<void>;
type HolidayLoader = () => Promise<HolidayEffect>;

type HolidayDate = readonly [month: number, day: number, yearOffset?: number];

type HolidayDef = {
  key: HolidayKey;
  range: readonly [from: HolidayDate, to: HolidayDate];
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
    range: [
      [10, 1],
      [11, 10],
    ],
    target: [10, 31],
    load: () => import("./halloween.ts").then((m) => m.halloween),
  },
  {
    key: "christmas",
    range: [
      [11, 30],
      [12, 25],
    ],
    target: [12, 24],
    load: () => import("./christmas.ts").then((m) => m.christmas),
  },
  {
    key: "newyear",
    range: [
      [12, 26],
      [1, 8, 1],
    ],
    target: [12, 31],
    load: () => import("./newYear.ts").then((m) => m.newYear),
  },
] as const satisfies readonly HolidayDef[];

let labelLang: Lang | undefined;
let labelCache: HolidayLabels | undefined;

const labels = async (): Promise<HolidayLabels> => {
  const lang = detectLanguage();

  if (labelLang === lang && labelCache) {
    return labelCache;
  }

  labelLang = lang;
  labelCache = (await useTranslations(lang)).holiday;

  return labelCache;
};

const plainDate = ([month, day, offset = 0]: HolidayDate, year: number) =>
  Temporal.PlainDate.from({
    year: year + offset,
    month,
    day,
  });

const epochMs = (date: Temporal.PlainDate): number => date.toZonedDateTime("UTC").epochMilliseconds;

const featureFlagsReady = new Promise<void>((resolve) => {
  posthog.onFeatureFlags(() => resolve());
});

const findHoliday = (today: Temporal.PlainDate, year: number) => {
  for (const holiday of holidays) {
    const [from, to] = holiday.range;
    const target = plainDate(holiday.target, year);
    const start = plainDate(from, year);
    const end = plainDate(to, year);

    if (
      Temporal.PlainDate.compare(today, start) >= 0 &&
      Temporal.PlainDate.compare(today, end) <= 0
    ) {
      return { holiday, from: start, to: end, target };
    }
  }

  return null;
};

export async function isHoliday(): Promise<ActiveHoliday | null> {
  await featureFlagsReady;

  if (!posthog.isFeatureEnabled("holiday-effects")) {
    return null;
  }

  const today = Temporal.Now.plainDateISO();
  const year = today.month === 1 ? today.year - 1 : today.year;
  const holiday = findHoliday(today, year);

  if (!holiday) {
    return null;
  }

  const holidayLabels = await labels();

  return {
    key: holiday.holiday.key,
    name: holidayLabels[holiday.holiday.key],
    from: epochMs(holiday.from),
    to: epochMs(holiday.to),
    timeto: epochMs(holiday.target),
    loadScript: holiday.holiday.load,
    runScript: async () => (await holiday.holiday.load())(),
  };
}

type Duration = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function holidayTimeTo(targetTime: number): Duration {
  let seconds = Math.max(
    0,
    Math.floor((targetTime - Temporal.Now.instant().epochMilliseconds) / 1000),
  );

  const days = Math.floor(seconds / 86400);
  seconds %= 86400;

  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;

  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  const duration = { days, hours, minutes, seconds };

  return { ...duration };
}

export const $holiday = atom<ActiveHoliday | null>(null);

onMount($holiday, () => {
  let cancelled = false;

  // oxlint-disable-next-line promise/always-return
  void isHoliday().then((holiday) => {
    if (!cancelled) $holiday.set(holiday);
  });

  return () => {
    cancelled = true;
  };
});

export const $holidayTime = atom<Duration | null>(null);

onMount($holidayTime, () => {
  let timer: number | undefined;

  // oxlint-disable-next-line promise/always-return
  void isHoliday().then((holiday) => {
    if (!holiday) {
      $holidayTime.set(null);
      return;
    }

    const update = () => {
      $holidayTime.set(holidayTimeTo(holiday.timeto));
    };

    update();
    timer = window.setInterval(update, 1000);
  });

  return () => {
    if (timer !== undefined) clearInterval(timer);
  };
});
