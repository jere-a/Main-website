import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type FakeDate = {
  year: number;
  month: number;
  day: number;
  toZonedDateTime: () => { epochMilliseconds: number };
};

function makeDate(date: { year: number; month: number; day: number }): FakeDate {
  return {
    ...date,
    toZonedDateTime: () => ({
      epochMilliseconds: Date.UTC(date.year, date.month - 1, date.day),
    }),
  };
}

const h = vi.hoisted(() => {
  const state = {
    today: { year: 2026, month: 10, day: 15 },
    nowMs: Date.UTC(2026, 9, 15, 12, 0, 0),
    flags: new Map<string, boolean>([["holiday-effects", true]]),
  };

  const temporal = {
    PlainDate: {
      from: (date: { year: number; month: number; day: number }) => makeDate(date),
      compare: (a: FakeDate, b: FakeDate) => {
        const an = a.year * 10000 + a.month * 100 + a.day;
        const bn = b.year * 10000 + b.month * 100 + b.day;
        return an - bn;
      },
    },
    Now: {
      plainDateISO: () => makeDate(state.today),
      instant: () => ({ epochMilliseconds: state.nowMs }),
    },
  };

  return {
    state,
    onFeatureFlags: vi.fn<(cb: () => void) => void>((cb: () => void) => cb()),
    isFeatureEnabled: vi.fn<(flag: string) => boolean>(
      (flag: string) => state.flags.get(flag) ?? false,
    ),
    getTemporal: vi.fn<() => Promise<unknown>>(async () => temporal),
    useTranslations: vi.fn<(lang: string) => Promise<{ holiday: Record<string, string> }>>(
      async () => ({
        holiday: { halloween: "Halloween", christmas: "Christmas", newyear: "New Year" },
      }),
    ),
    halloween: vi.fn<() => Promise<void>>(async () => undefined),
    christmas: vi.fn<() => Promise<void>>(async () => undefined),
    newYear: vi.fn<() => Promise<void>>(async () => undefined),
  };
});

vi.mock("@lib/analytics", () => ({
  default: {
    onFeatureFlags: h.onFeatureFlags,
    isFeatureEnabled: h.isFeatureEnabled,
  },
}));

vi.mock("@/lib/utils/temporal", () => ({
  getTemporal: h.getTemporal,
}));

vi.mock("@/i18n/index.ts", () => ({
  useTranslations: h.useTranslations,
}));

vi.mock("./halloween.ts", () => ({ halloween: h.halloween }));
vi.mock("./christmas.ts", () => ({ christmas: h.christmas }));
vi.mock("./newYear.ts", () => ({ newYear: h.newYear }));

import { $holiday, $holidayTime, isHoliday } from "./index";

const dayMs = 86_400_000;
const hourMs = 3_600_000;
const minuteMs = 60_000;

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

