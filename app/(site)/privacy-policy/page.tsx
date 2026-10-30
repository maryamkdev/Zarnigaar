import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/shop/policy-page";
import { SUPPORT_HREF } from "@/lib/store-policies";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Zarnigaar uses account, order and contact information, and how to make a privacy request.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy" currentHref="/privacy-policy"
      description="Your information helps us look after your account, fulfil your orders and answer your questions. Here is how it is used when you shop with Zarnigaar.">
      <PolicySection id="information" title="Information we receive">
        <p>Zarnigaar is an online clothing and scarves store serving customers in Pakistan. When you use our store, we receive the information you choose to provide:</p>
        <ul>
          <li>Your name and email address when you create an account or send us a message.</li>
          <li>Your phone number, delivery address, city, province and postal code when you place an order.</li>
          <li>The items, sizes, colours, quantities, prices and payment status associated with your orders.</li>
          <li>Your saved wishlist, product ratings, reviews and correspondence with us.</li>
        </ul>
        <p>Website hosting and authentication services may also process technical information, including your IP address, browser details and request logs, to deliver and protect the service.</p>
      </PolicySection>
      <PolicySection id="use" title="How we use your information">
        <p>We use this information to manage your account, prepare and deliver orders, handle returns and order enquiries, maintain wishlists and reviews, and investigate errors or suspected misuse. We also retain records needed for payment reconciliation and our business obligations.</p>
        <p>Product reviews are public. Your review text, rating and profile display name can be shown with the product; your account email is not displayed as part of your review.</p>
      </PolicySection>
      <PolicySection id="providers" title="Who receives information">
        <p>Our store uses Supabase for account authentication and data storage, and Vercel for website hosting. Authorised team members can access information needed to manage the store and respond to requests. Delivery partners receive the contact and address information needed to deliver your parcel.</p>
        <p>When an online payment method is enabled, its payment provider receives the information needed to process and verify that transaction under its own privacy terms. Our order forms do not ask for card numbers, card security codes or wallet PINs. Please do not include them in contact messages.</p>
        <p>We do not sell customer personal information. Information may be disclosed where required to respond to a lawful request or to investigate fraud and protect customers.</p>
      </PolicySection>
      <PolicySection id="cookies" title="Cookies and browser storage">
        <p>Authentication cookies help maintain your signed-in session. Your browser also stores your shopping bag and guest wishlist locally so they remain available when you return to the store.</p>
        <p>You can clear cookies and website storage through your browser settings. This may sign you out and remove your saved shopping bag or guest wishlist from that browser.</p>
      </PolicySection>
      <PolicySection id="retention" title="Keeping information secure">
        <p>Account and order information is stored using our service providers, with access controls for customer and administrator accounts. No internet service can guarantee absolute security. Please keep your password private and avoid sending payment credentials through messages or reviews.</p>
        <p>We keep information for as long as it is needed for the purposes described here, including outstanding orders, support requests and required business records. We do not promise immediate deletion of records that must be retained.</p>
      </PolicySection>
      <PolicySection id="requests" title="Your questions and requests">
        <p>You can ask us to explain, correct or remove personal information associated with your account by using our <Link href={SUPPORT_HREF}>contact form</Link>. We may need to verify that the request relates to your own account before acting on it. Some order and transaction records may need to be retained.</p>
        <p>If this policy changes, we will update this page and its revision date.</p>
      </PolicySection>
    </PolicyPage>
  );
}
