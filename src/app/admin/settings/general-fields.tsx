"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface GeneralFieldsProps {
  settings: Record<string, string>;
}

export function GeneralFields({ settings }: GeneralFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="siteName">
          Publication Name *
        </label>
        <Input
          id="siteName"
          name="siteName"
          defaultValue={settings.siteName || "CloudBlog"}
          required
          className="h-9 text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="siteDesc">
          Site Description (Tagline)
        </label>
        <Textarea
          id="siteDesc"
          name="siteDescription"
          defaultValue={settings.siteDescription || ""}
          rows={2}
          className="text-xs resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="postsPerPage">
            Articles Per Page
          </label>
          <Input
            id="postsPerPage"
            name="postsPerPage"
            type="number"
            min={1}
            max={50}
            defaultValue={settings.postsPerPage || "6"}
            className="h-9 text-xs font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="contactEmail">
            Contact Email
          </label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={settings.contactEmail || "contact@cloudblog.local"}
            className="h-9 text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="aboutText">
          About Summary
        </label>
        <Textarea
          id="aboutText"
          name="aboutText"
          defaultValue={settings.aboutText || ""}
          rows={3}
          className="text-xs resize-none"
        />
      </div>
    </div>
  );
}
