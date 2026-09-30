import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Category, Tag } from "@/lib/db";

interface TopicCloudProps {
  categories: (Category & { postCount: number })[];
  tags: (Tag & { postCount: number })[];
}

export function TopicCloud({ categories, tags }: TopicCloudProps) {
  return (
    <section className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-6 shadow-xs">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <h3 className="font-bold text-base font-heading">Explore by Architecture Topic</h3>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`}>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-muted/70 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border/70 transition-all cursor-pointer">
              <span>{cat.name}</span>
              <span className="text-[10px] text-muted-foreground">({cat.postCount})</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border/60">
        <span className="text-xs font-mono text-muted-foreground mr-1 self-center">Popular tags:</span>
        {tags.slice(0, 10).map((t) => (
          <Link key={t.id} href={`/tag/${t.slug}`}>
            <span className="text-xs text-muted-foreground hover:text-foreground font-mono bg-muted/50 hover:bg-muted px-2.5 py-1 rounded-md transition-colors cursor-pointer">
              #{t.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
