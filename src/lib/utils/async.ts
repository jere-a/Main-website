/** Async and timing utilities for client-side code. */

/**
 * Throttle an async callback so it runs at most once per `delay` ms. If called while throttled,
 * only the latest args are kept.
 */
export const throttle = <Args extends Array<unknown>>(
  cb: (...args: Args) => void | Promise<void>,
  delay = 1000,
) => {
  let waiting: Args | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return async (...args: Args) => {
    if (timer) {
      waiting = args;
      return;
    }
    await cb(...args);
    timer = setTimeout(() => {
      void (async () => {
        timer = null;
        if (waiting) {
          await catchErrorTyped(Promise.resolve(cb(...waiting)));
          waiting = null;
        }
      })();
    }, delay);
  };
};

/**
 * Await a promise and return a typed tuple: [undefined, T] on success, [Error] on failure.
 * Optionally filter which error types to catch; re-throws others.
 */
export async function catchErrorTyped<T, E extends new (message?: string) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[],
): Promise<[undefined, T] | [InstanceType<E>]> {
  try {
    const data = await promise;
    return [undefined, data] as [undefined, T];
  } catch (error) {
    if (errorsToCatch === undefined || errorsToCatch.some((e) => error instanceof e)) {
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return [error] as [InstanceType<E>];
    }
    throw error;
  }
}
