import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArticleNavigationProps {
  author: {
    name: string;
    slug: string;
    avatarUrl: string | null;
    bio: string | null;
  };
  adjacent: {
    prev: { title: string; slug: string } | null;
    next: { title: string; slug: string } | null;
  };
}

export function ArticleNavigation({ author, adjacent }: ArticleNavigationProps) {
  return (
    <div className="space-y-12">
      {/* Author Box */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 rounded-2xl border border-border/80 bg-card shadow-xs">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={64}
            height={64}
            className="rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
            {author.name[0]}
          </div>
        )}
        <div className="space-y-2 text-center sm:text-left">
          <div>
            <span className="text-xs font-mono uppercase text-muted-foreground">Written by</span>
            <h3 className="text-lg font-bold font-heading">{author.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {author.bio || "Staff contributor and systems engineer at CloudBlog."}
          </p>
          <div>
            <Link
              href={`/author/${author.slug}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all articles by {author.name} &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {adjacent.prev ? (
          <Link
            href={`/blog/${adjacent.prev.slug}`}
            className="group flex flex-col p-4 rounded-xl border border-border/80 hover:border-primary/50 transition-all bg-card/60"
          >
            <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Previous Article
            </span>
            <span className="text-sm font-semibold font-heading line-clamp-1 mt-1 group-hover:text-primary transition-colors">
              {adjacent.prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {adjacent.next ? (
          <Link
            href={`/blog/${adjacent.next.slug}`}
            className="group flex flex-col p-4 rounded-xl border border-border/80 hover:border-primary/50 transition-all bg-card/60 sm:text-right"
          >
            <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 sm:justify-end">
              Next Article
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-sm font-semibold font-heading line-clamp-1 mt-1 group-hover:text-primary transition-colors">
              {adjacent.next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
