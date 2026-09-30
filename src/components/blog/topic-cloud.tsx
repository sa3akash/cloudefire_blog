import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import type { Category, Tag } from "@/lib/db";

interface TopicCloudProps {
  categories: (Category & { postCount: number })[];
  tags: (Tag & { postCount: number })[];
}

export function TopicCloud({ categories, tags }: TopicCloudProps) {
  return (
    <section className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-muted/20 space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <h3 className="font-bold text-base font-heading">Explore by Architecture Topic</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`}>
            <Badge variant="secondary" className="px-3 py-1.5 text-xs hover:bg-secondary/80 font-mono transition-colors">
              {cat.name} ({cat.postCount})
            </Badge>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
        <span className="text-xs font-mono text-muted-foreground mr-1 self-center">Popular tags:</span>
        {tags.slice(0, 10).map((t) => (
          <Link key={t.id} href={`/tag/${t.slug}`}>
            <span className="text-xs text-muted-foreground hover:text-foreground font-mono transition-colors">
              #{t.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
