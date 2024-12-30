export const email = (holiday: any, query: any) => {
  if (holiday.changeFont && holiday.changeFont !== undefined) query('a.email-link').classList.remove('email-font');
}