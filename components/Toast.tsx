type ToastProps = {
  title: string;
  message: string;
  variant?: "success" | "error";
};

export default function Toast({ title, message, variant = "success" }: ToastProps) {
  const styles =
    variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-rose-200 bg-rose-50 text-rose-900";

  return (
    <div className={`fixed bottom-5 right-5 z-[60] max-w-sm rounded-3xl border px-5 py-4 shadow-lift ${styles}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm opacity-80">{message}</p>
    </div>
  );
}
