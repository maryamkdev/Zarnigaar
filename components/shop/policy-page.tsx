import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { POLICY_LINKS, POLICY_UPDATED_DATE, POLICY_UPDATED_LABEL, SUPPORT_HREF } from "@/lib/store-policies";
import { cn } from "@/lib/utils";

export function PolicyPage({ title, description, currentHref, children }: {
  title: string;
  description: string;
  currentHref: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-border bg-beige/30">
        <div className="container-page py-12 sm:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Zarnigaar / Customer care</p>
          <h1 className="mt-4 font-heading text-4xl sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
          <p className="mt-6 text-xs text-muted-foreground">
            Last updated <time dateTime={POLICY_UPDATED_DATE}>{POLICY_UPDATED_LABEL}</time>
          </p>
        </div>
      </header>
      <div className="container-page grid gap-10 py-10 sm:py-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        <aside className="h-fit min-w-0 lg:sticky lg:top-28">
          <nav aria-label="Store policies" className="flex overflow-x-auto border border-border lg:flex-col">
            {POLICY_LINKS.map(link => (
              <Link key={link.href} href={link.href} aria-current={link.href === currentHref ? "page" : undefined}
                className={cn("flex shrink-0 items-center justify-between gap-3 whitespace-nowrap border-r border-border px-5 py-4 text-sm last:border-r-0 hover:bg-beige/40 focus-visible:outline-2 focus-visible:outline-offset-2 lg:border-b lg:border-r-0 lg:last:border-b-0",
                  link.href === currentHref && "bg-beige/60 font-medium")}>
                {link.label}
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              </Link>
            ))}
          </nav>
          <div className="mt-5 hidden bg-beige/30 p-5 lg:block">
            <h2 className="font-heading text-xl">A little help?</h2>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">Send us your question and order number, if you have one.</p>
            <Link href={SUPPORT_HREF} className="mt-3 inline-flex items-center gap-2 text-sm underline underline-offset-4">
              Contact Zarnigaar <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
        <article aria-label={title} className="min-w-0 max-w-3xl space-y-9 text-sm leading-7 text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5">
          {children}
        </article>
      </div>
    </>
  );
}

export function PolicySection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <h2 id={`${id}-heading`} className="mb-3 font-heading text-2xl text-foreground">{title}</h2>
      {children}
    </section>
  );
}
