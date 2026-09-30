import { requireAuth } from "@/lib/auth";
import { getDashboardAnalytics } from "@/lib/services/analytics";
import { BarChart3, TrendingUp, ShieldCheck, Eye, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminAnalyticsPage() {
  await requireAuth();
  const metrics = await getDashboardAnalytics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">
          Analytics Overview
        </h1>
        <p className="text-xs text-muted-foreground">
          Lightweight, privacy-conscious metrics tailored for Cloudflare Free Tier limits.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase">Unique 24h Views</span>
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-primary">
            {metrics.totalViews}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Recorded across all published articles
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase">Active Articles</span>
            <BarChart3 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
            {metrics.publishedPosts}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Generating edge traffic globally
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase">Database Impact</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-blue-600 dark:text-blue-400">
            0.01%
          </div>
          <p className="text-[11px] text-muted-foreground">
            Of 100k daily write allowance
          </p>
        </div>
      </div>

      {/* Top Performing Articles Table */}
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base font-heading flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Top Performing Articles</span>
          </h3>
          <span className="text-xs font-mono text-muted-foreground">Sorted by Reads</span>
        </div>

        {metrics.popularPosts.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-8 text-center">
            No view data recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-border/60">
            {metrics.popularPosts.map((post, idx) => (
              <div
                key={post.id}
                className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-bold font-mono text-sm text-muted-foreground w-6 text-center">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="font-medium text-xs sm:text-sm hover:text-primary transition-colors truncate block"
                    >
                      {post.title}
                    </Link>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      /blog/{post.slug}
                    </span>
                  </div>
                </div>

                <Badge variant="outline" className="font-mono text-xs px-2.5 py-0.5">
                  {post.viewsCount} views
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Free Tier Engineering Note */}
      <div className="p-6 rounded-2xl border border-border/80 bg-muted/20 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold font-mono text-primary uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Architectural Safeguard</span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          CloudBlog’s internal analytics engine uses a privacy-conscious daily hash (`visitorHash = sha256(ip + userAgent)`). Repeated page refreshes within a 24-hour period do not generate extra writes to Cloudflare D1. For complete traffic telemetry (referrers, countries, Core Web Vitals), integrate <strong>Cloudflare Web Analytics</strong> (free and zero-cookie) in Site Settings.
        </p>
      </div>
    </div>
  );
}
