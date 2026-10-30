import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shop/page-header";
import { ContactForm } from "@/components/shop/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact Us" description="We'd love to hear from you." />
      <div className="container-page grid gap-14 py-14 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-xl">Get in Touch</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            For order queries, sizing help or anything else, reach out and our team will respond within 1-2 business
            days.
          </p>

          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Use the form for delivery questions, returns, cancellations or a privacy request. If you have an order,
            include its order number and the email address used at checkout. Please do not include payment PINs,
            card security codes or passwords.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <Link href="/shipping-policy" className="underline underline-offset-4">Shipping & Delivery</Link>
            <Link href="/return-refund-policy" className="underline underline-offset-4">Returns & Refunds</Link>
            <Link href="/privacy-policy" className="underline underline-offset-4">Privacy Policy</Link>
          </div>
        </div>

        <div id="contact-form" className="scroll-mt-28">
          <h2 className="font-heading text-xl">Send a Message</h2>
          <div className="mt-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
