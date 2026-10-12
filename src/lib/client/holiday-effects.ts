/** Subscribe to the active-holiday store and run each holiday's effect exactly once. */

import { $holiday } from "@utils/index";

export const loadHolidayEffect = (): (() => void) => {
  let currentKey: string | null = null;

  return $holiday.subscribe((holiday) => {
    if (!holiday || holiday.key === currentKey) {
      return;
    }

    currentKey = holiday.key;
    void holiday.runScript();
  });
};
