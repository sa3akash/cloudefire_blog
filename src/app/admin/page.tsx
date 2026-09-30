import { requireAuth } from "@/lib/auth";
import { getDashboardAnalytics } from "@/lib/services/analytics";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCards } from "@/components/admin/dashboard/metric-cards";
import { RecentPostsList } from "@/components/admin/dashboard/recent-posts-list";
import { PopularPostsList } from "@/components/admin/dashboard/popular-posts-list";
import { RecentCommentsList } from "@/components/admin/dashboard/recent-comments-list";

export default async function AdminDashboardPage() {
  await requireAuth();
  const metrics = await getDashboardAnalytics();

  return (
    <div className="space-y-8">
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

      <MetricCards
        totalPosts={metrics.totalPosts}
        publishedPosts={metrics.publishedPosts}
        draftPosts={metrics.draftPosts}
        totalViews={metrics.totalViews}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <RecentPostsList posts={metrics.recentPosts} />
        <PopularPostsList posts={metrics.popularPosts} />
      </div>

      <RecentCommentsList comments={metrics.recentComments} />
    </div>
  );
}
