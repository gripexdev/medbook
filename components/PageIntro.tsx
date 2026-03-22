import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  centered?: boolean;
};

export default function PageIntro({
  eyebrow,
  title,
  description,
  action,
  centered = false
}: PageIntroProps) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 font-display text-[32px] font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-[38px] md:text-[54px]">
        {title}
      </h1>
      <p className="mt-4 text-sm leading-7 text-slate-600 md:text-[17px]">{description}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
