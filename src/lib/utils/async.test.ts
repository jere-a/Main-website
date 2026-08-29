import { describe, expect, it } from "vitest";

import { catchErrorTyped } from "./async";

class FooError extends Error {}
class BarError extends Error {}

describe("catchErrorTyped", () => {
  it("returns [undefined, value] when the promise resolves", async () => {
    const result = await catchErrorTyped(Promise.resolve(42));

    expect(result).toEqual([undefined, 42]);
  });

  it("returns the rejected error when errorsToCatch is omitted", async () => {
    const error = new FooError("foo");

    const result = await catchErrorTyped(Promise.reject(error));

    expect(result).toEqual([error]);
    expect(result[0]).toBe(error);
  });

  it("returns the rejected error when its type matches", async () => {
    const error = new FooError("foo");

    const result = await catchErrorTyped(Promise.reject(error), [FooError]);

    expect(result).toEqual([error]);
    expect(result[0]).toBe(error);
  });

  it("rethrows the error when its type does not match", async () => {
    const error = new BarError("bar");

    await expect(catchErrorTyped(Promise.reject(error), [FooError])).rejects.toBe(error);
  });

  it("matches any error constructor in errorsToCatch", async () => {
    const error = new BarError("bar");

    const result = await catchErrorTyped(Promise.reject(error), [FooError, BarError]);

    expect(result).toEqual([error]);
    expect(result[0]).toBe(error);
  });

  it("rethrows when errorsToCatch is empty", async () => {
    const error = new FooError("foo");

    await expect(catchErrorTyped(Promise.reject(error), [])).rejects.toBe(error);
  });

  it("matches subclasses through instanceof", async () => {
    class ChildFooError extends FooError {}

    const error = new ChildFooError("child");

    const result = await catchErrorTyped(Promise.reject(error), [FooError]);

    expect(result).toEqual([error]);
  });

  it("preserves the original error instance", async () => {
    const error = new Error("original");

    const result = await catchErrorTyped(Promise.reject(error));

    expect(result[0]).toBe(error);
  });

  it.each([
    ["string", "hello"],
    ["number", 42],
    ["object", { value: 123 }],
    ["null", null],
    ["undefined", undefined],
  ])("preserves resolved %s values", async (_, value) => {
    const result = await catchErrorTyped(Promise.resolve(value));

    expect(result).toEqual([undefined, value]);
  });
});
