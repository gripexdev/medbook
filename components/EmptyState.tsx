import Link from "next/link";
import { buttonClasses } from "@/components/Button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string | null;
  actionLabel?: string;
};

export default function EmptyState({
  title,
  description,
  actionHref = "/booking",
  actionLabel = "Book an appointment"
}: EmptyStateProps) {
  return (
    <div className="panel-muted px-6 py-10 text-center">
      <p className="eyebrow">No appointments</p>
      <h3 className="mt-4 font-display text-3xl leading-none text-slate-900">{title}</h3>
      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">{description}</p>
      {actionHref ? (
        <Link href={actionHref} className={buttonClasses("primary", "md", false, "mt-6")}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
