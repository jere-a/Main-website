export { email } from './comp/Email';
export { imghold } from './comp/ImageHolder';

const { query, isHoliday } = (await import('@/ts/global'));
const { IsHolidayBool } = (await import('@/ts/stores'));
const holidayfunc = async (data?: any) => {
  (await isHoliday(data));
};
import { email, imghold } from '.';

export const mainAllComponents = (component: string) => {
  IsHolidayBool.subscribe(holiday => {
	if (holiday.bool) {
	  switch (component) {
			case 'email':
        email(holiday, query);
        break;
      case 'imghold':
        imghold(holidayfunc(['h2.title', 'p.body']));
        break;
    };
	}})
};