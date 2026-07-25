type AnyFunction = (...args: never[]) => unknown;

interface TypeMap {
  string: string;
  number: number;
  boolean: boolean;
  bigint: bigint;
  symbol: symbol;
  undefined: undefined;
  function: AnyFunction;
  object: object;
}

type PrimitiveType = keyof TypeMap;

/** Checks if a value matches a JavaScript typeof type. */
export function isType<T extends PrimitiveType>(value: unknown, type: T): value is TypeMap[T] {
  return typeof value === type;
}

export const isString = (value: unknown): value is string => isType(value, "string");

export const isNumber = (value: unknown): value is number => isType(value, "number");

export const isBoolean = (value: unknown): value is boolean => isType(value, "boolean");

export const isBigInt = (value: unknown): value is bigint => isType(value, "bigint");

export const isSymbol = (value: unknown): value is symbol => isType(value, "symbol");

export const isFunction = (value: unknown): value is AnyFunction => isType(value, "function");

export const isObject = (value: unknown): value is object =>
  value !== null && isType(value, "object");

/** Asserts that a value matches a JavaScript typeof type. */
export function assertType<T extends PrimitiveType>(
  value: unknown,
  type: T,
  error: string | Error = `Expected ${type}.`,
): asserts value is TypeMap[T] {
  if (isType(value, type)) {
    return;
  }

  throw isString(error) ? new TypeError(error) : error;
}

/** Checks if a value is not null or undefined. */
export function exists<T>(value: T | null | undefined): value is T {
  return value != null;
}

/** Asserts that a value is not null or undefined. */
export function assertExists<T>(
  value: T | null | undefined,
  error: string | Error = "Expected value to exist.",
): asserts value is T {
  if (exists(value)) {
    return;
  }

  throw isString(error) ? new TypeError(error) : error;
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export const assertString = (value: unknown, error?: string | Error): asserts value is string =>
  assertType(value, "string", error);

export const assertNumber = (value: unknown, error?: string | Error): asserts value is number =>
  assertType(value, "number", error);

export const assertBoolean = (value: unknown, error?: string | Error): asserts value is boolean =>
  assertType(value, "boolean", error);

export const assertBigInt = (value: unknown, error?: string | Error): asserts value is bigint =>
  assertType(value, "bigint", error);

export const assertSymbol = (value: unknown, error?: string | Error): asserts value is symbol =>
  assertType(value, "symbol", error);

export const assertFunction = (
  value: unknown,
  error?: string | Error,
): asserts value is AnyFunction => assertType(value, "function", error);

export const assertObject = (
  value: unknown,
  error: string | Error = "Expected object.",
): asserts value is object => {
  if (!isObject(value)) {
    throw isString(error) ? new TypeError(error) : error;
  }
};
