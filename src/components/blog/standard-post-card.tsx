import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import type { PostListItem } from "@/lib/services/posts";
import { Badge } from "@/components/ui/badge";

export function StandardPostCard({ post }: { post: PostListItem }) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:border-primary/40">
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center text-muted-foreground font-mono text-xs">
              CloudBlog
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            {post.category ? (
              <Link href={`/category/${post.category.slug}`}>
                <Badge variant="secondary" className="text-[11px] hover:bg-secondary/80 font-mono">
                  {post.category.name}
                </Badge>
              </Link>
            ) : (
              <span />
            )}
            <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readingTime} min
            </span>
          </div>

          <h3 className="text-lg font-bold font-heading line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {post.excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {post.tags.slice(0, 3).map((t) => (
                <Link key={t.id} href={`/tag/${t.slug}`}>
                  <span className="text-[10px] text-muted-foreground hover:text-foreground font-mono">
                    #{t.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-border/50 flex items-center justify-between mt-auto">
        <Link
          href={`/author/${post.author.slug}`}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group/author"
        >
          {post.author.avatarUrl ? (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              width={22}
              height={22}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
              {post.author.name.charAt(0)}
            </div>
          )}
          <span className="font-medium text-foreground text-xs group-hover/author:underline truncate max-w-[120px]">
            {post.author.name}
          </span>
        </Link>

        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {publishedDate}
        </span>
      </div>
    </article>
  );
}
