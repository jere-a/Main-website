import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { holiday, defaultLang, useTranslations } from '@/i18n';
import { language } from './globals';

// holidays
import * as holidays from '@/ts/holidays';

dayjs.extend(isBetween);
const today = dayjs();
const trans = useTranslations(language() in holiday ? language() as keyof typeof holiday : defaultLang);

export function isHoliday(data?: (HTMLElement | string)[] | string[]) {
	const daysInDecember =
		today.year() === today.year() ? today.date(12).daysInMonth() : today.date(12).daysInMonth();
	
	if (today.isBetween(`${today.year()}-10-01`, `${today.year()}-11-10`, 'day', '[]')) {
		return {
			bool: true,
			holiday: 'halloween',
			script: holidays.main_halloween(data),
			timeto:
				today.year() === today.year()
					? dayjs(`${today.year()}-10-31`).format('YYYY-MM-DD')
					: dayjs(`${today.year()}-10-31`).format('YYYY-MM-DD'),
		};
	} else if (
		today.isBetween(`${today.year()}-11-30`, `${today.year()}-12-${daysInDecember}`, 'day', '[]')
	) {
		return {
			bool: true,
			holiday: `${trans('holiday.christmas')}`,
			script: holidays.christmas(),
			timeto: today.year() === today.year() ? dayjs(`${today.year()}-12-24`).format('YYYY-MM-DD') : dayjs(`${today.year()}-12-24`).format('YYYY-MM-DD')
		};
	} else if (today.isBetween(`${today.year()}-12-20`, `${today.year() + 1}-01-10`, 'day', '[]')) {
		return {
			bool: true,
			holiday: 'newyear',
		};
	} else {
		return {
			bool: false,
			holiday: '',
		};
	}
}

export function holidayTimeTo(targetdate: string | undefined) {
	const time = (
		targetDate: string | undefined = `${today.year()}-${today.month()}-${today.day()}`
	) => {
	  const time = dayjs(targetDate).diff(dayjs());
		return {
			days: Math.floor(time / (1000 * 60 * 60 * 24)),
			hours: Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			minutes: Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)),
			seconds: Math.floor((time % (1000 * 60)) / 1000),
		};
	};

	return {
		timeto: {
			days: time(targetdate).days,
			hours: time(targetdate).hours,
			minutes: time(targetdate).minutes,
			seconds: time(targetdate).seconds,
		},
	};
}