describe("holidays", () => {
  beforeEach(() => {
    h.state.today = { year: 2026, month: 10, day: 15 };
    h.state.nowMs = Date.UTC(2026, 9, 15, 12, 0, 0);
    h.state.flags.set("holiday-effects", true);
    h.useTranslations.mockReset();
    h.useTranslations.mockImplementation(async () => ({
      holiday: { halloween: "Halloween", christmas: "Christmas", newyear: "New Year" },
    }));
    h.halloween.mockClear();
    h.christmas.mockClear();
    h.newYear.mockClear();
  });

  afterEach(() => {
    $holiday.set(null);
    $holidayTime.set(null);
    document.documentElement.lang = "";
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  describe("isHoliday", () => {
    it("returns null when the holiday-effects flag is disabled", async () => {
      h.state.flags.set("holiday-effects", false);

      expect(await isHoliday()).toBeNull();
    });

    it("returns halloween when today is inside its season", async () => {
      const holiday = await isHoliday();

      expect(holiday?.key).toBe("halloween");
      expect(holiday?.name).toBe("Halloween");
      expect(holiday?.from).toBe(Date.UTC(2026, 9, 1));
      expect(holiday?.to).toBe(Date.UTC(2026, 10, 10));
      expect(holiday?.timeto).toBe(Date.UTC(2026, 9, 31));
      expect(typeof holiday?.loadScript).toBe("function");
      expect(typeof holiday?.runScript).toBe("function");
    });

    it("runs the halloween effect script", async () => {
      const holiday = await isHoliday();

      await holiday?.runScript();

      expect(h.halloween).toHaveBeenCalledTimes(1);
    });

    it("returns christmas when today is inside its season", async () => {
      h.state.today = { year: 2026, month: 12, day: 24 };

      const holiday = await isHoliday();

      expect(holiday?.key).toBe("christmas");
      expect(holiday?.name).toBe("Christmas");
      expect(holiday?.from).toBe(Date.UTC(2026, 10, 30));
      expect(holiday?.to).toBe(Date.UTC(2026, 11, 25));
      expect(holiday?.timeto).toBe(Date.UTC(2026, 11, 24));

      await holiday?.runScript();
      expect(h.christmas).toHaveBeenCalledTimes(1);
    });

    it("returns newyear in January using the previous season year", async () => {
      h.state.today = { year: 2027, month: 1, day: 3 };

      const holiday = await isHoliday();

      expect(holiday?.key).toBe("newyear");
      expect(holiday?.name).toBe("New Year");
      expect(holiday?.from).toBe(Date.UTC(2026, 11, 26));
      expect(holiday?.to).toBe(Date.UTC(2027, 0, 8));
      expect(holiday?.timeto).toBe(Date.UTC(2026, 11, 31));

      await holiday?.runScript();
      expect(h.newYear).toHaveBeenCalledTimes(1);
    });

    it("returns null outside the holiday season", async () => {
      h.state.today = { year: 2026, month: 7, day: 15 };

      expect(await isHoliday()).toBeNull();
    });

    it("returns null between the halloween and christmas seasons", async () => {
      h.state.today = { year: 2026, month: 11, day: 20 };

      expect(await isHoliday()).toBeNull();
    });

    it.each([
      ["halloween", 2026, 10, 1],
      ["halloween", 2026, 11, 10],
      ["christmas", 2026, 11, 30],
      ["christmas", 2026, 12, 25],
      ["newyear", 2026, 12, 26],
      ["newyear", 2027, 1, 8],
    ])("is active on the season boundary %s %i-%i-%i", async (key, year, month, day) => {
      h.state.today = { year, month, day };

      expect((await isHoliday())?.key).toBe(key);
    });
  });

  describe("labels", () => {
    let freshIsHoliday: () => Promise<unknown>;

    beforeEach(async () => {
      vi.resetModules();
      const mod = await import("./index");
      freshIsHoliday = mod.isHoliday;
    });

    it("caches labels across calls in the same language", async () => {
      h.state.today = { year: 2026, month: 10, day: 15 };

      await freshIsHoliday();
      await freshIsHoliday();

      expect(h.useTranslations).toHaveBeenCalledTimes(1);
      expect(h.useTranslations).toHaveBeenCalledWith("en");
    });

    it("reloads labels when the language changes", async () => {
      h.state.today = { year: 2026, month: 10, day: 15 };

      await freshIsHoliday();
      document.documentElement.lang = "fi";
      await freshIsHoliday();

      expect(h.useTranslations).toHaveBeenCalledTimes(2);
      expect(h.useTranslations).toHaveBeenNthCalledWith(1, "en");
      expect(h.useTranslations).toHaveBeenNthCalledWith(2, "fi");
    });
  });

  describe("holidayTimeTo", () => {
    let nf: ReturnType<
      typeof vi.fn<(lang: string, opts: { unit: string }) => { format: (value: number) => string }>
    >;
    let freshHolidayTimeTo: (targetTime: number) => Countdown;

    beforeEach(async () => {
      nf = vi.fn<(lang: string, opts: { unit: string }) => { format: (value: number) => string }>(
        function (_lang: string, opts: { unit: string }) {
          return { format: (value: number) => `${opts.unit}:${value}` };
        },
      );
      vi.stubGlobal("Intl", { ...Intl, NumberFormat: nf });
      vi.resetModules();
      const mod = await import("./index");
      freshHolidayTimeTo = mod.holidayTimeTo;
    });

    it("formats a full countdown with every unit", () => {
      const target = h.state.nowMs + (2 * dayMs + 3 * hourMs + 4 * minuteMs + 5 * 1000);

      expect(freshHolidayTimeTo(target)).toEqual({
        days: 2,
        hours: 3,
        minutes: 4,
        seconds: 5,
      });
    });

    it("shows hours when days are zero", () => {
      const target = h.state.nowMs + 3 * hourMs;

      expect(freshHolidayTimeTo(target)).toMatchObject({
        days: 0,
        hours: 3,
        minutes: 0,
        seconds: 0,
      });
    });

    it("shows seconds only when the target is under a minute away", () => {
      const target = h.state.nowMs + 5 * 1000;

      expect(freshHolidayTimeTo(target)).toMatchObject({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 5,
      });
    });

    it("clamps a past target to zero seconds", () => {
      const target = h.state.nowMs - 60_000;

      expect(freshHolidayTimeTo(target)).toMatchObject({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });
  });

  describe("$holiday store", () => {
    it("sets the active holiday when subscribed", async () => {
      vi.useFakeTimers();
      const unsub = $holiday.subscribe(() => {});

      await vi.advanceTimersByTimeAsync(0);

      expect($holiday.get()?.key).toBe("halloween");
      unsub();
      vi.advanceTimersByTime(1000);
    });

    it("stays null when unsubscribed before resolution", async () => {
      vi.useFakeTimers();
      let resolveTranslations!: (value: { holiday: Record<string, string> }) => void;
      const pending = new Promise<{ holiday: Record<string, string> }>((resolve) => {
        resolveTranslations = resolve;
      });
      h.useTranslations.mockImplementation(() => pending);
      document.documentElement.lang = "fi";

      const unsub = $holiday.subscribe(() => {});
      unsub();
      vi.advanceTimersByTime(1000);
      await vi.advanceTimersByTimeAsync(0);
      expect(h.useTranslations).toHaveBeenCalledWith("fi");

      resolveTranslations({
        holiday: { halloween: "Halloween", christmas: "Christmas", newyear: "New Year" },
      });
      await vi.advanceTimersByTimeAsync(0);

      expect($holiday.get()).toBeNull();
    });
  });

  describe("$holidayTime store", () => {
    it("updates every second while a holiday is active", async () => {
      vi.useFakeTimers();
      const unsub = $holidayTime.subscribe(() => {});

      await vi.advanceTimersByTimeAsync(0);
      const first = $holidayTime.get();
      expect(first).not.toBeNull();

      h.state.nowMs = Date.UTC(2026, 9, 14, 12, 0, 0);
      vi.advanceTimersByTime(1000);

      expect($holidayTime.get()?.days).toBe((first?.days ?? 0) + 1);

      unsub();
      vi.advanceTimersByTime(1000);
      expect(vi.getTimerCount()).toBe(0);
    });

    it("stays null when no holiday is active", async () => {
      h.state.flags.set("holiday-effects", false);
      vi.useFakeTimers();
      const unsub = $holidayTime.subscribe(() => {});

      await vi.advanceTimersByTimeAsync(0);

      expect($holidayTime.get()).toBeNull();

      unsub();
      vi.advanceTimersByTime(1000);
      expect(vi.getTimerCount()).toBe(0);
    });
  });
});
