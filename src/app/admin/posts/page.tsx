import { requireAuth } from "@/lib/auth";
import { getAllPostsForAdmin } from "@/lib/services/posts";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/blog/pagination-bar";
import { PostsFilterBar } from "./posts-filter-bar";
import { PostsTable } from "./posts-table";

interface AdminPostsPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    q?: string;
  }>;
}

export default async function AdminPostsPage({ searchParams }: AdminPostsPageProps) {
  await requireAuth();
  const resolved = await searchParams;
  const page = parseInt(resolved.page || "1", 10);
  const status = resolved.status || "all";
  const search = resolved.q || "";

  const data = await getAllPostsForAdmin({
    page,
    limit: 15,
    status,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Articles &amp; Posts
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your blog publications, draft revisions, and scheduled articles.
          </p>
        </div>

        <Link href="/admin/posts/new">
          <Button size="sm" className="gap-1.5 text-xs shadow-xs">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Article</span>
          </Button>
        </Link>
      </div>

      <PostsFilterBar status={status} search={search} />

      <PostsTable posts={data.posts} />

      <PaginationBar
        currentPage={data.page}
        totalPages={data.totalPages}
        basePath="/admin/posts"
      />
    </div>
  );
}
