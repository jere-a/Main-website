import { describe, expect, it } from "vitest";

import { catchErrorTyped } from "./async";

describe("catchErrorTyped", () => {
  it("returns [undefined, value] on success", async () => {
    const result = await catchErrorTyped(Promise.resolve(42));
    expect(result).toEqual([undefined, 42]);
  });

  it("returns [error] on rejection without filter", async () => {
    const error = new Error("boom");
    const result = await catchErrorTyped(Promise.reject(error));
    expect(result).toEqual([error]);
  });

  it("catches matching error types when filter provided", async () => {
    const typeError = new TypeError("bad type");
    const result = await catchErrorTyped(Promise.reject(typeError), [TypeError]);
    expect(result).toEqual([typeError]);
  });

  it("re-throws non-matching error types when filter provided", async () => {
    const rangeError = new RangeError("out of range");
    await expect(catchErrorTyped(Promise.reject(rangeError), [TypeError])).rejects.toThrow(
      "out of range",
    );
  });

  it("catches multiple error types in filter", async () => {
    const rangeError = new RangeError("out of range");
    const result = await catchErrorTyped(Promise.reject(rangeError), [TypeError, RangeError]);
    expect(result).toEqual([rangeError]);
  });

  it("re-throws when error matches none in filter", async () => {
    const custom = new Error("custom");
    await expect(catchErrorTyped(Promise.reject(custom), [TypeError, RangeError])).rejects.toThrow(
      "custom",
    );
  });

  it("returns [undefined, T] with complex types", async () => {
    const data = { items: [1, 2, 3], count: 3 };
    const result = await catchErrorTyped(Promise.resolve(data));
    expect(result).toEqual([undefined, data]);
  });

  it("returns [undefined, undefined] when the promise resolves to undefined", async () => {
    const result = await catchErrorTyped(Promise.resolve(undefined));
    expect(result).toEqual([undefined, undefined]);
  });

  it("returns the rejected non-Error value when no filter is provided", async () => {
    const result = await catchErrorTyped(Promise.reject("string error"));
    expect(result).toEqual(["string error"]);
  });

  it("re-throws non-Error rejections when a filter is provided", async () => {
    await expect(catchErrorTyped(Promise.reject("string error"), [TypeError])).rejects.toBe(
      "string error",
    );
  });

  it("re-throws all errors when the filter is an empty array", async () => {
    await expect(catchErrorTyped(Promise.reject(new Error("x")), [])).rejects.toThrow("x");
  });
});
