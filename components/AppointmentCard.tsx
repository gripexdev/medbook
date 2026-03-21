import Button from "@/components/Button";
import { formatBookingDate, formatBookingTime } from "@/lib/format";
import type { BookingRecord } from "@/lib/types";

type AppointmentCardProps = {
  booking: BookingRecord;
  onCancel?: (id: string) => void;
  isPending?: boolean;
};

export default function AppointmentCard({ booking, onCancel, isPending = false }: AppointmentCardProps) {
  const isCancelled = booking.status === "cancelled";
  const isConfirmed = booking.status === "confirmed";
  const bookingStatusLabel =
    booking.status === "completed"
      ? "Completed"
      : booking.status === "cancelled"
        ? "Cancelled"
        : "Confirmed";
  const statusClasses =
    booking.status === "completed"
      ? "bg-emerald-50 text-emerald-700"
      : booking.status === "cancelled"
        ? "bg-stone-200 text-stone-700"
        : "bg-brand-50 text-brand-700";

  return (
    <article className="panel flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-3xl leading-none text-slate-900">{booking.serviceName}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusClasses}`}>
            {bookingStatusLabel}
          </span>
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {formatBookingDate(booking.preferredDate)} at {formatBookingTime(booking.preferredTime)}
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>{booking.fullName}</span>
          <span>{booking.email}</span>
          <span>{booking.phone}</span>
        </div>
        {booking.notes ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{booking.notes}</p>
        ) : null}
      </div>
      {onCancel ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onCancel(booking.id)}
          disabled={isPending || !isConfirmed}
        >
          {!isConfirmed ? bookingStatusLabel : isPending ? "Updating..." : "Cancel booking"}
        </Button>
      ) : null}
    </article>
  );
}
