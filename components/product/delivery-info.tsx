import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DELIVERY_ESTIMATE, DISPATCH_ESTIMATE, RETURN_WINDOW_DAYS } from "@/lib/store-policies";
import { FLAT_SHIPPING_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

export function DeliveryInfo() {
  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-2.5">
          <Truck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground">Delivery in {DELIVERY_ESTIMATE} across Pakistan.</p>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground">Cash on Delivery available.</p>
        </div>
        <div className="flex items-start gap-2.5">
          <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground">{RETURN_WINDOW_DAYS}-day return requests on unused items.</p>
        </div>
      </div>

      <Accordion className="mt-6">
        <AccordionItem value="delivery">
          <AccordionTrigger className="text-sm">Delivery Information</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Standard shipping is {formatPrice(FLAT_SHIPPING_RATE)}, with free shipping on merchandise subtotals of{" "}
            {formatPrice(FREE_SHIPPING_THRESHOLD)} or more. Dispatch is generally within {DISPATCH_ESTIMATE}, with
            typical delivery in {DELIVERY_ESTIMATE} depending on your city. See our{" "}
            <Link href="/shipping-policy" className="underline underline-offset-4">Shipping &amp; Delivery Policy</Link>.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="payment">
          <AccordionTrigger className="text-sm">Cash on Delivery &amp; Online Payment</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Pay with Cash on Delivery. Online payments are coming soon; available payment methods are shown at
            checkout. Do not share card details or payment PINs through the contact form.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="returns">
          <AccordionTrigger className="text-sm">Returns &amp; Exchanges</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Request a return within {RETURN_WINDOW_DAYS} days of delivery for unused articles in their original
            condition with tags attached. See our{" "}
            <Link href="/return-refund-policy" className="underline underline-offset-4">Return &amp; Refund Policy</Link>{" "}
            for eligibility, exchanges and refund arrangements.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
