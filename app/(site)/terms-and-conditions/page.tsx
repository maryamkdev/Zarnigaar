import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/shop/policy-page";
import { SUPPORT_HREF } from "@/lib/store-policies";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using Zarnigaar, placing an order, product information, payment and customer support.",
};

export default function TermsAndConditionsPage() {
  return (
    <PolicyPage title="Terms & Conditions" currentHref="/terms-and-conditions"
      description="These terms explain how to use our store and what to expect when placing an order with Zarnigaar. Please read them alongside our privacy, shipping and return policies.">
      <PolicySection id="store" title="Using the Zarnigaar store">
        <p>Zarnigaar offers clothing, scarves and related articles through this website. Use the store for lawful shopping and enquiries, provide accurate details and keep your account access private. Please do not interfere with the site, access another customer’s account or submit misleading reviews or information.</p>
      </PolicySection>
      <PolicySection id="articles" title="Article information and availability">
        <p>Check each product page for the article description, available sizes, colours and any fabric or care information provided for that item. Fabric details are specific to each article. Photographs can appear slightly different depending on lighting and screen settings.</p>
        <p>Availability may change. If an ordered article cannot be supplied or its listing contains an error that affects your order, we will contact you to explain the issue and the available next steps.</p>
      </PolicySection>
      <PolicySection id="orders" title="Orders, prices and payment">
        <p>Prices and checkout totals are in Pakistani rupees (PKR). Delivery charges and applicable discounts are shown before the order is placed. Please check your selected size, colour, quantity and delivery details before submitting.</p>
        <p>An order number records your order; it does not mean an online payment has been completed. Cash on Delivery is currently available, and online payments are coming soon. Never send payment credentials through our contact form.</p>
      </PolicySection>
      <PolicySection id="fulfilment" title="Delivery, cancellations and returns">
        <p>Our <Link href="/shipping-policy">Shipping & Delivery Policy</Link> explains coverage, charges and estimated timings. Our <Link href="/return-refund-policy">Return & Refund Policy</Link> explains return eligibility, exchanges, cancellations and approved refunds.</p>
        <p>Please contact us promptly if you need help with an order. Changes and cancellations depend on whether it has already been dispatched.</p>
      </PolicySection>
      <PolicySection id="privacy" title="Accounts, reviews and privacy">
        <p>Our <Link href="/privacy-policy">Privacy Policy</Link> describes how customer information, cookies and browser storage are used. When posting a review, share your own experience and avoid including contact details, payment information or another person’s private information.</p>
      </PolicySection>
      <PolicySection id="content" title="Website content and updates">
        <p>Website content is provided to help you browse and purchase our articles. Please obtain permission before using Zarnigaar branding, photographs or original website content for commercial purposes.</p>
        <p>We may update these pages as the store or its services change. The date on each policy shows its latest revision. These terms do not limit rights available to you under applicable law.</p>
      </PolicySection>
      <PolicySection id="contact" title="Contact us">
        <p>For questions about these terms or an existing order, use the <Link href={SUPPORT_HREF}>Zarnigaar contact form</Link>. Include your order number when your enquiry relates to a purchase.</p>
      </PolicySection>
    </PolicyPage>
  );
}
