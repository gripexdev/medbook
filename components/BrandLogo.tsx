import { useId } from "react";
import { siteConfig } from "@/config/site";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  showSubtitle?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function BrandMark({ className = "h-11 w-11" }: { className?: string }) {
  const gradientId = useId().replace(/:/g, "");
  const accentId = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="10" y1="8" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1D4ED8" />
          <stop offset="0.52" stopColor="#2563FF" />
          <stop offset="1" stopColor="#5FD2FF" />
        </linearGradient>
        <linearGradient id={accentId} x1="39.5" y1="12" x2="50.5" y2="23" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C7F0FF" />
          <stop offset="1" stopColor="#7DD3FC" />
        </linearGradient>
      </defs>

      <rect x="4" y="4" width="56" height="56" rx="18" fill={`url(#${gradientId})`} />
      <rect
        x="4.75"
        y="4.75"
        width="54.5"
        height="54.5"
        rx="17.25"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.18"
      />
      <path
        d="M20 45V23.5c0-2.76 2.24-5 5-5 2.1 0 4.03 1.08 5.14 2.86L32 24.5l1.86-3.14A6.02 6.02 0 0 1 39 18.5c2.76 0 5 2.24 5 5V45"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="45" cy="18.5" r="5.5" fill={`url(#${accentId})`} />
      <circle cx="45" cy="18.5" r="1.65" fill="#0F172A" fillOpacity="0.16" />
    </svg>
  );
}

export default function BrandLogo({
  className = "",
  markClassName,
  showSubtitle = true,
  titleClassName = "font-display text-[28px] leading-none tracking-[-0.05em] text-slate-950",
  subtitleClassName = "mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-400"
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <BrandMark className={markClassName || "h-11 w-11"} />
      <div>
        <p className={titleClassName}>{siteConfig.name}</p>
        {showSubtitle ? <p className={subtitleClassName}>{siteConfig.businessLabel}</p> : null}
      </div>
    </div>
  );
}
