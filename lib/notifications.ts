import { siteConfig } from "@/config/site";
import { formatBookingDate, formatBookingTime } from "@/lib/format";
import { sendTransactionalEmail } from "@/lib/email";
import { listReminderCandidates, markBookingNotificationSent } from "@/lib/bookings";
import type { BookingRecord, ReminderRunResult } from "@/lib/types";

function buildEmailFrame(content: { title: string; body: string; ctaLabel: string; ctaHref: string }) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f5f8fd; padding:32px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:24px; padding:32px; border:1px solid #e2e8f0;">
        <p style="font-size:12px; letter-spacing:0.24em; text-transform:uppercase; color:#2563eb; margin:0;">MEDBOOK</p>
        <h1 style="font-size:28px; line-height:1.1; margin:16px 0 0; color:#0f172a;">${content.title}</h1>
        <p style="font-size:15px; line-height:1.8; color:#475569; margin:18px 0 0;">${content.body}</p>
        <a href="${content.ctaHref}" style="display:inline-block; margin-top:24px; background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:999px; font-weight:600;">
          ${content.ctaLabel}
        </a>
      </div>
    </div>
  `;
}

function getDashboardUrl() {
  const appUrl = process.env.APP_URL?.trim();
  return appUrl ? `${appUrl}/dashboard` : "http://localhost:3000/dashboard";
}

function getBookingSummary(booking: BookingRecord) {
  return `${booking.serviceName} on ${formatBookingDate(booking.preferredDate)} at ${formatBookingTime(booking.preferredTime)}`;
}

export async function sendBookingConfirmationNotification(booking: BookingRecord) {
  const summary = getBookingSummary(booking);
  const result = await sendTransactionalEmail({
    to: booking.email,
    subject: `Booking confirmed: ${booking.serviceName}`,
    text: `Your appointment is confirmed for ${summary}. You can review it in your MEDBOOK dashboard.`,
    html: buildEmailFrame({
      title: "Your appointment is confirmed",
      body: `Your appointment for ${summary} has been successfully booked. You can review your booking details and future changes from the dashboard.`,
      ctaLabel: "Open dashboard",
      ctaHref: getDashboardUrl()
    })
  });

  if (result.status === "sent") {
    markBookingNotificationSent(booking.id, "confirmation");
  }

  return result;
}

export async function sendBookingCancellationNotification(booking: BookingRecord) {
  const summary = getBookingSummary(booking);
  const result = await sendTransactionalEmail({
    to: booking.email,
    subject: `Booking cancelled: ${booking.serviceName}`,
    text: `Your appointment for ${summary} has been cancelled. You can book a new appointment from your dashboard.`,
    html: buildEmailFrame({
      title: "Your appointment has been cancelled",
      body: `Your appointment for ${summary} has been cancelled. If you still need time with the team, you can book a new slot from your account.`,
      ctaLabel: "Book another appointment",
      ctaHref: getDashboardUrl().replace("/dashboard", "/booking")
    })
  });

  if (result.status === "sent") {
    markBookingNotificationSent(booking.id, "cancellation");
  }

  return result;
}

export async function sendReminderNotifications() {
  const candidates = listReminderCandidates(siteConfig.reminderLeadHours);
  const result: ReminderRunResult = {
    processed: candidates.length,
    sent: 0,
    skipped: 0,
    failed: 0
  };

  for (const booking of candidates) {
    const summary = getBookingSummary(booking);
    const delivery = await sendTransactionalEmail({
      to: booking.email,
      subject: `Reminder: ${booking.serviceName}`,
      text: `Reminder: you have an appointment scheduled for ${summary}.`,
      html: buildEmailFrame({
        title: "Appointment reminder",
        body: `This is a reminder that you have an appointment scheduled for ${summary}. If you need to review your booking, open your dashboard below.`,
        ctaLabel: "Review booking",
        ctaHref: getDashboardUrl()
      })
    });

    if (delivery.status === "sent") {
      result.sent += 1;
      markBookingNotificationSent(booking.id, "reminder");
    } else if (delivery.status === "skipped") {
      result.skipped += 1;
    } else {
      result.failed += 1;
    }
  }

  return result;
}
