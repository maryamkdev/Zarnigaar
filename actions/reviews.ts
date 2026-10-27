"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { reviewSchema, type ReviewInput } from "@/lib/validation/review";

export interface ReviewResult { ok: boolean; message: string }

export async function saveProductReview(input: ReviewInput): Promise<ReviewResult> {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check your review." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in to leave a review." };

  const { data: product } = await supabase.from("products").select("id")
    .eq("id", parsed.data.productId).eq("status", "active").maybeSingle();
  if (!product) return { ok: false, message: "This product is no longer available for reviews." };
  const { data: existing, error: lookupError } = await supabase.from("product_reviews").select("id")
    .eq("product_id", product.id).eq("user_id", user.id).maybeSingle();
  if (lookupError) return { ok: false, message: "Reviews are temporarily unavailable. Please try again later." };

  const content = { rating: parsed.data.rating, body: parsed.data.body };
  const { error } = existing
    ? await supabase.from("product_reviews").update(content).eq("id", existing.id).eq("user_id", user.id)
    : await supabase.from("product_reviews").insert({ product_id: product.id, ...content });
  if (error) return { ok: false, message: error.code === "23505"
    ? "You already reviewed this product. Refresh the page to edit your review."
    : "Could not save your review. Please try again." };
  revalidatePath("/", "layout");
  return { ok: true, message: existing ? "Your review has been updated." : "Thank you! Your review has been published." };
}

export async function deleteProductReview(productId: string): Promise<ReviewResult> {
  const parsed = reviewSchema.shape.productId.safeParse(productId);
  if (!parsed.success) return { ok: false, message: "Choose a valid product." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in to manage your review." };
  const { error } = await supabase.from("product_reviews").delete()
    .eq("product_id", parsed.data).eq("user_id", user.id);
  if (error) return { ok: false, message: "Could not remove your review. Please try again." };
  revalidatePath("/", "layout");
  return { ok: true, message: "Your review has been removed." };
}
