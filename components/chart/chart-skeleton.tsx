import { Skeleton } from "@/components/ui/primitives";

export function ChartPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-28 w-full" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-20 shrink-0" />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
