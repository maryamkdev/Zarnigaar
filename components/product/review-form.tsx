"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveProductReview, deleteProductReview, type ReviewResult } from "@/actions/reviews";

export function ReviewForm({ productId, existing }: {
  productId: string;
  existing: { rating: number; body: string } | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [body, setBody] = useState(existing?.body ?? "");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [pending, startTransition] = useTransition();

  function runAction(action: () => Promise<ReviewResult>) {
    setResult(null);
    startTransition(async () => {
      try {
        const response = await action();
        setResult(response);
        if (response.ok) {
          toast.success(response.message);
          router.refresh();
        }
      } catch {
        setResult({ ok: false, message: "Could not connect. Please try again." });
      }
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runAction(() => saveProductReview({ productId, rating, body }));
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <h3 className="font-heading text-xl">{existing ? "Your review" : "Write a review"}</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">Your account name will appear with your review. You can edit or remove it later.</p>
      <fieldset disabled={pending} className="space-y-5">
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Your rating</legend>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="cursor-pointer">
                <input type="radio" name="rating" value={value} required checked={rating === value}
                  onChange={() => setRating(value)} className="peer sr-only" aria-label={`${value} ${value === 1 ? "star" : "stars"}`} />
                <span className="flex h-11 w-11 items-center justify-center border border-border transition-colors hover:border-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground peer-checked:border-foreground">
                  <Star className={`h-5 w-5 ${value <= rating ? "fill-current text-foreground" : "text-muted-foreground/50"}`} strokeWidth={1.5} aria-hidden="true" />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="review-body" className="mb-2 block text-sm font-medium">Your review</label>
          <Textarea id="review-body" name="body" rows={5} required maxLength={2000}
            value={body} onChange={(event) => setBody(event.target.value)} aria-describedby="review-length"
            placeholder="Share your experience with this article." className="rounded-none" />
          <p id="review-length" className="mt-1 text-right text-xs text-muted-foreground">{body.length}/2,000</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" className="rounded-none px-5" disabled={pending}>
            {pending ? "Saving..." : existing ? "Update review" : "Post review"}
          </Button>
          {existing && <Button type="button" variant="ghost" size="lg" className="rounded-none"
            disabled={pending} onClick={() => runAction(() => deleteProductReview(productId))}>Remove review</Button>}
        </div>
      </fieldset>
      {result && <p role={result.ok ? "status" : "alert"} className={`text-sm ${result.ok ? "text-foreground" : "text-destructive"}`}>{result.message}</p>}
    </form>
  );
}
