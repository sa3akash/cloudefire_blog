import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import type { PostListItem } from "@/lib/services/posts";
import { Badge } from "@/components/ui/badge";

export function FeaturedPostCard({ post }: { post: PostListItem }) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  return (
    <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/40">
      <div className="lg:col-span-7 relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
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
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-muted to-primary/5 flex items-center justify-center text-muted-foreground font-mono text-sm">
            CloudBlog Featured
          </div>
        )}
      </div>

      <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="text-xs uppercase tracking-wider font-semibold">
              Featured
            </Badge>
            {post.category && (
              <Link href={`/category/${post.category.slug}`}>
                <Badge variant="outline" className="text-xs hover:bg-muted transition-colors">
                  {post.category.name}
                </Badge>
              </Link>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> {post.readingTime} min read
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`} className="focus:outline-none">
              {post.title}
            </Link>
          </h2>

          {post.excerpt && (
            <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-border/60 flex items-center justify-between">
          <Link
            href={`/author/${post.author.slug}`}
            className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors group/author"
          >
            {post.author.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name}
                width={28}
                height={28}
                className="rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {post.author.name.charAt(0)}
              </div>
            )}
            <span className="font-medium text-foreground group-hover/author:underline">
              {post.author.name}
            </span>
          </Link>

          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {publishedDate}
          </span>
        </div>
      </div>
    </article>
  );
}
