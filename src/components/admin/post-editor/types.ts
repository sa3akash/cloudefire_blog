export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string | null;
  tagIds: string[];
  status: "draft" | "published" | "scheduled";
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

export interface InitialPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  categoryId: string | null;
  status: "draft" | "published" | "scheduled";
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  publishedAt: Date | null;
  tagIds: string[];
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface TagOption {
  id: string;
  name: string;
}
