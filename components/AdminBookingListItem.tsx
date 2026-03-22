"use client";

import Button from "@/components/Button";
import { formatBookingDate, formatBookingTime } from "@/lib/format";
import type { BookingRecord, BookingStatus } from "@/lib/types";

type AdminBookingListItemProps = {
  booking: BookingRecord;
  isSelected?: boolean;
  onSelect: (bookingId: string) => void;
};

const statusBadgeClasses: Record<BookingStatus, string> = {
  confirmed: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border border-slate-200 bg-slate-100 text-slate-700",
  cancelled: "border border-rose-200 bg-rose-50 text-rose-700"
};

export default function AdminBookingListItem({
  booking,
  isSelected = false,
  onSelect
}: AdminBookingListItemProps) {
  return (
    <article
      className={[
        "rounded-[24px] border px-5 py-5 transition duration-200",
        isSelected
          ? "border-brand-200 bg-brand-50/50 shadow-soft"
          : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/70"
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="truncate text-base font-semibold text-slate-950 sm:text-lg">{booking.serviceName}</h3>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusBadgeClasses[booking.status]}`}
            >
              {booking.status}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-700">{booking.fullName}</p>
          <p className="mt-1 text-sm text-slate-500">
            {formatBookingDate(booking.preferredDate)} at {formatBookingTime(booking.preferredTime)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:justify-end">
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            {booking.phone || "No phone"}
          </div>
          <Button
            variant={isSelected ? "primary" : "secondary"}
            size="sm"
            onClick={() => onSelect(booking.id)}
          >
            {isSelected ? "Viewing" : "View details"}
          </Button>
        </div>
      </div>
    </article>
  );
}
