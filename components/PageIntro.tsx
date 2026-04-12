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
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="label">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-jira-text-primary sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-jira-text-secondary">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
