"use client";

import SelectField from "@/components/SelectField";
import { formatBookingDate, formatBookingTime } from "@/lib/format";
import type { BookingRecord, BookingStatus } from "@/lib/types";

type AdminBookingCardProps = {
  booking: BookingRecord;
  isPending?: boolean;
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
};

const statusBadgeClasses: Record<BookingStatus, string> = {
  confirmed: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border border-slate-200 bg-slate-100 text-slate-700",
  cancelled: "border border-rose-200 bg-rose-50 text-rose-700"
};

function getNotificationState(sentAt: string | null, bookingStatus: BookingStatus, kind: "confirmation" | "reminder" | "cancellation") {
  if (sentAt) {
    return {
      label: "Sent",
      badgeClassName: "bg-emerald-50 text-emerald-700"
    };
  }

  if (kind === "cancellation" && bookingStatus !== "cancelled") {
    return {
      label: "Not needed",
      badgeClassName: "bg-slate-100 text-slate-500"
    };
  }

  if (kind === "reminder" && bookingStatus !== "confirmed") {
    return {
      label: "Not scheduled",
      badgeClassName: "bg-slate-100 text-slate-500"
    };
  }

  return {
    label: "Pending",
    badgeClassName: "bg-amber-50 text-amber-700"
  };
}

function InfoItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-[22px] border border-slate-200/80 bg-white px-4 py-4 ${className}`.trim()}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function NotificationRow({
  label,
  sentAt,
  bookingStatus,
  kind
}: {
  label: string;
  sentAt: string | null;
  bookingStatus: BookingStatus;
  kind: "confirmation" | "reminder" | "cancellation";
}) {
  const state = getNotificationState(sentAt, bookingStatus, kind);

  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200/70 bg-white px-4 py-3">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${state.badgeClassName}`}>{state.label}</span>
    </div>
  );
}

export default function AdminBookingCard({
  booking,
  isPending = false,
  onStatusChange
}: AdminBookingCardProps) {
  return (
    <article className="panel overflow-hidden border border-slate-200/80 bg-white">
      <div className="flex flex-col gap-5 border-b border-slate-200/80 px-6 py-6 sm:px-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-700">
              Appointment
            </span>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${statusBadgeClasses[booking.status]}`}>
              {booking.status}
            </span>
          </div>
          <h3 className="mt-4 font-display text-[28px] leading-none tracking-[-0.04em] text-slate-950 sm:text-[32px]">
            {booking.serviceName}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {formatBookingDate(booking.preferredDate)} at {formatBookingTime(booking.preferredTime)}
          </p>
        </div>

        <div className="w-full rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 sm:max-w-[250px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Workflow</p>
          <div className="mt-4">
            <SelectField
              label="Appointment status"
              value={booking.status}
              onChange={(event) => onStatusChange(booking.id, event.target.value as BookingStatus)}
              disabled={isPending}
            >
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </SelectField>
          </div>
          <p className="mt-3 text-xs leading-6 text-slate-500">
            {isPending ? "Saving changes..." : "Status updates immediately affect public slot availability."}
          </p>
        </div>
      </div>

      <div className="grid gap-5 px-6 py-6 sm:px-7 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoItem label="Client" value={booking.fullName} />
            <InfoItem label="Email" value={booking.email} className="min-w-0 break-all" />
            <InfoItem label="Phone" value={booking.phone || "Not provided"} />
          </div>

          <div className="panel-muted px-5 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Notes</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {booking.notes || "No client notes were added for this appointment."}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="panel-muted px-5 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Communication</p>
            <div className="mt-4 grid gap-3">
              <NotificationRow
                label="Confirmation email"
                sentAt={booking.confirmationSentAt}
                bookingStatus={booking.status}
                kind="confirmation"
              />
              <NotificationRow
                label="Reminder email"
                sentAt={booking.reminderSentAt}
                bookingStatus={booking.status}
                kind="reminder"
              />
              <NotificationRow
                label="Cancellation email"
                sentAt={booking.cancellationSentAt}
                bookingStatus={booking.status}
                kind="cancellation"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Booked on" value={new Date(booking.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })} />
            <InfoItem label="Last updated" value={new Date(booking.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })} />
          </div>
        </div>
      </div>
    </article>
  );
}
