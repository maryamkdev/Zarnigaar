import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().uuid("Choose a valid product."),
  rating: z.number().int().min(1, "Choose a star rating.").max(5),
  body: z.string().trim().min(1, "Write your review.").max(2000, "Keep your review within 2,000 characters."),
}).strict();

export type ReviewInput = z.infer<typeof reviewSchema>;

export function parseReviewPage(value: string | undefined): number {
  const page = Number(value ?? 1);
  return Number.isSafeInteger(page) && page >= 1 && page <= 10000 ? page : 1;
}
