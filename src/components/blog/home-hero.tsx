import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Database, HardDrive, Globe, Sparkles } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-primary/5 via-card to-background p-6 sm:p-10 md:p-12 text-center md:text-left shadow-sm">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-mono shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next.js 16 + Cloudflare Free Tier</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight">
            Engineering insights at the <span className="text-primary underline decoration-primary/30">speed of light</span>.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Explore deep dives into systems architecture, edge computing, and modern web performance. Engineered with zero external hosting dependencies.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start">
            <Link href="/blog">
              <Button className="gap-2 shadow-sm font-semibold">
                <span>Browse Articles</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="font-medium">
                Architecture Overview
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-left">
          <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-xs hover:border-primary/40 transition-colors">
            <Globe className="w-5 h-5 text-primary mb-2" />
            <div className="font-bold text-sm font-heading">300+ Edge PoPs</div>
            <div className="text-[11px] text-muted-foreground">Workers global network</div>
          </div>
          <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-xs hover:border-primary/40 transition-colors">
            <Database className="w-5 h-5 text-primary mb-2" />
            <div className="font-bold text-sm font-heading">Cloudflare D1</div>
            <div className="text-[11px] text-muted-foreground">Serverless SQLite</div>
          </div>
          <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-xs hover:border-primary/40 transition-colors">
            <HardDrive className="w-5 h-5 text-primary mb-2" />
            <div className="font-bold text-sm font-heading">Cloudflare R2</div>
            <div className="text-[11px] text-muted-foreground">Zero egress object store</div>
          </div>
          <div className="p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-xs hover:border-primary/40 transition-colors">
            <Zap className="w-5 h-5 text-primary mb-2" />
            <div className="font-bold text-sm font-heading">100/100 Lighthouse</div>
            <div className="text-[11px] text-muted-foreground">Optimized rendering</div>
          </div>
        </div>
      </div>
    </section>
  );
}
