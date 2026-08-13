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

describe("isType", () => {
  it("returns true for matching primitive types", () => {
    expect(isType("hello", "string")).toBe(true);
    expect(isType(42, "number")).toBe(true);
    expect(isType(true, "boolean")).toBe(true);
    expect(isType(BigInt(0), "bigint")).toBe(true);
    expect(isType(Symbol("a"), "symbol")).toBe(true);
    expect(isType(undefined, "undefined")).toBe(true);
    expect(isType(() => {}, "function")).toBe(true);
    expect(isType({}, "object")).toBe(true);
  });

  it("returns false for mismatched types", () => {
    expect(isType(42, "string")).toBe(false);
    expect(isType("hello", "number")).toBe(false);
    expect(isType(undefined, "string")).toBe(false);
    expect(isType({}, "function")).toBe(false);
    expect(isType(0, "bigint")).toBe(false);
  });

  it("typeof null is 'object' in JS", () => {
    expect(isType(null, "object")).toBe(true);
  });

  it("handles special number values", () => {
    expect(isType(NaN, "number")).toBe(true);
    expect(isType(Infinity, "number")).toBe(true);
    expect(isType(-0, "number")).toBe(true);
  });
});

describe("isString", () => {
  it("returns true for strings", () => {
    expect(isString("")).toBe(true);
    expect(isString("hello")).toBe(true);
    expect(isString(String.raw`template`)).toBe(true);
  });

  it("returns false for non-strings", () => {
    expect(isString(0)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString({})).toBe(false);
  });
});

describe("isNumber", () => {
  it("returns true for numbers including special values", () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-0)).toBe(true);
    expect(isNumber(42)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
    expect(isNumber(-Infinity)).toBe(true);
    expect(isNumber(NaN)).toBe(true);
  });

  it("returns false for non-numbers", () => {
    expect(isNumber("0")).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
  });
});

describe("isBoolean", () => {
  it("returns true for booleans", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  it("returns false for non-booleans", () => {
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean("true")).toBe(false);
    expect(isBoolean(null)).toBe(false);
  });
});

describe("isBigInt", () => {
  it("returns true for bigints", () => {
    expect(isBigInt(BigInt(0))).toBe(true);
    expect(isBigInt(9007199254740993n)).toBe(true);
    expect(isBigInt(BigInt(-1))).toBe(true);
  });

  it("returns false for non-bigints", () => {
    expect(isBigInt(0)).toBe(false);
    expect(isBigInt("0")).toBe(false);
  });
});

describe("isSymbol", () => {
  it("returns true for symbols", () => {
    expect(isSymbol(Symbol())).toBe(true);
    expect(isSymbol(Symbol.for("key"))).toBe(true);
  });

  it("returns false for non-symbols", () => {
    expect(isSymbol("symbol")).toBe(false);
    expect(isSymbol(undefined)).toBe(false);
  });
});

describe("isFunction", () => {
  it("returns true for functions", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    // oxlint-disable-next-line typescript/no-extraneous-class
    expect(isFunction(class {})).toBe(true);
    expect(isFunction(Math.max)).toBe(true);
    expect(isFunction(async () => {})).toBe(true);
    expect(isFunction(function* () {})).toBe(true);
  });

  it("returns false for non-functions", () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction("function")).toBe(false);
  });
});

describe("isObject", () => {
  it("returns true for objects and arrays (not null)", () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(new Date())).toBe(true);
    expect(isObject(/regex/)).toBe(true);
  });

  it("returns false for null, primitives", () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(0)).toBe(false);
    expect(isObject("")).toBe(false);
    expect(isObject(true)).toBe(false);
  });
});

describe("assertType", () => {
  it("does not throw for matching type", () => {
    expect(() => assertType("hello", "string")).not.toThrow();
    expect(() => assertType(42, "number")).not.toThrow();
    expect(() => assertType(true, "boolean")).not.toThrow();
  });

  it("throws TypeError with default message for mismatch", () => {
    expect(() => assertType(42, "string")).toThrow(TypeError);
    expect(() => assertType(42, "string")).toThrow("Expected string.");
    expect(() => assertType(42, "undefined")).toThrow("Expected undefined.");
  });

  it("throws TypeError with custom string message", () => {
    expect(() => assertType(42, "string", "bad type")).toThrow(TypeError);
    expect(() => assertType(42, "string", "bad type")).toThrow("bad type");
  });

  it("throws provided Error object directly", () => {
    const custom = new RangeError("custom");
    expect(() => assertType(42, "string", custom)).toThrow(custom);
    expect(() => assertType(42, "string", custom)).toThrow(RangeError);
  });
});

