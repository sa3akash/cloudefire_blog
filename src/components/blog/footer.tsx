"use client";

import Link from "next/link";
import { useState } from "react";
import { Rss, Cloud, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full border-t border-border/60 bg-muted/20 py-12 md:py-16 transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs tracking-wider">
              CB
            </span>
            <span className="font-bold text-base font-heading">
              CloudBlog
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            An open-source, production-grade publication platform engineered to run entirely within Cloudflare’s free tier using Next.js App Router, Cloudflare Workers, D1 database, and R2 media storage.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border/80 text-xs text-muted-foreground">
            <Cloud className="w-3.5 h-3.5 text-primary" />
            <span>100% Cloudflare Free Tier Native</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/blog" className="hover:text-foreground transition-colors">
                All Articles
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-foreground transition-colors">
                Search
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-foreground transition-colors">
                About Architecture
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/feed.xml" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <Rss className="w-3.5 h-3.5 text-orange-500" />
                <span>RSS Feed</span>
              </Link>
            </li>
            <li>
              <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
                XML Sitemap
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Box */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Newsletter</span>
          </h4>
          <p className="text-xs text-muted-foreground">
            Get technical dispatches on cloud architecture, edge runtimes, and web performance.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Check className="w-4 h-4" />
              <span>Thank you! You are subscribed.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-xs"
              />
              <Button type="submit" size="sm" className="w-full text-xs h-8">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} CloudBlog. Engineered with precision.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/admin/login" className="hover:text-foreground transition-colors">
            Staff Sign In
          </Link>
          <span>&bull;</span>
          <Link href="https://developers.cloudflare.com/workers" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Cloudflare Docs
          </Link>
        </div>
      </div>
    </div>
    </footer >
  );
}
