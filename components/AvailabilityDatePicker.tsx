"use client";

import type { AvailableDate } from "@/lib/types";

type AvailabilityDatePickerProps = {
  dates: AvailableDate[];
  value: string;
  onChange: (date: string) => void;
  error?: string;
  isLoading?: boolean;
};

export default function AvailabilityDatePicker({
  dates,
  value,
  onChange,
  error,
  isLoading = false
}: AvailabilityDatePickerProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="block text-sm font-medium text-slate-700">Preferred date</span>
        <span className="text-xs text-slate-400">
          {isLoading ? "Refreshing..." : `${dates.length} bookable day${dates.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {isLoading && dates.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[78px] animate-pulse rounded-[24px] border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : dates.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-4 text-sm text-slate-500">
          No bookable days are currently available for this service.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {dates.map((date) => {
            const isSelected = value === date.date;

            return (
              <button
                key={date.date}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange(date.date)}
                className={[
                  "rounded-[24px] border px-4 py-4 text-left transition duration-200",
                  isSelected
                    ? "border-brand-300 bg-brand-50 shadow-soft ring-4 ring-brand-100"
                    : "border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{date.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{date.date}</p>
                  </div>
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
                    {date.slotCount} slot{date.slotCount === 1 ? "" : "s"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {error ? <span className="mt-2 block text-xs text-rose-600">{error}</span> : null}
    </div>
  );
}
