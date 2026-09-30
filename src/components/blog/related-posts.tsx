import type { PostListItem } from "@/lib/services/posts";
import { PostCard } from "@/components/blog/post-card";

interface RelatedPostsProps {
  posts: PostListItem[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="space-y-6 pt-12 border-t border-border/80">
      <h2 className="text-2xl font-bold font-heading">Related Publications</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((item) => (
          <PostCard key={item.id} post={item} />
        ))}
      </div>
    </div>
  );
}
