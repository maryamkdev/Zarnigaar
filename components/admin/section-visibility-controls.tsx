"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { setHomepageSectionVisibility } from "@/actions/admin/sections";
import { HOMEPAGE_SECTIONS, HOMEPAGE_SECTION_IDS, type HomepageSectionId, type HomepageVisibility } from "@/lib/homepage-sections";

export function SectionVisibilityControls({ initialVisibility, configured }: {
  initialVisibility: HomepageVisibility;
  configured: boolean;
}) {
  const [visibility, setVisibility] = useState(initialVisibility);
  const [pending, startTransition] = useTransition();
  const [savingId, setSavingId] = useState<HomepageSectionId | null>(null);
  const [error, setError] = useState<string | null>(null);

  function changeVisibility(sectionId: HomepageSectionId, enabled: boolean) {
    const previous = visibility[sectionId];
    setVisibility(current => ({ ...current, [sectionId]: enabled }));
    setSavingId(sectionId);
    setError(null);
    startTransition(async () => {
      try {
        const result = await setHomepageSectionVisibility({ sectionId, enabled });
        if (result.ok) toast.success(result.message);
        else {
          setVisibility(current => ({ ...current, [sectionId]: previous }));
          setError(result.message);
        }
      } catch {
        setVisibility(current => ({ ...current, [sectionId]: previous }));
        setError("Could not save this change. Please try again.");
      } finally {
        setSavingId(null);
      }
    });
  }

  return (
    <div className="space-y-4">
      {!configured && <p role="alert" className="border border-border bg-beige/30 p-4 text-sm text-muted-foreground">Section controls are unavailable. Complete the website section setup, then refresh this page.</p>}
      <ul className="divide-y divide-border border border-border">
        {HOMEPAGE_SECTION_IDS.map(id => (
          <li key={id} className="flex items-center justify-between gap-5 p-5">
            <div>
              <label htmlFor={`section-${id}`} className="cursor-pointer text-sm font-medium">{HOMEPAGE_SECTIONS[id].label}</label>
              <p id={`section-${id}-description`} className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">{HOMEPAGE_SECTIONS[id].description}</p>
              <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
                {savingId === id ? "Saving..." : visibility[id] ? "Shown when content is available" : "Hidden"}
              </p>
            </div>
            <Switch id={`section-${id}`} aria-describedby={`section-${id}-description`}
              checked={visibility[id]} disabled={!configured || pending}
              onCheckedChange={enabled => changeVisibility(id, enabled)} />
          </li>
        ))}
      </ul>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
