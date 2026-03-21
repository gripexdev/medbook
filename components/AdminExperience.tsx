"use client";

import { startTransition, useEffect, useState } from "react";
import AdminBookingCard from "@/components/AdminBookingCard";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import InputField from "@/components/InputField";
import LoadingState from "@/components/LoadingState";
import PageIntro from "@/components/PageIntro";
import SelectField from "@/components/SelectField";
import Toast from "@/components/Toast";
import { getLocalDateInputValue } from "@/lib/format";
import { getWeekdayLabel } from "@/lib/schedule";
import { flattenFieldErrors } from "@/lib/validators";
import type {
  AvailabilityWindowRecord,
  BlackoutDateRecord,
  BookingRecord,
  BookingStatus,
  SessionUser
} from "@/lib/types";

type AdminExperienceProps = {
  user: SessionUser;
};

type WindowFormErrors = Partial<Record<"weekday" | "startTime" | "endTime", string>>;
type BlackoutFormErrors = Partial<Record<"date" | "reason", string>>;

export default function AdminExperience({ user }: AdminExperienceProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [windows, setWindows] = useState<AvailabilityWindowRecord[]>([]);
  const [blackouts, setBlackouts] = useState<BlackoutDateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingBookingId, setPendingBookingId] = useState("");
  const [isSavingWindow, setIsSavingWindow] = useState(false);
  const [isSavingBlackout, setIsSavingBlackout] = useState(false);
  const [windowErrors, setWindowErrors] = useState<WindowFormErrors>({});
  const [blackoutErrors, setBlackoutErrors] = useState<BlackoutFormErrors>({});
  const [toast, setToast] = useState<{ title: string; message: string; variant: "success" | "error" } | null>(null);
  const [windowForm, setWindowForm] = useState({
    weekday: "1",
    startTime: "09:00",
    endTime: "17:00"
  });
  const [blackoutForm, setBlackoutForm] = useState({
    date: getLocalDateInputValue(),
    reason: ""
  });

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [bookingsResponse, windowsResponse, blackoutsResponse] = await Promise.all([
          fetch("/api/admin/bookings", { cache: "no-store" }),
          fetch("/api/admin/availability/windows", { cache: "no-store" }),
          fetch("/api/admin/availability/blackouts", { cache: "no-store" })
        ]);

        const [bookingsData, windowsData, blackoutsData] = await Promise.all([
          bookingsResponse.json(),
          windowsResponse.json(),
          blackoutsResponse.json()
        ]);

        if (!bookingsResponse.ok) {
          throw new Error(bookingsData?.error || "Unable to load bookings.");
        }

        if (!windowsResponse.ok) {
          throw new Error(windowsData?.error || "Unable to load availability windows.");
        }

        if (!blackoutsResponse.ok) {
          throw new Error(blackoutsData?.error || "Unable to load blackout dates.");
        }

        startTransition(() => {
          setBookings(bookingsData.bookings || []);
          setWindows(windowsData.windows || []);
          setBlackouts(blackoutsData.blackouts || []);
        });
      } catch (error) {
        setToast({
          title: "Unable to load admin data",
          message: error instanceof Error ? error.message : "Something went wrong.",
          variant: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    void loadAdminData();
  }, []);

  const handleBookingStatusChange = async (bookingId: string, status: BookingStatus) => {
    setPendingBookingId(bookingId);

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to update the booking.");
      }

      startTransition(() => {
        setBookings((current) =>
          current.map((booking) => (booking.id === bookingId ? data.booking : booking))
        );
      });

      setToast({
        title: "Appointment updated",
        message: `The appointment status is now ${status}.`,
        variant: "success"
      });
    } catch (error) {
      setToast({
        title: "Update failed",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
    } finally {
      setPendingBookingId("");
    }
  };

  const handleWindowSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWindowErrors({});
    setIsSavingWindow(true);

    try {
      const response = await fetch("/api/admin/availability/windows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          weekday: Number(windowForm.weekday),
          startTime: windowForm.startTime,
          endTime: windowForm.endTime
        })
      });
      const data = await response.json();

      if (!response.ok) {
        setWindowErrors(flattenFieldErrors<keyof WindowFormErrors>(data?.fieldErrors || {}));
        throw new Error(data?.error || "Unable to save the availability window.");
      }

      setWindows(data.windows || []);
      setToast({
        title: "Availability updated",
        message: "A new weekly availability window has been added.",
        variant: "success"
      });
    } catch (error) {
      setToast({
        title: "Availability save failed",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
    } finally {
      setIsSavingWindow(false);
    }
  };

  const handleDeleteWindow = async (windowId: string) => {
    try {
      const response = await fetch(`/api/admin/availability/windows/${windowId}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to delete the availability window.");
      }

      setWindows((current) => current.filter((window) => window.id !== windowId));
    } catch (error) {
      setToast({
        title: "Delete failed",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
    }
  };

  const handleBlackoutSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBlackoutErrors({});
    setIsSavingBlackout(true);

    try {
      const response = await fetch("/api/admin/availability/blackouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(blackoutForm)
      });
      const data = await response.json();

      if (!response.ok) {
        setBlackoutErrors(flattenFieldErrors<keyof BlackoutFormErrors>(data?.fieldErrors || {}));
        throw new Error(data?.error || "Unable to save the blackout date.");
      }

      setBlackouts(data.blackouts || []);
      setToast({
        title: "Blackout added",
        message: "That date is now unavailable for booking.",
        variant: "success"
      });
    } catch (error) {
      setToast({
        title: "Blackout save failed",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
    } finally {
      setIsSavingBlackout(false);
    }
  };

  const handleDeleteBlackout = async (blackoutId: string) => {
    try {
      const response = await fetch(`/api/admin/availability/blackouts/${blackoutId}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to delete the blackout date.");
      }

      setBlackouts((current) => current.filter((blackout) => blackout.id !== blackoutId));
    } catch (error) {
      setToast({
        title: "Delete failed",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
    }
  };

  return (
    <div className="section-shell py-16">
      <div className="grid gap-8">
        <section className="panel p-8 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <PageIntro
              eyebrow="Admin"
              title="Manage scheduling, availability, and live appointments"
              description="This workspace gives admins control over weekly availability, blackout dates, and the status of every booking in the system."
            />
            <div className="panel-muted px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signed in as</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">{user.email}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.94fr_1.06fr]">
          <div className="panel p-8">
            <h2 className="font-display text-[34px] leading-none text-slate-950">Weekly availability</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Weekly windows define when the booking form can generate valid appointment slots.
            </p>

            <form className="mt-8 grid gap-4 md:grid-cols-3" onSubmit={handleWindowSubmit}>
              <SelectField
                label="Weekday"
                value={windowForm.weekday}
                onChange={(event) => setWindowForm((current) => ({ ...current, weekday: event.target.value }))}
                error={windowErrors.weekday}
              >
                {Array.from({ length: 7 }).map((_, weekday) => (
                  <option key={weekday} value={weekday}>
                    {getWeekdayLabel(weekday)}
                  </option>
                ))}
              </SelectField>
              <InputField
                label="Start time"
                type="time"
                value={windowForm.startTime}
                onChange={(event) => setWindowForm((current) => ({ ...current, startTime: event.target.value }))}
                error={windowErrors.startTime}
              />
              <InputField
                label="End time"
                type="time"
                value={windowForm.endTime}
                onChange={(event) => setWindowForm((current) => ({ ...current, endTime: event.target.value }))}
                error={windowErrors.endTime}
              />
              <div className="md:col-span-3">
                <Button type="submit" disabled={isSavingWindow}>
                  {isSavingWindow ? "Saving..." : "Add availability window"}
                </Button>
              </div>
            </form>

            <div className="mt-8 space-y-3">
              {loading ? (
                <LoadingState rows={3} />
              ) : windows.length === 0 ? (
                <EmptyState
                  title="No availability windows"
                  description="Add at least one weekly availability window to generate bookable appointment slots."
                  actionHref={null}
                />
              ) : (
                windows.map((window) => (
                  <div
                    key={window.id}
                    className="flex flex-col gap-3 rounded-[26px] border border-slate-200 bg-slate-50/90 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{getWeekdayLabel(window.weekday)}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {window.startTime} to {window.endTime}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteWindow(window.id)}>
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel p-8">
            <h2 className="font-display text-[34px] leading-none text-slate-950">Blackout dates</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Blackout dates disable booking for a full day, even if a normal weekly window exists.
            </p>

            <form className="mt-8 grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-end" onSubmit={handleBlackoutSubmit}>
              <InputField
                label="Date"
                type="date"
                min={getLocalDateInputValue()}
                value={blackoutForm.date}
                onChange={(event) => setBlackoutForm((current) => ({ ...current, date: event.target.value }))}
                error={blackoutErrors.date}
              />
              <InputField
                label="Reason"
                placeholder="Holiday, team offsite, maintenance..."
                value={blackoutForm.reason}
                onChange={(event) => setBlackoutForm((current) => ({ ...current, reason: event.target.value }))}
                error={blackoutErrors.reason}
              />
              <div className="md:col-span-2">
                <Button type="submit" disabled={isSavingBlackout}>
                  {isSavingBlackout ? "Saving..." : "Add blackout date"}
                </Button>
              </div>
            </form>

            <div className="mt-8 space-y-3">
              {loading ? (
                <LoadingState rows={2} />
              ) : blackouts.length === 0 ? (
                <div className="rounded-[26px] border border-dashed border-slate-200 px-5 py-5 text-sm text-slate-500">
                  No blackout dates have been added yet.
                </div>
              ) : (
                blackouts.map((blackout) => (
                  <div
                    key={blackout.id}
                    className="flex flex-col gap-3 rounded-[26px] border border-slate-200 bg-slate-50/90 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{blackout.date}</p>
                      <p className="mt-1 text-sm text-slate-600">{blackout.reason || "Blackout date"}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteBlackout(blackout.id)}>
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="panel p-8 md:p-10">
          <PageIntro
            eyebrow="Appointments"
            title="Live appointment management"
            description="Update booking statuses as the day progresses. Confirmed bookings reserve their slots, while cancelled and completed bookings release availability."
          />

          <div className="mt-10">
            {loading ? (
              <LoadingState rows={4} />
            ) : bookings.length === 0 ? (
              <EmptyState
                title="No bookings in the system"
                description="Once clients start booking, appointments will appear here for admin review and updates."
              />
            ) : (
              <div className="space-y-5">
                {bookings.map((booking) => (
                  <AdminBookingCard
                    key={booking.id}
                    booking={booking}
                    onStatusChange={handleBookingStatusChange}
                    isPending={pendingBookingId === booking.id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {toast ? <Toast {...toast} /> : null}
    </div>
  );
}
