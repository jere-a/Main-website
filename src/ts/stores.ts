import { atom } from "nanostores";

export const issplashcursor = atom(false);
export const isPrefersReducedMotion = atom(false);

export const IsHolidayBool = atom<
  {
    bool: boolean;
    holiday: string;
    changeFont: boolean | undefined;
  },
  {}
>({
  bool: false,
  holiday: "",
  changeFont: false,
});
