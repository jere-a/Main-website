/**
 * Await a promise and return a typed tuple: [undefined, T] on success, [Error] on failure.
 * Optionally filter which error types to catch; re-throws others.
 */
type ErrorConstructor = abstract new (...args: never[]) => Error;

export function catchErrorTyped<T>(
  promise: Promise<T>,
): Promise<[error: unknown] | [error: undefined, data: T]>;

export function catchErrorTyped<T, E extends readonly ErrorConstructor[]>(
  promise: Promise<T>,
  errorsToCatch: E,
): Promise<[error: InstanceType<E[number]>] | [error: undefined, data: T]>;

export async function catchErrorTyped<T, E extends readonly ErrorConstructor[]>(
  promise: Promise<T>,
  errorsToCatch?: E,
) {
  try {
    return [undefined, await promise] as const;
  } catch (error) {
    if (!errorsToCatch || errorsToCatch.some((ErrorType) => error instanceof ErrorType)) {
      return [error] as const;
    }

    throw error;
  }
}
