import { requireAuth } from "@/lib/auth";
import { getAllCommentsForAdmin } from "@/lib/services/comments";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/blog/pagination-bar";
import { CommentModerator } from "./comment-moderator";

interface AdminCommentsPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function AdminCommentsPage({
  searchParams,
}: AdminCommentsPageProps) {
  await requireAuth();
  const resolved = await searchParams;
  const status = resolved.status || "all";
  const page = parseInt(resolved.page || "1", 10);

  const data = await getAllCommentsForAdmin({
    status,
    page,
    limit: 15,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Comments Moderation
          </h1>
          <p className="text-xs text-muted-foreground">
            Review and moderate reader feedback before publication.
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "approved", label: "Approved" },
            { key: "rejected", label: "Rejected" },
          ].map((tab) => (
            <Link key={tab.key} href={`/admin/comments?status=${tab.key}`}>
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
      </div>

      <CommentModerator initialComments={data.comments} />

      <PaginationBar
        currentPage={data.page}
        totalPages={data.totalPages}
        basePath="/admin/comments"
        searchParams={{ status }}
      />
    </div>
  );
}
