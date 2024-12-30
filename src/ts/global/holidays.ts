import { defaultLang, ui, useTranslations } from '@/i18n';
import { IsHolidayBool } from '@/ts/stores';
import { compareAsc } from 'date-fns/compareAsc';
import { language } from './globals';

class date extends Date {
  isBetween(startDate: string, endDate: string): boolean {
    const a = new Date();
    const p = Date.parse;
    
    if (compareAsc(a, p(startDate)) >= 0 && compareAsc(a, p(endDate)) <= 0) {
      return true;
    } else {
      return false;
    }
  }
}

const today = new date();
const currentYear = today.getFullYear();
const trans = useTranslations(language() in ui ? language() : defaultLang);

export async function isHoliday(data?: (HTMLElement | string)[] | string[]) {
  const getFormattedDate = (month: number, day: number) => `${currentYear}-${month}-${day}`;

  const holidayParams = (new URL(window.location.href).searchParams.get('h') || '').toLowerCase();

  const holidayData = [
    {
      range: [`${getFormattedDate(10, 1)}`, `${getFormattedDate(11, 10)}`],
      name: 'halloween',
      script: (await import('@/ts/holidays/halloween')).main_halloween,
      changeFont: true,
      timeto: `${getFormattedDate(10, 31)}`,
    },
    {
      range: [`${getFormattedDate(11, 30)}`, `${getFormattedDate(12, 25)}`],
      name: trans('holiday.christmas'),
      script: (await import('@/ts/holidays/christmas')).christmas,
      timeto: `${getFormattedDate(12, 24)}`,
    },
    {
      range: [`${getFormattedDate(12, 26)}`, `${currentYear + 1}-01-08`],
      name: trans('holiday.newyear'),
      script: (await import('@/ts/holidays/newYear')).NewYear,
      timeto: `${getFormattedDate(12, 31)}`
    },
  ];
  for (const { range, name, script, changeFont = false, timeto } of holidayData) {
    if (today.isBetween(range[0], range[1])) {
      IsHolidayBool.set({
        bool: true,
        holiday: '',
        changeFont
      });
      return {
        bool: true,
        holiday: name,
        script: script(data),
        changeFont,
        timeto,
      };
    }
  }

  return {
    bool: false,
    holiday: '',
    timeto: ''
  };
}

export function holidayTimeTo(targetDate: string = `${currentYear}-${today.getMonth() + 1}-${today.getDate()}`) {
  let diff: number = new Date(targetDate).getTime() - today.getTime();
  let toDuration = (ms: number) => ({
    days: Math.floor(ms / (1000 * 60 * 60 * 24)),
    hours: Math.floor((ms / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((ms / (1000 * 60)) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  });

  return toDuration(diff);
}
