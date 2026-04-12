import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function InputField({ label, error, className = "", id, ...props }: InputFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-jira-text-secondary">
        {label}
      </span>
      <input id={id} className={`field-base ${className}`.trim()} {...props} />
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-jira-danger">{error}</span>
      ) : null}
    </label>
  );
}
