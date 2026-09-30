import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowUpRight, Sparkles } from "lucide-react";
import type { PostListItem } from "@/lib/services/posts";

export function StandardPostCard({ post }: { post: PostListItem }) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm overflow-hidden shadow-xs hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
        aria-label={post.title}
      />

      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/60">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-muted/80 to-primary/5 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
              <Sparkles className="w-6 h-6 text-primary/40 mb-2" />
              <span className="font-mono text-xs font-semibold tracking-wider uppercase text-foreground/70">
                {post.category?.name || "Editorial"}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

          {post.category && (
            <div className="absolute top-3 left-3 z-20">
              <Link
                href={`/category/${post.category.slug}`}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-background/90 backdrop-blur-md border border-border/80 shadow-xs text-foreground hover:bg-background hover:text-primary transition-colors"
              >
                {post.category.name}
              </Link>
            </div>
          )}

          <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-950/75 text-neutral-200 backdrop-blur-md">
              <Clock className="w-3 h-3 text-primary" />
              {post.readingTime}m
            </span>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="text-lg sm:text-xl font-bold font-heading line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1 relative z-20">
              {post.tags.slice(0, 3).map((t) => (
                <Link
                  key={t.id}
                  href={`/tag/${t.slug}`}
                  className="text-[10px] text-muted-foreground hover:text-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md hover:bg-muted transition-colors"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3.5 border-t border-border/50 flex items-center justify-between mt-auto bg-muted/15 relative z-20">
        <Link
          href={`/author/${post.author.slug}`}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group/author"
        >
          {post.author.avatarUrl ? (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              width={24}
              height={24}
              className="rounded-full object-cover ring-1 ring-border"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] ring-1 ring-border">
              {post.author.name.charAt(0)}
            </div>
          )}
          <span className="font-semibold text-foreground text-xs group-hover/author:underline truncate max-w-[120px]">
            {post.author.name}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {publishedDate}
          </span>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </article>
  );
}
