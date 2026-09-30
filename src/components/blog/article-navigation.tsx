import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FollowButton } from "./follow-button";

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
    <div className="space-y-10">
      {/* Author Box */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/70 backdrop-blur-sm shadow-xs">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={64}
            height={64}
            className="rounded-full object-cover shrink-0 ring-2 ring-primary/20"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0 ring-2 ring-primary/20">
            {author.name[0]}
          </div>
        )}
        <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Written by</span>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground">{author.name}</h3>
            </div>
            <div>
              <FollowButton authorSlug={author.slug} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {author.bio || "Staff contributor and systems engineer at CloudBlog."}
          </p>
          <div className="pt-1">
            <Link
              href={`/author/${author.slug}`}
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View all articles by {author.name}</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {adjacent.prev ? (
          <Link
            href={`/blog/${adjacent.prev.slug}`}
            className="group flex flex-col p-5 rounded-2xl border border-border/80 hover:border-primary/50 transition-all bg-card/70 shadow-xs hover:shadow-md hover:-translate-y-0.5 duration-200"
          >
            <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-primary" />
              Previous Article
            </span>
            <span className="text-sm font-bold font-heading line-clamp-1 mt-1.5 group-hover:text-primary transition-colors text-foreground">
              {adjacent.prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {adjacent.next ? (
          <Link
            href={`/blog/${adjacent.next.slug}`}
            className="group flex flex-col p-5 rounded-2xl border border-border/80 hover:border-primary/50 transition-all bg-card/70 shadow-xs hover:shadow-md hover:-translate-y-0.5 duration-200 sm:text-right"
          >
            <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 sm:justify-end">
              Next Article
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-primary" />
            </span>
            <span className="text-sm font-bold font-heading line-clamp-1 mt-1.5 group-hover:text-primary transition-colors text-foreground">
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
