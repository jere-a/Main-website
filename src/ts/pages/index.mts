const main = async () => {
  if (!main.once) {
    main.once = true;
    const { language, isHoliday, query, holidayTimeTo, capitalize } = await import('@/ts/global');
    const { formatDistanceToNowStrict, isEqual } = (await import('date-fns'));
    const { enUS, fi } = (await import('date-fns/locale'));
  
    const holiday = (await isHoliday([
      query('.main'),
      query('.instructions'),
      query('p.holidays'),
      '.navItem',
    ]));
  
    query('.how_old').textContent = ` Tämä sivu on tällä hetkellä ${formatDistanceToNowStrict(new Date(2024, 5, 27), {
      locale: language() === 'fi' ? fi : enUS
    })} vanha.`;
  
    const updateHolidayMessage = async () => {
      let { days, hours, minutes, seconds } = holidayTimeTo(holiday.timeto);
      let msg: string;
      
      if (isEqual(Date.parse(holiday.timeto), new Date())) {
        msg = `${capitalize(holiday.holiday)} on tänään.`;
      } else if (days < 0) {
        msg = `${capitalize(holiday.holiday)} oli jo ${Math.abs(days)} päivää ja ${Math.abs(hours)} tuntia sitten.`;
      } else {
        msg = `${capitalize(holiday.holiday)} ${days} päivää, ${hours} tuntia, ${minutes} minuuttia ja ${seconds} sekuntia.`;
      }
      
      if (msg !== '' || msg !== null) query('p.holidays').innerText = msg;
    };

  
    if (holiday.bool) {
      query('p.holidays').classList.remove('invisible');
      holiday.script;
      updateHolidayMessage();
      setInterval(updateHolidayMessage, 1000);
    }
  }
};

main.once = false;

document.addEventListener('astro:page-load', main);
document.addEventListener('DOMContentLoaded', main);