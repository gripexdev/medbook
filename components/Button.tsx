import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white shadow-sm hover:bg-brand-400 focus-visible:ring-brand-200",
  secondary:
    "border border-jira-border bg-jira-card text-jira-text-primary shadow-sm hover:bg-jira-hover focus-visible:ring-brand-100",
  ghost:
    "bg-transparent text-jira-text-secondary hover:bg-jira-hover hover:text-jira-text-primary focus-visible:ring-brand-100"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm"
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  fullWidth = false,
  className = ""
) {
  return [
    "inline-flex items-center justify-center gap-2 rounded font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, fullWidth, className)}
      {...props}
    >
      {children}
    </button>
  );
}
