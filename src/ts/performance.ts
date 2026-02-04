const startTimeMap: Map<string, number> = new Map();

export const timeStart = (funcName: string): void => {
  startTimeMap.set(funcName, performance.now());
};

export const timeStop = (funcName: string): void => {
  const startTime = startTimeMap.get(funcName);

  if (startTime === undefined) {
    console.error(`Function '${funcName}' has not been started yet.`);
    return;
  }

  const duration = performance.now() - startTime;
  console.log(`Call to '${funcName}' took ${duration.toFixed(2)} milliseconds`);

  // Cleanup after timing is done
  startTimeMap.delete(funcName);
};

export const withTiming =
  (funcName: string, func: func) =>
  (...args: any[]) => {
    timeStart(funcName);
    const result = func(...args);
    timeStop(funcName);
    return result;
  };
