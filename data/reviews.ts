import "server-only";
import { createClient } from "@/lib/supabase/server";

export const REVIEWS_PER_PAGE = 10;

export async function getProductRatingSummaries(productIds: string[]) {
  const summaries = new Map<string, { averageRating: number | null; reviewCount: number }>();
  if (productIds.length === 0) return summaries;
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_rating_summaries")
    .select("product_id, average_rating, review_count").in("product_id", productIds);
  if (error) {
    console.error("Could not load product ratings:", error.code);
    return summaries;
  }
  for (const id of productIds) summaries.set(id, { averageRating: null, reviewCount: 0 });
  for (const row of data ?? []) {
    summaries.set(row.product_id, { averageRating: Number(row.average_rating), reviewCount: row.review_count });
  }
  return summaries;
}

export async function getProductReviews(productId: string, requestedPage: number) {
  const supabase = await createClient();
  const { count, error: countError } = await supabase.from("product_reviews")
    .select("id", { count: "exact", head: true }).eq("product_id", productId);
  if (countError) return { available: false as const, reviews: [], total: 0, page: 1, pages: 1 };
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / REVIEWS_PER_PAGE));
  const page = Math.min(requestedPage, pages);
  const offset = (page - 1) * REVIEWS_PER_PAGE;
  const { data, error } = await supabase.from("product_reviews")
    .select("id, author_name, rating, body, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false }).order("id", { ascending: false })
    .range(offset, offset + REVIEWS_PER_PAGE - 1);
  return { available: !error, reviews: data ?? [], total, page, pages };
}
