import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/shop/policy-page";
import { RETURN_WINDOW_DAYS, SUPPORT_HREF } from "@/lib/store-policies";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "Zarnigaar return eligibility, exchanges, cancellations and the process for requesting a refund.",
};

export default function ReturnRefundPolicyPage() {
  return (
    <PolicyPage title="Returns & Refunds" currentHref="/return-refund-policy"
      description="If something is not right with your order, get in touch so we can review it with you. Please read the steps below before sending an article back.">
      <div className="border-l-2 border-ink bg-beige/30 p-5 text-foreground">
        Request a return within <strong>{RETURN_WINDOW_DAYS} days of delivery</strong>. Keep the article unused, with its tags and packaging, while we review your request.
      </div>
      <PolicySection id="eligibility" title="When an article can be returned">
        <p>Contact us within {RETURN_WINDOW_DAYS} days of receiving your order. Articles should be unworn, unwashed, unaltered and in their original condition with tags attached. Keep the original packaging and your order confirmation or other proof of purchase.</p>
        <p>If your item arrived damaged, defective or different from what you ordered, explain the issue when you contact us and keep clear photographs of the article and packaging. We will explain how to share any photographs needed for the review. Please avoid using or altering the article before the issue has been reviewed.</p>
      </PolicySection>
      <PolicySection id="request" title="How to request a return or exchange">
        <ol>
          <li>Send a request through the <Link href={SUPPORT_HREF}>Zarnigaar contact form</Link>, including your order number, the article name and the reason for your request.</li>
          <li>We will review the details and ask for photographs or further information where needed.</li>
          <li>Wait for our confirmation and return instructions before posting the parcel. We will confirm the return address and any applicable courier charges with you.</li>
          <li>Pack the article securely and keep your courier receipt and tracking number until the request is resolved.</li>
        </ol>
      </PolicySection>
      <PolicySection id="inspection" title="Inspection and exchanges">
        <p>Returned articles are inspected against the request and the eligibility conditions above. We will explain the outcome and any issue that prevents a return from being accepted.</p>
        <p>Exchanges depend on the requested size, colour or article being available. Any price difference and delivery charges will be confirmed before an exchange is arranged. If a replacement is unavailable, we will discuss the available resolution with you.</p>
      </PolicySection>
      <PolicySection id="refunds" title="Refunds and payment method">
        <p>If a refund is approved, we will confirm the amount, payment method and expected processing time with you. A return request or a parcel being delivered back to us does not by itself confirm that a refund has been approved.</p>
        <p>For an online payment, an approved refund will be returned to the original payment method where the payment provider supports it. For Cash on Delivery, we will agree a suitable refund method with you after verifying the order. Banks and payment providers may take additional time to show a completed refund.</p>
        <p>Any treatment of original delivery charges or return courier costs will be explained as part of the resolution before you send the parcel. If you are unsure, ask us before booking a courier.</p>
      </PolicySection>
      <PolicySection id="cancellations" title="Cancellations and unavailable items">
        <p>To request a cancellation or an order change, contact us as soon as possible with your order number. We can review requests before dispatch; once a parcel has been dispatched, the return process applies.</p>
        <p>If an article cannot be supplied, we will contact you about the affected item. Any amount already paid for an item we cannot fulfil will be refunded, with the refund arrangements confirmed with you.</p>
      </PolicySection>
      <PolicySection id="help" title="Help with an existing request">
        <p>Please use the <Link href={SUPPORT_HREF}>contact form</Link> and quote your order number and any return tracking reference. Do not send card security codes, wallet PINs, passwords or one-time passcodes.</p>
      </PolicySection>
    </PolicyPage>
  );
}
