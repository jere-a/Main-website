import { describe, expect, it } from "vitest";
import { ajaxSchema, ParamSchema } from "./types.d";

describe("ajaxSchema", () => {
  it("accepts valid POST request", () => {
    const valid = {
      type: "POST" as const,
      url: "https://example.com/api",
      data: {},
    };
    const result = ajaxSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts valid GET request", () => {
    const valid = {
      type: "GET" as const,
      url: "https://example.com/api",
      data: {},
    };
    const result = ajaxSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects invalid type", () => {
    const invalid = { type: "PUT", url: "https://example.com/api", data: {} };
    const result = ajaxSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects invalid URL", () => {
    const invalid = { type: "GET", url: "not-a-url", data: {} };
    const result = ajaxSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const invalid = { type: "POST" };
    const result = ajaxSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("ParamSchema", () => {
  it("accepts string selector", () => {
    expect(ParamSchema.safeParse(".class").success).toBe(true);
    expect(ParamSchema.safeParse("#id").success).toBe(true);
    expect(ParamSchema.safeParse("div").success).toBe(true);
  });

  it("accepts null", () => {
    expect(ParamSchema.safeParse(null).success).toBe(true);
  });

  it("accepts undefined", () => {
    expect(ParamSchema.safeParse(undefined).success).toBe(true);
  });

  it("rejects invalid types", () => {
    expect(ParamSchema.safeParse(123).success).toBe(false);
    expect(ParamSchema.safeParse(true).success).toBe(false);
    expect(ParamSchema.safeParse({}).success).toBe(false);
  });
});