describe("exists", () => {
  it("returns true for defined values", () => {
    expect(exists(0)).toBe(true);
    expect(exists("")).toBe(true);
    expect(exists(false)).toBe(true);
    expect(exists([])).toBe(true);
    expect(exists({})).toBe(true);
  });

  it("returns false for null and undefined", () => {
    expect(exists(null)).toBe(false);
    expect(exists(undefined)).toBe(false);
  });
});

describe("assertExists", () => {
  it("does not throw for defined values", () => {
    expect(() => assertExists(0)).not.toThrow();
    expect(() => assertExists("")).not.toThrow();
    expect(() => assertExists(false)).not.toThrow();
  });

  it("throws TypeError for null", () => {
    expect(() => assertExists(null)).toThrow(TypeError);
  });

  it("throws TypeError for undefined", () => {
    expect(() => assertExists(undefined)).toThrow(TypeError);
  });

  it("uses default error message", () => {
    expect(() => assertExists(null)).toThrow("Expected value to exist.");
  });

  it("uses custom string error message", () => {
    expect(() => assertExists(null, "missing")).toThrow("missing");
  });

  it("throws provided Error object directly", () => {
    const err = new Error("gone");
    expect(() => assertExists(null, err)).toThrow(err);
  });
});

describe("assertNever", () => {
  it("always throws", () => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    expect(() => assertNever(null as never)).toThrow("Unexpected value: null");
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    expect(() => assertNever(42 as never)).toThrow("Unexpected value: 42");
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    expect(() => assertNever("x" as never)).toThrow("Unexpected value: x");
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    expect(() => assertNever(undefined as never)).toThrow("Unexpected value: undefined");
  });
});

describe("assertString", () => {
  it("does not throw for strings", () => {
    expect(() => assertString("hello")).not.toThrow();
    expect(() => assertString("")).not.toThrow();
  });

  it("throws for non-strings", () => {
    expect(() => assertString(42)).toThrow(TypeError);
  });
});

describe("assertNumber", () => {
  it("does not throw for numbers", () => {
    expect(() => assertNumber(0)).not.toThrow();
    expect(() => assertNumber(NaN)).not.toThrow();
  });

  it("throws for non-numbers", () => {
    expect(() => assertNumber("42")).toThrow(TypeError);
  });
});

describe("assertBoolean", () => {
  it("does not throw for booleans", () => {
    expect(() => assertBoolean(true)).not.toThrow();
    expect(() => assertBoolean(false)).not.toThrow();
  });

  it("throws for non-booleans", () => {
    expect(() => assertBoolean(1)).toThrow(TypeError);
  });
});

describe("assertBigInt", () => {
  it("does not throw for bigints", () => {
    expect(() => assertBigInt(BigInt(0))).not.toThrow();
  });

  it("throws for non-bigints", () => {
    expect(() => assertBigInt(0)).toThrow(TypeError);
  });
});

describe("assertSymbol", () => {
  it("does not throw for symbols", () => {
    expect(() => assertSymbol(Symbol())).not.toThrow();
  });

  it("throws for non-symbols", () => {
    expect(() => assertSymbol("sym")).toThrow(TypeError);
  });
});

describe("assertFunction", () => {
  it("does not throw for functions", () => {
    expect(() => assertFunction(() => {})).not.toThrow();
  });

  it("throws for non-functions", () => {
    expect(() => assertFunction({})).toThrow(TypeError);
  });
});

describe("assertObject", () => {
  it("does not throw for objects and arrays", () => {
    expect(() => assertObject({})).not.toThrow();
    expect(() => assertObject([])).not.toThrow();
  });

  it("throws for primitives", () => {
    expect(() => assertObject(0)).toThrow(TypeError);
    expect(() => assertObject("")).toThrow(TypeError);
    expect(() => assertObject(true)).toThrow(TypeError);
    expect(() => assertObject(null)).toThrow("Expected object.");
  });

  it("throws provided Error object directly", () => {
    const err = new Error("not an object");
    expect(() => assertObject(null, err)).toThrow(err);
  });
});
