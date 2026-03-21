import { z } from "zod";
import { siteConfig } from "@/config/site";
import { getLocalDateInputValue } from "@/lib/format";
import { isValidTime, timeToMinutes } from "@/lib/schedule";

const availableServiceIds = new Set(siteConfig.services.map((service) => service.id));

const trimmedString = (message: string) => z.string().trim().min(1, message);
const timeStringSchema = z
  .string()
  .trim()
  .refine((value) => isValidTime(value), "Enter a valid time.");
const dateStringSchema = trimmedString("Select a valid date.")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00`)), "Select a valid date.");

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name."),
    email: z.string().trim().email("Enter a valid email address.").transform((value) => value.toLowerCase()),
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[A-Z]/, "Include at least one uppercase letter.")
      .regex(/[a-z]/, "Include at least one lowercase letter.")
      .regex(/[0-9]/, "Include at least one number."),
    confirmPassword: z.string()
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match."
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Enter your password.")
});

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the client name."),
  email: z.string().trim().email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  phone: trimmedString("Enter a phone number.").refine(
    (value) => value.replace(/\D/g, "").length >= 10,
    "Enter a valid phone number."
  ),
  serviceId: trimmedString("Choose a service.").refine(
    (value) => availableServiceIds.has(value),
    "Choose a valid service."
  ),
  preferredDate: dateStringSchema
    .refine(
      (value) => value >= getLocalDateInputValue(),
      "Preferred date must be today or later."
    ),
  preferredTime: timeStringSchema,
  notes: z.string().trim().max(500, "Keep notes under 500 characters.").optional().default("")
});

export const availabilityWindowSchema = z
  .object({
    weekday: z.number().int().min(0).max(6),
    startTime: timeStringSchema,
    endTime: timeStringSchema
  })
  .superRefine(({ startTime, endTime }, context) => {
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be later than the start time."
      });
    }
  });

export const blackoutDateSchema = z.object({
  date: dateStringSchema.refine(
    (value) => value >= getLocalDateInputValue(),
    "Blackout date must be today or later."
  ),
  reason: z.string().trim().max(120, "Keep the reason under 120 characters.").optional().default("")
});

export const bookingStatusSchema = z.object({
  status: z.enum(["confirmed", "cancelled", "completed"])
});

export const slotsQuerySchema = z.object({
  serviceId: trimmedString("Choose a valid service.").refine(
    (value) => availableServiceIds.has(value),
    "Choose a valid service."
  ),
  date: dateStringSchema
});

export const availableDatesQuerySchema = z.object({
  serviceId: trimmedString("Choose a valid service.").refine(
    (value) => availableServiceIds.has(value),
    "Choose a valid service."
  ),
  days: z.coerce.number().int().min(1).max(60).optional()
});

export function getValidationMessage(error: z.ZodError, fallback: string) {
  const flattened = error.flatten();
  const firstFieldMessage = Object.values(flattened.fieldErrors)
    .flat()
    .find((message): message is string => Boolean(message));

  return firstFieldMessage || flattened.formErrors[0] || fallback;
}

export function flattenFieldErrors<TFieldName extends string>(
  fieldErrors: Record<string, string[] | undefined>
) {
  const nextErrors = {} as Partial<Record<TFieldName, string>>;

  for (const [fieldName, messages] of Object.entries(fieldErrors)) {
    if (messages?.[0]) {
      nextErrors[fieldName as TFieldName] = messages[0];
    }
  }

  return nextErrors;
}
