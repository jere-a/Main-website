import { describe, expect, it } from "vitest";

import {
  isType,
  isString,
  isNumber,
  isBoolean,
  isBigInt,
  isSymbol,
  isFunction,
  isObject,
  assertType,
  exists,
  assertExists,
  assertNever,
  assertString,
  assertNumber,
  assertBoolean,
  assertBigInt,
  assertSymbol,
  assertFunction,
  assertObject,
} from "./typecheck";

type IsTest = readonly [
  name: string,
  is: (value: unknown) => boolean,
  valid: readonly unknown[],
  invalid: readonly unknown[],
];

const isTests: readonly IsTest[] = [
  ["String", isString, ["", "hello", String.raw`template`], [0, null, undefined, true, {}]],
  ["Number", isNumber, [0, -0, 42, 3.14, NaN, Infinity], ["0", null, undefined]],
  ["Boolean", isBoolean, [true, false], [0, 1, "true", null]],
  ["BigInt", isBigInt, [0n, 9007199254740993n, -1n], [0, "0"]],
  ["Symbol", isSymbol, [Symbol(), Symbol.for("key")], ["symbol", undefined]],
  [
    "Function",
    isFunction,
    [
      () => {},
      function () {},
      // oxlint-disable-next-line typescript/no-extraneous-class
      class {},
      Math.max,
      async () => {},
      function* () {},
    ],
    [{}, null, "function"],
  ],
  ["Object", isObject, [{}, [], new Date(), /regex/], [null, undefined, 0, "", true]],
];

describe.each(isTests)("is%s", (_, is, valid, invalid) => {
  it.each(valid)("returns true for %s", (value) => {
    expect(is(value)).toBe(true);
  });

  it.each(invalid)("returns false for %s", (value) => {
    expect(is(value)).toBe(false);
  });
});

describe("isType", () => {
  it.each([
    ["hello", "string"],
    [42, "number"],
    [true, "boolean"],
    [0n, "bigint"],
    [Symbol(), "symbol"],
    [undefined, "undefined"],
    [() => {}, "function"],
    [{}, "object"],
    [null, "object"],
    [NaN, "number"],
    [Infinity, "number"],
    [-0, "number"],
  ] as const)("recognizes %s as %s", (value, type) => {
    expect(isType(value, type)).toBe(true);
  });

  it.each([
    [42, "string"],
    ["hello", "number"],
    [undefined, "string"],
    [{}, "function"],
    [0, "bigint"],
  ] as const)("rejects %s as %s", (value, type) => {
    expect(isType(value, type)).toBe(false);
  });
});

describe("exists", () => {
  it.each([0, "", false, [], {}])("returns true for %s", (value) => {
    expect(exists(value)).toBe(true);
  });

  it.each([null, undefined])("returns false for %s", (value) => {
    expect(exists(value)).toBe(false);
  });
});

type AssertTest = readonly [
  name: string,
  assert: (value: unknown, message?: string | Error) => unknown,
  valid: readonly unknown[],
  invalid: readonly unknown[],
];

const assertTests: readonly AssertTest[] = [
  ["String", (value) => assertString(value), ["hello", ""], [42, {}, null, true]],
  ["Number", (value) => assertNumber(value), [0, NaN, 42], ["42", {}, null, true]],
  ["Boolean", (value) => assertBoolean(value), [true, !0, false, !1], [1, 0, "String"]],
  ["BigInt", (value) => assertBigInt(value), [0n], [0, "String", true]],
  ["Symbol", (value) => assertSymbol(value), [Symbol()], ["sym"]],
  ["Function", (value) => assertFunction(value), [() => {}], [{}]],
  ["Object", (value) => assertObject(value), [{}, []], [0, "", true, null]],
];

describe.each(assertTests)("assert%s", (_, assert, valid, invalid) => {
  it.each(valid)("accepts %s", (value) => {
    expect(() => assert(value)).not.toThrow();
  });

  it.each(invalid)("rejects %s with TypeError", (value) => {
    expect(() => assert(value)).toThrow(TypeError);
  });
});

describe("assertType", () => {
  it.each([
    ["hello", "string"],
    [42, "number"],
    [true, "boolean"],
  ] as const)("accepts %s as %s", (value, type) => {
    expect(() => assertType(value, type)).not.toThrow();
  });

  it.each([
    [42, "string"],
    [42, "undefined"],
  ] as const)("rejects %s as %s", (value, type) => {
    expect(() => assertType(value, type)).toThrow(TypeError);
    expect(() => assertType(value, type)).toThrow(`Expected ${type}.`);
  });

  it("supports a custom string message", () => {
    expect(() => assertType(42, "string", "bad type")).toThrow("bad type");
  });

  it("throws a provided Error directly", () => {
    const error = new RangeError("custom");
    expect(() => assertType(42, "string", error)).toThrow(error);
    expect(() => assertType(42, "string", error)).toThrow(RangeError);
  });
});

describe("assertExists", () => {
  it.each([0, "", false, [], {}])("accepts %s", (value) => {
    expect(() => assertExists(value)).not.toThrow();
  });

  it.each([null, undefined])("rejects %s with TypeError", (value) => {
    expect(() => assertExists(value)).toThrow(TypeError);
  });

  it("uses the default message", () => {
    expect(() => assertExists(null)).toThrow("Expected value to exist.");
  });

  it("supports a custom string message", () => {
    expect(() => assertExists(null, "missing")).toThrow("missing");
  });

  it("throws a provided Error directly", () => {
    const error = new Error("gone");
    expect(() => assertExists(null, error)).toThrow(error);
  });
});

describe("assertNever", () => {
  it.each([
    [null, "null"],
    [42, "42"],
    ["x", "x"],
    [undefined, "undefined"],
  ] as const)("throws for %s", (value, expected) => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    expect(() => assertNever(value as never)).toThrow(`Unexpected value: ${expected}`);
  });
});

describe("assertObject", () => {
  it("uses the expected default message", () => {
    expect(() => assertObject(null)).toThrow("Expected object.");
  });

  it("throws a provided Error directly", () => {
    const error = new Error("not an object");
    expect(() => assertObject(null, error)).toThrow(error);
  });
});
