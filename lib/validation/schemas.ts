import { z } from "zod";

export const trainNumberSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{3,6}$/, "Train number must be 3-6 digits");

export const journeyDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date");

export const stationCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{2,8}$/, "Invalid station code");

export const searchQuerySchema = z
  .string()
  .trim()
  .max(64, "Query too long");

export const chartRequestSchema = z.object({
  train: trainNumberSchema,
  date: journeyDateSchema,
});

export const chartQuerySchema = z.object({
  from: stationCodeSchema.optional(),
  to: stationCodeSchema.optional(),
  status: z.enum(["all", "vacant", "part", "occupied"]).optional(),
  class: z.string().max(8).optional(),
  coach: z.string().max(8).optional(),
  berthType: z.string().max(16).optional(),
  q: z.string().max(64).optional(),
});
