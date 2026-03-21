"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AvailabilityDatePicker from "@/components/AvailabilityDatePicker";
import BookingSummaryCard from "@/components/BookingSummaryCard";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import PageIntro from "@/components/PageIntro";
import SelectField from "@/components/SelectField";
import TextAreaField from "@/components/TextAreaField";
import Toast from "@/components/Toast";
import { formatBookingDate, formatBookingTime } from "@/lib/format";
import { bookingSchema, flattenFieldErrors } from "@/lib/validators";
import { siteConfig } from "@/config/site";
import type { AvailableDate, AvailableSlot, BookingInput, SessionUser } from "@/lib/types";

const AVAILABILITY_REFRESH_INTERVAL_MS = 15000;

type BookingExperienceProps = {
  initialServiceId: string;
  user: SessionUser;
};

type FormErrors = Partial<Record<keyof BookingInput, string>>;

async function fetchAvailableDates(serviceId: string, signal?: AbortSignal) {
  const response = await fetch(
    `/api/availability/dates?serviceId=${encodeURIComponent(serviceId)}&days=${siteConfig.bookingWindowDays}`,
    {
      signal,
      cache: "no-store"
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Unable to load bookable dates.");
  }

  return (data.dates || []) as AvailableDate[];
}

async function fetchAvailableSlots(serviceId: string, date: string, signal?: AbortSignal) {
  const response = await fetch(
    `/api/availability/slots?serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`,
    {
      signal,
      cache: "no-store"
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Unable to load available slots.");
  }

  return (data.slots || []) as AvailableSlot[];
}

export default function BookingExperience({ initialServiceId, user }: BookingExperienceProps) {
  const router = useRouter();
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
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
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availabilityRefreshKey, setAvailabilityRefreshKey] = useState(0);
  const [confirmation, setConfirmation] = useState("");
  const [toast, setToast] = useState<{ title: string; message: string; variant: "success" | "error" } | null>(null);
  const skipNextSlotToastRef = useRef(false);

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

  useEffect(() => {
    if (!formValues.serviceId) {
      setAvailableDates([]);
      setAvailableSlots([]);
      setFormValues((current) => ({
        ...current,
        preferredDate: "",
        preferredTime: ""
      }));
      return;
    }

    const controller = new AbortController();
    const selectedDate = formValues.preferredDate;

    const loadDates = async () => {
      setIsLoadingDates(true);

      try {
        const dates = await fetchAvailableDates(formValues.serviceId, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setAvailableDates(dates);

        const fallbackDate = dates[0]?.date || "";
        const hasSelectedDate = Boolean(selectedDate) && dates.some((date) => date.date === selectedDate);

        if (!selectedDate && fallbackDate) {
          setFormValues((current) => ({
            ...current,
            preferredDate: fallbackDate,
            preferredTime: ""
          }));
          return;
        }

        if (!selectedDate || hasSelectedDate) {
          return;
        }

        skipNextSlotToastRef.current = true;
        setFormValues((current) =>
          current.preferredDate === selectedDate
            ? {
                ...current,
                preferredDate: fallbackDate,
                preferredTime: ""
              }
            : current
        );
        setToast({
          title: "Availability updated",
          message: fallbackDate
            ? `Your previous date is no longer available. We moved you to ${formatBookingDate(fallbackDate)}.`
            : "No bookable days are available right now. Please check back shortly.",
          variant: "error"
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          setAvailableDates([]);
          setToast({
            title: "Dates unavailable",
            message: error instanceof Error ? error.message : "Unable to load bookable dates.",
            variant: "error"
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingDates(false);
        }
      }
    };

    void loadDates();

    return () => controller.abort();
  }, [availabilityRefreshKey, formValues.serviceId]);

  useEffect(() => {
    if (!formValues.serviceId || !formValues.preferredDate) {
      setAvailableSlots([]);
      setFormValues((current) => ({
        ...current,
        preferredTime: ""
      }));
      return;
    }

    const controller = new AbortController();
    const selectedTime = formValues.preferredTime;
    const selectedDate = formValues.preferredDate;

    const loadSlots = async () => {
      setIsLoadingSlots(true);

      try {
        const slots = await fetchAvailableSlots(formValues.serviceId, selectedDate, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setAvailableSlots(slots);

        const isSelectedTimeStillAvailable =
          Boolean(selectedTime) && slots.some((slot) => slot.time === selectedTime);

        setFormValues((current) => ({
          ...current,
          preferredTime: isSelectedTimeStillAvailable ? current.preferredTime : ""
        }));

        if (selectedTime && !isSelectedTimeStillAvailable && !skipNextSlotToastRef.current) {
          setToast({
            title: "Time updated",
            message: "That time was just taken or released. Please choose from the refreshed options.",
            variant: "error"
          });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setAvailableSlots([]);
          setToast({
            title: "Slots unavailable",
            message: error instanceof Error ? error.message : "Unable to load available slots.",
            variant: "error"
          });
        }
      } finally {
        skipNextSlotToastRef.current = false;

        if (!controller.signal.aborted) {
          setIsLoadingSlots(false);
        }
      }
    };

    void loadSlots();

    return () => controller.abort();
  }, [availabilityRefreshKey, formValues.preferredDate, formValues.serviceId]);

  useEffect(() => {
    if (!formValues.serviceId) {
      return;
    }

    const refreshAvailability = () => {
      setAvailabilityRefreshKey((current) => current + 1);
    };
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshAvailability();
      }
    };

    const interval = window.setInterval(refreshAvailability, AVAILABILITY_REFRESH_INTERVAL_MS);
    window.addEventListener("focus", refreshAvailability);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshAvailability);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [formValues.serviceId]);

  const handleChange = (field: keyof BookingInput, value: string) => {
    setFormValues((current) => {
      if (field === "serviceId") {
        return {
          ...current,
          serviceId: value,
          preferredDate: "",
          preferredTime: ""
        };
      }

      if (field === "preferredDate") {
        return {
          ...current,
          preferredDate: value,
          preferredTime: ""
        };
      }

      return { ...current, [field]: value };
    });
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
        message: "Your appointment has been saved and the available schedule has been refreshed.",
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
      setAvailabilityRefreshKey((current) => current + 1);
    } catch (error) {
      setToast({
        title: "Booking failed",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
      setAvailabilityRefreshKey((current) => current + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="panel p-8 md:p-10">
          <PageIntro
            eyebrow="Booking"
            title="Book a premium appointment"
            description="Appointments are tied to your account, and date or time choices refresh automatically as the schedule changes."
          />

          <div className="mt-8 rounded-[28px] border border-brand-100 bg-brand-50/70 px-5 py-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Signed in as {user.email}</p>
            <p className="mt-2 leading-7">
              Your booking is saved to this account only. Availability updates live if an admin confirms, cancels,
              completes, or blocks appointments.
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

              <div className="md:col-span-2">
                <AvailabilityDatePicker
                  dates={availableDates}
                  value={formValues.preferredDate}
                  onChange={(date) => handleChange("preferredDate", date)}
                  error={errors.preferredDate}
                  isLoading={isLoadingDates}
                />
              </div>

              <div className="md:col-span-2">
                <SelectField
                  label="Preferred time"
                  required
                  value={formValues.preferredTime}
                  onChange={(event) => handleChange("preferredTime", event.target.value)}
                  error={errors.preferredTime}
                  disabled={!formValues.preferredDate || isLoadingSlots || availableSlots.length === 0}
                >
                  <option value="">
                    {!formValues.serviceId
                      ? "Choose a service first"
                      : !formValues.preferredDate
                        ? isLoadingDates
                          ? "Loading bookable days..."
                          : "Choose a date above"
                        : isLoadingSlots
                          ? "Refreshing times..."
                          : availableSlots.length === 0
                            ? "No times available"
                            : "Choose a time"}
                  </option>
                  {availableSlots.map((slot) => (
                    <option key={slot.time} value={slot.time}>
                      {slot.label}
                    </option>
                  ))}
                </SelectField>
              </div>
            </div>

            {formValues.preferredDate && !isLoadingSlots && availableSlots.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                That day no longer has open times. Choose another bookable date and the time list will refresh.
              </div>
            ) : null}

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
              Availability is generated from admin rules and confirmed bookings. Days disappear when full, and open
              times update automatically while this page is open.
            </p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl bg-white/90 px-4 py-3 text-sm text-slate-600">
                Only the configured admin account can view and manage system-wide appointments
              </div>
              <div className="rounded-2xl bg-white/90 px-4 py-3 text-sm text-slate-600">
                Confirmed, cancelled, and completed statuses immediately affect slot availability
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast ? <Toast {...toast} /> : null}
    </div>
  );
}
