import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";

interface ArticleHeaderProps {
  title: string;
  excerpt: string | null;
  category: { name: string; slug: string } | null;
  author: { name: string; slug: string; avatarUrl: string | null };
  publishedAt: Date | null;
  readingTime: number;
  coverImage: string | null;
}

export function ArticleHeader({
  title,
  excerpt,
  category,
  author,
  publishedAt,
  readingTime,
  coverImage,
}: ArticleHeaderProps) {
  const formattedPublished = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  return (
    <header className="space-y-8">
      <div className="space-y-6 text-center max-w-3xl mx-auto">
        {category && (
          <Link href={`/category/${category.slug}`} className="inline-block">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-mono hover:bg-primary/20 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {category.name}
            </span>
          </Link>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-[1.15] text-foreground">
          {title}
        </h1>

        {excerpt && (
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {excerpt}
          </p>
        )}

        <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground pt-2 flex-wrap">
          <Link
            href={`/author/${author.slug}`}
            className="flex items-center gap-2 hover:text-foreground font-medium transition-colors"
          >
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={32}
                height={32}
                className="rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">
                {author.name[0]}
              </div>
            )}
            <span className="text-foreground font-semibold">{author.name}</span>
          </Link>

          <span className="text-border">&bull;</span>

          <span className="flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <time dateTime={publishedAt?.toISOString()}>{formattedPublished}</time>
          </span>

          <span className="text-border">&bull;</span>

          <span className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{readingTime} min read</span>
          </span>
        </div>
      </div>

      {coverImage && (
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border/80 shadow-xl bg-muted/40">
          <Image
            src={coverImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
        </div>
      )}
    </header>
  );
}
