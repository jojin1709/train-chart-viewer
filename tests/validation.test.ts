import { describe, it, expect } from "vitest";
import {
  trainNumberSchema,
  journeyDateSchema,
  stationCodeSchema,
  chartRequestSchema,
} from "@/lib/validation/schemas";

describe("trainNumberSchema", () => {
  it("accepts valid numeric train numbers", () => {
    expect(trainNumberSchema.safeParse("22648").success).toBe(true);
    expect(trainNumberSchema.safeParse("123").success).toBe(true);
  });
  it("rejects non-numeric or malformed train numbers", () => {
    expect(trainNumberSchema.safeParse("abc").success).toBe(false);
    expect(trainNumberSchema.safeParse("12").success).toBe(false);
    expect(trainNumberSchema.safeParse("<script>").success).toBe(false);
  });
});

describe("journeyDateSchema", () => {
  it("accepts a valid ISO date", () => {
    expect(journeyDateSchema.safeParse("2026-09-10").success).toBe(true);
  });
  it("rejects malformed or invalid dates", () => {
    expect(journeyDateSchema.safeParse("10-09-2026").success).toBe(false);
    expect(journeyDateSchema.safeParse("2026-13-40").success).toBe(false);
    expect(journeyDateSchema.safeParse("").success).toBe(false);
  });
});

describe("stationCodeSchema", () => {
  it("accepts and uppercases valid station codes", () => {
    const result = stationCodeSchema.safeParse("tvcn");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("TVCN");
  });
  it("rejects codes with invalid characters", () => {
    expect(stationCodeSchema.safeParse("TV-1").success).toBe(false);
    expect(stationCodeSchema.safeParse("").success).toBe(false);
  });
});

describe("chartRequestSchema", () => {
  it("accepts a valid combined request", () => {
    expect(chartRequestSchema.safeParse({ train: "22648", date: "2026-09-10" }).success).toBe(true);
  });
  it("rejects when either field is invalid", () => {
    expect(chartRequestSchema.safeParse({ train: "abc", date: "2026-09-10" }).success).toBe(false);
    expect(chartRequestSchema.safeParse({ train: "22648", date: "not-a-date" }).success).toBe(false);
  });
});
