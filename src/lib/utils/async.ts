/** Async utilities for client-side code. */

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
