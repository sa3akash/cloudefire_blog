"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HeroFieldsProps {
  settings: Record<string, string>;
}

export function HeroFields({ settings }: HeroFieldsProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-border/70">
      <h3 className="font-semibold text-sm font-heading">Homepage Hero & Call-to-Actions</h3>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="heroBadge">
          Hero Tagline Badge
        </label>
        <Input
          id="heroBadge"
          name="heroBadge"
          defaultValue={settings.heroBadge || "Next.js 16 + Cloudflare Free Tier"}
          className="h-9 text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="heroHeadline">
          Main Hero Headline
        </label>
        <Input
          id="heroHeadline"
          name="heroHeadline"
          defaultValue={settings.heroHeadline || "Engineering insights at the speed of light."}
          className="h-9 text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="heroSubheadline">
          Hero Subheadline / Introduction
        </label>
        <Textarea
          id="heroSubheadline"
          name="heroSubheadline"
          defaultValue={
            settings.heroSubheadline ||
            "Explore deep dives into systems architecture, edge computing, and modern web performance. Engineered with zero external hosting dependencies."
          }
          rows={2}
          className="text-xs resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="heroCtaPrimaryText">
            Primary Button Label
          </label>
          <Input
            id="heroCtaPrimaryText"
            name="heroCtaPrimaryText"
            defaultValue={settings.heroCtaPrimaryText || "Browse Articles"}
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="heroCtaPrimaryLink">
            Primary Button Link
          </label>
          <Input
            id="heroCtaPrimaryLink"
            name="heroCtaPrimaryLink"
            defaultValue={settings.heroCtaPrimaryLink || "/blog"}
            className="h-9 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="heroCtaSecondaryText">
            Secondary Button Label
          </label>
          <Input
            id="heroCtaSecondaryText"
            name="heroCtaSecondaryText"
            defaultValue={settings.heroCtaSecondaryText || "Architecture Overview"}
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="heroCtaSecondaryLink">
            Secondary Button Link
          </label>
          <Input
            id="heroCtaSecondaryLink"
            name="heroCtaSecondaryLink"
            defaultValue={settings.heroCtaSecondaryLink || "/about"}
            className="h-9 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
