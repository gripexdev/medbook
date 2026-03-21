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
    <aside className="panel p-8">
      <p className="eyebrow">Booking Summary</p>
      <h2 className="mt-4 font-display text-3xl leading-none text-slate-900">
        {service?.name || "Choose a service"}
      </h2>
      <div className="mt-6 space-y-4 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 px-4 py-3">
          <span>Duration</span>
          <span className="font-semibold text-slate-900">{service?.duration || "--"}</span>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 px-4 py-3">
          <span>Price</span>
          <span className="font-semibold text-slate-900">{service?.price || "--"}</span>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 px-4 py-3">
          <span>Date</span>
          <span className="font-semibold text-slate-900">{formatBookingDate(preferredDate)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 px-4 py-3">
          <span>Time</span>
          <span className="font-semibold text-slate-900">{formatBookingTime(preferredTime)}</span>
        </div>
      </div>
      <div className="mt-8 rounded-[26px] bg-slate-900 px-5 py-5 text-sm text-slate-200">
        <p className="font-semibold text-white">Account details</p>
        <p className="mt-3">{fullName || "Your name will appear here."}</p>
        <p className="mt-1">{email || "Email pending"}</p>
        <p className="mt-1">{phone || "Phone pending"}</p>
      </div>
    </aside>
  );
}
