import { requireAuth } from "@/lib/auth";
import { getDashboardAnalytics } from "@/lib/services/analytics";
import Link from "next/link";
import {
  FileText,
  Eye,
  CheckCircle,
  Clock,
  PlusCircle,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  await requireAuth();
  const metrics = await getDashboardAnalytics();

  return (
    <div className="space-y-8">
      {/* Header with Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Overview of your CloudBlog content, edge views, and moderation tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/posts/new">
            <Button size="sm" className="gap-1.5 text-xs shadow-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Post</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase font-mono">Total Posts</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-extrabold font-heading">
            {metrics.totalPosts}
          </div>
          <p className="text-[11px] text-muted-foreground">Articles in D1 database</p>
        </div>

        <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase font-mono">Published</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
            {metrics.publishedPosts}
          </div>
          <p className="text-[11px] text-muted-foreground">Live on global edge</p>
        </div>

        <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase font-mono">Drafts</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-amber-600 dark:text-amber-400">
            {metrics.draftPosts}
          </div>
          <p className="text-[11px] text-muted-foreground">Unpublished revisions</p>
        </div>

        <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase font-mono">Total Views</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-blue-600 dark:text-blue-400">
            {metrics.totalViews}
          </div>
          <p className="text-[11px] text-muted-foreground">Deduplicated edge hits</p>
        </div>
      </div>

      {/* Two Column Grid: Recent Posts & Top Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Posts (col 7) */}
        <div className="lg:col-span-7 rounded-xl border border-border/80 bg-card shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-heading">Recent Posts</h3>
            <Link
              href="/admin/posts"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {metrics.recentPosts.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center italic">
              No posts found. Start by creating your first post!
            </p>
          ) : (
            <div className="divide-y divide-border/60">
              {metrics.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-medium text-xs sm:text-sm hover:text-primary transition-colors truncate block"
                    >
                      {post.title}
                    </Link>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      Updated {new Date(post.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={post.status === "published" ? "default" : "secondary"}
                      className="text-[10px] capitalize"
                    >
                      {post.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most Popular Posts (col 5) */}
        <div className="lg:col-span-5 rounded-xl border border-border/80 bg-card shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-heading flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Top Articles</span>
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">Views</span>
          </div>

          {metrics.popularPosts.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center italic">
              No view statistics recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {metrics.popularPosts.map((pop, idx) => (
                <div
                  key={pop.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold font-mono text-muted-foreground w-4 text-center">
                      {idx + 1}
                    </span>
                    <Link
                      href={`/blog/${pop.slug}`}
                      target="_blank"
                      className="text-xs font-medium truncate hover:text-primary transition-colors"
                    >
                      {pop.title}
                    </Link>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] shrink-0">
                    {pop.viewsCount} views
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Comments Section */}
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base font-heading flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span>Recent Comments</span>
          </h3>
          <Link
            href="/admin/comments"
            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
          >
            <span>Moderation Queue</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {metrics.recentComments.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center italic">
            No comments submitted yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.recentComments.map((comm) => (
              <div
                key={comm.id}
                className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    {comm.authorName}
                  </span>
                  <Badge
                    variant={
                      comm.status === "approved"
                        ? "default"
                        : comm.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-[10px] capitalize"
                  >
                    {comm.status}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground font-medium truncate">
                  On article: {comm.postTitle}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 italic">
                  &ldquo;{comm.content}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
