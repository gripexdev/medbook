"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppointmentCard from "@/components/AppointmentCard";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import PageIntro from "@/components/PageIntro";
import Toast from "@/components/Toast";
import { buttonClasses } from "@/components/Button";
import type { BookingRecord, SessionUser } from "@/lib/types";

type DashboardExperienceProps = {
  user: SessionUser;
};

export default function DashboardExperience({ user }: DashboardExperienceProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState("");
  const [toast, setToast] = useState<{ title: string; message: string; variant: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await fetch("/api/bookings", {
          cache: "no-store"
        });
        const data = await response.json();

        if (response.status === 401) {
          router.replace("/login?redirectTo=%2Fdashboard");
          return;
        }

        if (!response.ok) {
          throw new Error(data?.error || "Unable to load appointments.");
        }

        startTransition(() => {
          setBookings(data.bookings || []);
        });
      } catch (error) {
        setToast({
          title: "Unable to load",
          message: error instanceof Error ? error.message : "Something went wrong.",
          variant: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [router]);

  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;

  const handleCancel = async (id: string) => {
    setPendingId(id);

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to cancel appointment.");
      }

      startTransition(() => {
        setBookings((current) =>
          current.map((booking) => (booking.id === id ? data.booking : booking))
        );
      });

      setToast({
        title: "Appointment updated",
        message: "The booking has been cancelled and your slot is now released.",
        variant: "success"
      });
    } catch (error) {
      setToast({
        title: "Cancellation failed",
        message: error instanceof Error ? error.message : "Something went wrong.",
        variant: "error"
      });
    } finally {
      setPendingId("");
    }
  };

  return (
    <div className="section-shell py-16">
      <div className="panel p-6 sm:p-8 md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <PageIntro
            eyebrow="Dashboard"
            title={`Welcome back, ${user.name.split(" ")[0]}.`}
            description="Your appointments are linked to your signed-in account, with private history and secure cancellation controls."
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {user.role === "admin" ? (
              <Link href="/admin" className={buttonClasses("secondary", "sm", false, "w-full sm:w-auto")}>
                Open admin
              </Link>
            ) : null}
            <Link href="/booking" className={buttonClasses("primary", "sm", false, "w-full sm:w-auto")}>
              Book another appointment
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="panel-muted px-5 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Account</p>
            <p className="mt-3 break-all text-sm font-semibold text-slate-900">{user.email}</p>
          </div>
          <div className="panel-muted px-5 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total bookings</p>
            <p className="mt-3 font-display text-[32px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
              {bookings.length}
            </p>
          </div>
          <div className="panel-muted px-5 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Confirmed</p>
            <p className="mt-3 font-display text-[32px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
              {confirmedBookings}
            </p>
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <LoadingState rows={3} />
          ) : bookings.length === 0 ? (
            <EmptyState
              title="No appointments booked yet"
              description="Create your first appointment to populate the dashboard with confirmed bookings tied to your account."
            />
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <AppointmentCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancel}
                  isPending={pendingId === booking.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {toast ? <Toast {...toast} /> : null}
    </div>
  );
}
