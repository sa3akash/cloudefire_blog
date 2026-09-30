import type { PostListItem } from "@/lib/services/posts";
import { FeaturedPostCard } from "./featured-post-card";
import { StandardPostCard } from "./standard-post-card";

interface PostCardProps {
  post: PostListItem;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return <FeaturedPostCard post={post} />;
  }
  return <StandardPostCard post={post} />;
}
