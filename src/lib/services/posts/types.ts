export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: "draft" | "published" | "scheduled";
  featured: boolean;
  readingTime: number;
  publishedAt: Date | null;
  createdAt: Date;
  category: { id: string; name: string; slug: string } | null;
  author: { id: string; name: string; slug: string; avatarUrl: string | null };
  tags?: { id: string; name: string; slug: string }[];
}

export interface GetPostsOptions {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  search?: string;
  sort?: "newest" | "oldest" | "popular";
}
