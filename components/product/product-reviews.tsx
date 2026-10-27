import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProductReviews } from "@/data/reviews";
import { ReviewForm } from "@/components/product/review-form";
import { ProductRating, StarRating } from "@/components/product/star-rating";
import type { Product } from "@/types/catalog";

const reviewDate = new Intl.DateTimeFormat("en-PK", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Karachi" });

export async function ProductReviews({ product, page }: { product: Product; page: number }) {
  const supabase = await createClient();
  const [feedback, { data: { user } }] = await Promise.all([
    getProductReviews(product.id, page),
    supabase.auth.getUser(),
  ]);
  const ownReview = user && feedback.available
    ? await supabase.from("product_reviews").select("rating, body, updated_at")
      .eq("product_id", product.id).eq("user_id", user.id).maybeSingle()
    : null;
  const returnPath = `/product/${product.slug}#reviews`;
  const pageHref = (target: number) => `/product/${product.slug}?reviewsPage=${target}#reviews`;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="mt-16 scroll-mt-24 border-t border-border pt-10 sm:mt-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 id="reviews-heading" className="font-heading text-2xl sm:text-3xl">Customer Reviews</h2>
        <ProductRating averageRating={product.averageRating} reviewCount={product.reviewCount} />
      </div>
      {!feedback.available ? (
        <p className="py-6 text-sm text-muted-foreground">Reviews are temporarily unavailable. Please try again later.</p>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            {feedback.total === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">No reviews yet. Share your experience with this article.</p>
            ) : (
              <ul className="divide-y divide-border">
                {feedback.reviews.map((review) => (
                  <li key={review.id} className="py-6 first:pt-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div><p className="text-sm font-medium">{review.author_name}</p><div className="mt-2"><StarRating value={review.rating} /></div></div>
                      <time dateTime={review.created_at} className="text-xs text-muted-foreground">{reviewDate.format(new Date(review.created_at))}</time>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">{review.body}</p>
                  </li>
                ))}
              </ul>
            )}
            {feedback.pages > 1 && (
              <nav aria-label="Product review pages" className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-5 text-sm">
                {feedback.page > 1 ? <Link href={pageHref(feedback.page - 1)} className="underline underline-offset-4">Previous</Link> : <span />}
                <span className="text-xs text-muted-foreground">Page {feedback.page} of {feedback.pages}</span>
                {feedback.page < feedback.pages ? <Link href={pageHref(feedback.page + 1)} className="underline underline-offset-4">Next</Link> : <span />}
              </nav>
            )}
          </div>
          <div className="border border-border bg-background p-5 sm:p-7">
            {user ? ownReview?.error ? (
              <p className="text-sm text-muted-foreground">Your review could not be loaded. Please try again later.</p>
            ) : (
              <ReviewForm key={`${user.id}-${ownReview?.data?.updated_at ?? "new"}`} productId={product.id} existing={ownReview?.data ?? null} />
            ) : (
              <div className="space-y-3">
                <h3 className="font-heading text-xl">Share your experience</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">Sign in to rate this article and write a review.</p>
                <Link href={`/login?redirect=${encodeURIComponent(returnPath)}`} className="inline-block text-sm font-medium underline underline-offset-4">Sign in to write a review</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
