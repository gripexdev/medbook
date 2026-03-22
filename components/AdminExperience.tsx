"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminBookingCard from "@/components/AdminBookingCard";
import AdminBookingListItem from "@/components/AdminBookingListItem";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import InputField from "@/components/InputField";
import LoadingState from "@/components/LoadingState";
import PageIntro from "@/components/PageIntro";
import SelectField from "@/components/SelectField";
import Toast from "@/components/Toast";
import { buttonClasses } from "@/components/Button";
import { getLocalDateInputValue } from "@/lib/format";
import { getWeekdayLabel } from "@/lib/schedule";
import { flattenFieldErrors } from "@/lib/validators";
import type {
  AdminBookingStatusFilter,
  AdminBookingSummary,
  AdminBookingsResult,
  AvailabilityWindowRecord,
  BlackoutDateRecord,
  BookingRecord,
  BookingStatus,
  PaginationMeta,
  SessionUser
} from "@/lib/types";

type AdminExperienceProps = {
  user: SessionUser;
};

type WindowFormErrors = Partial<Record<"weekday" | "startTime" | "endTime", string>>;
type BlackoutFormErrors = Partial<Record<"date" | "reason", string>>;

const initialSummary: AdminBookingSummary = {
  total: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
  today: 0
};

const initialPagination: PaginationMeta = {
  page: 1,
  pageSize: 8,
  total: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false
};

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, "end-ellipsis", totalPages];
  }

  if (page >= totalPages - 2) {
    return [1, "start-ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "start-ellipsis", page - 1, page, page + 1, "end-ellipsis", totalPages];
}

function SummaryCard({
  label,
  value,
  description
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <article className="panel-muted px-5 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-4 font-display text-[36px] leading-none tracking-[-0.05em] text-slate-950">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  );
}

function SectionHeading({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="font-display text-[26px] leading-none tracking-[-0.04em] text-slate-950 sm:text-[30px]">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
      </div>
      {action ? <div className="sm:pt-1">{action}</div> : null}
    </div>
  );
}

export default function AdminExperience({ user }: AdminExperienceProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [summary, setSummary] = useState<AdminBookingSummary>(initialSummary);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const [statusFilter, setStatusFilter] = useState<AdminBookingStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [windows, setWindows] = useState<AvailabilityWindowRecord[]>([]);
  const [blackouts, setBlackouts] = useState<BlackoutDateRecord[]>([]);
  const [isBookingsLoading, setIsBookingsLoading] = useState(true);
  const [isSchedulingLoading, setIsSchedulingLoading] = useState(true);
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
    const timeout = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const loadBookings = useCallback(
    async (silent = false) => {
      if (!silent) {
        setIsBookingsLoading(true);
      }

      try {
        const searchParams = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          status: statusFilter
        });

        if (searchQuery) {
          searchParams.set("q", searchQuery);
        }

        const response = await fetch(`/api/admin/bookings?${searchParams.toString()}`, {
          cache: "no-store"
        });
        const data = (await response.json()) as Partial<AdminBookingsResult> & { error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Unable to load bookings.");
        }

        setBookings(data.bookings || []);
        setSummary(data.summary || initialSummary);
        setPagination(data.pagination || initialPagination);
        setPage(data.filters?.page || 1);
      } catch (error) {
        setToast({
          title: "Unable to load bookings",
          message: error instanceof Error ? error.message : "Something went wrong.",
          variant: "error"
        });
      } finally {
        setIsBookingsLoading(false);
      }
    },
    [page, pageSize, searchQuery, statusFilter]
  );

  const loadSchedulingData = useCallback(async () => {
    setIsSchedulingLoading(true);

    try {
      const [windowsResponse, blackoutsResponse] = await Promise.all([
        fetch("/api/admin/availability/windows", { cache: "no-store" }),
        fetch("/api/admin/availability/blackouts", { cache: "no-store" })
      ]);

      const [windowsData, blackoutsData] = await Promise.all([
        windowsResponse.json(),
        blackoutsResponse.json()
      ]);

      if (!windowsResponse.ok) {
        throw new Error(windowsData?.error || "Unable to load availability windows.");
      }

      if (!blackoutsResponse.ok) {
        throw new Error(blackoutsData?.error || "Unable to load blackout dates.");
      }

      setWindows(windowsData.windows || []);
      setBlackouts(blackoutsData.blackouts || []);
    } catch (error) {
      setToast({
        title: "Unable to load scheduling controls",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
    } finally {
      setIsSchedulingLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    void loadSchedulingData();
  }, [loadSchedulingData]);

  useEffect(() => {
    if (bookings.length === 0) {
      setSelectedBookingId("");
      return;
    }

    setSelectedBookingId((current) =>
      bookings.some((booking) => booking.id === current) ? current : bookings[0]?.id || ""
    );
  }, [bookings]);

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

      await loadBookings(true);
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
      setToast({
        title: "Availability removed",
        message: "The weekly window has been deleted.",
        variant: "success"
      });
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
      setToast({
        title: "Blackout removed",
        message: "The unavailable date has been deleted.",
        variant: "success"
      });
    } catch (error) {
      setToast({
        title: "Delete failed",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
    }
  };

  const hasActiveFilters = statusFilter !== "all" || searchInput.trim().length > 0;
  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.id === selectedBookingId) || null,
    [bookings, selectedBookingId]
  );
  const pageLabel =
    pagination.total === 0
      ? "No appointments found"
      : `Showing ${(pagination.page - 1) * pagination.pageSize + 1}-${Math.min(
          pagination.page * pagination.pageSize,
          pagination.total
        )} of ${pagination.total} appointments`;
  const visiblePages = useMemo(
    () => getVisiblePages(pagination.page, pagination.totalPages),
    [pagination.page, pagination.totalPages]
  );

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);

    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      window.requestAnimationFrame(() => {
        document.getElementById("admin-booking-details")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    }
  };

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8">
        <section className="panel product-shell overflow-hidden p-6 sm:p-8 md:p-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] xl:items-end">
            <PageIntro
              eyebrow="Admin dashboard"
              title="Operate appointments, availability, and client flow from one workspace"
              description="Use this control center to keep booking operations clean: review appointments, adjust live status, define working hours, and block unavailable days."
              action={
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => void loadBookings()} variant="secondary">
                    Refresh bookings
                  </Button>
                  <Link href="/booking" className={buttonClasses("primary", "md")}>
                    Open booking flow
                  </Link>
                </div>
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel px-5 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Signed in</p>
                <p className="mt-3 text-base font-semibold text-slate-950">{user.name}</p>
                <p className="mt-1 break-all text-sm text-slate-500">{user.email}</p>
              </div>
              <div className="panel px-5 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Operational focus</p>
                <p className="mt-3 text-base font-semibold text-slate-950">Keep confirmed slots accurate</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Status changes immediately affect public availability and email workflow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard label="Total appointments" value={summary.total} description="All bookings currently stored in the system." />
          <SummaryCard label="Confirmed" value={summary.confirmed} description="Slots actively reserved for clients." />
          <SummaryCard label="Completed" value={summary.completed} description="Appointments already fulfilled by the team." />
          <SummaryCard label="Cancelled" value={summary.cancelled} description="Bookings released back into availability." />
          <SummaryCard label="Today" value={summary.today} description="Appointments scheduled for the current day." />
        </section>

        <section className="panel p-6 sm:p-8">
          <SectionHeading
            title="Appointment operations"
            description="Review the queue in a compact list. Open only the appointment you want to manage, then update status and inspect client details in the side panel."
            action={
              <Button variant="secondary" size="sm" onClick={() => void loadBookings()}>
                Refresh
              </Button>
            }
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_200px_160px]">
            <InputField
              label="Search appointments"
              placeholder="Client, service, email, date, or phone"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setPage(1);
              }}
            />
            <SelectField
              label="Status"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as AdminBookingStatusFilter);
                setPage(1);
              }}
            >
              <option value="all">All statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </SelectField>
            <SelectField
              label="Rows per page"
              value={String(pageSize)}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
            >
              <option value="8">8 per page</option>
              <option value="12">12 per page</option>
              <option value="16">16 per page</option>
              <option value="24">24 per page</option>
            </SelectField>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">{pageLabel}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                {hasActiveFilters ? "Filtered queue" : "Operational queue"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {hasActiveFilters ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchInput("");
                    setSearchQuery("");
                    setStatusFilter("all");
                    setPage(1);
                  }}
                >
                  Clear filters
                </Button>
              ) : null}
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                {selectedBooking ? "Detail panel active" : "No appointment selected"}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.72fr)]">
            <div>
              {isBookingsLoading ? (
                <LoadingState rows={5} />
              ) : bookings.length === 0 ? (
                hasActiveFilters ? (
                  <div className="panel-muted px-6 py-10 text-center">
                    <p className="eyebrow">No results</p>
                    <h3 className="mt-4 font-display text-[28px] leading-none text-slate-900 sm:text-3xl">
                      No appointments match the current filters
                    </h3>
                    <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-600">
                      Change the status filter or search query to widen the result set.
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => {
                        setSearchInput("");
                        setSearchQuery("");
                        setStatusFilter("all");
                        setPage(1);
                      }}
                    >
                      Reset filters
                    </Button>
                  </div>
                ) : (
                  <EmptyState
                    title="No bookings in the system"
                    description="Once clients start booking, appointments will appear here for review, confirmations, and day-of operations."
                    actionHref="/booking"
                    actionLabel="Open booking page"
                  />
                )
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <AdminBookingListItem
                      key={booking.id}
                      booking={booking}
                      isSelected={booking.id === selectedBookingId}
                      onSelect={handleSelectBooking}
                    />
                  ))}
                </div>
              )}

              {pagination.totalPages > 1 ? (
                <div className="mt-8 flex flex-col gap-4 border-t border-slate-200/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!pagination.hasPreviousPage}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      Previous
                    </Button>
                    {visiblePages.map((pageItem) =>
                      typeof pageItem === "number" ? (
                        <button
                          key={pageItem}
                          type="button"
                          className={buttonClasses(
                            pageItem === pagination.page ? "primary" : "ghost",
                            "sm",
                            false,
                            "min-w-[42px] rounded-full border border-transparent"
                          )}
                          onClick={() => setPage(pageItem)}
                        >
                          {pageItem}
                        </button>
                      ) : (
                        <span key={pageItem} className="px-2 text-sm text-slate-400">
                          ...
                        </span>
                      )
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!pagination.hasNextPage}
                      onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <div id="admin-booking-details">
              <AdminBookingCard
                booking={selectedBooking}
                onStatusChange={handleBookingStatusChange}
                isPending={pendingBookingId === selectedBooking?.id}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-2">
          <section className="panel p-6 sm:p-8">
            <SectionHeading
              title="Weekly availability"
              description="Define recurring working hours. These windows are used to generate public appointment slots."
            />

            <form className="mt-8 grid gap-4" onSubmit={handleWindowSubmit}>
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
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
              <Button type="submit" disabled={isSavingWindow} className="w-full">
                {isSavingWindow ? "Saving..." : "Add availability window"}
              </Button>
            </form>

            <div className="mt-8 space-y-3">
              {isSchedulingLoading ? (
                <LoadingState rows={3} />
              ) : windows.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 px-5 py-5 text-sm leading-7 text-slate-500">
                  No weekly availability has been configured yet.
                </div>
              ) : (
                windows.map((window) => (
                  <div
                    key={window.id}
                    className="flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/90 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{getWeekdayLabel(window.weekday)}</p>
                      <p className="mt-1 text-sm text-slate-500">
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
          </section>

          <section className="panel p-6 sm:p-8">
            <SectionHeading
              title="Blackout dates"
              description="Block full days when the team is unavailable, on holiday, or otherwise closed."
            />

            <form className="mt-8 grid gap-4" onSubmit={handleBlackoutSubmit}>
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
                placeholder="Holiday, maintenance, clinic closure..."
                value={blackoutForm.reason}
                onChange={(event) => setBlackoutForm((current) => ({ ...current, reason: event.target.value }))}
                error={blackoutErrors.reason}
              />
              <Button type="submit" disabled={isSavingBlackout} className="w-full">
                {isSavingBlackout ? "Saving..." : "Add blackout date"}
              </Button>
            </form>

            <div className="mt-8 space-y-3">
              {isSchedulingLoading ? (
                <LoadingState rows={2} />
              ) : blackouts.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 px-5 py-5 text-sm leading-7 text-slate-500">
                  No blackout dates are currently set.
                </div>
              ) : (
                blackouts.map((blackout) => (
                  <div
                    key={blackout.id}
                    className="flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/90 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{blackout.date}</p>
                      <p className="mt-1 text-sm text-slate-500">{blackout.reason || "Blackout date"}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteBlackout(blackout.id)}>
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>
      </div>

      {toast ? <Toast {...toast} /> : null}
    </div>
  );
}
