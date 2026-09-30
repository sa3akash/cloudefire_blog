import { getRelatedPosts } from "@/lib/services/posts";
import { getApprovedCommentsForPost } from "@/lib/services/comments";
import { RelatedPosts } from "@/components/blog/related-posts";
import { CommentsSection } from "@/components/blog/comments-section";
import { Skeleton } from "@/components/ui/skeleton";
import { PostCardSkeleton } from "@/components/blog/skeletons";

export async function RelatedPostsSection({
  postId,
  categoryId,
}: {
  postId: string;
  categoryId: string | null;
}) {
  const relatedPosts = await getRelatedPosts(postId, categoryId, 3);
  return <RelatedPosts posts={relatedPosts} />;
}

export function RelatedPostsSkeleton() {
  return (
    <div className="space-y-6 pt-12 border-t border-border/80 animate-pulse">
      <Skeleton className="h-8 w-56 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export async function CommentsSectionLoader({
  postId,
  allowComments,
}: {
  postId: string;
  allowComments: boolean;
}) {
  if (!allowComments) return null;
  const comments = await getApprovedCommentsForPost(postId);
  return <CommentsSection postId={postId} initialComments={comments} />;
}

export function CommentsSectionSkeleton() {
  return (
    <section className="space-y-8 pt-10 border-t border-border/70 animate-pulse">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-6 w-36 rounded-md" />
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-9 w-full sm:w-48 rounded-lg" />
          <Skeleton className="h-9 w-full sm:w-48 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg sm:ml-auto" />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-border/60 bg-card/40 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
