import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
    <header className="space-y-6 text-center max-w-3xl mx-auto">
      {category && (
        <Link href={`/category/${category.slug}`}>
          <Badge variant="secondary" className="px-3 py-1 font-mono text-xs hover:bg-secondary/80">
            {category.name}
          </Badge>
        </Link>
      )}

      <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight">
        {title}
      </h1>

      {excerpt && (
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          {excerpt}
        </p>
      )}

      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2 flex-wrap">
        <Link
          href={`/author/${author.slug}`}
          className="flex items-center gap-2 hover:text-foreground font-medium transition-colors"
        >
          {author.avatarUrl ? (
            <Image
              src={author.avatarUrl}
              alt={author.name}
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {author.name[0]}
            </div>
          )}
          <span>{author.name}</span>
        </Link>

        <span>&bull;</span>

        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <time dateTime={publishedAt?.toISOString()}>{formattedPublished}</time>
        </span>

        <span>&bull;</span>

        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{readingTime} min read</span>
        </span>
      </div>

      {coverImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/80 shadow-md mt-8">
          <Image
            src={coverImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      )}
    </header>
  );
}
