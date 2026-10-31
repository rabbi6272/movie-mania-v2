import { Skeleton } from "@heroui/react";

// Mirrors SmallMovieCard; pass the page's own grid classes so placeholders sit where the cards will land.
export function CardGridSkeleton({ className, count = 20 }: { className: string; count?: number }) {
  return (
    <div className={className} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="w-full rounded-md lg:rounded-lg border border-gray-200 bg-white shadow-md overflow-hidden"
        >
          <Skeleton className="w-full aspect-3/4 rounded-none" />
          <div className="p-1 lg:p-2 space-y-1.5">
            <Skeleton className="h-3.5 lg:h-4 w-4/5 rounded-full" />
            <Skeleton className="h-2.5 lg:h-3 w-1/2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
