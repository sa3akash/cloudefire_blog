import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowRight, Sparkles } from "lucide-react";
import type { PostListItem } from "@/lib/services/posts";

export function FeaturedPostCard({ post }: { post: PostListItem }) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  return (
    <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 p-5 sm:p-8 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300">
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
        aria-label={post.title}
      />

      <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted/60 border border-border/60">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/15 via-muted to-primary/5 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <Sparkles className="w-10 h-10 text-primary/40 mb-3" />
            <span className="font-mono text-sm font-bold tracking-wider uppercase text-foreground/80">
              Featured Publication
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
      </div>

      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 flex-wrap relative z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary text-primary-foreground shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Featured
            </span>
            {post.category && (
              <Link
                href={`/category/${post.category.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-muted/80 hover:bg-muted border border-border/80 text-foreground transition-colors"
              >
                {post.category.name}
              </Link>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-primary" /> {post.readingTime} min read
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-foreground group-hover:text-primary transition-colors leading-[1.2]">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="pt-5 border-t border-border/60 flex items-center justify-between relative z-20">
          <Link
            href={`/author/${post.author.slug}`}
            className="flex items-center gap-3 text-xs text-muted-foreground hover:text-foreground transition-colors group/author"
          >
            {post.author.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-xs group-hover/author:underline">
                {post.author.name}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {publishedDate}
              </span>
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
            <span>Read Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
