import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function ArticleTags({ tags }: { tags?: { id: string; name: string; slug: string }[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap pt-6 border-t border-border/80">
      <span className="text-xs font-mono text-muted-foreground mr-1">Tagged:</span>
      {tags.map((t) => (
        <Link key={t.id} href={`/tag/${t.slug}`}>
          <Badge variant="outline" className="text-xs font-mono hover:bg-muted cursor-pointer">
            #{t.name}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
