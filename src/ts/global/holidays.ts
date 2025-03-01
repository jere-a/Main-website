import { language } from './globals';

class date extends Date {
  isBetween(startDate: string, endDate: string): boolean {
    const startDateValue = new Date(startDate);
    const endDateValue = new Date(endDate);

    return this >= startDateValue && this <= endDateValue;
  }
}

const today = new date();
const currentYear = today.getFullYear();
const trans = await import('@/i18n').then(module => module.useTranslations(language() in module.ui ? language() : module.defaultLang));

export async function isHoliday(data?: (HTMLElement | string)[] | string[]) {
  const getFormattedDate = (month: number, day: number, year: number = currentYear) => `${year}-${month}-${day}`;

  const holidayParams = (new URL(window.location.href).searchParams.get('h') || '').toLowerCase();

  switch (true) {
    case today.isBetween(getFormattedDate(10, 1), getFormattedDate(11, 10)):
      return { 
        bool: true,
        holiday: 'halloween', 
        script: import('@/ts/global/holidays/halloween').then(module => module.main_halloween),
        changeFont: true,
        timeto: `${getFormattedDate(10, 31)}`
      };
    case today.isBetween(getFormattedDate(11, 30), getFormattedDate(2, 31, currentYear + 1)):
      return { 
        bool: true,
        holiday: trans('holiday.christmas'), 
        script: import('@/ts/global/holidays/christmas').then(module => module.christmas),
        timeto: `${getFormattedDate(12, 24)}`
      };
    case today.isBetween(getFormattedDate(12, 26), getFormattedDate(1, 8, currentYear + 1)):
      return { 
        bool: true,
        holiday: trans('holiday.newyear'), 
        script: import('@/ts/global/holidays/newYear').then(module => module.newYear),
        timeto: `${getFormattedDate(12, 31)}`
      };
    default:
      return {
        bool: false,
        holiday: '',
        timeto: ''
      }
  }
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
