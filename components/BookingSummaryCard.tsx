import { siteConfig } from "@/config/site";
import { formatBookingDate, formatBookingTime } from "@/lib/format";

type BookingSummaryCardProps = {
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  fullName: string;
  email: string;
  phone: string;
};

export default function BookingSummaryCard({
  serviceId,
  preferredDate,
  preferredTime,
  fullName,
  email,
  phone
}: BookingSummaryCardProps) {
  const service = siteConfig.services.find((item) => item.id === serviceId) || siteConfig.services[0];

  return (
    <aside className="panel p-6 sm:p-8">
      <p className="eyebrow">Booking Summary</p>
      <h2 className="mt-4 font-display text-[28px] leading-none text-slate-900 sm:text-3xl">
        {service?.name || "Choose a service"}
      </h2>
      <div className="mt-6 space-y-4 text-sm text-slate-600">
        <div className="flex flex-col gap-1 rounded-2xl bg-stone-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Duration</span>
          <span className="font-semibold text-slate-900">{service?.duration || "--"}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-stone-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Price</span>
          <span className="font-semibold text-slate-900">{service?.price || "--"}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-stone-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Date</span>
          <span className="font-semibold text-slate-900">{formatBookingDate(preferredDate)}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-stone-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Time</span>
          <span className="font-semibold text-slate-900">{formatBookingTime(preferredTime)}</span>
        </div>
      </div>
      <div className="mt-8 rounded-[26px] bg-slate-900 px-5 py-5 text-sm text-slate-200">
        <p className="font-semibold text-white">Account details</p>
        <p className="mt-3">{fullName || "Your name will appear here."}</p>
        <p className="mt-1 break-all">{email || "Email pending"}</p>
        <p className="mt-1">{phone || "Phone pending"}</p>
      </div>
    </aside>
  );
}
