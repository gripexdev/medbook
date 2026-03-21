import { z } from "zod";
import { siteConfig } from "@/config/site";
import { getLocalDateInputValue } from "@/lib/format";

const availableServiceIds = new Set(siteConfig.services.map((service) => service.id));
const availableAppointmentTimes = new Set(siteConfig.appointmentTimes);

const trimmedString = (message: string) => z.string().trim().min(1, message);

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
  preferredDate: trimmedString("Select a preferred date.")
    .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00`)), "Select a valid date.")
    .refine(
      (value) => value >= getLocalDateInputValue(),
      "Preferred date must be today or later."
    ),
  preferredTime: trimmedString("Select a preferred time.").refine(
    (value) => availableAppointmentTimes.has(value),
    "Choose a valid time."
  ),
  notes: z.string().trim().max(500, "Keep notes under 500 characters.").optional().default("")
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
