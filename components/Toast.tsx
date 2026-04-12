type ToastProps = {
  title: string;
  message: string;
  variant?: "success" | "error";
};

export default function Toast({ title, message, variant = "success" }: ToastProps) {
  const styles =
    variant === "success"
      ? "border-l-4 border-l-jira-success bg-jira-success-bg text-jira-text-primary"
      : "border-l-4 border-l-jira-danger bg-jira-danger-bg text-jira-text-primary";

  return (
    <div
      className={`fixed bottom-4 right-4 z-[60] w-80 rounded-lg border border-jira-border shadow-overlay ${styles}`}
    >
      <div className="px-4 py-3">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-jira-text-secondary">{message}</p>
      </div>
    </div>
  );
}
