import { requireAuth } from "@/lib/auth";
import { getAllPostsForAdmin } from "@/lib/services/posts";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaginationBar } from "@/components/blog/pagination-bar";
import { PostRowActions } from "./post-row-actions";

interface AdminPostsPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    q?: string;
  }>;
}

export default async function AdminPostsPage({
  searchParams,
}: AdminPostsPageProps) {
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
      {/* Header and Create Button */}
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

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-card">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { key: "all", label: "All Posts" },
            { key: "published", label: "Published" },
            { key: "draft", label: "Drafts" },
          ].map((tab) => (
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

        {/* Search Input */}
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

      {/* Posts Table */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4 hidden md:table-cell">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 hidden sm:table-cell">Published Date</th>
                <th className="py-3 px-4 hidden lg:table-cell">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground italic">
                    No articles found matching your criteria.
                  </td>
                </tr>
              ) : (
                data.posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="hover:text-primary transition-colors font-semibold truncate max-w-sm"
                        >
                          {post.title}
                        </Link>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          /{post.slug}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                      {post.categoryName || "—"}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={post.status === "published" ? "default" : "secondary"}
                        className="text-[10px] capitalize"
                      >
                        {post.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground font-mono text-[11px]">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground font-mono text-[11px]">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <PostRowActions
                        id={post.id}
                        slug={post.slug}
                        status={post.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <PaginationBar
        currentPage={data.page}
        totalPages={data.totalPages}
        basePath="/admin/posts"
        searchParams={{ status, q: search }}
      />
    </div>
  );
}
