import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/shop/policy-page";
import { DELIVERY_ESTIMATE, DISPATCH_ESTIMATE, SUPPORT_HREF } from "@/lib/store-policies";
import { FLAT_SHIPPING_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "Delivery coverage, shipping charges, dispatch estimates and order support for Zarnigaar customers in Pakistan.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage title="Shipping & Delivery" currentHref="/shipping-policy"
      description="We deliver across Pakistan. Here is what to expect from order preparation, delivery charges and the journey of your parcel.">
      <dl className="grid divide-y divide-border border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[
          ["Standard shipping", formatPrice(FLAT_SHIPPING_RATE)],
          ["Free shipping from", formatPrice(FREE_SHIPPING_THRESHOLD)],
          ["Typical delivery", DELIVERY_ESTIMATE],
        ].map(([label, value]) => (
          <div key={label} className="p-5">
            <dt className="text-xs uppercase tracking-wider">{label}</dt>
            <dd className="mt-2 text-base font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      <PolicySection id="coverage" title="Where we deliver">
        <p>Our checkout currently accepts delivery addresses within Pakistan. Courier serviceability can vary by area. If you are unsure about your location, please <Link href={SUPPORT_HREF}>contact us</Link> before ordering. International delivery is not currently offered through this checkout.</p>
      </PolicySection>
      <PolicySection id="charges" title="Delivery charges">
        <p>Standard shipping is {formatPrice(FLAT_SHIPPING_RATE)} per order. Shipping is free when the merchandise subtotal reaches {formatPrice(FREE_SHIPPING_THRESHOLD)} or more. The threshold is checked before a discount code is deducted, in line with our checkout calculation.</p>
        <p>Your delivery charge and order total are shown in your shopping bag and again at checkout before you place the order. Prices on the store are in Pakistani rupees (PKR).</p>
      </PolicySection>
      <PolicySection id="timing" title="Preparation and delivery estimates">
        <p>Orders are generally prepared for dispatch within {DISPATCH_ESTIMATE}. Typical delivery is {DELIVERY_ESTIMATE}, depending on your city and courier service. These are estimates, not a guaranteed delivery date.</p>
        <p>Weekends, public holidays, busy shopping periods, weather and courier disruptions may affect timing. If your order is needed for a particular date, ask us before placing it.</p>
      </PolicySection>
      <PolicySection id="address" title="Your delivery details">
        <p>Please enter your complete address, city, province, postal code, email address and an active phone number. Incomplete information or an unreachable recipient can delay delivery.</p>
        <p>Request address changes through the <Link href={SUPPORT_HREF}>contact form</Link> as soon as possible. Changes after dispatch depend on the courier and cannot be guaranteed.</p>
      </PolicySection>
      <PolicySection id="tracking" title="Tracking and delivery issues">
        <p>You can ask us for the status of your order and any available courier tracking reference by quoting your order number. If a parcel is late, missing or marked as delivered when you have not received it, contact us so we can check the delivery with the courier.</p>
        <p>If delivery cannot be completed, contact us to discuss the next steps. Any further courier charge will be confirmed before a redelivery is arranged.</p>
      </PolicySection>
      <PolicySection id="payment" title="Payment and parcel checks">
        <p>Cash on Delivery is currently available. Online payments are coming soon; the checkout will show any additional payment methods when they become available.</p>
        <p>Please check your order when it arrives and keep the packaging if an article is damaged, missing or incorrect. See our <Link href="/return-refund-policy">Return & Refund Policy</Link> for the request process.</p>
      </PolicySection>
    </PolicyPage>
  );
}
