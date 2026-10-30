// Keep customer-facing summaries and policy pages consistent.
// Shipping prices come directly from the same rules used by checkout.
export const RETURN_WINDOW_DAYS = 7;
export const DISPATCH_ESTIMATE = "1–2 business days";
export const DELIVERY_ESTIMATE = "3–7 business days";
export const POLICY_UPDATED_DATE = "2026-10-30";
export const POLICY_UPDATED_LABEL = "30 October 2026";
export const SUPPORT_HREF = "/contact#contact-form";

export const POLICY_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/return-refund-policy", label: "Returns & Refunds" },
  { href: "/shipping-policy", label: "Shipping & Delivery" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
] as const;
