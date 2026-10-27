import { Star } from "lucide-react";

export function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, value - star + 1)) * 100;
        return (
          <span key={star} className="relative inline-block h-4 w-4" aria-hidden="true">
            <Star className="h-4 w-4 text-muted-foreground/40" strokeWidth={1.5} />
            <Star className="absolute inset-0 h-4 w-4 fill-current text-foreground" strokeWidth={1.5}
              style={{ clipPath: `inset(0 ${100 - fill}% 0 0)` }} />
          </span>
        );
      })}
    </span>
  );
}

export function ProductRating({ averageRating, reviewCount }: {
  averageRating: number | null;
  reviewCount: number | null;
}) {
  if (reviewCount === null) return <span className="text-xs text-muted-foreground">Reviews unavailable</span>;
  if (reviewCount === 0) return <span className="text-xs text-muted-foreground">Be the first to review</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <StarRating value={averageRating ?? 0} />
      <span>{averageRating?.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</span>
    </span>
  );
}
