import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";
import { Cpu, Database, HardDrive, ShieldCheck, Zap, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Architecture | CloudBlog",
  description: "Learn how CloudBlog runs a production-grade publication platform entirely on Cloudflare's free tier.",
};

export default async function AboutPage() {
  const aboutText = await getSetting(
    "aboutText",
    "CloudBlog is an open-source, edge-native blogging platform engineered specifically for Cloudflare's free tier."
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-16">
      {/* Intro */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Edge Architecture Manifesto</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight leading-tight">
          Production Next.js on Cloudflare Free Tier
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {aboutText}
        </p>
      </div>

      {/* Free Tier Architecture Breakdown */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-heading tracking-tight">
            How CloudBlog Stays 100% Free
          </h2>
          <p className="text-sm text-muted-foreground">
            A real-world engineering blueprint that leverages Cloudflare&rsquo;s generous allowances without hitting limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
            <Cpu className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-base font-heading">Cloudflare Workers</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>100,000 requests/day</strong> free. Next.js App Router runs on Workers with sub-50ms cold starts globally.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
            <Database className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-base font-heading">Cloudflare D1</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>5M reads &amp; 100k writes/day</strong> free. Serverless SQLite with compound indexing and optimized pagination prevents database bloat.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
            <HardDrive className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-base font-heading">Cloudflare R2</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>10 GB storage with 0 egress fees</strong>. High-resolution media files are cached immutably across 300+ edge locations.
            </p>
          </div>
        </div>
      </section>

      {/* Architectural Principles */}
      <section className="space-y-6 p-8 rounded-2xl border border-border/80 bg-muted/20">
        <h2 className="text-xl font-bold font-heading tracking-tight">
          Core Architectural Principles
        </h2>
        <ul className="space-y-4 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground">Zero Vendor Lock-in in Business Logic:</strong> Storage, database, caching, and authentication are strictly decoupled behind clean TypeScript interfaces.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground">Server Components by Default:</strong> Zero client-side JavaScript sent for static prose content. Client components are reserved only for interactive features.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground">Privacy-Conscious Light Analytics:</strong> No invasive tracking scripts. View counters are deduplicated daily and run in zero-blocking background tasks.
            </div>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <div className="flex items-center justify-between p-6 rounded-2xl border border-border/80 bg-card text-center sm:text-left flex-col sm:flex-row gap-4">
        <div>
          <h3 className="font-bold text-base font-heading">Ready to write or inspect the CMS?</h3>
          <p className="text-xs text-muted-foreground">Explore the admin dashboard, post editor, and moderation panel.</p>
        </div>
        <Link href="/admin">
          <Button size="sm">Open Admin CMS</Button>
        </Link>
      </div>
    </div>
  );
}
