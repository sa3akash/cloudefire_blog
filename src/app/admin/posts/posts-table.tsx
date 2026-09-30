import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PostRowActions } from "./post-row-actions";

interface AdminPostRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string | null;
  authorName: string;
}

export function PostsTable({ posts }: { posts: AdminPostRow[] }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border text-muted-foreground font-mono uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4 hidden md:table-cell">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden sm:table-cell">Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground italic">
                  No articles found matching criteria.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 max-w-xs sm:max-w-md">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="font-semibold hover:text-primary transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      {post.featured && (
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">
                      /blog/{post.slug}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                    {post.categoryName || "Uncategorized"}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        post.status === "published"
                          ? "default"
                          : post.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-[10px] uppercase font-mono"
                    >
                      {post.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground font-mono text-[11px]">
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <PostRowActions id={post.id} slug={post.slug} status={post.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
