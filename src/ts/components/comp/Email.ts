import { query } from '@/ts/global';

export const email = (holiday: any) => {
  if (holiday.changeFont && holiday.changeFont !== undefined) query('a.email-link').classList.remove('email-font');
}