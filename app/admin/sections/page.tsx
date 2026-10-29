import Link from "next/link";
import { getHomepageSections } from "@/data/homepage-sections";
import { SectionVisibilityControls } from "@/components/admin/section-visibility-controls";

export default async function WebsiteSectionsPage() {
  const settings = await getHomepageSections();
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl">Website Sections</h1>
        <Link href="/" className="text-sm underline underline-offset-4">View website</Link>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">Show or hide sections on the home page. Changes save automatically. Unused promotion tiles start hidden, and empty product rows stay hidden.</p>
      <SectionVisibilityControls key={JSON.stringify(settings.visibility)} initialVisibility={settings.visibility} configured={settings.configured} />
    </div>
  );
}
