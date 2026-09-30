import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PostsFilterBarProps {
  status: string;
  search: string;
}

export function PostsFilterBar({ status, search }: PostsFilterBarProps) {
  const tabs = [
    { key: "all", label: "All Posts" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Drafts" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-card">
      <div className="flex items-center gap-1.5 w-full sm:w-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/posts?status=${tab.key}${search ? `&q=${search}` : ""}`}
          >
            <Button
              variant={status === tab.key ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
            >
              {tab.label}
            </Button>
          </Link>
        ))}
      </div>

      <form action="/admin/posts" method="GET" className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={search}
          placeholder="Filter by title..."
          className="pl-8 h-8 text-xs"
        />
        {status !== "all" && <input type="hidden" name="status" value={status} />}
      </form>
    </div>
  );
}
