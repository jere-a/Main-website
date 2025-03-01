import { atom } from 'nanostores';

export const IsHolidayBool = atom<{
    bool: boolean;
    holiday: string;
    changeFont: boolean | undefined;
}, {}>({
  bool: false,
  holiday: '',
  changeFont: false,
});