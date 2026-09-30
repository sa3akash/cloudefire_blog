import Link from "next/link";
import { getFeaturedPosts, getPublishedPosts } from "@/lib/services/posts";
import { getAllCategories } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";
import { PostCard } from "@/components/blog/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Database, HardDrive, Globe, Sparkles, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredPosts, latestResult, categoriesList, tagsList] = await Promise.all([
    getFeaturedPosts(1),
    getPublishedPosts({ page: 1, limit: 6 }),
    getAllCategories(),
    getAllTags(),
  ]);

  const featured = featuredPosts[0] || null;
  // Filter out the featured post from the latest grid if it matches
  const latestPosts = latestResult.posts.filter((p) => p.id !== featured?.id).slice(0, 6);

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-20">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-muted/50 via-background to-background p-6 sm:p-10 md:p-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next.js 16 + Cloudflare Free Tier</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight leading-tight">
              Engineering insights at the <span className="text-primary underline decoration-primary/30">speed of light</span>.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Explore deep dives into systems architecture, edge computing, and modern web performance. Engineered with zero external hosting dependencies.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start">
              <Link href="/blog">
                <Button className="gap-2 shadow-sm">
                  <span>Browse Articles</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">
                  Architecture Overview
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-left">
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <Globe className="w-5 h-5 text-primary mb-1.5" />
              <div className="font-bold text-sm font-heading">300+ Edge PoPs</div>
              <div className="text-[11px] text-muted-foreground">Workers global network</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <Database className="w-5 h-5 text-primary mb-1.5" />
              <div className="font-bold text-sm font-heading">Cloudflare D1</div>
              <div className="text-[11px] text-muted-foreground">Serverless SQLite</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <HardDrive className="w-5 h-5 text-primary mb-1.5" />
              <div className="font-bold text-sm font-heading">Cloudflare R2</div>
              <div className="text-[11px] text-muted-foreground">Zero egress object store</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-xs">
              <Zap className="w-5 h-5 text-primary mb-1.5" />
              <div className="font-bold text-sm font-heading">100/100 Lighthouse</div>
              <div className="text-[11px] text-muted-foreground">Optimized rendering</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article Section */}
      {featured && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-heading tracking-tight">
                Featured Editorial
              </h2>
              <p className="text-xs text-muted-foreground">
                Hand-picked technical analysis from our editorial team
              </p>
            </div>
            <Link
              href="/blog"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <PostCard post={featured} featured={true} />
        </section>
      )}

      {/* Categories Bar */}
      {categoriesList.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Browse by Topic
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {categoriesList.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`}>
                <Badge
                  variant="outline"
                  className="px-3.5 py-1.5 text-xs hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer rounded-lg border-border"
                >
                  <span>{cat.name}</span>
                  <span className="ml-1.5 opacity-60 font-mono text-[10px]">
                    ({cat.postCount})
                  </span>
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-heading tracking-tight">
              Latest Articles
            </h2>
            <p className="text-xs text-muted-foreground">
              Recent technical guides, architecture reviews, and performance breakdowns
            </p>
          </div>
          <Link
            href="/blog"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View all ({latestResult.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl text-muted-foreground">
            No articles published yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Tags Pills */}
      {tagsList.length > 0 && (
        <section className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>Popular Tags</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {tagsList.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`}>
                <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-mono">
                  #{tag.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
