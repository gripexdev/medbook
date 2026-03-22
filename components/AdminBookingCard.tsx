"use client";

import SelectField from "@/components/SelectField";
import { formatBookingDate, formatBookingTime } from "@/lib/format";
import type { BookingRecord, BookingStatus } from "@/lib/types";

type AdminBookingCardProps = {
  booking: BookingRecord;
  isPending?: boolean;
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
};

export default function AdminBookingCard({
  booking,
  isPending = false,
  onStatusChange
}: AdminBookingCardProps) {
  return (
    <article className="panel flex flex-col gap-5 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-[28px] leading-none text-slate-900 sm:text-3xl">{booking.serviceName}</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              {booking.status}
            </span>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {formatBookingDate(booking.preferredDate)} at {formatBookingTime(booking.preferredTime)}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span>{booking.fullName}</span>
            <span className="break-all">{booking.email}</span>
            <span>{booking.phone}</span>
          </div>
          {booking.notes ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{booking.notes}</p>
          ) : null}
        </div>

        <div className="w-full max-w-none sm:max-w-[220px]">
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
      </div>

      <div className="grid gap-3 text-sm text-slate-500 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          Confirmation email: {booking.confirmationSentAt ? "sent" : "pending"}
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          Reminder email: {booking.reminderSentAt ? "sent" : "pending"}
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          Cancellation email: {booking.cancellationSentAt ? "sent" : "pending"}
        </div>
      </div>
    </article>
  );
}
