"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookingSummaryCard from "@/components/BookingSummaryCard";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import PageIntro from "@/components/PageIntro";
import SelectField from "@/components/SelectField";
import TextAreaField from "@/components/TextAreaField";
import Toast from "@/components/Toast";
import { siteConfig } from "@/config/site";
import { formatBookingDate, formatBookingTime, getLocalDateInputValue } from "@/lib/format";
import { bookingSchema, flattenFieldErrors } from "@/lib/validators";
import type { BookingInput, SessionUser } from "@/lib/types";

type BookingExperienceProps = {
  initialServiceId: string;
  user: SessionUser;
};

type FormErrors = Partial<Record<keyof BookingInput, string>>;

export default function BookingExperience({ initialServiceId, user }: BookingExperienceProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<BookingInput>({
    fullName: user.name,
    email: user.email,
    phone: "",
    serviceId: initialServiceId,
    preferredDate: "",
    preferredTime: "",
    notes: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [toast, setToast] = useState<{ title: string; message: string; variant: "success" | "error" } | null>(null);

  useEffect(() => {
    setFormValues((current) => ({
      ...current,
      fullName: current.fullName || user.name,
      email: user.email,
      serviceId: initialServiceId
    }));
  }, [initialServiceId, user.email, user.name]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleChange = (field: keyof BookingInput, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = bookingSchema.safeParse(formValues);

    if (!validation.success) {
      setErrors(flattenFieldErrors<keyof BookingInput>(validation.error.flatten().fieldErrors));
      setToast({
        title: "Check the form",
        message: "Please correct the highlighted fields before submitting.",
        variant: "error"
      });
      return;
    }

    setIsSubmitting(true);
    setConfirmation("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data)
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login?redirectTo=%2Fbooking");
          return;
        }

        setErrors(flattenFieldErrors<keyof BookingInput>(data?.fieldErrors || {}));
        throw new Error(data?.error || "Unable to complete the booking.");
      }

      setConfirmation(
        `Appointment confirmed for ${data.booking.serviceName} on ${formatBookingDate(validation.data.preferredDate)} at ${formatBookingTime(validation.data.preferredTime)}.`
      );
      setToast({
        title: "Booking confirmed",
        message: "Your appointment has been saved and is ready to view in the dashboard.",
        variant: "success"
      });
      setFormValues({
        fullName: validation.data.fullName,
        email: user.email,
        phone: "",
        serviceId: validation.data.serviceId,
        preferredDate: "",
        preferredTime: "",
        notes: ""
      });
    } catch (error) {
      setToast({
        title: "Booking failed",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = getLocalDateInputValue();

  return (
    <div className="section-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="panel p-8 md:p-10">
          <PageIntro
            eyebrow="Booking"
            title="Book a premium appointment"
            description="Appointments are now tied to your account, with secure API submission and private access in the dashboard."
          />

          <div className="mt-8 rounded-[28px] border border-brand-100 bg-brand-50/70 px-5 py-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Signed in as {user.email}</p>
            <p className="mt-2 leading-7">
              Your booking will be saved to this account and shown immediately in the protected dashboard.
            </p>
          </div>

          <form className="mt-10 grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Full name"
                required
                placeholder="Jordan Lee"
                value={formValues.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                error={errors.fullName}
              />
              <InputField
                label="Email address"
                required
                type="email"
                placeholder="jordan@example.com"
                value={formValues.email}
                onChange={(event) => handleChange("email", event.target.value)}
                error={errors.email}
                readOnly
              />
              <InputField
                label="Phone number"
                required
                type="tel"
                placeholder="(555) 555-1234"
                value={formValues.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                error={errors.phone}
              />
              <SelectField
                label="Service selection"
                required
                value={formValues.serviceId}
                onChange={(event) => handleChange("serviceId", event.target.value)}
                error={errors.serviceId}
              >
                {siteConfig.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </SelectField>
              <InputField
                label="Preferred date"
                required
                type="date"
                min={today}
                value={formValues.preferredDate}
                onChange={(event) => handleChange("preferredDate", event.target.value)}
                error={errors.preferredDate}
              />
              <SelectField
                label="Preferred time"
                required
                value={formValues.preferredTime}
                onChange={(event) => handleChange("preferredTime", event.target.value)}
                error={errors.preferredTime}
              >
                <option value="">Choose a time</option>
                {siteConfig.appointmentTimes.map((time) => (
                  <option key={time} value={time}>
                    {formatBookingTime(time)}
                  </option>
                ))}
              </SelectField>
            </div>

            <TextAreaField
              label="Message or notes"
              placeholder="Share any context for the appointment, preferences, or goals."
              value={formValues.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
              error={errors.notes}
            />

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Confirming..." : "Confirm booking"}
              </Button>
              <Link href="/dashboard" className="text-sm font-semibold text-brand-700 transition hover:text-brand-800">
                View dashboard
              </Link>
            </div>

            {confirmation ? (
              <div className="panel-muted px-5 py-5">
                <p className="eyebrow">Confirmed</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{confirmation}</p>
              </div>
            ) : null}
          </form>
        </section>

        <div className="space-y-6">
          <BookingSummaryCard
            serviceId={formValues.serviceId}
            preferredDate={formValues.preferredDate}
            preferredTime={formValues.preferredTime}
            fullName={formValues.fullName}
            email={formValues.email}
            phone={formValues.phone}
          />

          <div className="panel-muted p-6">
            <p className="text-sm font-semibold text-slate-900">What happens next</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              After submission, the appointment is stored in SQLite and appears immediately in your signed-in dashboard.
            </p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl bg-white/90 px-4 py-3 text-sm text-slate-600">
                Session-protected booking flow with account-linked history
              </div>
              <div className="rounded-2xl bg-white/90 px-4 py-3 text-sm text-slate-600">
                Slot conflict detection to prevent duplicate confirmed appointments
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast ? <Toast {...toast} /> : null}
    </div>
  );
}
