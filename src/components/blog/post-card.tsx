import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowRight, Tag } from "lucide-react";
import type { PostListItem } from "@/lib/services/posts";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  post: PostListItem;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  if (featured) {
    return (
      <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/40">
        {/* Cover Image */}
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

        {/* Content Details */}
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

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/40">
      <div className="space-y-3">
        {/* Cover image */}
        <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-muted to-primary/5 flex items-center justify-center text-muted-foreground font-mono text-xs">
              CloudBlog
            </div>
          )}
        </Link>

        {/* Badges / Meta */}
        <div className="flex items-center justify-between text-xs pt-1">
          {post.category ? (
            <Link href={`/category/${post.category.slug}`}>
              <Badge variant="outline" className="text-[11px] font-medium hover:bg-muted transition-colors">
                {post.category.name}
              </Badge>
            </Link>
          ) : (
            <div />
          )}
          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" /> {post.readingTime} min
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg font-heading tracking-tight line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Author and Date Footer */}
      <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <Link
          href={`/author/${post.author.slug}`}
          className="flex items-center gap-2 hover:text-foreground transition-colors group/author"
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
            <div className="w-5.5 h-5.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
              {post.author.name.charAt(0)}
            </div>
          )}
          <span className="font-medium text-foreground truncate max-w-[120px]">
            {post.author.name}
          </span>
        </Link>

        <span className="font-mono text-[11px]">{publishedDate}</span>
      </div>
    </article>
  );
}
