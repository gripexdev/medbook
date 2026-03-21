import type { ReactNode } from "react";

type SectionShellProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

export default function SectionShell({ children, id, className = "" }: SectionShellProps) {
  return (
    <section id={id} className={`section-shell ${className}`.trim()}>
      {children}
    </section>
  );
}
