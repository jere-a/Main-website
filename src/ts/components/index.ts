import { query, isHoliday } from '@/ts/global';
// const { IsHolidayBool } = (await import('@/ts/stores'));
import { IsHolidayBool } from '@/ts/stores';
import { email, imghold } from './comp';
import global from '@/ts/global-code';

const holidayfunc = async (data?: any) => {
  (await isHoliday(data));
};

export const mainAllComponents = async (component: string) => {
  global();
  IsHolidayBool.subscribe(holiday => {
	if (holiday.bool) {
	  switch (component) {
			case 'email':
        email(holiday);
        break;
      case 'imghold':
        imghold(holidayfunc(['h2.title', 'p.body']));
        break;
    };
	}})
};