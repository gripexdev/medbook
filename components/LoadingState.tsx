type LoadingStateProps = {
  rows?: number;
};

export default function LoadingState({ rows = 3 }: LoadingStateProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm"
        >
          <div className="h-4 w-24 rounded-full bg-stone-200" />
          <div className="mt-4 h-5 w-40 rounded-full bg-stone-200" />
          <div className="mt-4 h-3 w-full rounded-full bg-stone-100" />
          <div className="mt-2 h-3 w-5/6 rounded-full bg-stone-100" />
        </div>
      ))}
    </div>
  );
}
