import dayjs from 'dayjs';
//import isBetween from 'dayjs/plugin/isBetween';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import localizedFormat from 'dayjs/plugin/localizedFormat';
// import 'dayjs/locale/fi';
//import duration from 'dayjs/plugin/duration';

const dynamic_import = {
	duration: (await import('dayjs/plugin/duration')).default,
	isBetween: (await import('dayjs/plugin/isBetween')).default,
};

// holidays
import { main_halloween } from '@/ts/holidays';

// dayjs.extend(relativeTime);
// dayjs.extend(localizedFormat);

dayjs.extend(dynamic_import.isBetween);
dayjs.extend(dynamic_import.duration);
const today = dayjs();

export function isHoliday(data?: (HTMLElement | string)[] | string[]) {
	const days_in_december = dayjs(`${today.year()}-12-12`).daysInMonth();

	if (dayjs().isBetween(`2024-10-1`, `2024-11-10`, 'day', '[]')) {
		return {
			bool: true,
			holiday: 'halloween',
			script: main_halloween(data),
			timeto: `${today.year()}-10-31`,
		};
	} else if (
		today.isBetween(
			`${today.year()}-12-21`,
			`${today.year()}-12-${days_in_december}`,
			'day',
			'[]'
		)
	) {
		return {
			bool: true,
			holiday: 'chrismas',
		};
	} else if (
		today.isBetween(`${today.year()}-12-20`, `${today.year() + 1}-00-10 00:00`, 'day', '[]')
	) {
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
		// Create a duration object from the difference
		const timeDuration = dayjs.duration(dayjs(targetDate).diff(dayjs()));

		// Extract days, hours, minutes, and seconds from the duration
		const days = Math.floor(timeDuration.asDays());
		const hours = timeDuration.hours();
		const minutes = timeDuration.minutes();
		const seconds = timeDuration.seconds();

		return {
			days,
			hours,
			minutes,
			seconds,
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
